import React, { useState, useEffect } from 'react';
import { 
  FiTag, 
  FiPlusCircle, 
  FiCheckCircle, 
  FiXCircle, 
  FiPercent, 
  FiDollarSign, 
  FiCalendar, 
  FiUsers, 
  FiToggleLeft, 
  FiToggleRight, 
  FiTrash2,
  FiSearch
} from 'react-icons/fi';

export default function OrganizerPromoCodes() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [promos, setPromos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '0',
    max_uses: '100',
    valid_until: '',
    event_id: ''
  });

  useEffect(() => {
    fetchPromos();
    fetchEvents();
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_promo_codes.php?organizer_id=${user.id || 2}`);
      const data = await res.json();
      if (data.status === 'success') {
        setPromos(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching promo codes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/my_events.php?user_id=${user.id || 2}`);
      const data = await res.json();
      if (data && data.events && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error fetching organizer events:", err);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '0',
      max_uses: '100',
      valid_until: '',
      event_id: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_value) {
      triggerToast('Promo Code and Discount Value are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/create_promo_code.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizer_id: user.id || 2
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Promo code '${formData.code.toUpperCase()}' created successfully!`);
        setShowModal(false);
        fetchPromos();
      } else {
        triggerToast(data.message || 'Failed to create promo code', 'error');
      }
    } catch (err) {
      triggerToast('Error submitting promo code.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (promoId) => {
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/toggle_promo_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promo_id: promoId, action: 'toggle_status' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Promo code status toggled.');
        fetchPromos();
      }
    } catch (err) {
      triggerToast('Error updating status.', 'error');
    }
  };

  const handleDelete = async (promoId) => {
    if (!window.confirm("Are you sure you want to delete this promotional discount code?")) return;
    try {
      const res = await fetch('http://localhost/EventEase/backend/api/toggle_promo_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promo_id: promoId, action: 'delete' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast('Promo code deleted.');
        fetchPromos();
      }
    } catch (err) {
      triggerToast('Error deleting promo code.', 'error');
    }
  };

  const filteredPromos = promos.filter((p) => {
    return p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (p.event_title && p.event_title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-950 min-h-screen text-white">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            <FiTag className="text-purple-400" /> Promo Code & Discount Campaign Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create promotional discount codes, manage percentage vs fixed discounts, set usage caps and expiration dates.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <FiPlusCircle /> Create New Promo Code
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search promo codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Promo Codes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading promo campaigns...</div>
        ) : filteredPromos.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No promo codes found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Promo Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Event Applicability</th>
                  <th className="p-4">Usage Counter</th>
                  <th className="p-4">Min Order</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {filteredPromos.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <span className="font-mono font-extrabold text-base text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
                        {item.code}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {item.discount_type === 'percentage' ? `${item.discount_value}% OFF` : `LKR ${Number(item.discount_value).toLocaleString()} OFF`}
                    </td>
                    <td className="p-4 text-xs text-slate-300">
                      {item.event_title ? (
                        <span className="text-indigo-400 font-semibold">{item.event_title}</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold uppercase">Platform-Wide (All Events)</span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono">
                      <span className="text-purple-300 font-bold">{item.used_count}</span> / {item.max_uses} used
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-400">
                      LKR {Number(item.min_order_amount).toLocaleString()}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {item.valid_until ? new Date(item.valid_until).toLocaleDateString() : 'No Expiry'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
                          title="Toggle Active/Inactive"
                        >
                          {item.status === 'active' ? <FiToggleRight className="text-emerald-400 text-lg" /> : <FiToggleLeft className="text-slate-400 text-lg" />}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition border border-red-500/30"
                          title="Delete Code"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Promo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiTag className="text-purple-400" /> Create New Promo Code
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                <FiXCircle />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Promo Code String *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20, SUMMER500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono font-bold uppercase focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (LKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    {formData.discount_type === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (LKR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder={formData.discount_type === 'percentage' ? "e.g. 20" : "e.g. 500"}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Minimum Order Amount (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Max Usages Limit</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Applicable Event</label>
                  <select
                    value={formData.event_id}
                    onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                  >
                    <option value="">Platform-Wide (All Events)</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/20"
                >
                  {submitting ? 'Creating Code...' : 'Create Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
