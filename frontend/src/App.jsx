import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

            <Route
                path="/customer-dashboard"
                element={<CustomerDashboard />}
            />

            <Route
                path="/organizer-dashboard"
                element={<OrganizerDashboard />}
            />

            <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
            />
        </Routes>
    </BrowserRouter>
);


}

export default App;
