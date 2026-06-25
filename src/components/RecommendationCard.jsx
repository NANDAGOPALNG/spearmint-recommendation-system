/**
 * RecommendationCard.jsx
 *
 * Renders a single AI-recommended product.
 * Visually distinct from ProductCard to make it clear
 * these results were chosen by Gemini, not just listed.
 *
 * Receives the same `product` prop shape as ProductCard,
 * so the parent can pass items from the same products array
 * without any transformation.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Note: In a larger codebase, getCategoryIcon and formatPrice would live in
// src/utils/formatters.js and be imported by both card components.
// For this assessment scope, they are inlined here to keep each file self-contained.

const getCategoryIcon = (category) => {
    const icons = {
      Phone: "📱",
      Laptop: "💻",
      Headphones: "🎧",
      Smartwatch: "⌚",
      Tablet: "📟",
    };
    return icons[category] ?? "🛍️";
  };
  
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  
  // ─── Component ────────────────────────────────────────────────────────────────
  
  /**
   * RecommendationCard
   *
   * Props:
   *   product {Object} — a single product object from products.js
   *     - id          {number}
   *     - name        {string}
   *     - brand       {string}
   *     - category    {string}
   *     - price       {number}
   *     - description {string}
   */
  const RecommendationCard = ({ product }) => {
    const { name, brand, category, price, description } = product;
  
    return (
      <div className="recommendation-card">
  
        {/* AI badge — immediately signals this card is an AI pick */}
        <div className="recommendation-card__ai-badge">
          <span className="recommendation-card__ai-badge-icon">✦</span>
          <span>AI Recommended</span>
        </div>
  
        {/* Category icon + label — same pattern as ProductCard for consistency */}
        <div className="recommendation-card__category">
          <span className="recommendation-card__icon">
            {getCategoryIcon(category)}
          </span>
          <span className="recommendation-card__category-label">{category}</span>
        </div>
  
        {/* Product identity */}
        <h3 className="recommendation-card__name">{name}</h3>
        <p className="recommendation-card__brand">{brand}</p>
  
        {/* Spec summary */}
        <p className="recommendation-card__description">{description}</p>
  
        {/* Price */}
        <p className="recommendation-card__price">{formatPrice(price)}</p>
      </div>
    );
  };
  
  export default RecommendationCard;