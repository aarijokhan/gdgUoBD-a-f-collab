"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Shield, Play, Cpu, Activity } from "lucide-react";

export default function LandingPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);

  // SIMULATED BOOT SEQUENCE
  useEffect(() => {
    const sequence = [
      "INITIALIZING_KERNEL...",
      "LOADING_MODULES: [FINANCE_ENGINE, CRYPTO_BRIDGE, AUTH_LAYER]...",
      "CONNECTING TO EXCHANGE GATEWAY (PORT 443)...",
      "ESTABLISHING SECURE HANDSHAKE...",
      "WARNING: INTRUSION DETECTION SYSTEMS ACTIVE.",
      "SYSTEM_READY.",
      "AWAITING_INPUT..."
    ];

    let delay = 0;
    sequence.forEach((line, index) => {
      delay += Math.random() * 300 + 200;
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${line}`]);
        if (index === sequence.length - 1) setBooted(true);
      }, delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-mono flex flex-col p-6 relative overflow-hidden">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20 pointer-events-none"></div>

      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-neutral-800 pb-4 relative z-10">
        <div className="flex items-center gap-2 text-amber-500">
          <Terminal size={20} />
          <span className="font-bold tracking-widest text-sm">UNITRADE_OS v2.4</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${booted ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>SERVER_STATUS: {booted ? 'ONLINE' : 'BOOTING'}</span>
          </div>
          <span>LATENCY: 24ms</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 mt-10">
        
        <div className="w-full max-w-3xl space-y-12">
          
          {/* TITLE BLOCK */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-[10px] text-amber-500 uppercase tracking-widest mb-4">
              <Shield size={12} /> A&F Society x GDGoC Collab
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
              FINTECH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">CTF</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Financial Forensics & Security Challenge. <br/>
              Combine <span className="text-white font-bold">Financial Analysis</span> with <span className="text-white font-bold">System Exploitation</span> to recover 5 hidden flags.
            </p>
          </div>

          {/* ACTION AREA - CENTERED SINGLE BUTTON */}
          <div className={`flex justify-center transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* START BUTTON */}
            <Link href="/dashboard" className="group relative block w-full max-w-md">
              <div className="absolute inset-0 bg-amber-600 blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-neutral-900 border border-neutral-800 p-8 hover:border-amber-500 transition-colors group-hover:bg-black text-center">
                <div className="flex justify-center mb-6">
                  <Play className="text-amber-500 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">INITIALIZE SESSION</h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Launch the trading terminal to begin Stage 1.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider border border-amber-900/30 px-4 py-2 bg-amber-900/10 rounded">
                  Launch Terminal <Activity size={12} />
                </div>
              </div>
            </Link>

          </div>

          {/* SYSTEM LOG (Decorative) */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="text-[10px] font-bold text-neutral-600 mb-2 uppercase flex items-center gap-2">
              <Cpu size={10} /> System Kernel Log
            </div>
            <div className="h-32 overflow-hidden relative font-mono text-xs">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={`${i === logs.length - 1 ? 'text-green-500 animate-pulse' : 'text-neutral-600'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 pt-4 flex justify-between text-[10px] text-neutral-600 uppercase tracking-widest">
        <div>Secure Connection</div>
        <div>ID: GUEST_USER_772</div>
      </footer>
    </div>
  );
}