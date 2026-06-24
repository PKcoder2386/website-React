import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OnlinePayment.css";

function OnlinePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const totalPrice = location.state?.totalPrice || 0;

  const [paid, setpaid] = useState(false);

  const handlepayment = () => {
    setpaid(true);
    setTimeout(() => {
      navigate("/ordersuccess", { state: { paymentMode: "Online Payment" } });
    }, 1500);
  };

  const [formData, setFormData] = useState({
    FileUpload: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      FileUpload: e.target.files[0],
    });
  };

  const validateForm = () => {
    return formData.FileUpload !== null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please upload the payment screenshot.");
      return;
    }
    handlepayment();
  };

  return (
    <div className="online-pay-container">
      <h2 className="online-scan">Scan & Pay</h2>

      <p className="online-pay-total">
        Total Amount: ₹{totalPrice.toLocaleString()}{" "}
      </p>

      {!paid ? (
        <>
          <img
            src="Scanner.png"
            alt="QR Scanner"
            className="online-pay-image"
          />

          <br />
          <form onSubmit={handleSubmit}>
            <label htmlFor="">
              Upload Here Payment ScreenShot <br />
              <input
                type="file"
                accept="image/*"
                name="FileUpload"
                onChange={handleChange}
                className="online-pay-upload"
                required
              />
            </label>
          </form>
          <br />
          <button
            type="submit"
            onClick={handlepayment}
            className="online-pay-button"
          >
            Payment Completed
          </button>
        </>
      ) : (
        <h3 className="online-pay-successful">Payment Successful!</h3>
      )}
    </div>
  );
}
export default OnlinePayment;
