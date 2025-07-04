import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { Link } from "react-router-dom";

const Cart = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 py-5 bg-light text-center rounded">
            <div className="py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-4"></i>
              <h4 className="display-6 mb-4">Your Cart is Empty</h4>
              <p className="text-muted mb-4">Add some products to your cart to get started!</p>
              <Link to="/" className="btn btn-dark btn-lg">
                <i className="fa fa-arrow-left me-2"></i> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    dispatch(addCart(product));
  };
  
  const removeItem = (product) => {
    dispatch(delCart(product));
  };

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;
    
    state.map((item) => {
      return (subtotal += item.price * item.qty);
    });

    state.map((item) => {
      return (totalItems += item.qty);
    });
    
    return (
      <>
        <div className="container py-4">
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8 col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Shopping Cart ({totalItems} items)
                  </h5>
                </div>
                <div className="card-body p-0">
                  {state.map((item) => (
                    <div key={item.id} className="cart-item p-3 border-bottom">
                      <div className="row align-items-center g-3">
                        {/* Product Image */}
                        <div className="col-md-3 col-sm-4 col-6">
                          <div className="product-image-container text-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="img-fluid rounded"
                              style={{
                                maxHeight: '100px',
                                objectFit: 'contain',
                                width: '100%'
                              }}
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-md-4 col-sm-8 col-6">
                          <div className="product-details">
                            <h6 className="fw-bold mb-2" style={{
                              fontSize: '0.9rem',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {item.title}
                            </h6>
                            <p className="text-primary fw-bold mb-0">${item.price}</p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-md-3 col-sm-6 col-12">
                          <div className="quantity-controls d-flex align-items-center justify-content-center">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => removeItem(item)}
                              style={{ minWidth: '40px' }}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="mx-3 fw-bold">{item.qty}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => addItem(item)}
                              style={{ minWidth: '40px' }}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="col-md-2 col-sm-6 col-12">
                          <div className="text-end">
                            <p className="fw-bold mb-0">${(item.price * item.qty).toFixed(2)}</p>
                            <small className="text-muted">{item.qty} x ${item.price}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4 col-md-12">
              <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="fas fa-receipt me-2"></i>
                    Order Summary
                  </h5>
                </div>
                <div className="card-body">
                  <div className="summary-item d-flex justify-content-between align-items-center mb-3">
                    <span>Products ({totalItems})</span>
                    <span className="fw-bold">${Math.round(subtotal)}</span>
                  </div>
                  <div className="summary-item d-flex justify-content-between align-items-center mb-3">
                    <span>Shipping</span>
                    <span className="fw-bold">${shipping}</span>
                  </div>
                  <hr />
                  <div className="summary-item d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold fs-5">Total Amount</span>
                    <span className="fw-bold fs-5 text-primary">${Math.round(subtotal + shipping)}</span>
                  </div>

                  <Link
                    to="/checkout"
                    className="btn btn-dark w-100 btn-lg mb-3"
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceed to Checkout
                  </Link>
                  
                  <Link
                    to="/"
                    className="btn btn-outline-dark w-100"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-4">
              <i className="fas fa-shopping-cart me-3"></i>
              Shopping Cart
            </h1>
            <hr className="mb-4" />
          </div>
        </div>
        {state.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
