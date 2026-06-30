import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketDetails from "./pages/customer/TicketDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import BookingConfirmation from "./pages/customer/BookingConfirmation";
import EventDetails from "./pages/customer/EventDetails";
import BookEvent from "./pages/customer/BookEvent";
import MyBookings from "./pages/customer/MyBookings";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/customer/Profile";
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
    path="/profile"
    element={
        <ProtectedRoute allowedRole="customer">
            <Profile />
        </ProtectedRoute>
    }
/>

<Route
    path="/my-bookings"
    element={
        <ProtectedRoute allowedRole="customer">
            <MyBookings />
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
<Route
    path="/event/:id"
    element={<EventDetails />}
/>
<Route
    path="/book-event/:id"
    element={<BookEvent />}
/>

        </Routes>
    </BrowserRouter>
);


}

export default App;
