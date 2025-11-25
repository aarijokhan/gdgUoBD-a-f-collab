"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Database, Server, ShieldAlert, Lock, Terminal, ArrowRight } from "lucide-react";

export default function SecretReportPage() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await fetch("/api/verify-flag", {
          method: "POST",
          body: JSON.stringify({ stage: "stage2", input: Number(answer) }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("LEDGER REBALANCED", { 
            description: (
                <div className="space-y-2 font-mono">
                    <p>DATABASE INTEGRITY RESTORED.</p>
                    <div className="bg-emerald-950/50 text-emerald-400 border border-emerald-900 p-3 rounded text-[10px]">
                        <span className="text-neutral-500">FLAG:</span> {data.flag}
                        <br/>
                        <span className="text-emerald-600 uppercase mt-1 block font-bold">
                            &gt;&gt; PROCEED TO LOGIN AS 'kwest'
                        </span>
                    </div>
                </div>
            ), 
            duration: Infinity,
            action: {
                label: "RETURN TO ROOT",
                onClick: () => window.location.href = "/login"
            }
          });
        } else {
          toast.error("RECONCILIATION FAILED", { 
            description: "ERR_CHECKSUM_MISMATCH: Variance incorrectly calculated." 
          });
        }
    } catch (err) {
        toast.error("SYSTEM ERROR");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-mono flex items-center justify-center p-6">
      
      {/* MAIN CARD CONTAINER - NEUTRAL DARK BACKGROUND */}
      <div className="max-w-3xl w-full border border-neutral-800 bg-[#050505] shadow-2xl relative overflow-hidden">
        
        {/* HEADER */}
        <div className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-amber-500">
                <Terminal size={16} />
                <span className="font-bold text-xs tracking-widest uppercase">Secure_Ledger_View // v2.4</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-rose-500 font-bold uppercase bg-rose-950/10 px-2 py-1 border border-rose-900/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Restricted Access
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-8 space-y-8">
            
            {/* THE PUZZLE: RAW JSON DUMP */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                        <Server size={12} /> SYSTEM_DUMP: GL_Q3_FINAL.json
                    </div>
                    <div className="text-[10px] text-neutral-600">SIZE: 4KB</div>
                </div>
                
                {/* The JSON Block - Pure Black Background */}
                <div className="bg-black border border-neutral-800 p-6 text-xs relative group font-mono shadow-inner">
                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
                    
                    <pre className="whitespace-pre-wrap text-neutral-400 leading-relaxed relative z-20">
{`{
  "meta": {
    "report_id": "AUDIT_CASE_882",
    "timestamp": "2025-11-24T14:30:00Z",
    "security_level": "L5_CLASSIFIED"
  },
  "ledger_data": {
    "fiscal_period": "Q3_2025",
    "currency": "BUX",
    "entries": {
      "total_assets":      500000.00,
      "total_liabilities": 200000.00,
      "shareholder_equity": 250000.00
    }
  },
  "integrity_check": {
    "checksum": "FAIL",
    "error_code": "BALANCE_SHEET_INEQUALITY",
    "message": "WOMP WOMP! Get your financials in order."
  }
}`}
                    </pre>
                    {/* Blinking cursor */}
                    <div className="absolute bottom-6 left-4 w-2 h-4 bg-amber-500/50 animate-pulse z-20"></div>
                </div>
            </div>

            {/* INPUT AREA */}
            <div className="border-t border-neutral-800 pt-6">
                <div className="flex items-start gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20">
                        <ShieldAlert className="text-amber-500" size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Manual Adjustment Required</h3>
                        <p className="text-xs text-neutral-500 mt-1 max-w-lg leading-relaxed">
                            Automatic reconciliation failed due to checksum error. 
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex items-center border border-neutral-700 bg-black p-1 gap-1">
                    <div className="px-4 py-3 bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                        INPUT_VARIANCE
                    </div>
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-3 text-neutral-600 font-bold">$</span>
                        <input 
                            type="number" 
                            autoFocus
                            placeholder="0.00" 
                            className="w-full bg-transparent pl-8 pr-4 py-2 text-white font-mono text-lg focus:outline-none placeholder:text-neutral-800"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        {isLoading ? "CALCULATING..." : <>COMMIT <ArrowRight size={12} /></>}
                    </button>
                </form>
            </div>

        </div>

        {/* FOOTER */}
        <div className="bg-neutral-900 p-2 text-center border-t border-neutral-800 flex justify-between px-6">
            <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono">
                <Database size={10} />
                HOST: AWS_US_EAST_1
            </div>
            <div className="flex items-center gap-2 text-[10px] text-neutral-600 font-mono">
                <Lock size={10} />
                TLS_1.3_ENCRYPTED
            </div>
        </div>

      </div>
    </div>
  );
}