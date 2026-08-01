import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  FaQrcode,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHistory,
  FaSearch,
  FaVolumeUp,
  FaSync
} from "react-icons/fa";

const ScanTicket = () => {
  const [ticketCodeInput, setTicketCodeInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  
  const qrScannerRef = useRef(null);
  const scannerContainerId = "qr-reader-container";

  // Handle ticket verification API call
  const verifyTicket = async (codeToVerify) => {
    if (!codeToVerify || loading) return;

    const trimmedCode = codeToVerify.trim();
    if (!trimmedCode) return;

    setLoading(true);
    setValidationResult(null);

    try {
      const response = await fetch(
        `http://localhost/EventEase/backend/api/validate_ticket.php?ticket_code=${encodeURIComponent(
          trimmedCode
        )}`
      );
      const data = await response.json();

      const newScanItem = {
        id: Date.now(),
        code: trimmedCode,
        timestamp: new Date().toLocaleTimeString(),
        success: data.success,
        message: data.message,
        ticket: data.ticket || null
      };

      setValidationResult(newScanItem);

      // Add to recent scans log
      setRecentScans((prev) => [newScanItem, ...prev]);

      // Sound notification (optional synthesized beep)
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = data.success ? 880 : 300; // High tone for pass, low tone for fail
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Audio context play error muted silently
      }

    } catch (err) {
      setValidationResult({
        id: Date.now(),
        code: trimmedCode,
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        message: "Failed to connect to validation server",
        ticket: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Start Camera QR Scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (qrScannerRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      qrScannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" }, // Prefer back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // On QR Code Successfully Decoded
          verifyTicket(decodedText);
          stopCamera();
        },
        (errorMessage) => {
          // Ignore frame scan errors silently
        }
      );
      setScanning(true);
    } catch (err) {
      setCameraError("Camera access denied or camera not available. Use manual code entry below.");
      setScanning(false);
    }
  };

  // Stop Camera Scanner
  const stopCamera = async () => {
    if (qrScannerRef.current) {
      try {
        if (qrScannerRef.current.isScanning) {
          await qrScannerRef.current.stop();
        }
        qrScannerRef.current.clear();
      } catch (e) {
        console.error("Error stopping scanner", e);
      }
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (ticketCodeInput) {
      verifyTicket(ticketCodeInput);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-200 mb-3 border border-white/10">
            <FaQrcode /> Venue Access Control
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Ticket QR Code Scanner
          </h1>
          <p className="text-purple-200 mt-2 text-sm max-w-xl">
            Scan attendee digital QR tickets using your device camera or input ticket codes manually for instant venue verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!scanning ? (
            <button
              onClick={startCamera}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <FaCamera className="text-lg" /> Start Camera Scanner
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg hover:shadow-rose-600/20 transition flex items-center gap-2"
            >
              <FaTimesCircle className="text-lg" /> Stop Camera
            </button>
          )}
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scanner & Manual Input Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Camera View Box */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FaCamera className="text-purple-600" /> Live Camera Scanner
              </h2>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${scanning ? "bg-emerald-100 text-emerald-700 animate-pulse" : "bg-gray-100 text-gray-500"}`}>
                {scanning ? "Camera Active" : "Camera Idle"}
              </span>
            </div>

            <div className="w-full bg-slate-900 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center relative border-2 border-dashed border-indigo-300">
              <div id={scannerContainerId} className="w-full h-full"></div>

              {!scanning && !cameraError && (
                <div className="text-center p-8 text-slate-400">
                  <FaQrcode className="text-6xl mx-auto mb-3 opacity-30 text-indigo-400" />
                  <p className="font-medium text-slate-300">Camera scanner is turned off</p>
                  <p className="text-xs text-slate-500 mt-1">Click "Start Camera Scanner" above to begin scanning live QR codes</p>
                </div>
              )}

              {cameraError && (
                <div className="text-center p-6 text-rose-400 max-w-sm">
                  <FaExclamationTriangle className="text-4xl mx-auto mb-2 text-rose-500" />
                  <p className="text-xs font-medium leading-relaxed">{cameraError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual Input Form */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaSearch className="text-purple-600" /> Manual Code Validation
            </h2>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Ticket Code (e.g. EVT-118-4924)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ticketCodeInput}
                    onChange={(e) => setTicketCodeInput(e.target.value)}
                    placeholder="Enter or scan ticket code..."
                    className="w-full pl-4 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-600 outline-none font-mono text-gray-800 text-lg uppercase transition"
                  />
                  {ticketCodeInput && (
                    <button
                      type="button"
                      onClick={() => setTicketCodeInput("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !ticketCodeInput.trim()}
                className="w-full py-4 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 active:scale-95 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-700/20 transition flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <>
                    <FaSync className="animate-spin text-lg" /> Verifying Ticket...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" /> Validate Ticket Entry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Verification Result Banner & Session Log */}
        <div className="lg:col-span-6 space-y-6">
          {/* Result Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Verification Result</h2>

            {!validationResult ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                <FaQrcode className="text-5xl mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">Awaiting Ticket Scan</p>
                <p className="text-xs text-gray-400 mt-1">Scan a QR code or enter code above to see attendee status.</p>
              </div>
            ) : validationResult.success ? (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-inner animate-fadeIn space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-md">
                      Valid Ticket
                    </span>
                    <h3 className="text-xl font-black text-emerald-950 mt-1">
                      {validationResult.message}
                    </h3>
                  </div>
                </div>

                {validationResult.ticket && (
                  <div className="bg-white rounded-xl p-4 border border-emerald-200 space-y-2.5 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Attendee Name:</span>
                      <span className="font-bold text-gray-900">{validationResult.ticket.customer_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Event Title:</span>
                      <span className="font-bold text-indigo-700">{validationResult.ticket.event_title}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Event Date:</span>
                      <span className="font-medium text-gray-800">{validationResult.ticket.event_date}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Ticket Code:</span>
                      <span className="font-mono font-bold text-gray-900">{validationResult.ticket.ticket_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-xs uppercase">
                        {validationResult.ticket.status}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setValidationResult(null)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                >
                  Scan Next Attendee
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-6 shadow-inner animate-fadeIn space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                    <FaTimesCircle />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-md">
                      Validation Error
                    </span>
                    <h3 className="text-xl font-black text-rose-950 mt-1">
                      {validationResult.message}
                    </h3>
                  </div>
                </div>

                {validationResult.ticket && (
                  <div className="bg-white rounded-xl p-4 border border-rose-200 space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Attendee:</span>
                      <span className="font-bold text-gray-900">{validationResult.ticket.customer_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Event:</span>
                      <span className="font-bold text-gray-800">{validationResult.ticket.event_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ticket Status:</span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-xs uppercase">
                        {validationResult.ticket.status}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setValidationResult(null)}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition text-sm shadow-md"
                >
                  Scan Next Ticket
                </button>
              </div>
            )}
          </div>

          {/* Session Log */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FaHistory className="text-indigo-600" /> Recent Session Scans ({recentScans.length})
              </h2>
              {recentScans.length > 0 && (
                <button
                  onClick={() => setRecentScans([])}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Clear Log
                </button>
              )}
            </div>

            {recentScans.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No tickets validated in this session yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      scan.success
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-rose-50/50 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {scan.success ? (
                        <FaCheckCircle className="text-emerald-600 text-base shrink-0" />
                      ) : (
                        <FaTimesCircle className="text-rose-600 text-base shrink-0" />
                      )}
                      <div>
                        <p className="font-mono font-bold text-gray-900">{scan.code}</p>
                        <p className="text-gray-500 font-medium">
                          {scan.ticket ? scan.ticket.customer_name : scan.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          scan.success
                            ? "bg-emerald-200 text-emerald-800"
                            : "bg-rose-200 text-rose-800"
                        }`}
                      >
                        {scan.success ? "Approved" : "Failed"}
                      </span>
                      <p className="text-gray-400 text-[10px] mt-0.5">{scan.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanTicket;
