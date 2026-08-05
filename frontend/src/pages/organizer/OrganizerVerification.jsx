import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileUpload,
  FaBuilding,
  FaIdCard,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
  FaFilePdf
} from "react-icons/fa";

const OrganizerVerification = () => {
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Form State
  const [orgName, setOrgName] = useState("");
  const [brn, setBrn] = useState("");
  const [tin, setTin] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_organizer_verification.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success && data.organizer) {
        setOrganizer(data.organizer);
        setOrgName(data.organizer.organization_name || "");
        setBrn(data.organizer.business_registration_number || "");
        setTin(data.organizer.tin_number || data.organizer.tax_identification_number || "");
        setNic(data.organizer.nic_passport || "");
        setPhone(data.organizer.phone || "");
        setWebsite(data.organizer.website || "");
        setAddress(data.organizer.address || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateAll = () => {
    const errors = {};

    // Org Name
    if (!orgName || orgName.trim().length < 3) {
      errors.orgName = "Organization Name is required (minimum 3 characters).";
    }

    // BRN
    const brnClean = brn ? brn.trim() : "";
    const brnRegex = /^(PV|BR|W|CO|LLC|PVT)?-?[A-Za-z0-9\/-]{4,15}$/i;
    if (!brnClean || brnClean.length < 5 || !brnRegex.test(brnClean)) {
      errors.brn = "Enter a valid Business Registration Number (BRN) (e.g. PV-123456 or BR-98765).";
    }

    // TIN
    const tinClean = tin ? tin.trim() : "";
    const tinRegex = /^(TIN-?)?[A-Za-z0-9-]{8,15}$/i;
    if (!tinClean || tinClean.length < 8 || !tinRegex.test(tinClean)) {
      errors.tin = "Enter a valid Tax Identification Number (TIN) (e.g. TIN-987654321).";
    }

    // NIC
    if (!nic || nic.trim().length < 8) {
      errors.nic = "NIC / Passport Number is required (minimum 8 characters).";
    }

    // Phone
    const phoneDigits = phone ? phone.replace(/[^\d]/g, "") : "";
    if (!phone || phoneDigits.length < 9 || phoneDigits.length > 12) {
      errors.phone = "Please enter a valid 10-digit phone number.";
    }

    // Address
    if (!address || address.trim().length < 5) {
      errors.address = "Physical Address is required (minimum 5 characters).";
    }

    // File
    if (!file && (!organizer || !organizer.document_path)) {
      errors.file = "Please upload a Business License or Identity Document (PDF/Image).";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      orgName: true,
      brn: true,
      tin: true,
      nic: true,
      phone: true,
      address: true,
      file: true
    });

    const errors = validateAll();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstErr = Object.values(errors)[0];
      alert(firstErr || "Please fix validation errors before submitting to Admin.");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("organization_name", orgName);
    formData.append("business_registration_number", brn);
    formData.append("tax_identification_number", tin);
    formData.append("tin_number", tin);
    formData.append("nic_passport", nic);
    formData.append("phone", phone);
    formData.append("website", website);
    formData.append("address", address);
    if (file) {
      formData.append("document", file);
    }

    try {
      const res = await fetch("http://localhost/EventEase/backend/api/submit_organizer_verification.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg(data.message);
        fetchVerificationStatus();
      } else {
        alert(data.message || "Validation failed: Could not submit verification");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const status = organizer?.verification_status || "pending";
  const isVerified = status === "verified" || status === "approved";
  const isRejected = status === "rejected";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-yellow-300 text-2xl">
                <FaShieldAlt />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Organizer Business Verification</h1>
                <p className="text-purple-200 text-sm mt-0.5">
                  Submit verified BRN, TIN & business details for Admin review & badge approval
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isVerified ? (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                <FaCheckCircle className="text-emerald-600 text-base" /> Verified Organizer
              </span>
            ) : isRejected ? (
              <span className="bg-rose-100 text-rose-800 border border-rose-300 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                <FaExclamationTriangle className="text-rose-600 text-base" /> Verification Rejected
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm animate-pulse">
                <FaClock className="text-amber-600 text-base" /> Review Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-base" /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-black">
            ✕
          </button>
        </div>
      )}

      {isRejected && (
        <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-3xl space-y-2">
          <h3 className="text-rose-900 font-extrabold text-sm flex items-center gap-2">
            <FaExclamationTriangle /> Reason for Rejection:
          </h3>
          <p className="text-xs text-rose-700 font-medium">
            {organizer?.rejection_reason || "Your document or verification credentials were missing required business details."}
          </p>
          <p className="text-xs text-rose-600 pt-1 font-semibold">
            Please correct the validation errors below and re-submit for Admin approval.
          </p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Business Credentials & Verification Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Org Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaBuilding className="text-purple-600" /> Organization / Business Name *
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (fieldErrors.orgName) setFieldErrors({ ...fieldErrors, orgName: null });
                }}
                placeholder="e.g. Apex Events Pvt Ltd"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.orgName && fieldErrors.orgName
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.orgName && fieldErrors.orgName && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.orgName}</p>
              )}
            </div>

            {/* BRN */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> Business Registration No. (BRN) *
              </label>
              <input
                type="text"
                value={brn}
                onChange={(e) => {
                  setBrn(e.target.value);
                  if (fieldErrors.brn) setFieldErrors({ ...fieldErrors, brn: null });
                }}
                placeholder="e.g. PV-123456"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.brn && fieldErrors.brn
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.brn && fieldErrors.brn && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.brn}</p>
              )}
            </div>

            {/* TIN */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> Tax Identification No. (TIN) *
              </label>
              <input
                type="text"
                value={tin}
                onChange={(e) => {
                  setTin(e.target.value);
                  if (fieldErrors.tin) setFieldErrors({ ...fieldErrors, tin: null });
                }}
                placeholder="e.g. TIN-987654321"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.tin && fieldErrors.tin
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.tin && fieldErrors.tin && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.tin}</p>
              )}
            </div>

            {/* NIC */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> NIC or Passport Number *
              </label>
              <input
                type="text"
                value={nic}
                onChange={(e) => {
                  setNic(e.target.value);
                  if (fieldErrors.nic) setFieldErrors({ ...fieldErrors, nic: null });
                }}
                placeholder="e.g. 199512345678"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.nic && fieldErrors.nic
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.nic && fieldErrors.nic && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.nic}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaPhone className="text-purple-600" /> Official Contact Phone *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: null });
                }}
                placeholder="e.g. 0771234567"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.phone && fieldErrors.phone
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.phone && fieldErrors.phone && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.phone}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaGlobe className="text-purple-600" /> Business Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://apexevents.lk"
                className="w-full p-3.5 border border-gray-300 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-purple-600" /> Physical Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (fieldErrors.address) setFieldErrors({ ...fieldErrors, address: null });
                }}
                placeholder="e.g. Colombo 03, Sri Lanka"
                className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 transition ${
                  touched.address && fieldErrors.address
                    ? "border-red-500 focus:ring-red-400 bg-red-50/20"
                    : "border-gray-300 focus:ring-purple-600"
                }`}
              />
              {touched.address && fieldErrors.address && (
                <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {fieldErrors.address}</p>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-2 border-dashed border-purple-200 rounded-3xl p-6 bg-purple-50/50 space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase flex items-center gap-2">
              <FaFileUpload className="text-purple-600 text-base" /> Upload Business License / Identity Document (PDF / Image) *
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                setFile(e.target.files[0]);
                if (fieldErrors.file) setFieldErrors({ ...fieldErrors, file: null });
              }}
              className="text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
            />
            {touched.file && fieldErrors.file && (
              <p className="text-xs text-red-600 font-semibold">⚠️ {fieldErrors.file}</p>
            )}
            {organizer?.document_path && (
              <p className="text-xs text-purple-700 font-semibold flex items-center gap-1.5 pt-1">
                <FaFilePdf /> Uploaded Document:{" "}
                <a
                  href={`http://localhost/EventEase/backend/uploads/${organizer.document_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-purple-900"
                >
                  View Attached Document
                </a>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
          >
            {saving ? "Validating & Submitting..." : "Submit Verification Documents to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerVerification;
