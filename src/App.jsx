import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar"; 
import FarmerHome from "./pages/farmerHome";
import CommunityForum from "./pages/CommunityForum";
import ScheduledDelivery from "./pages/ScheduledDelivery";
import FarmersMarket from "./pages/FarmersMarket";
import Cart from "./pages/Cart";
import './index.css';
import ChoppedVegetables from "./pages/choppedVegetables";
import BusinessDashboard from "./components/BusinessDashboard";
import AdminPanel from "./pages/AdminPanel";
import CustomerManagement from "./pages/CustomerManagement";
import FarmersManagement from "./pages/FarmersManagement";
import ProductsManagement from "./pages/ProductsManagement";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerOrders from "./pages/FarmerOrders";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/farmer-home' element={<FarmerHome />} />
        <Route path='/communityforum' element={<CommunityForum />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path="/scheduled-delivery" element={<ScheduledDelivery />} />
        <Route path="/farmers-market" element={<FarmersMarket />} />
        <Route path="/choppedVegetables" element={<ChoppedVegetables />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/CustomerManagement" element={<CustomerManagement />} />
        <Route path="/FarmersManagement" element={<FarmersManagement />} />
        <Route path="/ProductsManagement" element={<ProductsManagement />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
