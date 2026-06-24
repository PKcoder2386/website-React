import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "./cartSlice";
import "./OrderSuccess.css";

function orderSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const paymentMode = location.state?.paymentMode || "Online Payment";

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="order-success-container">
      <h1 className="order-success-full">Order Successful!</h1>
      <p className="order-success-message">
        Your Order Has Been Placed Successfully.
      </p>
      <p className="order-success-message">
        Payment Mode: <span style={{ color: "red" }}>{paymentMode}</span>
      </p>

      <button onClick={() => navigate("/")} className="go-to-home">
        GO TO HOME
      </button>
    </div>
  );
}
export default orderSuccess;
