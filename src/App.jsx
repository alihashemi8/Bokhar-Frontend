import { HashRouter as Router, Routes, Route } from "react-router-dom";

import DesktopNavbar from "./components/DesktopNavbar";
import MobileNavbar from "./components/MobileNavbar";

import Landing from "./pages/Landing";
import Order from "./pages/Order";
import Status from "./pages/Status";
import CustomerProfile from "./pages/CustomerProfile";

export default function App() {
  return (
    <Router>
      {/* Navbar دسکتاپ */}
      <DesktopNavbar />

      {/* Navbar موبایل */}
      <MobileNavbar />

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
