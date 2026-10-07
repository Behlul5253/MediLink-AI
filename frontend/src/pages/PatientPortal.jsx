import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientPortal() {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("Patient");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Patient Profile Information state
  const [profile, setProfile] = useState({
    name: "Rahul Verma",
    age: "22",
    gender: "Male",
    bloodGroup: "O+",
    phone: "1234567890",
    email: "patient@medilink.ai"
  });

  // Edit Profile Modal / Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Booking Form State
  const [doctorName, setDoctorName] = useState("Dr. Rajesh Sharma");
  const [specialty, setSpecialty] = useState("Cardiology");
  const [date, setDate] = useState("2026-11-10");
  const [time, setTime] = useState("10:00 AM - 10:30 AM");
  const [consultType, setConsultType] = useState("Video Call");
  const [symptoms, setSymptoms] = useState("");
  const [reportFile, setReportFile] = useState(null);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am MediLink AI Health Assistant. How can I assist you with your health or medical reports today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    // 1. Load patient name & profile details
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setPatientName(storedName);
      setProfile(prev => ({ ...prev, name: storedName }));
    }

    const storedProfile = localStorage.getItem("patientProfile");
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile(parsed);
      setEditForm(parsed);
      if (parsed.name) setPatientName(parsed.name);
    }

    // 2. Load Appointments from localStorage (default to empty array)
    const savedAppointments = localStorage.getItem("patientAppointments");
    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments);
      setAppointments(parsed.filter(appt => appt.status !== "Cancelled"));
    } else {
      setAppointments([]);
      localStorage.setItem("patientAppointments", JSON.stringify([]));
    }

    // 3. Load Prescriptions from localStorage
    const savedPrescriptions = localStorage.getItem("patientPrescriptions");
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setPatientName(editForm.name);
    localStorage.setItem("patientProfile", JSON.stringify(editForm));
    localStorage.setItem("userName", editForm.name);
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleCancelAppointment = (id) => {
    const updated = appointments.filter(appt => appt.id !== id);
    setAppointments(updated);
    localStorage.setItem("patientAppointments", JSON.stringify(updated));
    alert("Appointment cancelled and removed successfully.");
  };

  const handleResetSampleAppointments = () => {
    const initialAppointments = [
      {
        id: Date.now(),
        doctorName: "Dr. Rajesh Sharma",
        specialty: "Cardiology",
        date: "2026-11-05",
        time: "09:00 AM - 09:30 AM",
        type: "Video Call",
        reportName: "Clinical Summary Patient.pdf",
        reportUrl: "http://localhost:8000/uploads/Clinical Summary Patient.pdf",
        status: "Confirmed"
      }
    ];
    setAppointments(initialAppointments);
    localStorage.setItem("patientAppointments", JSON.stringify(initialAppointments));
    alert("Sample appointments reloaded!");
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      phone: profile.phone,
      doctorName: doctorName,
      specialty: specialty,
      date: date,
      time: time,
      type: consultType,
      symptoms: symptoms || "General checkup",
      reportName: reportFile ? reportFile.name : "medical_report.jpeg",
      reportUrl: reportFile ? URL.createObjectURL(reportFile) : "http://localhost:8000/uploads/medical_report.jpeg",
      status: "Confirmed"
    };

    const existing = JSON.parse(localStorage.getItem("patientAppointments") || "[]");
    const updatedList = [newAppointment, ...existing];
    localStorage.setItem("patientAppointments", JSON.stringify(updatedList));
    setAppointments(updatedList.filter(a => a.status !== "Cancelled"));

    alert("Appointment booked successfully!");
    setActiveTab("dashboard");
    setSymptoms("");
    setReportFile(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const updatedMessages = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(updatedMessages);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      let aiReply = "Based on your query, I recommend staying hydrated, resting well, and booking an appointment with one of our specialists if symptoms persist.";
      const lower = userMsg.toLowerCase();
      if (lower.includes("cough") || lower.includes("throat") || lower.includes("cold")) {
        aiReply = "For cough and throat irritation, warm saline gargles, honey with ginger, and adequate rest can help. If it persists over 3 days, consider consulting an ENT specialist.";
      } else if (lower.includes("chest") || lower.includes("heart")) {
        aiReply = "Chest discomfort should be evaluated promptly. Please book an urgent consultation with our cardiologist, Dr. Rajesh Sharma.";
      } else if (lower.includes("headache") || lower.includes("migraine")) {
        aiReply = "Headaches can be triggered by stress, dehydration, or lack of sleep. Ensure you are resting in a quiet, dark room and drinking enough water.";
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: aiReply }]);
    }, 800);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleOpenReport = (reportUrl) => {
    window.open(reportUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#fff", fontFamily: "Segoe UI, sans-serif", padding: "20px" }}>
      
      {/* Top Header Bar */}
      <div style={{ backgroundColor: "#131b2e", padding: "20px 30px", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#16a34a", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>
            {patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>MediLink AI — Patient Portal</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#38bdf8" }}>
              Welcome back, {patientName}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
          Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setActiveTab("dashboard")}
            style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "dashboard" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            Dashboard & Prescriptions
          </button>
          <button 
            onClick={() => setActiveTab("book")}
            style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "book" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            Book Appointment
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "ai" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            AI Health Assistant
          </button>
        </div>

        {appointments.length === 0 && (
          <button 
            onClick={handleResetSampleAppointments}
            style={{ backgroundColor: "#334155", color: "#38bdf8", border: "1px solid #475569", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
            + Load Sample Appointments
          </button>
        )}
      </div>

      {/* Tab 1: Dashboard & Prescriptions */}
      {activeTab === "dashboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Patient Profile Information Card */}
          <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc", display: "flex", alignItems: "center", gap: "8px" }}>
                👤 Patient Profile Information
              </h3>
              <button 
                onClick={() => {
                  setEditForm(profile);
                  setIsEditingProfile(!isEditingProfile);
                }}
                style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      style={{ width: "100%", backgroundColor: "#131b2e", color: "#fff", border: "1px solid #475569", borderRadius: "6px", padding: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Age</label>
                    <input 
                      type="number" 
                      value={editForm.age} 
                      onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      style={{ width: "100%", backgroundColor: "#131b2e", color: "#fff", border: "1px solid #475569", borderRadius: "6px", padding: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Gender</label>
                    <select 
                      value={editForm.gender} 
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      style={{ width: "100%", backgroundColor: "#131b2e", color: "#fff", border: "1px solid #475569", borderRadius: "6px", padding: "8px", fontSize: "14px", outline: "none" }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Blood Group</label>
                    <select 
                      value={editForm.bloodGroup} 
                      onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      style={{ width: "100%", backgroundColor: "#131b2e", color: "#fff", border: "1px solid #475569", borderRadius: "6px", padding: "8px", fontSize: "14px", outline: "none" }}>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Phone Number</label>
                    <input 
                      type="text" 
                      value={editForm.phone} 
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{ width: "100%", backgroundColor: "#131b2e", color: "#fff", border: "1px solid #475569", borderRadius: "6px", padding: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                      required 
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    style={{ backgroundColor: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px", display: "block" }}>Full Name</span>
                  <strong style={{ color: "#f8fafc", fontSize: "15px" }}>{profile.name}</strong>
                </div>
                <div style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px", display: "block" }}>Age & Gender</span>
                  <strong style={{ color: "#f8fafc", fontSize: "15px" }}>{profile.age} yrs, {profile.gender}</strong>
                </div>
                <div style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px", display: "block" }}>Blood Group</span>
                  <strong style={{ color: "#22c55e", fontSize: "15px" }}>{profile.bloodGroup}</strong>
                </div>
                <div style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px", display: "block" }}>Phone Number</span>
                  <strong style={{ color: "#f8fafc", fontSize: "15px" }}>{profile.phone}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Medical Prescriptions Section */}
          <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "16px" }}>My Medical Prescriptions from Doctors</h3>
            {prescriptions.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>No prescriptions issued by your doctors yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {prescriptions.map((rx) => (
                  <div key={rx.id} style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <strong style={{ color: "#38bdf8" }}>{rx.doctorName}</strong>
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>{rx.date}</span>
                    </div>
                    <pre style={{ margin: 0, color: "#cbd5e1", fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: "13px" }}>{rx.details}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Appointments Section */}
          <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "20px" }}>Your Appointments</h3>

            {appointments.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>You have no active appointments booked. Click on "Book Appointment" above to schedule one!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {appointments.map((appt) => (
                  <div key={appt.id} style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", color: "#38bdf8" }}>
                        {appt.doctorName || "Doctor"} <span style={{ fontSize: "13px", color: "#94a3b8" }}>({appt.specialty || "General"})</span>
                      </h4>
                      <span style={{ backgroundColor: "#1e293b", color: "#22c55e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        {appt.status || "Confirmed"}
                      </span>
                    </div>

                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#cbd5e1" }}>
                      📅 {appt.date} | ⏰ {appt.time} | 🩺 {appt.type}
                    </p>

                    {appt.reportName && (
                      <p style={{ margin: "8px 0 14px 0", fontSize: "13px" }}>
                        <span style={{ color: "#94a3b8" }}>View Attached Report: </span>
                        <button 
                          onClick={() => handleOpenReport(appt.reportUrl)}
                          style={{ background: "none", border: "none", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", fontSize: "13px", padding: 0 }}>
                          {appt.reportName}
                        </button>
                      </p>
                    )}

                    <button 
                      onClick={() => handleCancelAppointment(appt.id)}
                      style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", marginTop: "10px" }}>
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Book Appointment */}
      {activeTab === "book" && (
        <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b", maxWidth: "700px" }}>
          <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "8px" }}>Book a New Appointment</h3>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Select a doctor, slot, and upload medical reports for consultation.</p>

          <form onSubmit={handleBookAppointment} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Select Doctor</label>
              <select 
                value={doctorName} 
                onChange={(e) => {
                  setDoctorName(e.target.value);
                  if(e.target.value.includes("Sharma")) setSpecialty("Cardiology");
                  else if(e.target.value.includes("Verma")) setSpecialty("Neurology");
                  else setSpecialty("General Medicine");
                }}
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none" }}>
                <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Cardiology)</option>
                <option value="Dr. Priya Mehta">Dr. Priya Mehta (Neurology)</option>
                <option value="Dr. Amit Patel">Dr. Amit Patel (General Medicine)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Appointment Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Time Slot</label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none" }}>
                  <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Consultation Type</label>
              <select 
                value={consultType} 
                onChange={(e) => setConsultType(e.target.value)}
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none" }}>
                <option value="Video Call">Video Call (VC)</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Reported Symptoms</label>
              <textarea 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms e.g. cough, fever, chest pain..."
                rows="3"
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Upload Medical Report (PDF / Image)</label>
              <input 
                type="file" 
                onChange={(e) => setReportFile(e.target.files[0])}
                style={{ color: "#cbd5e1", fontSize: "13px" }}
              />
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "15px", marginTop: "10px" }}>
              Confirm & Book Appointment
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: AI Health Assistant */}
      {activeTab === "ai" && (
        <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", height: "600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#f8fafc" }}>MediLink AI Health Assistant</h3>
              <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>Ask health-related queries or summarize reports instantly using AI.</p>
            </div>
            <button 
              onClick={() => setChatMessages([{ sender: "ai", text: "Hello! I am MediLink AI Health Assistant. How can I assist you with your health or medical reports today?" }])}
              style={{ backgroundColor: "#334155", color: "#cbd5e1", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
              Clear Chat
            </button>
          </div>

          {/* Chat Messages Box */}
          <div style={{ flex: 1, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "75%", backgroundColor: msg.sender === "user" ? "#2563eb" : "#1e293b", color: "#fff", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", lineHeight: "1.4" }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "12px" }}>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a health question (e.g. What helps with a severe sore throat?)..."
              style={{ flex: 1, backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "12px", fontSize: "14px", outline: "none" }}
            />
            <button 
              type="submit"
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "0 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}