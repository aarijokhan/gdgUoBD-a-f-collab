"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Terminal } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // THE EXPLOIT
  useEffect(() => {
    console.log("%c [SYSTEM] DEBUG MODE ACTIVE ", "background: #f59e0b; color: black; font-weight: bold;");
    console.table([
      { id: "USR_01", user: "jdoe", role: "INTERN", access: "READ_ONLY" },
      { id: "USR_02", user: "asmith", role: "TRADER", access: "EXECUTE" },
      { id: "USR_03", user: "kwest", role: "COMPLIANCE_OFFICER", pass: "admin_secure_99" } 
    ]);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "kwest" && password === "admin_secure_99") {
      toast.success("IDENTITY VERIFIED", { description: "FLAG{CHECK_OPTIONS_VALUATION}" });
      setTimeout(() => router.push("/admin-panel/options"), 1500);
    } else {
      toast.error("ACCESS DENIED", { description: "Invalid credentials." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-mono">
      <div className="w-full max-w-sm border border-neutral-800 bg-neutral-900 p-8">
        <div className="flex items-center gap-2 text-amber-500 mb-6 border-b border-neutral-800 pb-4">
          <Terminal size={20} />
          <span className="font-bold tracking-widest text-sm">TERMINAL ACCESS</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs text-neutral-500 uppercase">User ID</label>
            <input 
              className="w-full bg-black border border-neutral-700 p-2 text-sm text-white focus:border-amber-500 focus:outline-none rounded-none transition-colors"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-neutral-500 uppercase">Passkey</label>
            <input 
              type="password"
              className="w-full bg-black border border-neutral-700 p-2 text-sm text-white focus:border-amber-500 focus:outline-none rounded-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold text-xs uppercase py-3 tracking-widest">
            Authenticate
          </button>
        </form>
        <div className="mt-6 text-[10px] text-neutral-600 text-center">
          SECURE CONNECTION :: 256-BIT TLS
        </div>
      </div>
    </div>
  );
}