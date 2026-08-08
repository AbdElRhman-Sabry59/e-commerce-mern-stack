import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext(null);

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loding, setLoding] = useState(true);
  const fetchAllProduct = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products`);
      setProducts(res.data.products);
      setLoding(false);
    } catch (err) {
      setLoding(true);
      console.log(err);
    } finally {
      setLoding(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);
  // cartItems
  const [cartItems, setCartItems] = useState(() => {
    const savedInCart = localStorage.getItem("cartItems");
    return savedInCart ? JSON.parse(savedInCart) : [];
  });

  const addToCart = (item) => {
    setCartItems((prev) => {
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const deleteFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        return item.id !== id;
      }),
    );
  };
  const IncreaseQuantity = (id) => {
    setCartItems((prev) => {
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };
  const decreaseQuantity = (id) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        return item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item;
      });
    });
  };
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  // favItems
  const [favItems, setFavItems] = useState(() => {
    const saved = localStorage.getItem("favItems");
    return saved ? JSON.parse(saved) : [];
  });

  const addToFav = (item) => {
    setFavItems((prev) => {
      return [...prev, item];
    });
  };
  const deleteFromFav = (id) => {
    setFavItems((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  useEffect(() => {
    localStorage.setItem("favItems", JSON.stringify(favItems));
  }, [favItems]);
  return (
    <ProductContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        deleteFromCart,
        IncreaseQuantity,
        decreaseQuantity,
        favItems,
        addToFav,
        deleteFromFav,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
