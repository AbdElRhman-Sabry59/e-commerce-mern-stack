import { useEffect, useState } from "react";
import "./SearchItems.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const SearchItems = () => {
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchSearch = async () => {
    try {
      const res = await axios.get(
        `https://dummyjson.com/products/search?q=${searchVal}`,
      );

      setSearchResults(res.data.products.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSearch();
  }, [searchVal]);

  return (
    <div className="search">
      <div
        className="content-search "
        style={{
          marginTop: "20px",
        }}
      >
        <input
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          type="text"
          id="search"
          placeholder="Search for products..."
        />

        <button className="searchIcon">
          <FaSearch />
        </button>
      </div>
      <div className="result-search">
        {searchVal.trim() !== "" &&
          searchResults.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="card"
            >
              <img src={product.images[0]} alt={product.title} />
              <h2 className="content">{product.title}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SearchItems;
