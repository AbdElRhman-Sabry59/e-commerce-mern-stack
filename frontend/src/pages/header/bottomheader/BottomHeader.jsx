import { useContext, useEffect, useState } from "react";
import "./BottomHeader.css";
import axios from "axios";
import { FaRegHeart, FaCartPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../../productContext/ProductContext";

export default function BottomHeader() {
  const navigateLink = useNavigate();
  const pathLocation = useLocation();

  const { cartItems, favItems } = useContext(ProductContext);

  const [category, setCategory] = useState([]);
  const [active, setActive] = useState(pathLocation.pathname);

  // =========================
  // GET CATEGORIES
  // =========================
  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        "https://dummyjson.com/products/category-list",
      );

      setCategory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // =========================
  // UPDATE ACTIVE LINK
  // =========================
  useEffect(() => {
    setActive(pathLocation.pathname);
  }, [pathLocation.pathname]);

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

  const formatCategoryName = (item) => {
    return item
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bottom-header">
      <div className="bottom-header-container">
        <div className="category-wrapper">
          <select
            id="chooseCategory"
            value=""
            onChange={(e) => {
              const value = e.target.value;

              if (value === "all") {
                navigateLink("/home");
                setActive("/home");
              } else if (value) {
                navigateLink(`/products/category/${value}`);
                setActive(`/products/category/${value}`);
              }
            }}
          >
            <option value="" disabled>
              {pathLocation.pathname
                .split("/")[3]
                ?.replaceAll("-", " ")
                ?.toUpperCase() || "Browse Category"}
            </option>

            <option value="all">All Categories</option>

            {category.map((item) => (
              <option key={item} value={item}>
                {formatCategoryName(item)}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            NAVIGATION LINKS
        ========================= */}
        <ul className="links">
          {links.map((item) => (
            <li key={item.path}>
              <Link
                className={active === item.path ? "active" : ""}
                to={item.path}
                onClick={() => setActive(item.path)}
              >
                {item.link}
              </Link>
            </li>
          ))}
        </ul>

        {/* =========================
            CART / FAVORITES
        ========================= */}
        <div className="operations-icons">
          {/* FAVORITES */}
          <Link
            className={active === "/fav" ? "active" : ""}
            to="/fav"
            onClick={() => setActive("/fav")}
            aria-label="Favorites"
          >
            <div className="icon-wrapper">
              <FaRegHeart />

              <span className="count">
                {localStorage.getItem("email") ? favItems.length : 0}
              </span>
            </div>
          </Link>

          {/* CART */}
          <Link
            className={active === "/cart" ? "active" : ""}
            to="/cart"
            onClick={() => setActive("/cart")}
            aria-label="Shopping Cart"
          >
            <div className="icon-wrapper">
              <FaCartPlus />

              <span className="count">
                {localStorage.getItem("email") ? cartItems.length : 0}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
