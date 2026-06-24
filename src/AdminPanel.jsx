import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const BACKEND_URL = "https://my-backend-server-1-axkt.onrender.com";

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Tracks which order is updating status
  const [deletingId, setDeletingId] = useState(null); // Tracks which order is being deleted

  // Set your desired credentials here
  const ADMIN_USERNAME = "cakemagic";
  const ADMIN_PASSWORD = "CakeMagic2386";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminLoggedIn", "true");
    } else {
      alert("Invalid Username & Password");
    }
  };

  // Auto login
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch orders from MongoDB when authenticated
  const fetchOrders = () => {
    setLoading(true);
    axios.get(BACKEND_URL + "/api/admin/orders")
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading admin orders:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Updates COD payment status upon delivery confirmation
  const handleMarkAsPaid = (orderId) => {
    if (!window.confirm("Confirm that cash has been received and mark this order as PAID?")) return;
    
    setUpdatingId(orderId);
    axios.post(BACKEND_URL + "/api/admin/orders/update-payment", { orderId, paymentStatus: "Paid" })
      .then((response) => {
        if (response.data.success) {
          alert("Order payment status updated successfully!");
          fetchOrders(); // Refresh the list to reflect updates
        } else {
          alert("Failed to update status: " + response.data.message);
        }
        setUpdatingId(null);
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);
        alert("Server error while updating payment status.");
        setUpdatingId(null);
      });
  };

  // NEW FUNCTION: Mark an order as delivered
  const handleMarkAsDelivered = (orderId) => {
    if (!window.confirm("Are you sure you want to change this order status to DELIVERED?")) return;

    setUpdatingId(orderId);
    axios.post(BACKEND_URL + "/api/admin/orders/update-delivery", { orderId, deliveryStatus: "Delivered" })
      .then((response) => {
        if (response.data.success) {
          alert("Order marked as Delivered!");
          fetchOrders(); // Refresh list to update UI
        } else {
          alert("Failed to update status: " + response.data.message);
        }
        setUpdatingId(null);
      })
      .catch((error) => {
        console.error("Error updating delivery status:", error);
        alert("Server error while updating delivery status.");
        setUpdatingId(null);
      });
  };

  // NEW FUNCTION: Permanently delete an order from database
  const handleDeleteOrder = (orderId) => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to permanently DELETE this order from the database? This cannot be undone.")) return;

    setDeletingId(orderId);
    axios.delete(`${BACKEND_URL}/api/admin/orders/${orderId}`)
      .then((response) => {
        if (response.data.success) {
          alert("Order deleted successfully!");
          fetchOrders(); // Refresh list to drop card from UI
        } else {
          alert("Failed to delete order: " + response.data.message);
        }
        setDeletingId(null);
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        alert("Server error while deleting order.");
        setDeletingId(null);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // --- LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2 className="admin-login">CakeMagic Admin Login</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-btn">Login</button>
        </form>
      </div>
    );
  }

  // --- MAIN ADMIN ORDERS VIEW SCREEN ---
  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h2 className="dashboard">Customer Cake Orders Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {loading ? (
        <p className="loading-text">Loading incoming customer orders...</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found in the database.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isCOD = order.paymentMethod?.toLowerCase() === "cod";
            const isPendingPayment = order.paymentStatus?.toLowerCase() === "pending";
            const isDelivered = order.deliveryStatus?.toLowerCase() === "delivered";

            return (
              <div key={order._id} className="admin-order-card">
                <div className="order-card-header">
                  <h3 className="orderId">Order ID: {order._id}</h3>
                  <div className="online" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    
                    {/* Payment Status Indicator */}
                    <span className={`status-badge ${order.paymentMethod}`}>
                      {order.paymentMethod ? order.paymentMethod.toUpperCase() : "COD"} - {order.paymentStatus || "Pending"}
                    </span>

                    {/* Delivery Status Indicator */}
                    <span 
                      className="status-badge" 
                      style={{ 
                        backgroundColor: isDelivered ? "#d4edda" : "#f8d7da", 
                        color: isDelivered ? "#155724" : "#721c24" 
                      }}
                    >
                      DELIVERY: {order.deliveryStatus ? order.deliveryStatus.toUpperCase() : "PENDING"}
                    </span>
                    
                    {/* ACTION BUTTON: Mark as Paid (Only for pending COD) */}
                    {isCOD && isPendingPayment && (
                      <button 
                        className="mark-paid-btn"
                        onClick={() => handleMarkAsPaid(order._id)}
                        disabled={updatingId === order._id}
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "13px"
                        }}
                      >
                        {updatingId === order._id ? "Updating..." : "Mark as Paid"}
                      </button>
                    )}

                    {/* ACTION BUTTON: Mark as Delivered (Only visible if status is not Delivered) */}
                    {!isDelivered && (
                      <button 
                        className="mark-delivered-btn"
                        onClick={() => handleMarkAsDelivered(order._id)}
                        disabled={updatingId === order._id}
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "13px"
                        }}
                      >
                        {updatingId === order._id ? "Updating..." : "Mark Delivered"}
                      </button>
                    )}

                    {/* DANGEROUS ACTION BUTTON: Delete Order from dashboard */}
                    <button 
                      className="delete-order-btn"
                      onClick={() => handleDeleteOrder(order._id)}
                      disabled={deletingId === order._id}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "13px"
                      }}
                    >
                      {deletingId === order._id ? "Deleting..." : "Delete Order"}
                    </button>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="customer-details-section">
                    <h4 className="Customer-info">Customer Info</h4>
                    <p className="Customer-details"><strong>Name:</strong> {order.customer?.firstName} {order.customer?.lastName}</p>
                    <p className="Customer-details"><strong>Phone:</strong> {order.customer?.phone}</p>
                    <p className="Customer-details"><strong>Email:</strong> {order.customer?.email}</p>
                    <p className="Customer-details"><strong>Address:</strong> {order.customer?.address}, {order.customer?.landmark}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
                  </div>

                  <div className="ordered-items-section">
                    <h4>Cakes Ordered</h4>
                    {(() => {
                      const rawItemsData = order.items;
                      let itemsArray = [];
                      if (Array.isArray(rawItemsData)) {
                        itemsArray = rawItemsData;
                      } else if (rawItemsData && typeof rawItemsData === 'object') {
                        itemsArray = Object.values(rawItemsData);
                      }

                      if (itemsArray.length === 0 && order.title) {
                        itemsArray = [order];
                      }

                      if (itemsArray.length > 0) {
                        return itemsArray.map((rawItem, id) => {
                          const item = rawItem.item ? rawItem.item : rawItem;
                          
                          const displayTitle = item.title || item.name || rawItem.title || rawItem.name || "Delicious Cake";
                          const displayImage = item.image || item.imageUrl || rawItem.image || rawItem.imageUrl || "https://placehold.co/60x60?text=Cake";
                          const displayQty = rawItem.quantity || item.quantity || rawItem.qty || item.qty || 1;
                          const displayPrice = item.price || rawItem.price || item.rate || 0;
                          const displayWeight = item.weight || rawItem.weight || "";

                          return (
                            <div key={id} className="admin-item-row" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                              <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="admin-item-thumb" 
                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
                              />
                              <div className="admin-item-details">
                                <p style={{ margin: "0 0 4px 0" }}><strong>{displayTitle}</strong> {displayWeight ? `(${displayWeight})` : ""}</p>
                                <p style={{ margin: "0", color: "#555", fontSize: "13px" }}>Qty: {displayQty} | Price: ₹{displayPrice}</p>
                              </div>
                            </div>
                          );
                        });
                      } else {
                        return (
                          <div style={{ background: "#fff5f5", padding: "10px", borderRadius: "6px", border: "1px dashed #e53e3e" }}>
                            <p style={{ color: "#c53030", fontStyle: "italic", fontSize: "13px", margin: "0 0 5px 0" }}>
                              ⚠️ Schema mismatch: Check your checkout payload.
                            </p>
                            <span style={{ fontSize: "11px", color: "#742a2a" }}>
                              MongoDB data type: {Array.isArray(rawItemsData) ? "Array" : typeof rawItemsData} 
                            </span>
                          </div>
                        );
                      }
                    })()}
                    <h4 className="admin-total-amount" style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
                      Total Collected Amount: ₹{order.totalAmount}
                    </h4>
                  </div>
                </div>
                <p className="order-date">Ordered On: {order.dataCreated ? new Date(order.dataCreated).toLocaleString() : "Recent"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;