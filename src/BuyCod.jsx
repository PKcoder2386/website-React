import { useDispatch } from "react-redux";
import "./buyCod.css";
import { useLocation, useNavigate } from "react-router-dom";

function BuyCod() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const paymentMode = location.state?.paymentMode || "Cash on Delivery";

  return (
    <div className="buy-cod-container">
      <h1 className="buy-cod-full">Order Successful!</h1>
      <p className="buy-cod-message">
        Your Order Has Been Placed Successfully.
      </p>
      <p className="buy-cod-message">
        Payment Mode: <span style={{ color: "red" }}>{paymentMode}</span>
      </p>

      <button onClick={() => navigate("/")} className="go-to-home">
        GO TO HOME
      </button>
    </div>
  );
}
export default BuyCod;
