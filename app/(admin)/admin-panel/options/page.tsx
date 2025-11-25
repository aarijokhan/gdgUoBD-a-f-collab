"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, AlertTriangle, Lock, Terminal, ShieldAlert } from "lucide-react";

export default function OptionsStage() {
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/verify-flag", {
      method: "POST",
      body: JSON.stringify({ stage: "stage4", input: Number(price) }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success("VALUATION OVERRIDE APPROVED", { description: data.flag });
    } else {
      toast.error("REJECTED", { description: "Price violates No-Arbitrage rules." });
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border border-neutral-800 bg-[#050505]">
        
        {/* Header */}
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Terminal size={16} />
            <span className="font-bold text-xs tracking-widest">OPTION_PRICING_MODEL_V4</span>
          </div>
          <div className="text-[10px] text-neutral-500">SECURE_NODE_77</div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Asset Data Grid */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2">Underlying Asset</h3>
            <div className="grid grid-cols-4 border border-neutral-800 bg-black text-sm">
              <div className="p-3 border-r border-neutral-800">
                <div className="text-[10px] text-neutral-500 mb-1">TICKER</div>
                <div className="font-bold text-white">GGL</div>
              </div>
              <div className="p-3 border-r border-neutral-800">
                <div className="text-[10px] text-neutral-500 mb-1">SPOT PRICE</div>
                <div className="font-bold text-white">$150.00</div>
              </div>
              <div className="p-3 border-r border-neutral-800">
                <div className="text-[10px] text-neutral-500 mb-1">STRIKE</div>
                <div className="font-bold text-amber-500">$100.00</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-neutral-500 mb-1">TYPE</div>
                <div className="font-bold text-white">CALL</div>
              </div>
            </div>
          </div>

          {/* Alert Box */}
          <div className="bg-red-950/10 border border-red-900/30 p-4 flex gap-4 items-start">
             <ShieldAlert className="text-red-600 shrink-0" size={20} />
             <div>
                <p className="font-bold text-red-500 text-xs tracking-wider mb-1">ARBITRAGE VIOLATION DETECTED</p>
                <p className="text-red-400/60 text-xs leading-relaxed">
                  System Price ($12.00) is below Intrinsic Floor ($50.00). <br/>
                  Manual override required to prevent free-money exploit.
                </p>
             </div>
          </div>

          {/* COMEDIC RISK METRICS */}
<div className="grid grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-6">
    <div className="bg-black p-3 text-center">
        <div className="text-[9px] text-neutral-500 uppercase">Implied Volatility</div>
        <div className="text-amber-500 font-mono text-xs">COOKED</div>
    </div>
    <div className="bg-black p-3 text-center">
        <div className="text-[9px] text-neutral-500 uppercase">Theta (Decay)</div>
        <div className="text-rose-500 font-mono text-xs">I DONT EVEN KNOW WHAT THIS MEANS</div>
    </div>
    <div className="bg-black p-3 text-center">
        <div className="text-[9px] text-neutral-500 uppercase">Analyst Rating</div>
        <div className="text-white font-mono text-xs">TRUST ME BRO</div>
    </div>
</div>

          {/* Override Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-neutral-800 pt-6">
            <div>
               <div className="flex justify-between mb-2">
                 <label className="text-xs font-bold text-white uppercase">Manual Valuation Input</label>
                 <span className="text-[10px] text-red-500 font-bold">SYSTEM LOCK: MAX $15.00</span>
               </div>
               
               <div className="relative group">
                  <span className="absolute left-4 top-3 text-neutral-500 font-mono">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    max="15.00" // <--- THE EXPLOIT IS HERE
                    className="w-full bg-black border border-neutral-700 p-3 pl-8 text-white font-mono focus:border-amber-500 focus:outline-none transition-colors placeholder:text-neutral-800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
               </div>
            </div>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs py-4 uppercase tracking-widest flex items-center justify-center gap-2">
               <Lock size={14} /> Authorize Correction
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}