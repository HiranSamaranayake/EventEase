import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= CUSTOMER =================

import Home from "./pages/customer/Home";
import Events from "./pages/customer/Events";
import EventDetails from "./pages/customer/EventDetails";
import BookEvent from "./pages/customer/BookEvent";
import BookingConfirmation from "./pages/customer/BookingConfirmation";
import TicketDetails from "./pages/customer/TicketDetails";
import MyBookings from "./pages/customer/MyBookings";
import Profile from "./pages/customer/Profile";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentCancel from "./pages/customer/PaymentCancel";
import SavedEvents from "./pages/customer/SavedEvents";
import WaitingList from "./pages/customer/WaitingList";

// ================= AUTH =================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= ORGANIZER =================

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import MyEvents from "./pages/organizer/MyEvents";
import EditEvent from "./pages/organizer/EditEvent";
import EventBookings from "./pages/organizer/EventBookings";
import OrganizerLayout from "./components/OrganizerLayout";
import OrganizerAnalytics from "./pages/organizer/OrganizerAnalytics";
import OrganizerBookings from "./pages/organizer/OrganizerBookings";
import OrganizerTickets from "./pages/organizer/OrganizerTickets";
import OrganizerSchedules from "./pages/organizer/OrganizerSchedules";
import OrganizerPromoCodes from "./pages/organizer/OrganizerPromoCodes";
import ScanTicket from "./pages/organizer/ScanTicket";
import OrganizerVerification from "./pages/organizer/OrganizerVerification";




// ================= ADMIN =================

import AdminLayout from "./pages/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrganizers from "./pages/admin/AdminOrganizers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminSecurityLogs from "./pages/admin/AdminSecurityLogs";
import SupportComplaints from "./pages/customer/SupportComplaints";
import TicketView from "./pages/customer/TicketView";

// ================= SECURITY =================

import GuestCustomerPortal from "./pages/customer/GuestCustomerPortal";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= HOME & GUEST PORTAL ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/guest" element={<GuestCustomerPortal />} />

        {/* ================= AUTH ================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= CUSTOMER ================= */}

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
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
          path="/saved-events"
          element={
            <ProtectedRoute allowedRole="customer">
              <SavedEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/waiting-list"
          element={
            <ProtectedRoute allowedRole="customer">
              <WaitingList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/support"
          element={
            <ProtectedRoute allowedRole="customer">
              <SupportComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={<SupportComplaints />}
        />
       <Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>

<Route
  path="/payment-cancel"
  element={<PaymentCancel />}
/>


        <Route path="/events" element={<Events />} />

        <Route path="/event/:id" element={<EventDetails />} />

        <Route path="/book/:id" element={<BookEvent />} />
        <Route path="/book-event/:id" element={<BookEvent />} />

        <Route path="/booking-success" element={<BookingConfirmation />} />

        <Route path="/ticket/:id" element={<TicketDetails />} />

        {/* ================= ORGANIZER ================= */}

<Route
  path="/organizer"
  element={
    <ProtectedRoute allowedRole="organizer">
      <OrganizerLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<OrganizerDashboard />} />

  <Route path="dashboard" element={<OrganizerDashboard />} />

  <Route path="my-events" element={<MyEvents />} />

  <Route path="create-event" element={<CreateEvent />} />

  <Route path="edit-event/:id" element={<EditEvent />} />

  <Route
    path="event-bookings/:id"
    element={<EventBookings />}
  />
  <Route
  path="bookings"
  element={<OrganizerBookings />}
/>
<Route
  path="tickets"
  element={<OrganizerTickets />}
/>
<Route
  path="schedules"
  element={<OrganizerSchedules />}
/>
<Route
  path="promos"
  element={<OrganizerPromoCodes />}
/>

  <Route
    path="analytics"
    element={<OrganizerAnalytics />}
  />
  <Route
    path="scan-ticket"
    element={<ScanTicket />}
  />
  <Route
    path="verify"
    element={<OrganizerVerification />}
  />
</Route>

        {/* ================= ADMIN PANEL ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="users" element={<AdminUsers />} />

          <Route path="organizers" element={<AdminOrganizers />} />

          <Route path="events" element={<AdminEvents />} />

          <Route path="bookings" element={<AdminBookings />} />

          <Route path="complaints" element={<AdminComplaints />} />

          <Route path="security" element={<AdminSecurityLogs />} />

          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ================= OLD URL SUPPORT ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminUsers />} />
        </Route>

        <Route
          path="/admin-organizers"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOrganizers />} />
        </Route>

        <Route
          path="/admin-events"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminEvents />} />
        </Route>

        <Route
          path="/admin-bookings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminBookings />} />
        </Route>

        <Route
          path="/admin-settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSettings />} />
        </Route>

        <Route
          path="/admin-complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminComplaints />} />
        </Route>

        <Route
          path="/admin-security"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSecurityLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
