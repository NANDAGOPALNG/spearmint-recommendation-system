/**
 * gemini.js — Gemini API Service Layer
 *
 * Public API (the only function App.jsx needs):
 *   getRecommendations(userQuery, products) → Promise<string[]>
 *
 * Internal helpers:
 *   buildPrompt(userQuery, products)  → string
 *   parseResponse(responseText)       → string[]
 *
 * This module is intentionally framework-agnostic — it has no React imports
 * and no side effects. It can be unit-tested in isolation.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Client initialisation ────────────────────────────────────────────────────
// Vite exposes env variables prefixed with VITE_ via import.meta.env.
// The API key is never hardcoded — it lives in a .env file at project root:
//   VITE_GEMINI_API_KEY=your_key_here
//
// In production (Vercel), this is set as an Environment Variable in the
// project settings — the key never appears in the deployed bundle.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "[gemini.js] VITE_GEMINI_API_KEY is not set. " +
    "Add it to your .env file and restart the dev server."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

// gemini-1.5-flash: fast, cost-efficient, and more than capable for
// structured product recommendation tasks.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Prompt builder ───────────────────────────────────────────────────────────

/**
 * buildPrompt
 *
 * Constructs the full prompt sent to Gemini.
 *
 * Prompt engineering decisions:
 *   1. Role assignment       — "You are an AI shopping assistant" primes the
 *                              model with the right persona and context.
 *   2. Strict output format  — Instructing the model to return ONLY a JSON
 *                              array eliminates markdown, preamble, and
 *                              explanation text that would break JSON.parse().
 *   3. Product list as JSON  — Serialising the full product array gives Gemini
 *                              all attributes (name, brand, price, description)
 *                              in a structured, unambiguous format.
 *   4. Fallback instruction  — "Return an empty array [] if nothing matches"
 *                              prevents the model from hallucinating products
 *                              that aren't in the catalog.
 *   5. Name-only output      — We ask for product names, not full objects.
 *                              Simpler output = simpler parsing = fewer errors.
 *
 * @param {string} userQuery   — The natural language preference from the user
 * @param {Array}  products    — The full product catalog array
 * @returns {string}           — The complete prompt string
 */
const buildPrompt = (userQuery, products) => {
  // Serialise only the fields Gemini needs for reasoning.
  // Omitting `id` keeps the payload smaller; we match by name on the way back.
  const productList = products.map(({ name, brand, category, price, description }) => ({
    name,
    brand,
    category,
    price,
    description,
  }));

  return `
You are an AI shopping assistant helping a user find the best products from a catalog.

PRODUCT CATALOG (JSON):
${JSON.stringify(productList, null, 2)}

USER PREFERENCE:
"${userQuery}"

TASK:
Analyse the user's preference and recommend only the products from the catalog above that best satisfy their request.
Consider: product category, price range (in INR ₹), brand, and the features described.

RULES:
- Return ONLY a valid JSON array of product names (strings), exactly as they appear in the catalog.
- Do NOT include any explanation, markdown, code fences, or extra text.
- If multiple products match, include all of them — ranked from best match to least.
- If no products match the request, return an empty array: []
- Never recommend a product that is not in the catalog above.

RESPONSE FORMAT:
["Product Name 1", "Product Name 2"]
`.trim();
};

// ─── Response parser ──────────────────────────────────────────────────────────

/**
 * parseResponse
 *
 * Safely extracts a string[] from Gemini's raw text response.
 *
 * Gemini occasionally wraps JSON in markdown code fences (```json ... ```)
 * even when instructed not to. This parser handles that gracefully.
 *
 * @param {string} responseText — Raw text from Gemini
 * @returns {string[]}          — Array of product name strings
 * @throws {Error}              — If the response cannot be parsed as a JSON array
 */
const parseResponse = (responseText) => {
  // Strip markdown code fences if present: ```json ... ``` or ``` ... ```
  const cleaned = responseText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemini returned a response that could not be parsed as JSON.\nRaw response: ${responseText}`
    );
  }

  // Validate the parsed value is actually a string array
  if (!Array.isArray(parsed)) {
    throw new Error(
      `Expected a JSON array from Gemini, received: ${typeof parsed}`
    );
  }

  // Filter out any non-string entries defensively
  return parsed.filter((item) => typeof item === "string");
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getRecommendations
 *
 * The single function imported and called by App.jsx.
 *
 * @param {string} userQuery  — Natural language preference from the user
 * @param {Array}  products   — Full product catalog from products.js
 * @returns {Promise<string[]>} — Array of recommended product name strings
 * @throws {Error}              — Propagated to App.jsx for user-facing display
 */
export const getRecommendations = async (userQuery, products) => {
  const prompt = buildPrompt(userQuery, products);

  // generateContent sends a single-turn prompt — correct for this use case
  // since each query is independent (no conversation history needed).
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return parseResponse(text);
};