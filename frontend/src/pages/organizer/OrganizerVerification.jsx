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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(data.message || "Failed to submit verification");
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
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FaShieldAlt className="text-purple-600" /> Organizer Business Verification
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Submit business registration documents to gain Verified Organizer credentials and publish tickets.
          </p>
        </div>

        {/* Verification Status Pill */}
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

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-6 py-4 rounded-2xl shadow flex items-center justify-between text-sm font-semibold">
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600" /> {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)}>✕</button>
        </div>
      )}

      {isRejected && organizer?.rejection_reason && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 p-6 rounded-3xl space-y-2">
          <h3 className="font-extrabold flex items-center gap-2 text-rose-700">
            <FaExclamationTriangle /> Rejection Reason from Admin:
          </h3>
          <p className="text-xs leading-relaxed text-rose-800">{organizer.rejection_reason}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Business Credentials & Document Upload</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaBuilding className="text-purple-600" /> Organization / Business Name *
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Apex Events Pvt Ltd"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> Business Registration No. (BRN) *
              </label>
              <input
                type="text"
                required
                value={brn}
                onChange={(e) => setBrn(e.target.value)}
                placeholder="e.g. PV-123456"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> Tax Identification No. (TIN)
              </label>
              <input
                type="text"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                placeholder="e.g. TIN-98765432"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaIdCard className="text-purple-600" /> NIC or Passport Number *
              </label>
              <input
                type="text"
                required
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                placeholder="e.g. 199512345678"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaPhone className="text-purple-600" /> Official Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +94 77 123 4567"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaGlobe className="text-purple-600" /> Business Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://apexevents.lk"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-purple-600" /> Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Colombo 03, Sri Lanka"
                className="w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-2 border-dashed border-purple-200 rounded-3xl p-6 bg-purple-50/50 space-y-3">
            <label className="block text-xs font-bold text-gray-800 uppercase flex items-center gap-2">
              <FaFileUpload className="text-purple-600 text-base" /> Upload Business License / Identity Document (PDF / Image)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
            />
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
            {saving ? "Submitting..." : "Submit Verification Documents"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerVerification;
