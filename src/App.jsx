import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import DesktopNavbar from "./components/DesktopNavbar";
import MobileNavbar from "./components/MobileNavbar";
import AuthModal from "./components/auth/AuthModal";
import Landing from "./pages/Landing";
import Order from "./pages/Order";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import CustomerDashboard from "./pages/CustomerDashboard";
import MapSelector from "./pages/MapSelector";
export default function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <AuthProvider>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Router>
          {/* Navbar دسکتاپ */}
          <DesktopNavbar openModal={openModal} setOpenModal={setOpenModal} />

          {/* Navbar موبایل */}
          <MobileNavbar openModal={openModal} setOpenModal={setOpenModal} />

          {/* مودال در سطح بالا */}
          <AuthModal open={openModal} onClose={() => setOpenModal(false)} />

          {/* مسیرهای برنامه */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<MapSelector />} />
            <Route path="/order" element={<Order />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* مسیر محافظت‌شده برای داشبورد مشتری */}
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          </Routes>
        </Router>
      </div>
 </AuthProvider>
  );
}
