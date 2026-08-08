import { useContext } from "react";
import "./Cart.css";
import { FaRegTrashCan } from "react-icons/fa6";
import { ProductContext } from "../../productContext/ProductContext";

const Cart = () => {
  const { cartItems, deleteFromCart, IncreaseQuantity, decreaseQuantity } =
    useContext(ProductContext);
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cartItems.map((product) => (
              <div key={product.id} className="cart-item">
                <div className="product-info">
                  <img src={product.images[0]} alt="iPhone" />

                  <div>
                    <h3>{product.title}</h3>
                    <p>${product.price}</p>
                  </div>
                </div>

                <div className="quantity">
                  <button
                    onClick={() => {
                      decreaseQuantity(product.id);
                    }}
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() => {
                      IncreaseQuantity(product.id);
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    deleteFromCart(product.id);
                  }}
                  className="delete"
                >
                  <FaRegTrashCan />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              $
              {cartItems
                .reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
                .toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>
              $
              {cartItems
                .reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
                .toFixed(2)}
            </span>
          </div>

          <button className="Place-order">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
