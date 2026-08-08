import { useContext } from "react";
import "./Fav.css";
import { ProductContext } from "../../productContext/ProductContext";
import Stars from "../product/Stars";
import Product from "../product/Product";
export const Fav = () => {
  const { favItems } = useContext(ProductContext);
  return (
    <div className="fav-section">
      <div className="container">
        <h2>Your Favorites</h2>

        <div className="fav-box">
          {favItems.length === 0 ? (
            <p>Your favourt cart is empty</p>
          ) : (
            favItems.map((product) => <Product product={product} />)
          )}
        </div>
      </div>
    </div>
  );
};
