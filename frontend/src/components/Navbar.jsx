import React from 'react';
import { Activity, LogOut, User, ShieldAlert, Calendar } from 'lucide-react';

export default function Navbar({ userRole, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-sky-500 p-2 rounded-xl shadow-lg shadow-sky-500/30">
          <Activity className="h-6 w-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            MediLink AI
          </h1>
          <p className="text-xs text-slate-400 font-medium">Healthcare Management System</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="capitalize text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-sky-400 border border-sky-500/20 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Role: {userRole || 'Guest'}
        </span>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </nav>
  );
}