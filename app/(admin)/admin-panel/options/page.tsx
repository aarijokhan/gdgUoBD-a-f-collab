"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

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
      toast.success("Override Approved", { description: data.flag });
    } else {
      toast.error("Rejected", { description: "Price violates No-Arbitrage rules." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
        
        {/* Header Section */}
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-wider">
                <TrendingUp size={16} /> Valuation Tool
             </div>
             <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                Flagged
             </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Option Approval</h1>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Stock Price</p>
                <p className="text-2xl font-black text-slate-900">$150.00</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Strike Price</p>
                <p className="text-2xl font-black text-slate-900">$100.00</p>
             </div>
          </div>

          <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 flex gap-4 items-start">
             <AlertTriangle className="text-rose-500 shrink-0" />
             <div>
                <p className="font-bold text-rose-900 text-sm">Market Violation Detected</p>
                <p className="text-rose-700 text-xs mt-1">Current system price ($12.00) is below Intrinsic Floor.</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="text-xs font-bold text-slate-400 uppercase ml-2">Corrected Price</label>
               <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    max="15.00" // EXPLOIT
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3 pl-8 pr-4 font-bold text-xl text-slate-900 focus:border-indigo-500 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
               </div>
               <p className="text-[10px] text-slate-400 font-bold mt-2 text-right uppercase">Max Adjustment: $15.00</p>
            </div>
            <button className="w-full bg-slate-900 text-white font-bold rounded-2xl py-4 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
               <CheckCircle2 size={18} /> Approve Valuation
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}