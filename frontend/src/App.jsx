import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Register from "./components/register/Register";
import { Login } from "./components/login/Login";
import { Dashboard } from "./components/dashboard/Dashboard";
import Users from "./components/dashboard/users/Users";
import DashboardContent from "./components/dashboard/dashboardContent/DashboardContent";
import { Admins } from "./components/dashboard/admins/Admins";
import TopHeader from "./pages/header/topheader/TopHeader";
import Footer from "./pages/foot/Footer";
import BottomHeader from "./pages/header/bottomheader/BottomHeader";
import SelectionProducts from "./pages/home/selectionProducts/SelectionProducts";
import Home from "./pages/home/homePage/Home";
import ProductProvider from "./pages/productContext/ProductContext";
import ProdductDetails from "./pages/home/productDetails/ProdductDetails";
import ScrollTop from "./pages/home/scrollTop/ScrollTop";
import Cart from "./pages/home/cart/Cart";
import { Fav } from "./pages/home/fav/Fav";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
const App = () => {
  return (
    <ProductProvider>
      <BrowserRouter basename="/">
        <div className="app ">
          <ScrollTop />
          <TopHeader />
          {localStorage.getItem("email") ? (
            <BottomHeader />
          ) : (
            // <p className="container">"Please log in first!!"</p>
            ""
          )}
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardContent />} />
                <Route path="users" element={<Users />} />
                <Route path="admins" element={<Admins />} />
              </Route>
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/products/category/:category"
              element={<SelectionProducts />}
            />
            <Route path="/products/:id" element={<ProdductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/fav" element={<Fav />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </ProductProvider>
  );
};

export default App;
