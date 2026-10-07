import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Doctor",
    age: "22",
    gender: "Female",
    bloodGroup: "O+",
    department: "General Consultation",
    symptoms: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (formData.role === "Doctor") {
      localStorage.setItem("doctorProfile", JSON.stringify(formData));
      localStorage.setItem("user", formData.email);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "doctor");
      navigate("/doctor-dashboard", { replace: true });
    } else {
      localStorage.setItem("patientProfile", JSON.stringify(formData));
      localStorage.setItem("userProfile", JSON.stringify(formData));
      localStorage.setItem("user", formData.email);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "patient");
      navigate("/patient-portal", { replace: true });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ backgroundColor: "#131b2e", padding: "40px", borderRadius: "16px", border: "1px solid #1e293b", width: "100%", maxWidth: "480px", boxShadow: "0 4px 25px rgba(0,0,0,0.5)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>MediLink AI</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Create your account</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Register As</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {formData.role === "Patient" && (
            <div>
              <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Phone Number</label>
              <input 
                type="text" 
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          {formData.role === "Patient" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Age</label>
                  <input 
                    type="text" 
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Blood Group</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Department</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}>
                  <option value="General Consultation">General Consultation</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Reported Symptoms</label>
                <textarea 
                  name="symptoms"
                  rows="3"
                  placeholder="Describe your symptoms..."
                  value={formData.symptoms}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box", fontSize: "14px" }}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "10px" }}>
            Create Account & Open Dashboard
          </button>

        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#94a3b8", fontSize: "14px" }}>Already have an account? </span>
          <Link to="/login" style={{ color: "#38bdf8", fontSize: "14px", textDecoration: "none", fontWeight: "bold" }}>Login</Link>
        </div>

      </div>
    </div>
  );
}