import { Link } from "react-router-dom";
import "./Headers.css";

function Header() {
  return (
    <>
      <div className="dis">
        10% DISCOUNT On All orders over 1500 RS - Coupon code:'HappyCake'
      </div>
      <div className="navbar">
        <nav>
          <p className="logo">CAKE MAGIC</p>

          <ul>
            <li>
              <Link to="./" className="links">
                Home
              </Link>
            </li>
            {/* <li>
              <Link to="./about" className="links">
                About
              </Link>
            </li> */}

            <li>
              <Link to="./contact" className="links">
                Contact
              </Link>
            </li>

            <li>
              <Link to="./product" className="links">
                Product
              </Link>
            </li>
            <li>
                  <Link to="admin" className="admin-nav">Admin</Link>
              </li>
            {/* <li>
              <Link to="./orderconfirm" className="links">
                order History
              </Link>
            </li> */}
          </ul>
          <Link to="./cart" className="cart-logo">
            <img src="/shopping-bag.png" alt="" />
          </Link>
              
        
        </nav>
        <p className="text-2">HASSLE-FREE DELIVERIES Same Day & Next Day</p>
      </div>
    </>
  );
}
export default Header;
