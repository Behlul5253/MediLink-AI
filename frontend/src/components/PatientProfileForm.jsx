import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatientPortal() {
  const [name, setName] = useState(localStorage.getItem('name') || 'Patient');
  const email = localStorage.getItem('email') || 'patient@medilink.com';
  const [age, setAge] = useState(localStorage.getItem('age') || '');
  const [bloodGroup, setBloodGroup] = useState(localStorage.getItem('blood_group') || '');
  const [medicalHistory, setMedicalHistory] = useState(localStorage.getItem('medical_history') || '');
  const [uploadedFile, setUploadedFile] = useState(localStorage.getItem('uploaded_file') || '');

  const [isEditing, setIsEditing] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [tempFile, setTempFile] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReportAnalysis, setAiReportAnalysis] = useState(null);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file.name);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          age,
          blood_group: bloodGroup,
          medical_history: medicalHistory,
          uploaded_file: tempFile || uploadedFile
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('age', data.user.age);
        localStorage.setItem('blood_group', data.user.blood_group);
        localStorage.setItem('medical_history', data.user.medical_history);
        localStorage.setItem('uploaded_file', data.user.uploaded_file);
        setUploadedFile(data.user.uploaded_file);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.detail || 'Update failed.');
      }
    } catch (err) {
      alert('Cannot connect to backend server.');
    }
  };

  const handleAIAnalyzeReport = async () => {
    setAnalyzing(true);
    setAiReportAnalysis(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patient_email: email, 
          request_text: medicalHistory || "General profile and report review",
          uploaded_file: uploadedFile || "None"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiReportAnalysis(data.appointment.ai_analysis);
      } else {
        alert('AI Analysis failed.');
      }
    } catch (err) {
      alert('Cannot connect to backend server.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSmartBooking = async (e) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patient_email: email, 
          request_text: symptomText,
          uploaded_file: tempFile || uploadedFile
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingResult(data.appointment);
        setSymptomText('');
      } else {
        alert(data.detail || 'Booking failed.');
      }
    } catch (err) {
      alert('Cannot connect to backend server.');
    }
  };

  const handleCancelAppointment = () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setBookingResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-xl font-bold text-blue-400">Welcome, {name}</h1>
            <p className="text-xs text-slate-400 mt-1">Patient Portal • {email}</p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold cursor-pointer">
            Logout
          </button>
        </div>

        {/* Patient Profile Summary */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">📋 Your Medical Profile & Report</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAIAnalyzeReport}
                disabled={analyzing}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded text-xs font-medium cursor-pointer transition shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {analyzing ? '✨ Analyzing...' : '🤖 AI Analyzing'}
              </button>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium cursor-pointer transition"
              >
                {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">AGE</span>
                  <span className="text-white font-medium text-sm">{age || 'Not set'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">BLOOD GROUP</span>
                  <span className="text-white font-medium text-sm">{bloodGroup || 'Not set'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ATTACHED REPORT</span>
                  <span className="text-blue-400 font-medium truncate block">{uploadedFile || 'None'}</span>
                </div>
                <div className="col-span-1 md:col-span-3 bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">MEDICAL HISTORY</span>
                  <span className="text-white font-medium">{medicalHistory || 'None reported'}</span>
                </div>
              </div>

              {aiReportAnalysis && (
                <div className="bg-purple-950/40 border border-purple-500/40 p-4 rounded text-xs space-y-2 text-purple-200">
                  <span className="font-semibold text-sm text-purple-300 block">🧠 AI Instant Clinical Analysis:</span>
                  <p className="text-slate-200">{aiReportAnalysis}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-950 p-4 rounded border border-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Age</label>
                  <input type="text" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Blood Group</label>
                  <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Medical History Summary</label>
                <textarea rows="2" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white resize-none" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Update Report / Prescription (PDF/Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:bg-blue-600 file:text-white cursor-pointer" />
              </div>
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold cursor-pointer">
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* ACTIVE APPOINTMENT CARD WITH EXPLICIT CANCEL BUTTON */}
        {bookingResult && (
          <div className="bg-emerald-950/40 border-2 border-emerald-500 p-6 rounded-xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                🎉 Active Booked Appointment & AI Analysis
              </h2>
              <button 
                type="button"
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold cursor-pointer transition shadow-lg border border-red-400"
              >
                ❌ Cancel Appointment
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded border border-emerald-500/30">
              <div>
                <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
                <span className="text-white font-medium">{bookingResult.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SCHEDULED TIME</span>
                <span className="text-white font-medium">{bookingResult.appointment_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">URGENCY</span>
                <span className="text-white font-medium">{bookingResult.urgency}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ATTACHED FILE</span>
                <span className="text-blue-400 font-medium truncate block">{bookingResult.uploaded_file || 'None'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-emerald-500/30 text-xs space-y-1">
              <span className="text-emerald-400 font-semibold block">🧠 AI Clinical Breakdown:</span>
              <p className="text-slate-200">{bookingResult.ai_analysis}</p>
            </div>
          </div>
        )}

        {/* AI Appointment Booking Input Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">🤖 AI Smart Appointment Booking & Clinical Analysis</h2>
          <form onSubmit={handleSmartBooking} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Describe Symptoms</label>
              <textarea
                rows="3"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="e.g., severe chest pain, need cardiology appointment..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-white focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer">
              ✨ Book Appointment & Run AI Analysis
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}