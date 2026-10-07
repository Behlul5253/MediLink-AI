import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    localStorage.setItem("user", email);
    localStorage.setItem("isAuthenticated", "true");

    const emailLower = email.trim().toLowerCase();
    if (emailLower.includes("dr") || emailLower.includes("doctor")) {
      localStorage.setItem("role", "doctor");
      navigate("/doctor-dashboard", { replace: true });
    } else {
      localStorage.setItem("role", "patient");
      navigate("/patient-portal", { replace: true });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0f19", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ backgroundColor: "#131b2e", padding: "40px", borderRadius: "16px", border: "1px solid #1e293b", width: "100%", maxWidth: "440px", boxShadow: "0 4px 25px rgba(0,0,0,0.5)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "#3b82f6", fontSize: "26px", fontWeight: "bold", margin: "0 0 8px 0" }}>MediLink AI</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Sign in to access your Patient or Doctor Portal</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button 
            type="button" 
            onClick={handleLoginClick}
            style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "10px" }}>
            Sign In
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span style={{ color: "#94a3b8", fontSize: "14px" }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: "#38bdf8", fontSize: "14px", textDecoration: "none", fontWeight: "bold" }}>Sign up here</Link>
        </div>

      </div>
    </div>
  );
}