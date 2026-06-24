import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import "./buynow.css";

// Render Backend Live URL configuration
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

function BuyNow() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state;

  const [formData, setFormData] = useState({
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

  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      landmark,
      city,
      state,
      pincode,
    } = formData;
    return (
      firstName &&
      lastName &&
      email &&
      phone &&
      address &&
      landmark &&
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

  const totalPrice = product
    ? (product.quantity || 1) * getCleanPrice(product.price)
    : cartItems && cartItems.length > 0
    ? cartItems.reduce((total, item) => total + item.quantity * getCleanPrice(item.price), 0)
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Helper utility to structure items uniformly
  const getItemsPayload = () => {
    if (product) {
      return [{
        id: String(product.id),
        title: product.title || product.name || "Delicious Cake",
        weight: product.weight || "",
        quantity: Number(product.quantity || 1),
        price: String(product.price),
        image: product.image,
      }];
    } else if (cartItems && cartItems.length > 0) {
      return cartItems.map(item => ({
        id: String(item.id),
        title: item.title || item.name || "Delicious Cake",
        weight: item.weight || "",
        quantity: Number(item.quantity || 1),
        price: String(item.price),
        image: item.image,
      }));
    }
    return [];
  };

  // Database saving utility function specifically for COD
  const saveOrderToMongoDB = async () => {
    try {
      const itemsToSave = getItemsPayload();
      const orderpayload = {
        customer: formData,
        items: itemsToSave,
        totalAmount: totalPrice,
        paymentMethod: "cod",
        paymentStatus: "Pending",
      };

      const response = await axios.post(`${BACKEND_URL}/api/orders/save`, orderpayload);
      console.log("COD Order saved to MongoDB:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving order to MongoDB:", error);
      alert("Error saving order. Please try again.");
    }
  };

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
        description: `Cake Price: ₹${totalPrice} + ₹5 Platform Fee`,
        order_id: order.id,

        display: {
          hide_topbar: false,
          preferences: {
            show_fees: true
          },
          blocks: {
            items: {
              name: "Order Summary",
              instruments: [
                {
                  method: "upi",
                  fee_label: "Secure Platform Fee",
                  fee_amount: 500 // 500 paise = ₹5
                },
                {
                  method: "card",
                  fee_label: "Secure Platform Fee",
                  fee_amount: 500 
                },
                {
                  method: "netbanking",
                  fee_label: "Secure Platform Fee",
                  fee_amount: 500
                },
                {
                  method: "wallet",
                  fee_label: "Secure Platform Fee",
                  fee_amount: 500
                }
              ]
            }
          }
        },

        handler: async function (response) {
          try {
            const itemsToSave = getItemsPayload();
            const finalPaidAmountRupees = order.amount / 100;

            // Send full order verification packet to your custom backend secure /verify route
            const verifyResponse = await axios.post(`${BACKEND_URL}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: formData,
              items: itemsToSave,
              totalAmount: finalPaidAmountRupees
            });

            if (verifyResponse.data.status === "success") {
              const onlineOrderData = {
                product: product || (cartItems.length > 0 ? cartItems[0] : null),
                customer: formData,
                paymentMethod: "online",
                razorpayPaymentID: response.razorpay_payment_id,
                razorpayOrderID: response.razorpay_order_id,
              };
              navigate("/orderSuccess", { state: onlineOrderData });
            } else {
              alert("Payment verification failed on the server side.");
            }
          } catch (err) {
            console.error("Signature verification endpoint exception:", err);
            alert("Payment processed, but errors occurred while trying to save to database records.");
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          "Base Amount": `₹${totalPrice}`,
          "Platform Fee": "₹5",
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

    const orderData = {
      product: product,
      customer: formData,
      paymentMethod,
    };

    if (paymentMethod === "cod") {
      await saveOrderToMongoDB();
      navigate("/buyCod", { state: orderData });
    } else {
      handleOnlinePayment();
    }
  };

  if (!product && (!cartItems || cartItems.length === 0)) {
    return <p>No product Selected...</p>;
  }

  return (
    <div className="buy-now-container">
      <h2 className="buy-now-head">Order Summary</h2>

      <div className="buy-now-orders-wrapper" style={{ marginBottom: "20px" }}>
        {product ? (
          <div className="buy-now-ordercard">
            <img src={product.image} alt={product.name || product.title} className="buy-now-image" />
            <div className="buy-now-info">
              <h3 className="buy-now-title">{product.title || product.name}</h3>
              <p className="buy-now-cakeId">Cake ID: {product.id}</p>
              <p className="buy-now-weight">Weight: {product.weight}</p>
              <p className="buy-now-quantity">Quantity: {product.quantity || 1}</p>
              <h4 className="buy-now-totalprice">Total Price: ₹{totalPrice}</h4>
            </div>
          </div>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="buy-now-ordercard" style={{ marginBottom: "10px" }}>
              <img src={item.image} alt={item.title} className="buy-now-image" />
              <div className="buy-now-info">
                <h3 className="buy-now-title">{item.title}</h3>
                <p className="buy-now-cakeId">Cake ID: {item.id}</p>
                <p className="buy-now-weight">Weight: {item.weight}</p>
                <p className="buy-now-quantity">Quantity: {item.quantity || 1}</p>
                <h4 className="buy-now-totalprice">Price: ₹{getCleanPrice(item.price) * (item.quantity || 1)}</h4>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="buy-now-address">
        <h3>Delivery Address</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="buy-now-firstname"
              placeholder="First Name"
              required
            />
          </label>

          <label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="buy-now-lastname"
              placeholder="Last Name"
              required
            />
          </label>
          <br />
          <br />
          <label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="buy-now-email1"
              placeholder="Email Id"
              required
            />
          </label>
          <label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="buy-now-mobilenumber"
              placeholder="Mobile Number"
              required
            />
          </label>
          <br />
          <br />
          <label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="buy-now-Address"
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
              className="buy-now-landmark"
              placeholder="Landmark"
              required
            />
          </label>
          <br />
          <br />
          <label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="buy-now-city"
              placeholder="City"
              required
            />
          </label>
          <label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="buy-now-state"
              placeholder="State"
              required
            />
          </label>
          <label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="buy-now-pincode"
              placeholder="Pincode"
              required
            />
          </label>
          
          <h4 className="buy-now-paymentmethod">Payment Method</h4>
          <div className="buy-now-paymentoption">
            <label className="buy-now-checkoutcod">
              <input
                type="radio"
                name="paymentMethod"
                className="buy-now-cod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setpaymentMethod(e.target.value)}
                required
              />
              Cash on Delivery
            </label>
            <br />
            <label className="buy-now-checkoutonline">
              <input
                type="radio"
                name="paymentMethod"
                className="buy-now-online"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setpaymentMethod(e.target.value)}
                required
              />
              Online Payment
            </label>
          </div>

          {/* 🔽 COST BREAKDOWN SUMMARY PANEL IN CHEKOUT VIEW 🔽 */}
          <div className="checkout-fee-breakdown" 
        style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #eee"
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
              <span className="Items-Subtotal" style={{ color: "#555" }}>Items Subtotal:</span>
              <span className="fee" style={{ fontWeight: "500" }}>₹{totalPrice.toLocaleString()}</span>
            </div>

            {paymentMethod === "online" ? (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px", color: "#e67e22" }}>
                <span className="Secure-Platform">Secure Platform Fee:</span>
                <span className="fee" style={{ fontWeight: "500" }}>+ ₹5</span>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px", color: "#7f8c8d" }}>
                <span className="Platform-Fee" >Platform Fee:</span>
                <span   style={{ textDecoration: "line-through" }}>₹5</span>
                <span className="fee" style={{ color: "#2ecc71", fontSize: "0.85rem", fontWeight: "bold" }}>FREE ON COD</span>
              </div>
            )}

            <hr style={{ border: "0", borderTop: "1px solid #ddd", margin: "10px 0" }} />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span className="Grand-Total" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Grand Total:</span>
              <span className="fee" style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#000" }}>
                ₹{(paymentMethod === "online" ? totalPrice + 5 : totalPrice).toLocaleString()}
              </span>
            </div>
          </div>
          {/* 🔼 END OF COST BREAKDOWN SUMMARY PANEL 🔼 */}

          <br />
          <button type="submit" className="buy-now-placeorder">
            Place Order
          </button>
          <button type="button" className="cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>
      <div className="buy-now-back" onClick={() => navigate("/product")}>
        &larr; Back TO Products
      </div>
    </div>
  );
}

export default BuyNow;