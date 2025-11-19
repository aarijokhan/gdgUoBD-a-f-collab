"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, AlertTriangle } from "lucide-react";

export default function WireTransferStage() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Finance Task Info: Exchange A ($40k) vs Exchange B ($42k)
  const BITCOIN_PRICE_A = 40000;
  const BITCOIN_PRICE_B = 42000;
  
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // We send the raw value to the API. 
      const response = await fetch("/api/verify-flag", {
        method: "POST",
        body: JSON.stringify({ 
          stage: "stage5", 
          input: Number(amount) 
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Transfer Successful!", {
          description: data.flag, 
          duration: Infinity, 
          action: {
            label: "Copy Flag",
            onClick: () => navigator.clipboard.writeText(data.flag),
          },
        });
      } else {
        toast.error("Transfer Failed", {
          description: data.message || "Compliance checks failed.",
        });
      }
    } catch (err) {
      toast.error("System Error", { description: "Connection refused." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-8 bg-slate-50 min-h-screen">
      <Card className="w-full max-w-md border-slate-300 shadow-lg">
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Global Wire Transfer
          </CardTitle>
          <CardDescription className="text-slate-400">
            Rapid arbitrage execution gateway.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Market Data Context for Finance Student */}
          <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Market Opportunity Detected</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Exchange A (Buy)</p>
                <p className="font-mono font-bold text-slate-800">${BITCOIN_PRICE_A.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Exchange B (Sell)</p>
                <p className="font-mono font-bold text-green-600">${BITCOIN_PRICE_B.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Available Liquidity Cap: $500,000.00
            </div>
          </div>

          {/* The Vulnerable Form */}
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Transfer Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  // THIS IS THE VULNERABILITY 
                  // The CS student must inspect element and delete max="100000"
                  max={100000} 
                />
              </div>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                System Limit: $100,000 per transaction
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Execute Transfer"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t bg-slate-50 p-4">
          <p className="text-xs text-slate-400">Secure connection established (SSL/TLS)</p>
        </CardFooter>
      </Card>
    </div>
  );
}