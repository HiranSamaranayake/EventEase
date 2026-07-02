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
import CreateEvent from "./pages/organizer/CreateEvent";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/customer/Profile";
import MyEvents from "./pages/organizer/MyEvents";
import EditEvent from "./pages/organizer/EditEvent";
import EventBookings from "./pages/organizer/EventBookings";
import Events from "./pages/customer/Events";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRole="customer">
              <Events />
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
            <ProtectedRoute allowedRole="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute allowedRole="organizer">
              <MyEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-event/:id"
          element={
            <ProtectedRoute allowedRole="organizer">
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-bookings/:id"
          element={
            <ProtectedRoute allowedRole="organizer">
              <EventBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-event"
          element={
            <ProtectedRoute allowedRole="organizer">
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/ticket/:id" element={<TicketDetails />} />
        <Route path="/booking-success" element={<BookingConfirmation />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/book-event/:id" element={<BookEvent />} />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-events"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminEvents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
