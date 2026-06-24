import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Chectout.css";
import axios from "axios";

const BACKEND_URL = "https://my-backend-server-1-axkt.onrender.com";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

function chectout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setpaymentMethod] = useState("online");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const {
      country,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    } = formData;
    return (
      country &&
      firstName &&
      lastName &&
      email &&
      phone &&
      address &&
      city &&
      state &&
      pincode &&
      paymentMethod
    );
  };

  const getCleanPrice = (price) => {
    if (!price) return 0;
    return parseInt(String(price).replace(/,/g, ""), 10);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.quantity * getCleanPrice(item.price);
  }, 0);

  // Database saving function for Cash on Delivery (COD)
  const saveOrderToMongoDB = async () => {
    try {
      const itemToSave = cartItems.map(item => ({
        id: item.id,
        title: item.title,
        weight: item.weight || item.weigth,
        quantity: item.quantity,
        price: String(item.price),
        image: item.image,
      }));

      const orderpayload = {
        customer: formData,
        items: itemToSave,
        totalAmount: totalPrice, // COD does not charge platform fee
        paymentMethod: "COD",
        paymentStatus: "Pending"
      };

      const response = await axios.post(`${BACKEND_URL}/api/orders/save`, orderpayload);
      console.log("COD Order saved to MongoDB successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving order in MongoDB:", error);
      alert("Error processing order record pipeline. Please try again.");
    }
  };

  // Flow for processing Online Payments securely via verification backend endpoint
  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return; 
    }

    const clearnedPrice = totalPrice * 100; // Convert to paise
    const currency = "INR";
    const receipt = `receipt_${Date.now()}`;

    try {
      console.log("Sending price package to backend server:", clearnedPrice);

      const response = await fetch(`${BACKEND_URL}/order`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: clearnedPrice,
          currency,
          receipt,
        }),
      });
      const order = await response.json();
      console.log("Order created:", order);

      if (!order || !order.id) {
        alert("Failed to initialize server checkout generation pipeline.");
        return;
      }

      const options = {
        key: 'rzp_live_T3Zi02iOjYMjz5',
        amount: order.amount,
        currency: order.currency,
        name: "CakeMagic",
        description: "Cake Purchase",
        order_id: order.id,

        // 🔽 DISPLAYS THE DETAILED SPLIT INSIDE THE MODAL PANEL 🔽
        display: {
          hide_topbar: false,
          preferences: {
            show_fees: true
          },
          blocks: {
            items: {
              name: "Order Summary",
              instruments: [
                { method: "upi", fee_label: "Secure Platform Fee", fee_amount: 500 },
                { method: "card", fee_label: "Secure Platform Fee", fee_amount: 500 },
                { method: "netbanking", fee_label: "Secure Platform Fee", fee_amount: 500 },
                { method: "wallet", fee_label: "Secure Platform Fee", fee_amount: 500 }
              ]
            }
          }
        },

        handler: async function (response) {
          try {
            const itemToSave = cartItems.map(item => ({
              id: item.id,
              title: item.title,
              weight: item.weight || item.weigth,
              quantity: item.quantity,
              price: String(item.price),
              image: item.image,
            }));

            // Final dynamic order price registration (Base price + ₹5 fee)
            const absolutePaidAmount = totalPrice + 5;

            // Send everything to /verify route so backend can verify AND save order
            const verifyResponse = await axios.post(`${BACKEND_URL}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: formData,
              items: itemToSave,
              totalAmount: absolutePaidAmount
            });

            if (verifyResponse.data.status === "success") {
              const onlineorderData = {
                product: cartItems,
                customer: formData,
                paymentMethod: "Online Payment",
                razorpayPaymentID: response.razorpay_payment_id,
                razorpayOrderID: response.razorpay_order_id,
              };
              navigate("/orderSuccess", { state: onlineorderData });
            } else {
              alert("Payment verification failed on the server.");
            }
          } catch (err) {
            console.error("Verification endpoint submission crashed:", err);
            alert("Payment completed but encountered errors saving to database.");
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          "Base Cake Price": `₹${totalPrice}`,
          "Convenience Platform Fee": "₹5",
          address: formData.address + ", " + formData.landmark + ", " + formData.city + ", " + formData.state + ", " + formData.pincode,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    if (paymentMethod === "cod") {
      await saveOrderToMongoDB();
      navigate("/ordersuccess", { state: { paymentMode: "Cash on Delivery" } });
    } else {
      await handleOnlinePayment();
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout Items</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-address">
              <h3 className="delivery-address">Delivery Address</h3>

              <select name="country" className="country" id="" required>
                <option value={formData.country}>India</option>
              </select>
              <br />
              <br />

              <label htmlFor="">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="first-name"
                  placeholder="First Name"
                  required
                />
              </label>

              <label htmlFor="">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="last-name"
                  placeholder="Last Name"
                  required
                />
              </label>
              <br />
              <br />
              <label htmlFor="">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="email-1"
                  placeholder="Email Id"
                  required
                />
              </label>
              <label htmlFor="">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mobile-number"
                  placeholder="Mobile Number"
                  required
                />
              </label>
              <br />
              <br />
              <label htmlFor="">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="address"
                  placeholder="Address"
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="landmark"
                  placeholder="Landmark"
                  required
                />
              </label>
              <br />
              <br />
              <label htmlFor="">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="city"
                  placeholder="City"
                  required
                />
              </label>
              <label htmlFor="">
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="state"
                  placeholder="State"
                  required
                />
              </label>
              <label htmlFor="">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="pincode"
                  placeholder="Pincode"
                  required
                />
              </label>
            </div>
            
            <h4 className="payment-method">Payment Method</h4>
            <div className="payment-option">
              <label htmlFor="" className="checkout-cod">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="cod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setpaymentMethod(e.target.value)}
                  required
                />
                Cash on Delivery
              </label>
              <br />
              <label htmlFor="" className="checkout-online">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="online"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setpaymentMethod(e.target.value)}
                  required
                />
                Online Payment
              </label>
            </div>

            {/* 🔽 COST BREAKDOWN SUMMARY PANEL IN CHEKOUT VIEW 🔽 */}
            <div className="checkout-fee-breakdown" style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eee"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#555" }}>Items Subtotal:</span>
                <span style={{ fontWeight: "500" }}>₹{totalPrice.toLocaleString()}</span>
              </div>

              {paymentMethod === "online" ? (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#e67e22" }}>
                  <span>Secure Platform Fee:</span>
                  <span style={{ fontWeight: "500" }}>+ ₹5</span>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#7f8c8d" }}>
                  <span>Platform Fee:</span>
                  <span style={{ textDecoration: "line-through" }}>₹5</span>
                  <span style={{ color: "#2ecc71", fontSize: "0.85rem", fontWeight: "bold" }}>FREE ON COD</span>
                </div>
              )}

              <hr style={{ border: "0", borderTop: "1px solid #ddd", margin: "10px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Grand Total:</span>
                <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#000" }}>
                  ₹{(paymentMethod === "online" ? totalPrice + 5 : totalPrice).toLocaleString()}
                </span>
              </div>
            </div>
            {/* 🔼 END OF COST BREAKDOWN SUMMARY PANEL 🔼 */}

            <br />
            <button type="submit" className="place-order">Place Order</button>
          </form>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="checkout-img"
                />
                <div className="checkout-details">
                  <p className="checkout-title">
                    <strong>{item.title} </strong>
                    <br />({item.weight || item.weigth})
                  </p>
                  <div className="checkout-subtotal">
                    <p className="checkout-qty">Qty: {item.quantity}</p>
                    <p className="checkout-price">
                      Price: ₹
                      {(
                        item.quantity * getCleanPrice(item.price)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Kept base items total fallback logic cleaner */}
            <h4 className="checkout-total">
              Subtotal: ₹{totalPrice.toLocaleString()}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default chectout;