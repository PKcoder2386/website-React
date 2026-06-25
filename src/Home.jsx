import Product from "./Product";

import "./Home.css";
import { Link } from "react-router-dom";
function Home({ products }) {
  return (
    <>
      <div className="img">
        <img src="./main-cake.png" className="home-img" alt="" />
        <p>DELICIOUS</p>
        <h1 className="main-text">BIRTHDAY CAKES</h1>
        <p className="eggless">Eggless Cake</p>
        <Link to="/product" className="btn-1">
          BIRTHDAY CAKE
        </Link>
      </div>
      <h1 className="home-heading">ONLINE CAKE DELIVERY IN PUNE</h1>
      <p className="text">
        Our healthy <strong>cakes delivery to Pune</strong> are freshly baked
        exclusively in our award-winning Pune bakery and each of <br /> these
        cakes are delicious baked to <strong> send online in Pune </strong> and
        can be delivered same day, Midnight delivery or <br /> overnight{" "}
        <strong> cake delivery in Pune </strong> city. Are you looking for the
        best dessert to serve during a party? Then our
        <br /> gourmet cakes can be the best option for Pune. You can serve them
        during birthdays, anniversaries, and other
        <br /> special occasions.
      </p>

      <h1 className="shop-head">SHOP BY CATEGORY</h1>

      <div className="category">
        <div className="image1">
          <Link to="/product">
            <button className="btn-2">BIRTHDAY CAKES</button>
          </Link>
          <img src="./cake1.png" alt="" />
        </div>

        <div className="image1">
          <Link to="/product">
            <button className="btn-2">BEST SELLERS</button>
          </Link>
          <img src="./cake2.png" alt="" />
        </div>

        <div className="image1">
          <Link to="/product">
            <button className="btn-2">CHOCOLATE LOVERS</button>
          </Link>
          <img src="./cake3.png" alt="" />
        </div>

        <div className="image1">
          <Link to="/product">
            <button className="btn-3">CONGRATULATION CAKES</button>
          </Link>
          <img src="./cake4.png" alt="" />
        </div>
      </div>

      <div className="addimg">
        <img src="./backCake1.png" className="location-img" alt="" />
        <div className="location">
          <h3>OUR RETAIL STORE</h3>
          <p className="address">
            Mathura Colony, Nakhate vasti <br />
            Datta Krupa Building, Floor No.1 <br />
            <span>Pune, Maharashtra</span>
          </p>

          <p className="time">
            <small>
              Mon - Fri, 9:00am - 9:00pm <br />
              Saturday, 9:00am - 10:00pm <br /> Sunday, 9:00am - 10:00pm
            </small>
          </p>
          <Link
            to="https://maps.app.goo.gl/Xoae5p7Nh8D3gtAf7"
            className="direction"
          >
            GET DIRECTION
          </Link>
        </div>
      </div>

      {/* <Product products={products} /> */}
    </>
  );
}

export default Home;
