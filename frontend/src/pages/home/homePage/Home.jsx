import axios from "axios";
import Hero from "../hero/Hero";
import "./Home.css";

import SearchItems from "../searchItems/SearchItems";
import { Fragment, useContext, useEffect, useState } from "react";
import { ProductContext } from "../../productContext/ProductContext";
import Product from "../product/Product";

function Home() {
  const { products, loding, setProducts, setLoding } =
    useContext(ProductContext);
  const [category, setCategory] = useState([]);
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products/categories`);
      setCategory(res.data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  if (!products) {
    return <p>loding ..</p>;
  }
  return (
    <div className="home">
      <div className="container">
        <div className="home-section">
          {localStorage.getItem("email") ? (
            <div className="hero-section">
              <SearchItems />
              <Hero />
              <div className="products">
                <div className="category-products">
                  {category.map((cat) => (
                    <Fragment key={cat.slug}>
                      <div className="category-box">
                        <div className="category-header">
                          <h2>{cat.name}</h2>
                        </div>

                        <div className="products-grid">
                          {products
                            .filter((product) => product.category === cat.slug)
                            .map((product) => (
                              <Product key={product.id} product={product} />
                            ))}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>Please log in first!!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
