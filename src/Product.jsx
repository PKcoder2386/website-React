import "./Product.css";

import { useNavigate } from "react-router-dom";
function Product({ products }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="products">
        {products.map((item, index) => (
          <div className="pro" key={index}>
            <div className="image">
              <img
                src={item.image}
                onClick={() =>
                  navigate(`/product-detail/${item.id}`, { state: item })
                }
                alt=""
              />
              <div className="cake-name">
                <p>{item.title}</p>
                <p className="price">From Rs {item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Product;
