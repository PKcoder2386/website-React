import { useState } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Your Message As Been Submitted");
  };
  return (
    <>
      <div className="contact">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <img src="/user.png" className="user" alt="" />
            <input
              type="text"
              name="name"
              className="user1"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <br />
            <br />
            <img src="/email.png" className="emails" alt="" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <img src="/call.png" className="mobile" alt="" />
            <input
              type="tel:"
              name="number"
              placeholder="Enter your Number"
              className="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
            <br />
            <br />
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your Inquiry"
              required
            ></textarea>
            <br />
            <br />
            <button type="submit" className="submit">
              submit
            </button>
            <br />
          </form>
        </div>
        <div className="information">
          <h1
            style={{
              fontFamily: "Josefin Sans",
              textAlign: "center",
              position: "relative",
              top: "20px",
            }}
          >
            GET IN TOUCH
          </h1>
          <p>
            <span className="phone">Phone:</span>
            <br />
            <Link to="tel:+917420868825" className="mob">
              +91 74208 68825
            </Link>
          </p>
          <div className="address">
            <h5>Address:</h5>
            <p className="add-1">
              Mathura Colony, Nakhate vasti <br />
              Datta Krupa Building, Floor No.1 <br />
              Pune, Maharashtra
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;
