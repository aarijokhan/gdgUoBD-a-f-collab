"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Lock, Fingerprint } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // THE EXPLOIT (Logic preserved)
  useEffect(() => {
    console.log("%c ⚠️ DEBUG MODE ENABLED ", "background: #6366F1; color: white; padding: 4px; border-radius: 4px;");
    console.log("Loading user database...");
    console.table([
      { id: 1, user: "jdoe", role: "intern", pass: "password123" },
      { id: 2, user: "asmith", role: "trader", pass: "buyhighselllow" },
      { id: 3, user: "kwest", role: "compliance_officer", pass: "admin_secure_99" } 
    ]);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "kwest" && password === "admin_secure_99") {
      toast.success("Identity Verified", {
        description: "FLAG{CHECK_OPTIONS_VALUATION} - Access Granted",
      });
      setTimeout(() => router.push("/admin-panel/options"), 2000);
    } else {
      toast.error("Access Denied", { description: "Invalid credentials." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/20">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Fingerprint className="text-white w-10 h-10" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Secure Terminal Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4">Username</label>
            <input 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4">Password</label>
            <input 
              type="password"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl py-4 text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            <Lock size={20} /> Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}