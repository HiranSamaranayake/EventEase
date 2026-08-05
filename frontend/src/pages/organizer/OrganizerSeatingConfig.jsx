import React, { useState, useEffect } from 'react';
import { 
  FiGrid, 
  FiPlus, 
  FiTrash2, 
  FiDollarSign, 
  FiLayers, 
  FiInfo, 
  FiCheckCircle, 
  FiXCircle,
  FiAward
} from 'react-icons/fi';

export default function OrganizerSeatingConfig() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [seatingSections, setSeatingSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    section_name: '',
    total_rows: 5,
    seats_per_row: 10,
    ticket_price: 5000,
    color_code: '#8b5cf6',
    perks_description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchSeatingSections(selectedEventId);
    }
  }, [selectedEventId]);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchOrganizerEvents = async () => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id || 2}`);
      const data = await res.json();
      if (data.success && data.events && data.events.length > 0) {
        setEvents(data.events);
        setSelectedEventId(data.events[0].id);
      }
    } catch (err) {
      console.error("Failed to load organizer events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatingSections = async (eventId) => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_seating_configs.php?event_id=${eventId}`);
      const data = await res.json();
      if (data.status === 'success') {
        setSeatingSections(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load seating sections:", err);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!formData.section_name || formData.ticket_price < 0) {
      triggerToast("Section Name and valid Ticket Price are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/create_seating_config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          organizer_id: user.id || 2,
          ...formData
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Seating Section '${formData.section_name}' created successfully!`);
        setIsModalOpen(false);
        setFormData({
          section_name: '',
          total_rows: 5,
          seats_per_row: 10,
          ticket_price: 5000,
          color_code: '#8b5cf6',
          perks_description: ''
        });
        fetchSeatingSections(selectedEventId);
      } else {
        triggerToast(data.message || 'Creation failed.', 'error');
      }
    } catch (err) {
      triggerToast('Error creating seating section.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure you want to delete this seating section layout?")) return;

    try {
      const res = await fetch('http://localhost/EventEase/backend/api/delete_seating_config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast("Seating section deleted.");
        fetchSeatingSections(selectedEventId);
      }
    } catch (err) {
      triggerToast("Failed to delete section.", "error");
    }
  };

  const selectedEvent = events.find(e => parseInt(e.id) === parseInt(selectedEventId));
  const totalVenueCapacity = seatingSections.reduce((acc, sec) => acc + (sec.total_rows * sec.seats_per_row), 0);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiGrid className="text-purple-600" /> Venue Seating Layout & Tiered Pricing Configurator
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure custom seating sections (VIP, Gold, Silver), row x seat capacities, pricing tiers, and section perks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-700/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <FiPlus /> Add Venue Seating Tier
        </button>
      </div>

      {/* Event Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md md:col-span-2 flex flex-col justify-between">
          <label className="block text-xs font-extrabold text-gray-500 uppercase mb-2">Select Target Event</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 text-sm font-bold text-purple-950 focus:outline-none focus:border-purple-600"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                📅 #{ev.id} - {ev.title} ({ev.category || 'General'})
              </option>
            ))}
          </select>
          {selectedEvent && (
            <p className="text-xs text-gray-400 mt-2 font-medium">Venue: {selectedEvent.location || 'Colombo Main Arena'} | Date: {selectedEvent.event_date}</p>
          )}
        </div>

        <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs text-purple-200 font-bold uppercase">Configured Seating Capacity</div>
            <div className="text-3xl font-black mt-1">{totalVenueCapacity} Seats</div>
          </div>
          <div className="text-[11px] text-purple-300 font-medium mt-2">
            Across {seatingSections.length} Venue Pricing Tiers
          </div>
        </div>
      </div>

      {/* Seating Sections Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiLayers className="text-purple-600" /> Configured Seating Map Sections ({seatingSections.length})
        </h2>

        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading seating map layouts...</div>
        ) : seatingSections.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
            No seating map tiers created for this event yet. Click "Add Venue Seating Tier" above to define VIP or General sections!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seatingSections.map((sec) => {
              const secCapacity = sec.total_rows * sec.seats_per_row;
              return (
                <div key={sec.id} className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xl space-y-4 hover:border-purple-300 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span 
                        className="w-5 h-5 rounded-full inline-block shadow-sm shrink-0"
                        style={{ backgroundColor: sec.color_code }}
                      ></span>
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900">{sec.section_name}</h3>
                        <p className="text-xs text-gray-500 font-mono">
                          {sec.total_rows} Rows × {sec.seats_per_row} Seats/Row = <strong>{secCapacity} Seats</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-purple-900 text-sm bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                        LKR {Number(sec.ticket_price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg transition"
                        title="Delete Section"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Section Perks */}
                  {sec.perks_description && (
                    <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 text-xs text-purple-900 font-medium flex items-center gap-2">
                      <FiAward className="text-purple-600 text-base shrink-0" />
                      <span>{sec.perks_description}</span>
                    </div>
                  )}

                  {/* Visual Seat Grid Preview */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center border-b pb-1">
                      STAGE FRONT DIRECTIONS &rarr;
                    </div>
                    
                    <div className="grid gap-1.5 py-1">
                      {Array.from({ length: Math.min(sec.total_rows, 4) }).map((_, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                          <span className="w-5 font-bold">R{rIdx + 1}</span>
                          <div className="flex flex-wrap gap-1 flex-1">
                            {Array.from({ length: Math.min(sec.seats_per_row, 12) }).map((_, sIdx) => (
                              <span
                                key={sIdx}
                                className="w-4 h-4 rounded-sm text-[9px] flex items-center justify-center font-bold text-white shadow-sm"
                                style={{ backgroundColor: sec.color_code }}
                              >
                                {sIdx + 1}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Seating Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <FiGrid className="text-purple-600" /> Add Venue Seating Tier Section
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Define seat layout grid and pricing tier for selected event.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Front Row A"
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Number of Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.total_rows}
                    onChange={(e) => setFormData({ ...formData, total_rows: parseInt(e.target.value) || 1 })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Seats Per Row</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.seats_per_row}
                    onChange={(e) => setFormData({ ...formData, seats_per_row: parseInt(e.target.value) || 1 })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Ticket Price (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.ticket_price}
                    onChange={(e) => setFormData({ ...formData, ticket_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Badge Color Tag</label>
                  <input
                    type="color"
                    value={formData.color_code}
                    onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">Section Benefits & Perks</label>
                <input
                  type="text"
                  placeholder="e.g. Front row stage view + Welcome drink + VIP Pass"
                  value={formData.perks_description}
                  onChange={(e) => setFormData({ ...formData, perks_description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-purple-700/20"
                >
                  {submitting ? 'Saving...' : 'Save Seating Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
