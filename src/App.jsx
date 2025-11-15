import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";

import DesktopNavbar from "./components/DesktopNavbar";
import MobileNavbar from "./components/MobileNavbar";
import AuthModal from "./components/auth/AuthModal";
import Landing from "./pages/Landing";
import Order from "./pages/Order";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminOrders from "./components/admin/AdminOrders";
import AdminCategories from "./components/admin/AdminCategories";
import AdminCustomers from "./components/admin/customers/AdminCustomers";
import CustomerTransactions from "./components/admin/customers/CustomerTransactions";
import AdminDiscount from "./components/admin/AdminDiscount";
import AdminReports from "./components/admin/AdminReports";
import AdminServices from "./components/admin/AdminServices";
import PickupPage from "./pages/About";

function AppContent() {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();

  // مسیر واقعی از location.hash استخراج می‌شود
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    const hashPath = location.hash ? location.hash.replace("#", "") : window.location.hash.replace("#", "");
    setCurrentPath(hashPath);
  }, [location]);

  // همه مسیرهای /admin-dashboard و زیرمسیرها نوبار ندارند
  const hideNavbar = currentPath.startsWith("/admin-dashboard");

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Navbarها فقط اگر در مسیر مخفی نباشیم */}
      {!hideNavbar && (
        <>
          <DesktopNavbar openModal={openModal} setOpenModal={setOpenModal} />
          <MobileNavbar openModal={openModal} setOpenModal={setOpenModal} />
          <AuthModal open={openModal} onClose={() => setOpenModal(false)} />
        </>
      )}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/order" element={<Order />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/orders" element={<AdminOrders />} />
        <Route path="/admin-dashboard/customers" element={<AdminCustomers />} />
        <Route path="/admin-dashboard/customers/:id/transactions" element={<CustomerTransactions />} />
        <Route path="/admin-dashboard/services" element={<AdminServices />} />
        <Route path="/admin-dashboard/categories" element={<AdminCategories />} />
        <Route path="/admin-dashboard/discounts" element={<AdminDiscount />} />
        <Route path="/admin-dashboard/reports" element={<AdminReports />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/about" element={<PickupPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
