import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketDetails from "./pages/customer/TicketDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import BookingConfirmation from "./pages/customer/BookingConfirmation";


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
        <ProtectedRoute
            allowedRole="customer"
        >
            <CustomerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/organizer-dashboard"
    element={
        <ProtectedRoute
            allowedRole="organizer"
        >
            <OrganizerDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin-dashboard"
    element={
        <ProtectedRoute
            allowedRole="admin"
        >
            <AdminDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/ticket/:id"
    element={<TicketDetails />}
/>
<Route
    path="/booking-success"
    element={<BookingConfirmation />}
/>

        </Routes>
    </BrowserRouter>
);


}

export default App;
