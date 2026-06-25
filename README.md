# Spearmint-recommendation-system

> An AI-powered product recommendation system that understands natural language queries and matches them to the best products from a catalog — built with React, Vite, and Google Gemini AI.

---

## Overview

Traditional e-commerce search forces users to navigate filters, categories, and price sliders. AI Product Finder removes that friction entirely — users describe what they need in plain language and Gemini AI returns the most relevant matches from the catalog.

**Example queries the system understands:**

- *"I need a phone under ₹30,000 with a great camera"*
- *"Recommend a gaming laptop"*
- *"Affordable wireless headphones with good battery life"*
- *"Smartwatch with long battery life under ₹15,000"*

---

## Demo

| Full Catalog | AI Recommendations |
|---|---|
| All 20 products displayed in a responsive grid | Only matched products appear in a highlighted section above the catalog |

**Live deployment:** *(Vercel URL here once deployed)*

---

## Features

- **Natural language search** — Describe requirements in plain English; no dropdowns or filters needed
- **Gemini AI integration** — `gemini-2.5-flash` analyses user intent, budget, category, and product specs
- **Structured prompt engineering** — Prompt instructs the model to return a clean JSON array, preventing hallucinated or out-of-catalog recommendations
- **Robust response parsing** — Strips markdown fences, validates JSON structure, and handles malformed responses gracefully
- **Recommendation section** — AI-picked products render above the full catalog with a distinct visual treatment
- **Quick-search chips** — One-click example queries guide first-time users
- **Loading & error states** — Spinner during API calls; friendly error messages on failure
- **Responsive layout** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 8 |
| AI / LLM | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Styling | Plain CSS with CSS custom properties |
| Deployment | Vercel |

---

## Project Structure

```
ai-product-recommender/
│
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx         # Catalog product card (presentational)
│   │   └── RecommendationCard.jsx  # AI-recommended product card (highlighted)
│   │
│   ├── data/
│   │   └── products.js             # Product catalog — single source of truth
│   │
│   ├── services/
│   │   └── gemini.js               # Gemini API service layer
│   │                               #   buildPrompt()      — constructs the prompt
│   │                               #   parseResponse()    — extracts JSON from reply
│   │                               #   getRecommendations() — public API for App.jsx
│   │
│   ├── App.jsx                     # Root component; owns all state
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles & dark theme
│
├── public/
├── .env                            # VITE_GEMINI_API_KEY (never committed)
├── vite.config.js
└── package.json
```

---

## Architecture

```
User types query
      │
      ▼
  App.jsx  ──── handleSubmit()
      │
      ▼
  gemini.js ── buildPrompt(query, products)
      │              │
      │         Serialises catalog as JSON
      │         + strict output format rules
      │
      ▼
  Gemini API (gemini-2.5-flash)
      │
      ▼
  gemini.js ── parseResponse(text)
      │              │
      │         Strips markdown fences
      │         Validates JSON array
      │
      ▼
  App.jsx ── products.filter() matches names → full objects
      │
      ▼
  RecommendationCard renders each matched product
```

The service layer (`gemini.js`) is intentionally framework-agnostic — no React imports, no side effects — making it independently testable.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NANDAGOPALNG/spearmint-recommendation-system.git
cd spearmint-recommendation-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your key:
# VITE_GEMINI_API_KEY=your_api_key_here

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |

> **Security note:** The `VITE_` prefix is required by Vite to expose the variable to the client bundle. Never commit your `.env` file. On Vercel, add the key under **Project Settings → Environment Variables**.

---

## Product Catalog

The catalog lives in `src/data/products.js` and contains 20 products across 5 categories:

| Category | Count | Price range |
|---|---|---|
| 📱 Phones | 5 | ₹22,999 – ₹79,999 |
| 💻 Laptops | 5 | ₹47,999 – ₹1,14,999 |
| 🎧 Headphones | 4 | ₹1,499 – ₹29,999 |
| ⌚ Smartwatches | 4 | ₹3,499 – ₹41,900 |
| 📟 Tablets | 2 | ₹37,999 – ₹59,900 |

Each product exposes `id`, `name`, `brand`, `category`, `price`, and `description` — all fields are passed to Gemini so it can reason about budget, specs, and brand preferences simultaneously.

---

## Prompt Engineering

The prompt sent to Gemini follows five design principles:

1. **Role priming** — `"You are an AI shopping assistant"` anchors the model to the task domain
2. **Structured catalog input** — The product array is serialised as JSON so Gemini can reason over structured attributes rather than unstructured text
3. **Strict output format** — The model is instructed to return *only* a JSON array of product name strings, preventing preamble or explanation that would break `JSON.parse()`
4. **Hallucination guard** — `"Never recommend a product not in the catalog"` prevents the model from inventing products
5. **Graceful fallback** — `"Return [] if nothing matches"` gives the app a clean empty state to handle

The parser additionally strips markdown code fences (` ```json `) that Gemini occasionally adds despite instructions, ensuring reliable JSON extraction in all cases.

---

## Deployment on Vercel

```bash
# Option A — Vercel CLI
npm install -g vercel
vercel

# Option B — GitHub integration
# 1. Push repo to GitHub
# 2. Import project at vercel.com/new
# 3. Add VITE_GEMINI_API_KEY under Environment Variables
# 4. Deploy
```

Vercel automatically detects the Vite framework and configures the build command (`npm run build`) and output directory (`dist/`) with no additional configuration.

---

## Evaluation Criteria Mapping

| Requirement | Implementation |
|---|---|
| React frontend | React 19 + Vite 8 |
| Product display | `ProductCard` component, CSS Grid layout |
| AI integration | Google Gemini 2.5 Flash via `@google/generative-ai` |
| Natural language processing | Structured prompt with role, catalog, rules, and format |
| Recommendation engine | AI-based name matching with case-insensitive product lookup |
| Clean code | Modular components, service layer pattern, functional components + hooks |
| Loading & error handling | Spinner state, `try/catch/finally`, user-friendly error messages |
| Deployment | Vercel-ready, environment variable-based key management |

---

## License

This project was built as part of a technical assessment for Spearmint Technologies. Not licensed for commercial use.

---

*Built with React + Vite · Powered by Google Gemini AI*
