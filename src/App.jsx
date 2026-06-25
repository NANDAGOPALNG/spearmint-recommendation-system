/**
 * App.jsx
 *
 * Root component — owns all application state and defines the page layout.
 *
 * State:
 *   query           {string}   — controlled input value
 *   recommendations {Array}    — AI-matched product objects to display
 *   isLoading       {boolean}  — true while waiting for Gemini response
 *   error           {string|null} — error message to show, or null
 *
 * Layout sections:
 *   1. <header>         — App title and tagline
 *   2. #search          — Natural language input + submit button
 *   3. #recommendations — AI-filtered results (visible only after a query)
 *   4. #catalog         — Full product grid (always visible)
 */

import { useState, useCallback } from "react";

import ProductCard from "./components/ProductCard";
import RecommendationCard from "./components/RecommendationCard";
import products from "./data/products";

// Gemini service — implemented in Step 6
import { getRecommendations } from "./services/gemini";

// ─── Component ────────────────────────────────────────────────────────────────
const App = () => {
  // ── State ──────────────────────────────────────────────────────────────────

  // Tracks what the user has typed in the search input
  const [query, setQuery] = useState("");

  // Holds the subset of products Gemini recommends; empty until first query
  const [recommendations, setRecommendations] = useState([]);

  // True while the Gemini API call is in-flight
  const [isLoading, setIsLoading] = useState(false);

  // Holds a user-facing error string, or null when there is no error
  const [error, setError] = useState(null);

  // True once the user has submitted at least one query (controls empty state)
  const [hasSearched, setHasSearched] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  // Keeps `query` in sync with the input field on every keystroke
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Clicking an example chip pre-fills the input — UX shortcut for new users
  const handleChipClick = (example) => {
    setQuery(example);
  };

  // Allow submitting via the Enter key — matches natural typing behaviour
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "" && !isLoading) {
      handleSubmit();
    }
  };

  /**
   * handleSubmit — the core action of the app.
   *
   * Flow:
   *   1. Guard: ignore empty / whitespace-only queries
   *   2. Reset previous results and error
   *   3. Set loading state
   *   4. Call Gemini service (getRecommendations)
   *   5. Match returned product names back to full product objects
   *   6. Update recommendations state
   *   7. Handle any errors
   *   8. Always clear loading state
   *
   * useCallback: memoises the function so it isn't recreated on every render.
   * Correct practice for handlers passed as onClick props to child elements.
   */
  const handleSubmit = useCallback(async () => {
    // Guard — trim prevents whitespace-only submissions
    if (query.trim() === "") return;

    // Reset state for the new query
    setError(null);
    setRecommendations([]);
    setHasSearched(true);
    setIsLoading(true);

    try {
      // Ask Gemini to recommend products based on the user's natural language query.
      // Returns a string[] of product names exactly as they appear in products.js.
      const recommendedNames = await getRecommendations(query, products);

      // Match the returned names back to full product objects.
      // Case-insensitive comparison handles minor casing differences between
      // what Gemini returns and what's stored in products.js.
      const matched = products.filter((product) =>
        recommendedNames.some(
          (name) => name.toLowerCase() === product.name.toLowerCase()
        )
      );

      setRecommendations(matched);

    } catch (err) {
      // Show a friendly message — never expose raw API errors to the user
      setError(
        "Something went wrong while fetching recommendations. Please try again."
      );
      console.error("Gemini API error:", err);
    } finally {
      // Always runs — clears loading spinner whether the call succeeded or failed
      setIsLoading(false);
    }
  }, [query]); // Re-create only when query changes

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="app__header">
        <div className="app__header-inner">
          <h1 className="app__title">
            <span className="app__title-icon">✦</span>
            AI Product Finder
          </h1>
          <p className="app__tagline">
            Describe what you need — our AI picks the best match from the catalog.
          </p>
        </div>
      </header>

      <main className="app__main">

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <section className="search-section" aria-label="Product search">
          <div className="search-section__inner">
            <label htmlFor="preference-input" className="search-section__label">
              What are you looking for?
            </label>

            <div className="search-section__row">
              <input
                id="preference-input"
                type="text"
                className="search-section__input"
                placeholder="e.g. I need a phone under ₹30,000 with a great camera"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />

              <button
                className="search-section__button"
                onClick={handleSubmit}
                disabled={isLoading || query.trim() === ""}
              >
                {isLoading ? "Finding…" : "Recommend"}
              </button>
            </div>

            {/* Example query chips */}
            <ul className="search-section__examples" aria-label="Example queries">
              {[
                "Recommend a gaming laptop",
                "Affordable wireless headphones",
                "Smartwatch with long battery life",
                "Best phone under ₹25,000",
              ].map((example) => (
                <li key={example}>
                  <button
                    className="search-section__example-chip"
                    onClick={() => handleChipClick(example)}
                    disabled={isLoading}
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Error banner ───────────────────────────────────────────────────── */}
        {error && (
          <div className="app__error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Loading state ──────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="app__loading" role="status" aria-live="polite">
            <div className="app__spinner" aria-hidden="true" />
            <p>Finding the best products for you…</p>
          </div>
        )}

        {/* ── Recommendations section ────────────────────────────────────────── */}
        {!isLoading && recommendations.length > 0 && (
          <section className="recommendations-section" aria-label="AI recommendations">
            <div className="section-header">
              <h2 className="section-header__title">
                <span className="section-header__icon">✦</span>
                AI Recommendations
              </h2>
              <p className="section-header__count">
                {recommendations.length} product
                {recommendations.length !== 1 ? "s" : ""} matched
              </p>
            </div>

            <div className="recommendations-grid">
              {recommendations.map((product) => (
                <RecommendationCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* ── No results state ───────────────────────────────────────────────── */}
        {!isLoading && hasSearched && recommendations.length === 0 && !error && (
          <div className="app__no-results">
            <p>😕 No products matched your request. Try rephrasing your query.</p>
          </div>
        )}

        {/* ── Full catalog ───────────────────────────────────────────────────── */}
        <section className="catalog-section" aria-label="Product catalog">
          <div className="section-header">
            <h2 className="section-header__title">All Products</h2>
            <p className="section-header__count">
              {products.length} products available
            </p>
          </div>

          <div className="catalog-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="app__footer">
        <p>Powered by Gemini AI · Built with React + Vite</p>
      </footer>

    </div>
  );
};

export default App;