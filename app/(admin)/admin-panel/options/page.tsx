"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // You might need to install this or just use a span
import { TrendingUp, AlertTriangle } from "lucide-react";

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
      toast.success("Arbitrage Opportunity Captured!", { description: data.flag, duration: Infinity });
    } else {
      toast.error("Rejected", { description: "Submitted price still violates No-Arbitrage rules." });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white p-4">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="text-blue-500" /> 
              Option Valuation
            </CardTitle>
            <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/50 rounded">
              FLAGGED: MISPRICING
            </div>
          </div>
          <CardDescription className="text-slate-400">
            Manual review required for pending market maker submission.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* FINANCE DATA */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm">
            <div className="text-slate-500">Option Type</div>
            <div className="text-right font-bold text-blue-400">CALL</div>
            
            <div className="text-slate-500">Underlying Asset</div>
            <div className="text-right font-bold">GGL (Google)</div>
            
            <div className="text-slate-500">Current Stock Price</div>
            <div className="text-right font-bold text-emerald-400">$150.00</div>
            
            <div className="text-slate-500">Strike Price</div>
            <div className="text-right font-bold text-white">$100.00</div>
            
            <div className="col-span-2 border-t border-slate-800 my-2"></div>
            
            <div className="text-slate-400 flex items-center gap-2">
              Current Market Bid
              <AlertTriangle size={12} className="text-yellow-500" />
            </div>
            <div className="text-right font-bold text-yellow-500 text-lg">$12.00</div>
          </div>

          <div className="bg-blue-900/20 p-3 rounded text-xs text-blue-300 border border-blue-900/50">
            <strong>Analyst Note:</strong> This premium ($12.00) is theoretically impossible. 
            It violates the "Intrinsic Value Floor."
            <br/>
            <em>Formula: Intrinsic Value = Stock Price - Strike Price</em>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Corrected Valuation ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                
                {/* THE EXPLOIT: max="15.00" prevents entering the real value (50.00) */}
                <Input 
                  type="number" 
                  step="0.01"
                  max="15.00" 
                  className="pl-7 bg-slate-950 border-slate-700 text-white focus:border-blue-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <p className="text-[10px] text-red-400">
                * System limits price adjustments to +/- 25% of current bid ($15.00 max).
              </p>
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold">
              Override & Approve
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}