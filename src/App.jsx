import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Layout from "./Layout";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Chectout from "./Chectout";
import BuyNow from "./BuyNow";
import OrderSuccess from "./orderSuccess";
import OnlinePayment from "./OnlinePayment";
import BuyCod from "./BuyCod";
import BuyOnline from "./BuyOnline";
import AdminPanel from "./AdminPanel"
import { useEffect } from "react";
// import OrderComfirmation from "./OrderComfirmation";

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch("https://localhost:3000");
  //     const data = res.json();
  //     console.log(data);
  //   };
  //   fetchData();
  // });

  const products = [
    {
      id: "1",
      title: "Delectable Chocolate Cake",
      price: "799",
      image: "/cake1.png",
    },
    {
      id: "2",
      title: "Black Forest Cake",
      price: "1",
      image: "/cake2.png",
    },
    {
      id: "3",
      title: "Choco Snickers Cake",
      price: "899",
      image: "/cake3.png",
    },
    {
      id: "4",
      title: "Red Velvet Chocolate Cake",
      price: "1,599",
      image: "/cake4.png",
    },
    {
      id: "5",
      title: "Chocolate Mousse Cake",
      price: "1,299",
      image: "/cake5.png",
    },
    {
      id: "6",
      title: "Red Velvet Chocolate Cake",
      price: "1,599",
      image: "/cake6.png",
    },
    {
      id: "7",
      title: "Blue Berry Cake",
      price: "1600",
      image: "/cake7.png",
    },
    {
      id: "8",
      title: " Red Velvet",
      price: "749",
      image: "/cake8.png",
    },
    {
      id: "9",
      title: "Eggless Round Pineapple Cake",
      price: "849",
      image: "/cake9.png",
    },
    {
      id: "10",
      title: " Black Forest Cake",
      price: "599",
      image: "/cake10.png",
    },
    {
      id: "11",
      title: " Delish Fresh Fruit Cake",
      price: "1,399",
      image: "/cake11.png",
    },
    {
      id: "12",
      title: "Vanilla Bean Cake",
      price: "699",
      image: "/cake12.png",
    },
    {
      id: "13",
      title: "Delightful Butter Scotch  Cake",
      price: "699",
      image: "/cake13.png",
    },
    {
      id: "14",
      title: "Kit Kat Chocolate Cake",
      price: "1,999",
      image: "/cake14.png",
    },
    {
      id: "15",
      title: "Rainbow Rose Cake",
      price: "1,899",
      image: "/cake15.png",
    },
    {
      id: "16",
      title: "Designer Rose Swirl Cake | Heart",
      price: "1,349",
      image: "/cake16.png",
    },
  ];

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home products={products} />} />
            <Route path="product" element={<Product products={products} />} />
            <Route path="about" element={<About />} />
            <Route path="product-detail/:id" element={<ProductDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Chectout />} />
            <Route path="buynow" element={<BuyNow />} />
            <Route path="ordersuccess" element={<OrderSuccess />} />
            <Route path="onlinepayment" element={<OnlinePayment />} />
            <Route path="buyCod" element={<BuyCod />} />
            <Route path="buyOnline" element={<BuyOnline />} />
            <Route path="admin" element={<AdminPanel/>}/>
            {/* <Route path="orderconfirm" element={<OrderComfirmation />} />  */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
