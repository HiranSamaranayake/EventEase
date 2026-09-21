
import { motion } from "framer-motion";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaUserTie, FaUserShield, FaUserSecret, FaArrowRight } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "customer"
    });

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error("Please enter your registered email address.");
            return;
        }

        setForgotLoading(true);
        try {
            const res = await fetch("http://localhost/EventEase/backend/api/forgot_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "request_otp", email: forgotEmail })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                if (data.otp) {
                    setGeneratedOtp(data.otp);
                    setForgotOtp(data.otp);
                }
                setForgotStep(2);
            } else {
                toast.error(data.message || "Failed to find account.");
            }
        } catch (err) {
            toast.error("Server error. Could not request OTP.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!forgotOtp) {
            toast.error("Please enter the verification OTP code.");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setForgotLoading(true);
        try {
            const res = await fetch("http://localhost/EventEase/backend/api/forgot_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "verify_and_reset",
                    email: forgotEmail,
                    otp: forgotOtp,
                    new_password: newPassword
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Password reset successful! Enter your new password to log in.");
                setFormData((prev) => ({ ...prev, email: forgotEmail, password: newPassword }));
                setShowForgotModal(false);
                setForgotStep(1);
                setForgotEmail("");
                setForgotOtp("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message || "Reset failed.");
            }
        } catch (err) {
            toast.error("Server error during password reset.");
        } finally {
            setForgotLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === "guest") {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/guest");
            return;
        }

        if (!formData.email || !formData.password) {
            toast.error("Please enter email and password");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost/EventEase/backend/api/login.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {
                login(data.user, data.token);

                toast.success(`Login Successful as ${data.user.role.toUpperCase()} 🎉`);

                setTimeout(() => {
                    if (data.user.role === "customer") {
                        navigate("/customer-dashboard");
                    } else if (data.user.role === "organizer") {
                        navigate("/organizer/dashboard");
                    } else if (data.user.role === "admin") {
                        navigate("/admin-dashboard");
                    }
                }, 1200);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Server Error");
        }
    };

    const roleOptions = [
        { id: "guest", label: "Guest Customer", icon: <FaUserSecret /> },
        { id: "customer", label: "Customer", icon: <FaUser /> },
        { id: "organizer", label: "Organizer", icon: <FaUserTie /> },
        { id: "admin", label: "Admin", icon: <FaUserShield /> },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden p-6">
            {/* Purple Glow */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl"></div>
            {/* Pink Glow */}
            <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-fuchsia-500/20 blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden relative z-10"
            >
                <div className="grid lg:grid-cols-2">
                    {/* LEFT SIDE */}
                    <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 text-white">
                        <h2 className="text-5xl font-black leading-tight">EventEase</h2>
                        <p className="mt-6 text-lg text-white/90">
                            Smart Event Management Platform designed to simplify event creation, ticket booking and attendee management.
                        </p>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Guest Customer Event Browsing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Customer Ticket Reservation</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Organizer Dashboard & Event CRUD</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Admin Platform Moderation</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-10 lg:p-14">
                        <h1 className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            EventEase
                        </h1>

                        <p className="text-center text-gray-600 mt-3 leading-relaxed">
                            Select your role to continue:
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            {/* Role Selection Pills */}
                            <div>
                                <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Select User Role:
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {roleOptions.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r.id })}
                                            className={`py-2.5 px-2 rounded-xl border text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 ${
                                                formData.role === r.id
                                                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            {r.icon} {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.role === "guest" ? (
                                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center space-y-4">
                                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl">
                                        <FaUserSecret />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base text-purple-950">Guest Customer Mode</h3>
                                        <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                                            As a <strong>Guest Customer</strong>, you are allowed to browse events, search by title/category, and view event details without logging in or registering!
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
                                    >
                                        Browse Events as Guest Customer <FaArrowRight />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-2.5 text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                                            <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                                            Remember Me
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForgotModal(true);
                                                setForgotStep(1);
                                                setForgotEmail(formData.email || "");
                                            }}
                                            className="text-purple-600 text-xs font-bold hover:underline cursor-pointer"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-extrabold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    >
                                        Sign In to {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Portal
                                    </button>
                                </>
                            )}
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-xs font-semibold">
                                Don't have an account?
                            </p>
                            <Link
                                to="/register"
                                className="inline-block mt-1 text-purple-600 font-extrabold text-xs hover:text-fuchsia-600"
                            >
                                Create Account (Become Verified Customer)
                            </Link>
                        </div>

                        <div className="mt-8 border-t pt-5">
                            <p className="text-center text-xs text-gray-400">
                                EventEase Online Event Ticket Reservation Platform
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* FORGOT PASSWORD MODAL */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-fade-in">
                        <button
                            onClick={() => {
                                setShowForgotModal(false);
                                setForgotStep(1);
                            }}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900">Forgot Password? 🔐</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {forgotStep === 1
                                    ? "Enter your registered email address to receive a password reset verification code."
                                    : "Enter the OTP verification code and set your new account password."}
                            </p>
                        </div>

                        {forgotStep === 1 ? (
                            <form onSubmit={handleRequestOtp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                        Registered Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. user@example.com"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition cursor-pointer"
                                >
                                    {forgotLoading ? "Requesting OTP Code..." : "Send Verification Code →"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs text-purple-900 font-semibold flex items-center justify-between">
                                    <span>OTP Sent to: <strong>{forgotEmail}</strong></span>
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep(1)}
                                        className="text-purple-700 underline font-bold cursor-pointer"
                                    >
                                        Change
                                    </button>
                                </div>

                                {generatedOtp && (
                                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 font-bold text-center">
                                        Verification Code: <span className="font-mono text-base text-amber-900 tracking-widest">{generatedOtp}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        6-Digit Verification OTP Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        placeholder="123456"
                                        value={forgotOtp}
                                        onChange={(e) => setForgotOtp(e.target.value)}
                                        className="w-full px-4 py-2.5 font-mono text-center tracking-widest text-lg font-bold bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        New Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="At least 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Confirm New Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition cursor-pointer"
                                >
                                    {forgotLoading ? "Resetting Password..." : "Reset Password Now ✓"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
        </div>
    );
}

export default Login;



