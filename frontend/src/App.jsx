import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/admin/AdminLogin';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';

import RestaurantMenu from './pages/user/RestaurantMenu';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Dashboard from './pages/admin/Dashboard';
import Restaurants from './pages/admin/Restaurants';
import FoodItems from './pages/admin/FoodItems';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <Routes>
      {/* Public Routes - No Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Routes - With Navbar */}
      <Route element={
        <>
          <Navbar />
          <ProtectedRoute />
        </>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* Admin Protected Routes - No Navbar (AdminLayout handles it) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/restaurants" element={<Restaurants />} />
        <Route path="/admin/restaurants/:id/foods" element={<FoodItems />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
