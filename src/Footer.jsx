import { Link, Links } from "react-router-dom";
import "./Footer.css";
function Footer() {
  return (
    <>
      <footer>
        <div className="nav ">
          <ul>
            <li>
              <Link to="/" className="nav-links">
                Home
              </Link>
            </li>

            <li>
              <Link to="/contact" className="nav-links">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/product" className="nav-links">
                Products
              </Link>
            </li>
          </ul>
        </div>

        <div className="sub-2">
          <div className="t1">
            <p>sign up and save</p>
          </div>
          <div className="t2">
            <pre>
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime <br />
              deals.
            </pre>
            <div className="message">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your Email"
                required
              />

              <label>
                <img src="/email.png" className="email-img" alt="" />
              </label>
            </div>

            <div className="profile">
              <div className="insta">
                <Link>
                  <img src="/video.png" alt="" />
                </Link>
              </div>
              <div className="twitter">
                <Link>
                  <img src="/twitter.png" alt="" />
                </Link>
              </div>
              <div className="linkend">
                <Link>
                  <img src="/social.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="info">
          <p className="info-title">INFORMATION</p>
          <p className="phone">
            Phone:
            <br />
            <span>(+91)7420868825</span>
          </p>

          <p className="w-days">
            Working Days/Hours:
            <br />
            <span>Mon - Sun / 8:00 am - 9:00pm</span>
          </p>
        </div>

        <div className="footer-admin-link">
        <Link to="admin" style={{ color: 'black', fontSize: '11px', textDecoration: 'none' }}>
          Staff Login
        </Link>
      </div>
      </footer>
      <div className="copy">
        <p> &copy; Copy Right | CAKEMAGIC</p>
      </div>
    </>
  );
}

export default Footer;
