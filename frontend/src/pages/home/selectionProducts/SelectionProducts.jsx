import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SelectionProducts.css";
import Product from "../product/Product";

const SelectionProducts = () => {
  const { category } = useParams();

  const [selectedData, setSelectedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSelectProducts = async () => {
    try {
      const res = await axios.get(
        `https://dummyjson.com/products/category/${category}`,
      );

      setSelectedData(res.data.products);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectProducts();
  }, [category]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="selected-products-page">
      <h1 className="title">
        {category}: {selectedData.length}
      </h1>

      <p>{selectedData[0]?.description}</p>

      <div className="products-grid">
        {selectedData.map((item) => (
          <Product product={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default SelectionProducts;
