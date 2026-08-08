import { act, useContext, useEffect } from "react";
import "./BottomHeader.css";
import axios from "axios";
import { useState } from "react";
import { FaRegHeart, FaCartPlus } from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../../productContext/ProductContext";
export default function BottomHeader() {
  const navigateLink = useNavigate(null);
  const pathLocation = useLocation();
  const { cartItems, favItems } = useContext(ProductContext);
  const [category, setCategory] = useState([]);
  const [active, setActive] = useState(pathLocation.pathname);
  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `https://dummyjson.com/products/category-list`,
      );
      setCategory(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  const links = [
    {
      link: "Home",
      path: "/home",
    },
    {
      link: "About",
      path: "/about",
    },
    {
      link: "Accessories",
      path: "/accessories",
    },
    {
      link: "Blog",
      path: "/blog",
    },
    {
      link: "Contact",
      path: "/contact",
    },
  ];
  return (
    <div className="bottom-header">
      <div className="container">
        <section className="bottom-header-section">
          <div className="browse_category">
            <select
              name=""
              id="chooseCategory"
              onChange={(e) => {
                setActive(`${e.target.value}`);

                if (e.target.value === "all") {
                  navigateLink("/home");
                } else {
                  navigateLink(`/products/category/${e.target.value}`);
                }
              }}
            >
              <option hidden>
                {pathLocation.pathname
                  .split("/")[3]
                  ?.replace("-", " ")
                  ?.toUpperCase() || "Browse Category"}
              </option>
              <option value="all">All</option>
              {category.map((item, index) => (
                <option to={`/${item}`} key={item} value={item}>
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>
          <ul className="links">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  className={active === `${link.path}` ? "active" : ""}
                  to={link.path}
                  onClick={() => {
                    setActive(link.path);
                  }}
                >
                  {link.link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="operations-icons">
            <Link
              className={active === `fav` ? "active" : ""}
              to={`fav`}
              onClick={() => {
                setActive(`fav`);
              }}
              to="/fav"
            >
              <FaRegHeart />
              <span className="count">
                {localStorage.getItem("email") ? favItems.length : 0}
              </span>
            </Link>
            <Link
              className={active === `cart` ? "active" : ""}
              to={`cart`}
              onClick={() => {
                setActive(`cart`);
              }}
              to="/cart"
            >
              <FaCartPlus />
              <span className="count">
                {localStorage.getItem("email") ? cartItems.length : 0}
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
