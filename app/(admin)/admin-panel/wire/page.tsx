"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft, Globe, AlertTriangle, Send } from "lucide-react";
import confetti from "canvas-confetti"; // <--- IMPORT THIS

export default function WireTransferStage() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BITCOIN_PRICE_A = 40000;
  const BITCOIN_PRICE_B = 42000;
  
  // --- FIREWORKS LOGIC ---
  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Shoot from left
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      // Shoot from right
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-flag", {
        method: "POST",
        body: JSON.stringify({ stage: "stage5", input: Number(amount) }),
      });

      const data = await response.json();

      if (data.success) {
        // 1. TRIGGER FIREWORKS
        triggerFireworks();

        // 2. SHOW VICTORY TOAST
        toast.success("System Secured! You Win!", {
          description: data.flag, 
          duration: Infinity, 
          action: { label: "Copy Flag", onClick: () => navigator.clipboard.writeText(data.flag) },
        });
      } else {
        toast.error("Transfer Failed", { description: data.message || "Compliance checks failed." });
      }
    } catch (err) {
      toast.error("System Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COL: MARKET DATA */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl">
           <div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider mb-6">
                 <Globe size={20} /> Global Markets
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Arbitrage<br/>Opportunity</h1>
              <p className="text-slate-500 font-medium mt-4 leading-relaxed">
                Live spreads detected between international exchanges. 
                Immediate capital allocation required to capture spread.
              </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">Exchange A (Buy)</div>
                 <div className="text-3xl font-black text-slate-900">${BITCOIN_PRICE_A.toLocaleString()}</div>
                 <div className="text-emerald-600 text-xs font-bold mt-2">Available Volume: High</div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">Exchange B (Sell)</div>
                 <div className="text-3xl font-black text-indigo-600">${BITCOIN_PRICE_B.toLocaleString()}</div>
                 <div className="text-indigo-600 text-xs font-bold mt-2">+5.0% Spread</div>
              </div>
           </div>
        </div>

        {/* RIGHT COL: ACTION FORM */}
        <div className="lg:col-span-5 bg-[#4F46E5] rounded-[2.5rem] p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-900/50">
           <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

           <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-wider mb-8">
                 <ArrowRightLeft size={20} /> Swift Wire
              </div>
              
              <form onSubmit={handleTransfer} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-indigo-200 uppercase ml-2">Transfer Amount</label>
                    <div className="relative">
                       <span className="absolute left-6 top-5 text-indigo-300 font-bold text-xl">$</span>
                       <input 
                          type="number" 
                          className="w-full bg-black/20 border-2 border-indigo-400/30 rounded-3xl px-6 py-5 pl-10 font-bold text-3xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 transition-all"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          max={100000} // EXPLOIT
                       />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-full w-fit mx-auto">
                       <AlertTriangle size={12} />
                       SYSTEM LIMIT: $100,000
                    </div>
                 </div>
                 
                 <div className="pt-4">
                    <div className="flex justify-between text-sm font-bold text-indigo-200 mb-4 px-2">
                       <span>Available Capital</span>
                       <span>$500,000.00</span>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-indigo-600 font-black rounded-2xl py-5 text-lg shadow-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                       {isLoading ? "Processing..." : <><Send size={20} /> Execute Wire</>}
                    </button>
                 </div>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}