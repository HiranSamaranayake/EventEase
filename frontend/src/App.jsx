import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";


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
    element={
        <ProtectedRoute>
            <CustomerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/organizer-dashboard"
    element={
        <ProtectedRoute>
            <OrganizerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin-dashboard"
    element={
        <ProtectedRoute>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>
        </Routes>
    </BrowserRouter>
);


}

export default App;
