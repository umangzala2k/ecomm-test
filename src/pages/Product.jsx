import React, { useEffect, useState, useCallback, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";

import { Footer, Navbar } from "../components";
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  // Simulate product variants with colors, sizes, and images
  const productVariants = useMemo(() => ({
    colors: [
      { id: 'black', name: 'Black', hex: '#000000', image: product.image },
      { id: 'white', name: 'White', hex: '#FFFFFF', image: product.image },
      { id: 'red', name: 'Red', hex: '#FF0000', image: product.image },
      { id: 'blue', name: 'Blue', hex: '#0066CC', image: product.image },
      { id: 'green', name: 'Green', hex: '#00AA00', image: product.image }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availability: {
      'black': { S: true, M: true, L: true, XL: false },
      'white': { S: true, M: true, L: true, XL: true },
      'red': { S: false, M: true, L: true, XL: true },
      'blue': { S: true, M: true, L: false, XL: true },
      'green': { S: true, M: false, L: true, XL: true }
    }
  }), [product.image]);

  // Get current variant availability
  const currentAvailability = useMemo(() => {
    if (!selectedColor) return {};
    return productVariants.availability[selectedColor] || {};
  }, [selectedColor, productVariants.availability]);

  // Check if current selection is in stock
  const isInStock = useMemo(() => {
    if (!selectedColor || !selectedSize) return false;
    return currentAvailability[selectedSize] === true;
  }, [selectedColor, selectedSize, currentAvailability]);

  // Get current product image
  const currentImage = useMemo(() => {
    if (!selectedColor) return product.image;
    const colorVariant = productVariants.colors.find(c => c.id === selectedColor);
    return colorVariant?.image || product.image;
  }, [selectedColor, productVariants.colors, product.image]);

  // Initialize default selections
  useEffect(() => {
    if (productVariants.colors.length > 0 && !selectedColor) {
      setSelectedColor(productVariants.colors[0].id);
    }
    if (productVariants.sizes.length > 0 && !selectedSize) {
      setSelectedSize(productVariants.sizes[0]);
    }
  }, [productVariants, selectedColor, selectedSize]);

  const addProduct = useCallback((product) => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    const productWithVariant = {
      ...product,
      selectedColor,
      selectedSize,
      qty: quantity,
      variantPrice: product.price, // In real app, this might vary by variant
      variantImage: currentImage
    };
    
    dispatch(addCart(productWithVariant));
    toast.success(`Added ${quantity} ${product.title} (${selectedColor}, ${selectedSize}) to cart!`);
  }, [selectedColor, selectedSize, quantity, currentImage, dispatch]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setLoading2(true);
        
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
        
        const response2 = await fetch(
          `https://fakestoreapi.com/products/category/${data.category}`
        );
        if (!response2.ok) throw new Error('Similar products not found');
        
        const data2 = await response2.json();
        setSimilarProducts(data2);
        setLoading2(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        setLoading(false);
        setLoading2(false);
      }
    };
    
    getProduct();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row g-4">
        <div className="col-lg-6 col-md-12">
          <Skeleton height={500} />
        </div>
        <div className="col-lg-6 col-md-12">
          <Skeleton height={30} width={200} />
          <Skeleton height={60} />
          <Skeleton height={30} width={100} />
          <Skeleton height={50} width={150} />
          <Skeleton height={120} />
          <Skeleton height={50} width={120} />
          <Skeleton height={50} width={120} />
          <Skeleton height={50} width={120} />
        </div>
      </div>
    </div>
  );

  const SizeButton = ({ size, isSelected, isAvailable }) => (
    <button
      className={`size-button ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
      onClick={() => isAvailable && setSelectedSize(size)}
      disabled={!isAvailable}
    >
      {size}
      {!isAvailable && <small className="d-block">Out of Stock</small>}
    </button>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-4">
      <div className="row g-4">
        {/* Product Images */}
        <div className="col-lg-6 col-md-12">
          <div className="product-images-container">
            <div className="main-image-container bg-light rounded p-4 text-center mb-3">
              <img
                className="img-fluid rounded shadow-sm"
                src={currentImage}
                alt={product.title}
                style={{
                  maxHeight: '500px',
                  objectFit: 'contain',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6 col-md-12">
          <div className="product-details">
            {/* Category */}
            <div className="mb-3">
              <span className="badge bg-secondary text-white px-3 py-2">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="display-6 fw-bold mb-3" style={{
              lineHeight: '1.2',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
            }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${
                        i < Math.floor(product.rating?.rate || 0)
                          ? 'text-warning'
                          : 'text-muted'
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="text-muted">
                  ({product.rating?.rate || 0} / 5) - {product.rating?.count || 0} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h2 className="display-5 fw-bold text-primary mb-0">
                ${product.price}
              </h2>
              <small className="text-muted">Free shipping available</small>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {selectedColor && selectedSize ? (
                isInStock ? (
                  <div className="d-flex align-items-center text-success">
                    <i className="fas fa-check-circle me-2"></i>
                    <span className="fw-bold">In Stock</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-danger">
                    <i className="fas fa-times-circle me-2"></i>
                    <span className="fw-bold">Out of Stock</span>
                  </div>
                )
              ) : (
                <div className="d-flex align-items-center text-warning">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <span className="fw-bold">Please select color and size</span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold product-size-label">Select Size:</label>
              <div className="size-buttons-grid">
                {productVariants.sizes.map((size, idx) => {
                  const isAvailable = currentAvailability[size] === true;
                  // Find the first available size
                  const firstAvailable = productVariants.sizes.find(s => currentAvailability[s] === true);
                  const isDefaultSelected = !selectedSize && isAvailable && firstAvailable === size;
                  const isSelected = selectedSize === size || isDefaultSelected;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`size-button${isSelected ? ' selected' : ''}${!isAvailable ? ' unavailable' : ''} product-size-btn${isDefaultSelected ? ' default-selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      <span className="size-text">{size}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold">Quantity:</label>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="mx-3 fw-bold fs-5">{quantity}</span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isInStock}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-bold mb-2">Description:</h5>
              <p className="text-muted" style={{ lineHeight: '1.6' }}>
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-3">
              <button
                className={`btn btn-lg ${
                  isInStock ? 'btn-dark' : 'btn-secondary'
                }`}
                onClick={() => addProduct(product)}
                disabled={!isInStock}
              >
                {isInStock ? (
                  <>
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </>
                ) : (
                  <>
                    <i className="fas fa-times me-2"></i>
                    Out of Stock
                  </>
                )}
              </button>
              
              <div className="row g-2">
                <div className="col-6">
                  <Link to="/cart" className="btn btn-outline-dark w-100">
                    <i className="fas fa-shopping-bag me-2"></i>
                    View Cart
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/" className="btn btn-outline-secondary w-100">
                    <i className="fas fa-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Loading2 = () => (
    <div className="my-4 py-4">
      <div className="row g-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="col-lg-3 col-md-6 col-sm-6">
            <Skeleton height={300} />
          </div>
        ))}
      </div>
    </div>
  );

  const ShowSimilarProduct = () => (
    <div className="py-4 my-4">
      <div className="row g-3">
        {similarProducts.slice(0, 4).map((item) => (
          <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
            <div className="card h-100 shadow-sm">
              <div className="card-img-top p-3 text-center bg-light">
                <img
                  className="img-fluid"
                  src={item.image}
                  alt={item.title}
                  style={{
                    maxHeight: '200px',
                    objectFit: 'contain',
                    width: '100%'
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold" style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.title}
                </h6>
                <p className="text-primary fw-bold mb-3">${item.price}</p>
                <div className="mt-auto">
                  <div className="d-grid gap-2">
                    <Link
                      to={`/product/${item.id}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => {
                        dispatch(addCart(item));
                        toast.success("Added to cart!");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          {loading ? <Loading /> : <ShowProduct />}
        </div>
        
        {/* Similar Products Section */}
        <div className="row my-5 py-5">
          <div className="col-12">
            <h2 className="text-center mb-4">
              <i className="fas fa-heart me-3"></i>
              You May Also Like
            </h2>
            {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
