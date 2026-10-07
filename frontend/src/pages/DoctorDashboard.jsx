import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("appointments");

  const [doctorName, setDoctorName] = useState("Dr. Rajesh Sharma");
  const [doctorEmail, setDoctorEmail] = useState("dr.rajesh@medilink.ai");
  const [patientQueue, setPatientQueue] = useState([]);
  const [issuedPrescriptions, setIssuedPrescriptions] = useState([]);

  // Doctor Leave & Availability State
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("Available");
  const [leaveReason, setLeaveReason] = useState("");
  const [savedLeave, setSavedLeave] = useState(null);

  useEffect(() => {
    // 1. Load Doctor Details
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) {
      const formattedName = storedName.toLowerCase().startsWith("dr") 
        ? storedName 
        : `Dr. ${storedName}`;
      setDoctorName(formattedName);
    }
    if (storedEmail) {
      setDoctorEmail(storedEmail);
    }

    // 2. Load Leave Settings from localStorage
    const storedLeave = localStorage.getItem("doctorLeaveSettings");
    if (storedLeave) {
      const parsedLeave = JSON.parse(storedLeave);
      setSavedLeave(parsedLeave);
      setAvailabilityStatus(parsedLeave.status || "Available");
    }

    // 3. Load Appointments / Patient Queue from localStorage
    const savedAppointments = localStorage.getItem("patientAppointments");
    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments);
      setPatientQueue(parsed.filter(p => p.status !== "Cancelled"));
    } else {
      const initialAppointments = [
        {
          id: 1,
          name: "Rahul Verma",
          age: 30,
          gender: "Male",
          bloodGroup: "A+",
          date: "2026-11-05",
          time: "09:00 AM - 09:30 AM",
          type: "Video Call",
          phone: "1234567890",
          symptoms: "cough, sore throat",
          reportName: "Clinical Summary Patient.pdf",
          reportUrl: "http://localhost:8000/uploads/Clinical Summary Patient.pdf",
          status: "Confirmed"
        }
      ];
      setPatientQueue(initialAppointments);
      localStorage.setItem("patientAppointments", JSON.stringify(initialAppointments));
    }

    // 4. Load Issued Prescriptions
    const savedRx = localStorage.getItem("patientPrescriptions");
    if (savedRx) {
      setIssuedPrescriptions(JSON.parse(savedRx));
    }
  }, []);

  const updateAppointmentsInStorage = (updatedQueue) => {
    setPatientQueue(updatedQueue);
    localStorage.setItem("patientAppointments", JSON.stringify(updatedQueue));
  };

  const handleSaveLeaveSettings = (e) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) {
      alert("Please select both start and end dates for your leave.");
      return;
    }

    const leaveData = {
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      status: availabilityStatus,
      reason: leaveReason || "Scheduled Leave"
    };

    localStorage.setItem("doctorLeaveSettings", JSON.stringify(leaveData));
    setSavedLeave(leaveData);
    alert("Leave period and availability updated successfully!");
  };

  const handleClearLeave = () => {
    localStorage.removeItem("doctorLeaveSettings");
    setSavedLeave(null);
    setLeaveStartDate("");
    setLeaveEndDate("");
    setLeaveReason("");
    setAvailabilityStatus("Available");
    alert("Leave settings cleared. You are now marked as Available.");
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleOpenReport = (reportUrl) => {
    window.open(reportUrl, "_blank", "noopener,noreferrer");
  };

  const handleApproveVisit = (id) => {
    const updated = patientQueue.map(p => p.id === id ? { ...p, status: "Approved & Active" } : p);
    updateAppointmentsInStorage(updated);
    alert("Appointment successfully approved!");
  };

  const handleCancelAppointment = (id) => {
    const updated = patientQueue.filter(p => p.id !== id);
    updateAppointmentsInStorage(updated);
    alert("Appointment cancelled and removed permanently from queue.");
  };

  const handleDeletePrescription = (id) => {
    const updatedRx = issuedPrescriptions.filter(rx => rx.id !== id);
    setIssuedPrescriptions(updatedRx);
    localStorage.setItem("patientPrescriptions", JSON.stringify(updatedRx));
    alert("Prescription record removed successfully.");
  };

  // Computed Metrics
  const totalAppointmentsCount = patientQueue.length;
  const videoCallCount = patientQueue.filter(p => p.type && p.type.toLowerCase().includes("video")).length;
  const inPersonCount = patientQueue.filter(p => p.type && p.type.toLowerCase().includes("in-person")).length;

  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");

  const handleOpenPrescription = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionText(`Patient: ${patient.name}\nDiagnosis: Upper Respiratory Tract Infection\nRx:\n1. Paracetamol 650mg - 1 tab twice a day for 5 days\n2. Cough Syrup - 10ml thrice a day`);
    setPrescriptionModal(true);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("patientPrescriptions") || "[]");
    const newRx = {
      id: Date.now(),
      patientName: selectedPatient.name,
      doctorName: doctorName,
      date: new Date().toISOString().split("T")[0],
      details: prescriptionText
    };
    const updatedList = [...existing, newRx];
    localStorage.setItem("patientPrescriptions", JSON.stringify(updatedList));
    setIssuedPrescriptions(updatedList);

    alert(`Prescription saved and sent successfully for ${selectedPatient.name}!`);
    setPrescriptionModal(false);
    setSelectedPatient(null);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#fff", fontFamily: "Segoe UI, sans-serif", padding: "20px" }}>
      
      {/* Top Header Bar */}
      <div style={{ backgroundColor: "#131b2e", padding: "20px 30px", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>
            {doctorName.charAt(0) === 'D' && doctorName.charAt(3) ? doctorName.charAt(3) : doctorName.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>MediLink AI — Doctor Portal</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#38bdf8" }}>
              {doctorName} | General Consultation | <span style={{ color: availabilityStatus === "Available" ? "#22c55e" : "#ef4444" }}>● {availabilityStatus}</span>
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
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button 
          onClick={() => setActiveTab("appointments")}
          style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "appointments" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          Appointments & Patient Reports
        </button>
        <button 
          onClick={() => setActiveTab("records")}
          style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "records" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          Patient Records & EHR
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          style={{ padding: "12px 24px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "settings" ? "#2563eb" : "#131b2e", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
          Doctor Profile & Leave Settings
        </button>
      </div>

      {/* Tab 1: Appointments & Patient Reports */}
      {activeTab === "appointments" && (
        <div>
          {/* Metric Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ backgroundColor: "#131b2e", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Total Active Appointments</p>
              <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#38bdf8" }}>{totalAppointmentsCount}</h3>
            </div>
            <div style={{ backgroundColor: "#131b2e", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Video Call (VC) Consultations</p>
              <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#22c55e" }}>{videoCallCount}</h3>
            </div>
            <div style={{ backgroundColor: "#131b2e", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>In-Person Consultations</p>
              <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#f59e0b" }}>{inPersonCount}</h3>
            </div>
          </div>

          <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "20px" }}>Live Patient Queue & Attached Medical Reports</h3>
            
            {patientQueue.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No active appointments found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {patientQueue.map((patient) => (
                  <div key={patient.id} style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", color: "#38bdf8" }}>
                        {patient.name} <span style={{ fontSize: "13px", color: "#94a3b8" }}>({patient.gender}, {patient.age} yrs • Blood Group: {patient.bloodGroup})</span>
                      </h4>
                      <span style={{ backgroundColor: "#1e293b", color: patient.status.includes("Approved") ? "#22c55e" : "#f59e0b", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                        {patient.status}
                      </span>
                    </div>

                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#cbd5e1" }}>
                      <strong>Date:</strong> {patient.date} | <strong>Time:</strong> {patient.time} | <strong>Type:</strong> {patient.type} | <strong>Phone:</strong> {patient.phone}
                    </p>

                    <p style={{ margin: "8px 0 14px 0", fontSize: "13px", color: "#fca5a5" }}>
                      <strong>Reported Symptoms:</strong> {patient.symptoms}
                    </p>

                    {/* Report Link */}
                    {patient.reportName && (
                      <div style={{ backgroundColor: "#1e293b", padding: "10px 14px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>📎</span>
                          <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Patient Attached Medical Report:</span>
                          <button 
                            onClick={() => handleOpenReport(patient.reportUrl)}
                            style={{ background: "none", border: "none", color: "#38bdf8", textDecoration: "underline", cursor: "pointer", fontSize: "13px", fontWeight: "bold", padding: 0 }}>
                            {patient.reportName}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={() => handleApproveVisit(patient.id)}
                        style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                        Approve Visit
                      </button>
                      <button 
                        onClick={() => handleOpenPrescription(patient)}
                        style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                        Write Prescription
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(patient.id)}
                        style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Patient Records & EHR */}
      {activeTab === "records" && (
        <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "16px" }}>Issued Prescriptions & EHR History</h3>
          {issuedPrescriptions.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No prescriptions issued yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {issuedPrescriptions.map((rx) => (
                <div key={rx.id} style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong style={{ color: "#38bdf8" }}>Patient: {rx.patientName}</strong>
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>{rx.date}</span>
                  </div>
                  <pre style={{ margin: "0 0 12px 0", color: "#cbd5e1", fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: "13px" }}>{rx.details}</pre>
                  <button 
                    onClick={() => handleDeletePrescription(rx.id)}
                    style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                    Delete Record
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Doctor Profile & Leave Settings */}
      {activeTab === "settings" && (
        <div style={{ backgroundColor: "#131b2e", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b", maxWidth: "600px" }}>
          <h3 style={{ marginTop: 0, color: "#f8fafc", marginBottom: "6px" }}>Doctor Profile & Leave Settings</h3>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>Logged in as: {doctorEmail}</p>

          {savedLeave && (
            <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#38bdf8", fontSize: "14px" }}>Current Leave Status: Active</h4>
              <p style={{ margin: "4px 0", fontSize: "13px", color: "#cbd5e1" }}><strong>From:</strong> {savedLeave.startDate} | <strong>To:</strong> {savedLeave.endDate}</p>
              <p style={{ margin: "4px 0", fontSize: "13px", color: "#cbd5e1" }}><strong>Status:</strong> {savedLeave.status} ({savedLeave.reason})</p>
              <button 
                onClick={handleClearLeave}
                style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
                Cancel Leave / Set Available
              </button>
            </div>
          )}

          <form onSubmit={handleSaveLeaveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Leave Start Date</label>
                <input 
                  type="date" 
                  value={leaveStartDate} 
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Leave End Date</label>
                <input 
                  type="date" 
                  value={leaveEndDate} 
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Availability Status during Leave</label>
              <select 
                value={availabilityStatus} 
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none" }}>
                <option value="On Leave">On Leave (Unavailable for bookings)</option>
                <option value="Available">Available</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Reason for Leave (Optional)</label>
              <input 
                type="text" 
                value={leaveReason} 
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Conference, Personal, Vacation..."
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px", marginTop: "10px" }}>
              Save Leave Period & Status
            </button>
          </form>
        </div>
      )}

      {/* Prescription Modal */}
      {prescriptionModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#131b2e", border: "1px solid #334155", borderRadius: "12px", padding: "30px", width: "100%", maxWidth: "500px" }}>
            <h3 style={{ marginTop: 0, color: "#38bdf8" }}>Write Prescription for {selectedPatient?.name}</h3>
            
            <form onSubmit={handleSavePrescription}>
              <textarea 
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                rows="8"
                style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "20px", fontFamily: "monospace" }}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button 
                  type="button"
                  onClick={() => setPrescriptionModal(false)}
                  style={{ backgroundColor: "#475569", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                  Save & Send Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}