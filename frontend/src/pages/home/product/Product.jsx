import { Link, useNavigate } from "react-router-dom";
import "./Product.css";
import { FaStar, FaCartPlus, FaHeart } from "react-icons/fa";
import Stars from "./Stars";
import { useContext } from "react";
import { ProductContext } from "../../productContext/ProductContext";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart, favItems, addToFav, deleteFromFav } =
    useContext(ProductContext);
  const isInCart = cartItems.some((item) => item.id === product.id);
  const isInFav = favItems.some((item) => item.id === product.id);

  return (
    <div
      className={`product-section ${isInCart ? "inCart" : ""} || ${isInFav ? "isInFav" : ""}`}
    >
      {/* */}
      <div className={`card `}>
        <Link to={`/products/${product.id}`} className={`product-card `}>
          <div className="product-image">
            <img src={product.thumbnail} alt={product.title} />

            <span className="discount">-{product.discountPercentage}%</span>
          </div>
        </Link>
        <span className={`hideCart hide`}>in cart</span>
        <span className={`hideFav hide`}>in favourt</span>
        <div className="product-content">
          <div className="operation">
            <button
              onClick={() => {
                localStorage.getItem("email")
                  ? addToCart(product)
                  : navigate("/");
              }}
              className="cart-btn"
            >
              <FaCartPlus />
            </button>
            <button
              style={{
                background: isInFav ? "transparent" : "transparent",
              }}
              onClick={() => {
                localStorage.getItem("email")
                  ? !isInFav
                    ? addToFav(product)
                    : deleteFromFav(product.id)
                  : navigate("/");
              }}
              className=" fav-btn"
            >
              <FaHeart
                style={{
                  color: isInFav ? "red" : "white",
                }}
              />
            </button>
          </div>
          <p className="category">{product.category}</p>

          <h3>{product.title}</h3>

          <div className="rating">
            <Stars stars={product.rating} />
            <span>({product.rating})</span>
          </div>
          <div className="price">
            <span className="new-price">${product.price}</span>

            <span className="old-price">
              $
              {Math.round(
                product.price / (1 - product.discountPercentage / 100),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
