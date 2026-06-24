import { useDispatch, useSelector } from "react-redux";

import { addToCart, decreaseQuantity, removeFromCart } from "./cartSlice";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.quantity * parseInt(item.price.replace(/,/g, ""));
  }, 0);

  const handlIncrease = (item) => {
    dispatch(addToCart(item));
    toast.success("Increased quantity");
  };

  const handleDecrease = (item) => {
    dispatch(decreaseQuantity({ id: item.id }));
    toast.info("Decreased Quantity");
  };

  const handleChectout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h2 className="cart-head">cart Items</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Your cart is empty...</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                style={{ height: "150px" }}
                className="image-1"
              />
              <div className="item-details">
                <h3>
                  {item.title}-{item.id}
                </h3>
                {/* <p>Quantity:{item.quantity}</p> */}
                <p className="weight">Weight:{item.weight}</p>
                <p className="price-1">Price:{item.price}</p>

                {/* quantity buttons */}
                <div className="qty-controls">
                  <button
                    onClick={() => handleDecrease(item)}
                    className="sub-1"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handlIncrease(item)} className="add">
                    +
                  </button>
                </div>

                {/* <button onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove Item
                </button> */}
                <p className="subtotal">
                  subtotal:
                  {item.quantity * parseInt(item.price.replace(/,/g, ""))}
                </p>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h4>
              Total: <span>₹{totalPrice.toLocaleString()}</span>
            </h4>

            <button className="checkout-btn" onClick={handleChectout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Cart;
