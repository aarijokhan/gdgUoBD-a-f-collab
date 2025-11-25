"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft, Globe, AlertTriangle, Send, Activity } from "lucide-react";
import confetti from "canvas-confetti";

export default function WireTransferStage() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BITCOIN_PRICE_A = 40000;
  const BITCOIN_PRICE_B = 42000;
  
  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
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
        triggerFireworks();
        toast.success("SYSTEM SECURED", {
          description: data.flag, 
          duration: Infinity, 
          action: { label: "COPY FLAG", onClick: () => navigator.clipboard.writeText(data.flag) },
        });
      } else {
        toast.error("TRANSFER FAILED", { description: data.message || "Compliance checks failed." });
      }
    } catch (err) {
      toast.error("SYSTEM ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-300 font-mono p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 border border-neutral-800 bg-[#050505]">
        
        {/* LEFT: MARKET DATA */}
        <div className="p-8 border-r border-neutral-800 flex flex-col">
           <div className="flex items-center gap-2 text-amber-500 font-bold text-xs tracking-widest mb-8">
              <Globe size={16} /> GLOBAL_LIQUIDITY_POOLS
           </div>

           <div className="space-y-6 flex-1">
              <div>
                <h1 className="text-3xl text-white font-bold mb-2">ARBITRAGE OPPORTUNITY</h1>
                <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
                  Price dislocation detected between Asian and European order books. 
                  Immediate capital allocation required to capture spread.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-px bg-neutral-800 border border-neutral-800">
                 <div className="bg-black p-4 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Exchange A (Buy)</div>
                        <div className="text-2xl text-white font-bold">${BITCOIN_PRICE_A.toLocaleString()}</div>
                    </div>
                    <div className="text-green-600 text-[10px] font-bold bg-green-900/20 px-2 py-1">LIQUIDITY: HIGH</div>
                 </div>
                 
                 <div className="bg-black p-4 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Exchange B (Sell)</div>
                        <div className="text-2xl text-amber-500 font-bold">${BITCOIN_PRICE_B.toLocaleString()}</div>
                    </div>
                    <div className="text-amber-500 text-[10px] font-bold">+5.0% SPREAD</div>
                 </div>
              </div>
           </div>
           
           <div className="mt-auto pt-8 flex items-center gap-2 text-[10px] text-neutral-600">
              <Activity size={12} className="animate-pulse"/> LIVE FEED ACTIVE
           </div>
        </div>

        {/* RIGHT: EXECUTION FORM */}
        <div className="p-8 bg-neutral-900 flex flex-col justify-center">
           <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs tracking-widest mb-8">
              <ArrowRightLeft size={16} /> SWIFT_WIRE_PROTOCOL
           </div>

           <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between">
                    <label className="text-xs font-bold text-white uppercase">Transfer Amount</label>
                    <span className="text-[10px] text-neutral-500">BAL: $500,000.00</span>
                 </div>
                 
                 <div className="relative">
                    <span className="absolute left-4 top-4 text-neutral-500 font-bold text-lg">$</span>
                    <input 
                       type="number" 
                       className="w-full bg-black border border-neutral-700 p-4 pl-8 text-xl font-bold text-white focus:border-amber-500 focus:outline-none placeholder:text-neutral-800 transition-colors"
                       placeholder="0"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       max={100000} // <--- THE EXPLOIT IS HERE
                    />
                 </div>
                 
                 <div className="flex items-center gap-2 text-[10px] text-amber-600 font-bold bg-amber-900/10 p-2 border border-amber-900/20">
                    <AlertTriangle size={12} />
                    WARNING: SYSTEM LIMIT $100,000 PER TRANSACTION
                 </div>
              </div>
              {/* COMEDIC COMPLIANCE CHECKLIST */}
            <div className="space-y-2 bg-neutral-950 border border-neutral-800 p-3 rounded-lg mb-4">
               <div className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest border-b border-neutral-800 pb-1 mb-2">
                  Automated Compliance Checks
               </div>
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-400">KYC (Know Your Customer)</span>
                  <span className="text-emerald-600 font-bold">SKIPPED (VIP)</span>
               </div>
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-400">AML (Money Laundering)</span>
                  <span className="text-amber-600 font-bold">VERY LIKELY</span>
               </div>
               <div className="flex justify-between items-center text-[10px]">
                  <span className="text-neutral-400">Tax Haven Routing</span>
                  <span className="text-emerald-600 font-bold">OPTIMIZED (Cayman Is.)</span>
               </div>
            </div>
              
              <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
              >
                 {isLoading ? "PROCESSING..." : <><Send size={14} /> EXECUTE WIRE</>}
              </button>
           </form>
        </div>

      </div>
    </div>
  );
}