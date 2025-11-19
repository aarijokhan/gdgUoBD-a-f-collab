"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Lock } from "lucide-react";

export default function DashboardPage() {
  const [shares, setShares] = useState("");
  
  // Hardcoded data from your PDF Source [cite: 14]
  const STOCK_PRICE = 50;
  const TARGET_PROFIT = 2500;

  const handleBuy = async () => {
  console.log("Button Clicked!"); // <--- Add this
  console.log("Sending Input:", shares); // <--- Add this

  const response = await fetch("/api/verify-flag", {
    method: "POST",
    body: JSON.stringify({ stage: "stage1", input: shares }),
  });
  
  const data = await response.json();
  console.log("API Response:", data); // <--- Add this

  if (data.success) {
    toast.success("Trade Executed!", { description: data.flag, duration: Infinity });
  } else {
    toast.error("Trade Failed", { description: "Incorrect share volume calculated." });
  }
};

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Trading Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* FINANCE TASK CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-600"/> ACME Corp (ACM)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-100 rounded-lg">
              <p>Current Price: <span className="font-mono font-bold">${STOCK_PRICE}/share</span></p>
              <p>Target Profit: <span className="font-mono font-bold text-green-600">${TARGET_PROFIT}</span></p>
            </div>
            <p className="text-sm text-slate-500">
              Task: Calculate the volume required to hit target profit.
            </p>
          </CardContent>
        </Card>

        {/* TECH TASK CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Execute Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Volume</label>
              <Input 
                type="number" 
                placeholder="Enter quantity..." 
                value={shares}
                onChange={(e) => setShares(e.target.value)}
              />
            </div>
            
            {/* THE EXPLOIT: The button is disabled. CS students must remove 'aria-disabled' attribute. [cite: 16, 17] */}
            <Button
              className="w-full"
              onClick={handleBuy}
              aria-disabled={true}
            >
              <Lock className="w-4 h-4 mr-2" />
              Buy Shares (Locked)
            </Button>
            <p className="text-xs text-red-400 text-center">
              Error: Trade execution temporarily suspended by admin.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}