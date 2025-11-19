"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ShieldAlert, FileText, Calculator, Lock } from "lucide-react";

export default function SecretReportPage() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
        // Verify against the API Brain
        const response = await fetch("/api/verify-flag", {
          method: "POST",
          body: JSON.stringify({ stage: "stage2", input: Number(answer) }),
        });

        const data = await response.json();

        if (data.success) {
          // SUCCESS: They found the $50,000 error
          toast.success("AUDIT RESOLVED", { 
            description: (
                <div className="space-y-2">
                    <p>Discrepancy identified. Access Level Upgraded.</p>
                    <div className="bg-green-900/20 text-green-800 border border-green-900/20 p-3 rounded font-mono text-xs">
                        {data.flag}
                        <br/>
                        <span className="text-[10px] opacity-70 uppercase mt-1 block">
                            Hint: Use this user for Stage 3
                        </span>
                    </div>
                </div>
            ), 
            duration: Infinity,
            action: {
                label: "Proceed to Login",
                onClick: () => window.location.href = "/login"
            }
          });
        } else {
          // FAILURE
          toast.error("Calculation Error", { 
            description: "The variance does not balance the Accounting Equation (Assets = Liab + Equity)." 
          });
        }
    } catch (err) {
        toast.error("System Error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans text-slate-900">
      
      <div className="max-w-3xl w-full space-y-6">
        
        {/* SECURITY BANNER */}
        <div className="bg-rose-600 text-white px-6 py-3 rounded-t-xl flex items-center justify-between shadow-lg shadow-rose-600/20">
            <div className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                <ShieldAlert size={18} />
                Classified: Internal Audit Only
            </div>
            <div className="text-[10px] font-mono opacity-80 bg-rose-700 px-2 py-1 rounded">
                REF: AUDIT-2025-X
            </div>
        </div>

        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* HEADER */}
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <FileText className="text-slate-400"/> Q3 Balance Sheet Discrepancy
                        </h1>
                        <p className="text-slate-500 max-w-lg">
                            Automated systems flagged a variance in the general ledger. 
                            Manual reconciliation required to proceed with quarterly filing.
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Audit Status</div>
                        <div className="text-rose-600 font-bold flex items-center justify-end gap-1">
                            <AlertTriangle size={16} /> UNRESOLVED
                        </div>
                    </div>
                </div>
            </div>

            {/* REPORT CONTENT */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT: THE DATA */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">General Ledger Summary</h3>
                        
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                <span className="font-bold text-slate-700">Total Assets</span>
                                <span className="font-bold text-blue-600">$500,000.00</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Total Liabilities</span>
                                <span>$200,000.00</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Shareholder Equity</span>
                                <span>$250,000.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 italic">
                        * Standard Accounting Equation: Assets = Liabilities + Equity
                    </div>
                </div>

                {/* RIGHT: THE TASK */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Calculator size={16} className="text-blue-600"/>
                            Calculate Unaccounted Variance
                        </label>
                        <p className="text-xs text-slate-500">
                            Enter the missing dollar amount required to balance the ledger.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-8 bg-slate-50 border-slate-200"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isLoading}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {isLoading ? "Verifying..." : "Submit Audit"}
                        </Button>
                    </div>

                    {/* DECORATIVE FOOTER */}
                    <div className="pt-6 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Lock size={12} />
                            <span>Secure Environment | 256-bit Encryption</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}