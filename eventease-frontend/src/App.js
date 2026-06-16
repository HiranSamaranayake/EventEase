import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import MyBookings from './pages/customer/MyBookings';

import OrganizerDashboard from './pages/organizer/Dashboard';

import AdminDashboard from './pages/admin/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<h1>EventEase Home</h1>}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/customer/bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="/organizer/dashboard"
                    element={<OrganizerDashboard />}
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;