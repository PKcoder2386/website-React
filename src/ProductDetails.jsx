import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "./ProductDetails.css";
import { addToCart } from "./cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedWeight, setselectedWeight] = useState(1);
  if (!product) {
    return <p>Loading...</p>;
  }

  const basePrice = parseInt(product.price.replace(/,/g, ""));

  const updatePrice = basePrice * selectedWeight;

  const handleAddToCart = () => {
    // dispatch(addToCart(product));
    const itemWithWeight = {
      ...product,
      quantity: 1,
      weight: `${selectedWeight} KG`,
      price: updatePrice.toString(),
    };
    dispatch(addToCart(itemWithWeight));
    alert("Your Cake added in Cart");
  };

  return (
    <>
      <div className="pro-details">
        {product ? (
          <div className="pro-img">
            <img src={product.image} alt={product.title} />

            <div className="name">
              <h4>{product.title}</h4>
              <p className="cake-id">CakeMagic{id}</p>
              <pre>Price:{updatePrice.toLocaleString()}</pre>
              <div className="line"></div>
              <div className="weight">
                <p className="t-weight">CAKE WEIGHT:</p>
              </div>
              <div className="kg">
                <p
                  className={`onekg ${selectedWeight === 1 ? "active" : ""}`}
                  onClick={() => setselectedWeight(1)}
                >
                  1 KG
                </p>
                <p
                  className={`twokg ${selectedWeight === 2 ? "active" : ""}`}
                  onClick={() => setselectedWeight(2)}
                >
                  2 KG
                </p>
                <p
                  className={`threekg ${selectedWeight === 3 ? "active" : ""}`}
                  onClick={() => setselectedWeight(3)}
                >
                  3 KG
                </p>
              </div>
              <div className="btns">
                <button onClick={handleAddToCart} className="add-cart">
                  ADD TO CART
                </button>
                <br />
                <br />
                <button
                  className="buy-now"
                  onClick={() =>
                    navigate("/buynow", {
                      state: {
                        ...product,
                        quantity: 1,
                        weight: `${selectedWeight} KG`,
                        price: updatePrice.toString(),
                        id,
                      },
                    })
                  }
                >
                  BUY IT NOW
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading....</p>
        )}
      </div>
      <button className="back" onClick={() => navigate(`/product`)}>
        &larr; back to product
      </button>
    </>
  );
}
export default ProductDetails;
