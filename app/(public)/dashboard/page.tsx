"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bell, Lock, Activity, ArrowDownRight, Terminal, AlertTriangle, Zap } from "lucide-react";

// --- COMPONENTS ---
const StatPanel = ({ label, value, sub, highlight = false }: any) => (
  <div className={`p-4 border border-neutral-800 ${highlight ? 'bg-neutral-900' : 'bg-black'}`}>
    <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{label}</div>
    <div className={`text-2xl font-mono font-medium ${highlight ? 'text-amber-500' : 'text-white'}`}>{value}</div>
    <div className="text-[10px] text-neutral-400 mt-1">{sub}</div>
  </div>
);

const SystemLog = ({ time, msg, type }: any) => (
  <div className="flex gap-2 text-[10px] font-mono py-0.5 border-b border-neutral-800/50 last:border-0">
    <span className="text-neutral-600">[{time}]</span>
    <span className={type === 'ERR' ? 'text-rose-500' : 'text-amber-500'}>{type} ::</span>
    <span className="text-neutral-400">{msg}</span>
  </div>
);

export default function DashboardPage() {
  const [shares, setShares] = useState("");
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  
  // CTF CONSTANTS
  const STOCK_PRICE = 50.00;
  const TARGET_PROFIT = 2500;

  // MANUAL DOM LOCK (React Bypass)
  useEffect(() => {
    if (buyButtonRef.current) {
      buyButtonRef.current.setAttribute("disabled", "true");
    }
  }, []);

  const handleBuy = async () => {
    const response = await fetch("/api/verify-flag", {
      method: "POST",
      body: JSON.stringify({ stage: "stage1", input: shares }),
    });
    const data = await response.json();

    if (data.success) {
      toast.success("ALGO EXECUTION RESUMED", { 
        description: data.flag,
        action: { label: "COPY FLAG", onClick: () => navigator.clipboard.writeText(data.flag) }
      });
    } else {
      toast.error("EXECUTION REJECTED", { description: "Volume mismatch. Strategy requirements not met." });
    }
  };

  // Dynamic Math for Visual Feedback
  const currentVal = Number(shares) * STOCK_PRICE;
  const isTargetMet = currentVal === TARGET_PROFIT;

  return (
    <div className="min-h-screen bg-black text-neutral-300 font-sans flex flex-col">
      {/* HEADER */}
      <header className="h-12 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4 shrink-0">
        <div className="font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500"></div> UNITRADE <span className="text-neutral-600">PRO</span>
        </div>
        <div className="flex gap-4 text-xs font-mono text-neutral-400">
          <span>BTC: 42,105</span>
          <span>ETH: 2,240</span>
          <span className="text-green-500">MARKET OPEN</span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
        
        {/* COL 1: MARKET DATA */}
        <div className="bg-black p-6 col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">ACME CORP</h1>
              <div className="text-xs font-mono text-neutral-500">NASDAQ: ACM • REAL-TIME</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono text-white">${STOCK_PRICE.toFixed(2)}</div>
              <div className="text-sm font-mono text-red-500 flex justify-end items-center gap-1">
                <ArrowDownRight size={14}/> -0.39%
              </div>
            </div>
          </div>

          {/* STRATEGY HEADER (New Enhancement) */}
          <div className="flex items-center gap-4 mb-4 border-b border-neutral-800 pb-4">
             <div className="bg-amber-900/20 text-amber-500 border border-amber-900/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} /> Active Strategy: Yield_Master_V2
             </div>
             <div className="text-[10px] text-rose-500 font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle size={10} /> EXECUTION PAUSED
             </div>
          </div>

          {/* DATA GRID */}
          <div className="grid grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-px">
            <StatPanel label="Target Profit" value={`$${TARGET_PROFIT}`} sub="REQUIRED YIELD" highlight={true} />
            <StatPanel label="Market Cap" value="42.5B" sub="LARGE CAP" />
            <StatPanel label="Vol (24h)" value="1.2M" sub="AVG 900K" />
            <StatPanel label="P/E Ratio" value="33.49" sub="TTM" />
            <StatPanel label="EPS" value="1.42" sub="EST" />
            <StatPanel label="Beta" value="1.12" sub="VOLATILITY" />
          </div>

          {/* SYSTEM LOGS (New Enhancement) */}
          <div className="mt-auto pt-6">
             <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Terminal size={12} /> System Event Log
             </div>
             <div className="bg-neutral-900/50 border border-neutral-800 p-3 h-32 overflow-y-auto font-mono">
                <SystemLog time="10:42:01" type="INFO" msg="Session initialized. Coffee levels: CRITICAL." />
               <SystemLog time="10:42:05" type="INFO" msg={`Strategy loaded: Target Profit $${TARGET_PROFIT}.`} />
               <SystemLog time="10:42:06" type="WARN" msg="Market sentiment analysis: 'WE MIGHT BE COOKED'." />
               <SystemLog time="10:42:08" type="ERR" msg="Auto-Execution Failed. Reason: Some traders just want to watch the world burn." />
               <SystemLog time="10:42:09" type="WARN" msg="Switching to MANUAL OVERRIDE. This little maneuver's gonna cost us 51 years." />
               <SystemLog time="10:42:10" type="ERR" msg="Safety Lock engaged. Please do not smash keyboard." />
             </div>
          </div>
        </div>


        {/* COL 2: TRADE EXECUTION */}
        <div className="bg-neutral-900 p-6 flex flex-col justify-between border-l border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs tracking-widest mb-6 uppercase">
              <Lock size={14}/> Manual Override
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-neutral-500 mb-1">Action</label>
                <div className="grid grid-cols-2 gap-px bg-neutral-800">
                  <button className="bg-green-900/20 text-green-500 py-2 text-xs font-bold border border-green-900/50">BUY</button>
                  <button className="bg-black text-neutral-600 py-2 text-xs font-bold border border-neutral-800">SELL</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-neutral-500 mb-1">Volume (Shares)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full bg-black border border-neutral-700 p-3 font-mono text-white focus:border-amber-500 focus:outline-none text-right"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-neutral-500">PRICE</span>
                  <span>${STOCK_PRICE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono items-center">
                  <span className="text-neutral-500">PROJECTED VAL</span>
                  <div className="text-right">
                     <div className={`font-bold ${isTargetMet ? 'text-emerald-500' : 'text-amber-500'}`}>
                        ${currentVal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                     </div>
                     {isTargetMet && (
                        <div className="text-[9px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                           <Zap size={8} /> TARGET MATCHED
                        </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            ref={buyButtonRef} // THE EXPLOIT
            onClick={handleBuy}
            className="w-full bg-neutral-800 text-neutral-500 font-bold text-xs py-4 uppercase tracking-widest border border-neutral-700 hover:bg-amber-600 hover:text-black hover:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            <Lock size={14}/> Submit Order
          </button>
        </div>

      </main>
    </div>
  );
}