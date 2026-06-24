import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./orderConfirm.css";

function OrderComfirmation() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="order-history">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found. Start shopping!</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => {
            const subtotal = parseInt(order.product.price);
            const deliveryCharge = 50;
            const total = subtotal + deliveryCharge;
            const orderDate = new Date().toLocaleString();

            return (
              <div key={index} className="invoice-card">
                <div className="invoice-header">
                  <h4>Order ID: {order.id}</h4>
                  <p className="order-date">📅 {orderDate}</p>
                </div>

                <div className="invoice-body">
                  <div className="invoice-left">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="invoice-img"
                    />
                  </div>

                  <div className="invoice-right">
                    <h3>{order.title}</h3>
                    <p>Weight: {order.weight}</p>

                    <table className="invoice-table">
                      <tbody>
                        <tr>
                          <td>Subtotal:</td>
                          <td>₹{subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Delivery Charge:</td>
                          <td>₹{deliveryCharge}</td>
                        </tr>
                        <tr className="total-row">
                          <td>Total:</td>
                          <td>₹{total.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="invoice-address">
                      <h4>Shipping To:</h4>
                      <p>{order.name}</p>
                      <p>{order.address}</p>
                      <p>
                        {order.city} - {order.pincode}
                      </p>
                      <p>📞 {order.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/product")}>
        ⬅ Back to Shopping
      </button>
    </div>
  );
}

export default OrderComfirmation;
