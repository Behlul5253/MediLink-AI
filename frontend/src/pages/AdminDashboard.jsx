import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_appointments: 0, total_profiles: 0, system_status: 'Loading...' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError('Failed to load system statistics.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-blue-400">MediLink AI Admin Command Center</h1>
          <p className="text-xs text-slate-400">System-wide monitoring and metrics</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-200 text-xs p-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-6">Loading system statistics...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
              <p className="text-xs text-slate-400 uppercase font-medium">Total Users</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">{stats.total_users}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
              <p className="text-xs text-slate-400 uppercase font-medium">Appointments Booked</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.total_appointments}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
              <p className="text-xs text-slate-400 uppercase font-medium">Patient Profiles</p>
              <p className="text-3xl font-bold text-indigo-400 mt-2">{stats.total_profiles}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
              <p className="text-xs text-slate-400 uppercase font-medium">System Status</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-lg font-semibold text-emerald-400">{stats.system_status}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}