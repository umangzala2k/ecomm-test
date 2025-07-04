import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  // Simulate variants for demo; in real use, variants would come from product data
  const variants = product.variants || ["Default"];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const inStock = product.inStock !== false; // default to true if not specified

  return (
    <div className="product-card card h-100 d-flex flex-column shadow-sm border-0">
      {/* Product Image */}
      <div className="card-img-top p-3 text-center bg-light">
        <img
          src={product.image}
          alt={product.title}
          className="img-fluid"
          style={{ 
            maxHeight: '200px', 
            objectFit: 'contain',
            width: '100%'
          }}
        />
      </div>

      {/* Product Content */}
      <div className="card-body d-flex flex-column flex-grow-1">
        {/* Product Title */}
        <h5 
          className="card-title mb-2 fw-bold" 
          title={product.title}
          style={{ 
            fontSize: '1rem',
            lineHeight: '1.3',
            minHeight: '2.6rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.title}
        </h5>

        {/* Product Price */}
        <div className="mb-3">
          <span className="fw-bold fs-5 text-primary">${product.price}</span>
        </div>

        {/* Variant Selection as Button Group
        <div className="mb-3">
          <div className="size-buttons-grid">
            {variants.map((variant, idx) => (
              <button
                key={variant}
                type="button"
                className={`size-button${selectedVariant === variant ? ' selected' : ''}${idx === 0 ? ' default-selected' : ''}`}
                onClick={() => setSelectedVariant(variant)}
                style={{
                  marginRight: '0.5rem',
                  marginBottom: '0.5rem',
                  minWidth: 48,
                  height: 40,
                  fontWeight: selectedVariant === variant ? 700 : 500,
                  border: selectedVariant === variant ? '2px solid #1565c0' : idx === 0 ? '2px solid #43a047' : '2px solid #bdbdbd',
                  background: selectedVariant === variant ? '#e3f0fc' : idx === 0 ? '#e8f5e9' : '#fff',
                  color: selectedVariant === variant ? '#1565c0' : idx === 0 ? '#388e3c' : '#222',
                  boxShadow: selectedVariant === variant ? '0 0 0 2px #90caf9' : idx === 0 ? '0 0 0 2px #a5d6a7' : 'none',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Link
              to={`/product/${product.id}`}
              className="btn btn-outline-dark btn-sm"
            >
              View Details
            </Link>
            <button
              className={`btn btn-sm ${
                inStock ? 'btn-dark' : 'btn-secondary'
              }`}
              onClick={() => onAddToCart(product, selectedVariant)}
              disabled={!inStock}
              style={{ fontSize: '0.875rem' }}
            >
              {inStock ? (
                <>
                  <i className="fas fa-shopping-cart me-1"></i>
                  Add to Cart
                </>
              ) : (
                <>
                  <i className="fas fa-times me-1"></i>
                  Out of Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 