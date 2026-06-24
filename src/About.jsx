import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  const [product, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div style={styles.container}>
        {product.map((item) => (
          <div key={item.id}>
            <p>{item.id}</p>
            {/* <h2>{item.title}</h2>
            <p>{item.description}</p> */}
            {/* <span>{item.price}</span> */}
            <img
              src={item.thumbnail}
              onClick={() =>
                navigate(`/product-detail/${item.id}`, { state: item })
              }
              alt=""
            />
          </div>
        ))}
      </div>
    </>
  );
}
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "30px",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "10px 0 5px",
    textAlign: "center",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    marginBottom: "10px",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2ecc71",
  },
};
export default About;
