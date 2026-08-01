import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OrganizerDashboard from "../pages/organizer/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/organizer" element={<OrganizerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;