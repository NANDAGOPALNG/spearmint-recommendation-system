/**
 * ProductCard.jsx
 *
 * Renders a single product from the catalog.
 * Receives one `product` prop and is purely presentational —
 * it holds no state and triggers no side effects.
 */

// Maps each product category to a relevant emoji icon.
// Centralised here so adding a new category is a one-line change.
const getCategoryIcon = (category) => {
    const icons = {
      Phone: "📱",
      Laptop: "💻",
      Headphones: "🎧",
      Smartwatch: "⌚",
      Tablet: "📟",
    };
    // Fallback icon for any category not listed above
    return icons[category] ?? "🛍️";
  };
  
  // Formats a number as Indian Rupees, e.g. 74999 → "₹74,999"
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  
  /**
   * ProductCard
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
  const ProductCard = ({ product }) => {
    const { name, brand, category, price, description } = product;
  
    return (
      <div className="product-card">
        {/* Category icon + label badge */}
        <div className="product-card__category">
          <span className="product-card__icon">{getCategoryIcon(category)}</span>
          <span className="product-card__category-label">{category}</span>
        </div>
  
        {/* Product identity */}
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__brand">{brand}</p>
  
        {/* Spec summary */}
        <p className="product-card__description">{description}</p>
  
        {/* Price — visually prominent, placed last for natural reading order */}
        <p className="product-card__price">{formatPrice(price)}</p>
      </div>
    );
  };
  
  export default ProductCard;