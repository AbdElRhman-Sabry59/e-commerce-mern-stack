import { useParams } from "react-router-dom";
import "./ProdductDetails.css";
import axios from "axios";
import { FaCartPlus, FaHeart } from "react-icons/fa";

import { useContext, useEffect, useState } from "react";
import Stars from "../product/Stars";
import { ProductContext } from "../../productContext/ProductContext";
import Product from "../product/Product";
const ProdductDetails = () => {
  const { products, cartItems, addToCart, favItems, addToFav, deleteFromFav } =
    useContext(ProductContext);

  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);
  const fetchSinglePro = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/${id}`);
      setSingleProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchSinglePro();
  }, [id]);
  if (!singleProduct) {
    return <h2>Loading...</h2>;
  }
  const isInCart = cartItems.some((item) => item.id === singleProduct.id);
  const isInFav = favItems.some((item) => item.id === singleProduct.id);
  return (
    <div>
      <div className="cart-details">
        <div className="container">
          <div
            className={`product-details ${isInCart ? "inCart" : ""} || ${isInFav ? "isInFav" : ""}`}
          >
            <div className="images">
              <img
                id="big-image"
                src={singleProduct.thumbnail}
                alt=""
                className="main-image"
              />

              <div className="small-images">
                {singleProduct.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    onClick={() => {
                      document.getElementById("big-image").src = image;
                    }}
                    alt=""
                  />
                ))}
              </div>
            </div>

            <div className="details">
              <span className="category">{singleProduct.category}</span>

              <h1>{singleProduct.title}</h1>

              <Stars rating={singleProduct.rating} />

              <h2>${singleProduct.price}</h2>

              <p className="brand">
                Brand :<span>{singleProduct.brand}</span>
              </p>

              <p className="stock">{singleProduct.availabilityStatus}</p>

              <p className="description">{singleProduct.description}</p>

              <div className="buttons">
                <button
                  onClick={() => {
                    addToCart(singleProduct);
                  }}
                  className="cart cart-btn"
                >
                  <FaCartPlus />
                </button>

                <button
                  onClick={() => {
                    !isInFav
                      ? addToFav(singleProduct)
                      : deleteFromFav(singleProduct.id);
                  }}
                  className="wish fav-btn "
                >
                  <FaHeart
                    style={{
                      color: isInFav ? "red" : "black",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="category-product">
            <div className="content">
              <h2>{singleProduct.category.replace("-", " ").toUpperCase()}</h2>
              <p className="desc">{singleProduct.description}</p>
            </div>
            <div
              className="products-draw"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {products
                .filter(
                  (product) => product.category === singleProduct.category,
                )
                .map((product) => (
                  <Product key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdductDetails;
