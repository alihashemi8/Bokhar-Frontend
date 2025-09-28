import { HashRouter as Router, Routes, Route } from "react-router-dom";

import DesktopNavbar from "./components/DesktopNavbar";
import MobileNavbar from "./components/MobileNavbar";
import AuthModal from "./components/auth/AuthModal";
import Landing from "./pages/Landing";
import Order from "./pages/Order";
import Status from "./pages/Status";
import CustomerProfile from "./pages/CustomerProfile";
import { useState } from "react";

export default function App() {
  const [openModal, setOpenModal] = useState(false); // حالت مودال

  return (
    <Router>
      {/* Navbar دسکتاپ */}
      <DesktopNavbar openModal={openModal} setOpenModal={setOpenModal} />

      {/* Navbar موبایل */}
      <MobileNavbar openModal={openModal} setOpenModal={setOpenModal} />

      {/* مودال در سطح بالاتر */}
      <AuthModal open={openModal} onClose={() => setOpenModal(false)} />

      {/* فاصله محتوای صفحات از Navbar دسکتاپ */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/order" element={<Order />} />
        <Route path="/status" element={<Status />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
      </Routes>
    </Router>
  );
}
