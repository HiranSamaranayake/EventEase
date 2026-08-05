import { motion } from "framer-motion";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "customer",
        organizationName: "",
        brNumber: "",
        tinNumber: "",
        companyDetails: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validate a single field
    const validateField = (name, value, currentData) => {
        let error = "";
        const data = { ...currentData, [name]: value };

        switch (name) {
            case "fullName":
                if (!value || value.trim().length < 3) {
                    error = "Full Name must be at least 3 characters long.";
                } else if (!/^[A-Za-z\s.'-]{3,60}$/.test(value.trim())) {
                    error = "Full Name can only contain letters and spaces.";
                }
                break;

            case "email":
                if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    error = "Please enter a valid email address (e.g. name@example.com).";
                }
                break;

            case "phone": {
                const phoneDigits = value ? value.replace(/[^\d]/g, "") : "";
                if (!value || phoneDigits.length < 9 || phoneDigits.length > 12) {
                    error = "Please enter a valid 10-digit phone number.";
                }
                break;
            }

            case "password":
                if (!value || value.length < 8) {
                    error = "Password must be at least 8 characters long.";
                } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)) {
                    error = "Password must contain both letters and numbers.";
                }
                break;

            case "confirmPassword":
                if (value !== data.password) {
                    error = "Passwords do not match.";
                }
                break;

            case "organizationName":
                if (data.role === "organizer" && (!value || value.trim().length < 3)) {
                    error = "Company / Organization Name is required (min 3 characters).";
                }
                break;

            case "brNumber":
                if (data.role === "organizer") {
                    const brnClean = value ? value.trim() : "";
                    const brnRegex = /^(PV|BR|W|CO|LLC|PVT)?-?[A-Za-z0-9\/-]{4,15}$/i;
                    if (!brnClean || brnClean.length < 5 || !brnRegex.test(brnClean)) {
                        error = "Enter a valid Business Registration Number (BRN) (e.g. PV-123456 or BR-98765).";
                    }
                }
                break;

            case "tinNumber":
                if (data.role === "organizer") {
                    const tinClean = value ? value.trim() : "";
                    const tinRegex = /^(TIN-?)?[A-Za-z0-9-]{8,15}$/i;
                    if (!tinClean || tinClean.length < 8 || !tinRegex.test(tinClean)) {
                        error = "Enter a valid Tax Identification Number (TIN) (e.g. TIN-987654321).";
                    }
                }
                break;

            default:
                break;
        }

        return error;
    };

    // Validate all fields on submit
    const validateAll = () => {
        const errors = {};

        // Full Name
        if (!formData.fullName || formData.fullName.trim().length < 3) {
            errors.fullName = "Full Name must be at least 3 characters long.";
        } else if (!/^[A-Za-z\s.'-]{3,60}$/.test(formData.fullName.trim())) {
            errors.fullName = "Full Name can only contain letters and spaces.";
        }

        // Email
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = "Please enter a valid email address (e.g. name@example.com).";
        }

        // Phone
        const phoneDigits = formData.phone ? formData.phone.replace(/[^\d]/g, "") : "";
        if (!formData.phone || phoneDigits.length < 9 || phoneDigits.length > 12) {
            errors.phone = "Please enter a valid 10-digit phone number.";
        }

        // Password
        if (!formData.password || formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long.";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
            errors.password = "Password must contain both letters and numbers.";
        }

        // Confirm Password
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        // Organizer Fields
        if (formData.role === "organizer") {
            if (!formData.organizationName || formData.organizationName.trim().length < 3) {
                errors.organizationName = "Company / Organization Name is required (min 3 characters).";
            }

            const brnClean = formData.brNumber ? formData.brNumber.trim() : "";
            const brnRegex = /^(PV|BR|W|CO|LLC|PVT)?-?[A-Za-z0-9\/-]{4,15}$/i;
            if (!brnClean || brnClean.length < 5 || !brnRegex.test(brnClean)) {
                errors.brNumber = "Enter a valid Business Registration Number (BRN) (e.g. PV-123456 or BR-98765).";
            }

            const tinClean = formData.tinNumber ? formData.tinNumber.trim() : "";
            const tinRegex = /^(TIN-?)?[A-Za-z0-9-]{8,15}$/i;
            if (!tinClean || tinClean.length < 8 || !tinRegex.test(tinClean)) {
                errors.tinNumber = "Enter a valid Tax Identification Number (TIN) (e.g. TIN-987654321).";
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const nextData = { ...prev, [name]: value };
            if (name === "role" && value === "customer") {
                // Clear organizer errors when switching to customer
                setFieldErrors((prevErr) => {
                    const copy = { ...prevErr };
                    delete copy.organizationName;
                    delete copy.brNumber;
                    delete copy.tinNumber;
                    return copy;
                });
            } else {
                const fieldErr = validateField(name, value, nextData);
                setFieldErrors((prevErr) => ({ ...prevErr, [name]: fieldErr }));
            }
            return nextData;
        });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const fieldErr = validateField(name, formData[name], formData);
        setFieldErrors((prevErr) => ({ ...prevErr, [name]: fieldErr }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = {
            fullName: true,
            email: true,
            phone: true,
            password: true,
            confirmPassword: true,
        };
        if (formData.role === "organizer") {
            allTouched.organizationName = true;
            allTouched.brNumber = true;
            allTouched.tinNumber = true;
        }
        setTouched(allTouched);

        const errors = validateAll();
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstErr = Object.values(errors)[0];
            toast.error(firstErr || "Please fix input validation errors before submitting.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost/EventEase/backend/api/register.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Registration Successful!");

                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    role: "customer",
                    organizationName: "",
                    brNumber: "",
                    tinNumber: "",
                    companyDetails: "",
                });
                setFieldErrors({});
                setTouched({});
            } else {
                toast.error(data.message || "Registration Failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server Error while submitting registration");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden px-4 py-8">
            {/* Purple Glow */}
            <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl"></div>
            {/* Pink Glow */}
            <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-fuchsia-500/20 blur-3xl"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10"
            >
                <div className="grid lg:grid-cols-2">
                    {/* Left Side */}
                    <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 text-white">
                        <h2 className="text-5xl font-black">EventEase</h2>
                        <p className="mt-6 text-lg text-white/90">
                            Book events, reserve seats, receive QR tickets and manage event experiences through EventEase.
                        </p>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Browse Events</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Reserve Seats</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>QR Ticket Access</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Verified Organizer Validation (BRN & TIN)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="p-8 lg:p-10">
                        <h1 className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-center text-gray-600 mt-3">
                            Join EventEase today as Customer or Verified Organizer
                        </p>

                        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                            touched.fullName && fieldErrors.fullName
                                                ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                : touched.fullName && !fieldErrors.fullName && formData.fullName
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-gray-300 focus:ring-purple-500"
                                        }`}
                                    />
                                    {touched.fullName && fieldErrors.fullName && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            ⚠️ {fieldErrors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your email"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                            touched.email && fieldErrors.email
                                                ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                : touched.email && !fieldErrors.email && formData.email
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-gray-300 focus:ring-purple-500"
                                        }`}
                                    />
                                    {touched.email && fieldErrors.email && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            ⚠️ {fieldErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g. 0771234567"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                            touched.phone && fieldErrors.phone
                                                ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                : touched.phone && !fieldErrors.phone && formData.phone
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-gray-300 focus:ring-purple-500"
                                        }`}
                                    />
                                    {touched.phone && fieldErrors.phone && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            ⚠️ {fieldErrors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Register As *
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-gray-800 bg-white"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="organizer">Organizer</option>
                                    </select>
                                </div>

                                {/* ORGANIZER VALIDITY VERIFICATION FIELDS */}
                                {formData.role === "organizer" && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                Company / Organization Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. Apex Event Management Ltd"
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                                    touched.organizationName && fieldErrors.organizationName
                                                        ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                        : touched.organizationName && !fieldErrors.organizationName && formData.organizationName
                                                        ? "border-green-500 focus:ring-green-400"
                                                        : "border-gray-300 focus:ring-purple-500"
                                                }`}
                                            />
                                            {touched.organizationName && fieldErrors.organizationName && (
                                                <p className="text-xs text-red-600 font-semibold mt-1">
                                                    ⚠️ {fieldErrors.organizationName}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                Business Registration (BR) Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="brNumber"
                                                value={formData.brNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. PV-123456 or BR-98765"
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                                    touched.brNumber && fieldErrors.brNumber
                                                        ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                        : touched.brNumber && !fieldErrors.brNumber && formData.brNumber
                                                        ? "border-green-500 focus:ring-green-400"
                                                        : "border-gray-300 focus:ring-purple-500"
                                                }`}
                                            />
                                            {touched.brNumber && fieldErrors.brNumber && (
                                                <p className="text-xs text-red-600 font-semibold mt-1">
                                                    ⚠️ {fieldErrors.brNumber}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                Tax Identification (TIN) Number *
                                            </label>
                                            <input
                                                type="text"
                                                name="tinNumber"
                                                value={formData.tinNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="e.g. TIN-987654321"
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                                    touched.tinNumber && fieldErrors.tinNumber
                                                        ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                        : touched.tinNumber && !fieldErrors.tinNumber && formData.tinNumber
                                                        ? "border-green-500 focus:ring-green-400"
                                                        : "border-gray-300 focus:ring-purple-500"
                                                }`}
                                            />
                                            {touched.tinNumber && fieldErrors.tinNumber && (
                                                <p className="text-xs text-red-600 font-semibold mt-1">
                                                    ⚠️ {fieldErrors.tinNumber}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium text-gray-700">
                                                Company Address / Details
                                            </label>
                                            <input
                                                type="text"
                                                name="companyDetails"
                                                value={formData.companyDetails}
                                                onChange={handleChange}
                                                placeholder="Company Address & Business Details"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Password */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter password (min 8 chars)"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                            touched.password && fieldErrors.password
                                                ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                : touched.password && !fieldErrors.password && formData.password
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-gray-300 focus:ring-purple-500"
                                        }`}
                                    />
                                    {touched.password && fieldErrors.password && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            ⚠️ {fieldErrors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Confirm password"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition ${
                                            touched.confirmPassword && fieldErrors.confirmPassword
                                                ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                                                : touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword
                                                ? "border-green-500 focus:ring-green-400"
                                                : "border-gray-300 focus:ring-purple-500"
                                        }`}
                                    />
                                    {touched.confirmPassword && fieldErrors.confirmPassword && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">
                                            ⚠️ {fieldErrors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-extrabold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                Create {formData.role === "organizer" ? "Organizer Account with Verification" : "Customer Account"}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-gray-600">Already have an account?</p>
                            <a href="/login" className="text-purple-600 font-semibold hover:text-fuchsia-600">
                                Login Here
                            </a>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <p className="text-center text-sm text-gray-500">
                                EventEase Online Ticket Reservation Platform
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
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

export default Register;
