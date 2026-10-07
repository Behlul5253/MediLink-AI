import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    blood_group: '',
    emergency_contact: '',
    medical_history: '',
  });
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  
  // Smart Appointment State
  const [apptText, setApptText] = useState('');
  const [apptLoading, setApptLoading] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeHistory = async () => {
    if (!profile.medical_history || aiLoading) return;
    
    setAiLoading(true);
    setAiSummary('');
    try {
      const res = await fetch('http://127.0.0.1:8000/analyze-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medical_history: profile.medical_history }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiSummary(data.summary);
      } else {
        alert(data.detail || 'Error generating AI summary');
      }
    } catch (err) {
      alert(`Unable to reach AI service: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    if (!apptText || apptLoading) return;

    setApptLoading(true);
    setAppointmentResult(null);

    try {
      const res = await fetch('http://127.0.0.1:8000/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_text: apptText }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointmentResult(data.appointment);
        setApptText('');
      } else {
        alert(data.detail || 'Failed to schedule appointment');
      }
    } catch (err) {
      alert(`Network error: ${err.message}`);
    } finally {
      setApptLoading(false);
    }
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\\n/g, '\n')
      .replace(/(##\s+[^\n]+)/g, '\n\n$1\n\n')
      .replace(/(\n-\s+)/g, '\n\n- ')
      .replace(/\n{3,}/g, '\n\n');
  };

  if (loading) {
    return (
      <div className="p-8 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        Loading patient records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-blue-400">
            MediLink AI Patient Portal
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </header>

        {/* Patient Profile & AI Analysis Section */}
        <main className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h2 className="text-xl font-semibold">Medical Record Summary</h2>
            <button
              onClick={handleAnalyzeHistory}
              disabled={aiLoading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded font-medium transition flex items-center gap-2 cursor-pointer"
            >
              {aiLoading ? 'Analyzing...' : '✨ Analyze with AI'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-400 block mb-1">Age</span>
              <span className="text-lg font-bold">{profile.age || 'N/A'}</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-400 block mb-1">Gender</span>
              <span className="text-lg font-bold">{profile.gender || 'N/A'}</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-400 block mb-1">Blood Group</span>
              <span className="text-lg font-bold text-blue-400">{profile.blood_group || 'N/A'}</span>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <span className="text-xs text-slate-400 block mb-1">Emergency Contact</span>
              <span className="text-lg font-bold">{profile.emergency_contact || 'N/A'}</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <span className="text-xs text-slate-400 block mb-1">Medical History</span>
            <p className="text-sm leading-relaxed">{profile.medical_history || 'No history recorded.'}</p>
          </div>

          {aiSummary && (
            <div className="p-6 rounded-xl bg-purple-950/30 border border-purple-500/40 text-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-semibold border-b border-purple-500/20 pb-3">
                <span>🤖 Gemini AI Clinical Summary</span>
              </div>
              <div className="text-sm leading-relaxed space-y-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-purple-300 mt-5 mb-2 border-b border-purple-500/20 pb-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-purple-300 mt-5 mb-2 border-b border-purple-500/20 pb-1" {...props} />,
                    p: ({ node, ...props }) => <p className="text-slate-300 my-2 leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc space-y-2 my-3 text-slate-300 pl-5" {...props} />,
                    li: ({ node, ...props }) => <li className="text-slate-300 pl-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                  }}
                >
                  {formatMarkdown(aiSummary)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </main>

        {/* AI Smart Appointment Scheduler Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-semibold text-blue-400">📅 AI Smart Appointment Scheduling</h2>
            <p className="text-xs text-slate-400 mt-1">
              Describe your symptoms or preferred schedule in plain text. Our AI will automatically match you with the right specialist and secure your slot.
            </p>
          </div>

          <form onSubmit={handleScheduleAppointment} className="space-y-4">
            <div>
              <textarea
                rows="3"
                value={apptText}
                onChange={(e) => setApptText(e.target.value)}
                placeholder="e.g., I need a cardiology checkup next Tuesday morning because of mild chest discomfort..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={apptLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded transition text-sm cursor-pointer flex items-center gap-2"
            >
              {apptLoading ? 'AI Matching & Booking...' : '✨ Smart Book Appointment'}
            </button>
          </form>

          {appointmentResult && (
            <div className="p-5 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                <span className="text-blue-400 font-semibold text-sm">✅ Appointment Confirmed</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
                  {appointmentResult.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Assigned Specialist</span>
                  <span className="font-bold text-white text-sm">{appointmentResult.doctor_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Department</span>
                  <span className="font-bold text-blue-300 text-sm">{appointmentResult.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scheduled Time</span>
                  <span className="font-bold text-white text-sm">{appointmentResult.appointment_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Urgency Classification</span>
                  <span className="font-bold text-amber-300 text-sm">{appointmentResult.urgency}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}