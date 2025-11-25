"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import Link from "next/link";
import { 
  Activity, Wallet, Globe, Lock, AlertTriangle, 
  TrendingUp, TrendingDown, BarChart3, Users, Clock, Briefcase
} from 'lucide-react';

// --- UTILS ---
const generateHistory = (start: number) => {
  const data = [start];
  for(let i=1; i<100; i++) data.push(data[i-1] + (Math.random() - 0.5));
  return data;
};

const InstitutionalTrade = ({ time, entity, type, size, price }: any) => (
  <div className="grid grid-cols-5 text-[10px] py-1 border-b border-neutral-800 hover:bg-neutral-900 font-mono">
    <span className="text-neutral-500">{time}</span>
    <span className="text-neutral-300 font-bold">{entity}</span>
    <span className={type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}>{type}</span>
    <span className="text-amber-500 font-bold">{size}</span>
    <span className="text-neutral-400">${price}</span>
  </div>
);

// --- MARKET DEPTH COMPONENT ---
const MarketDepth = ({ currentPrice }: { currentPrice: number }) => {
  const generateDepth = (basePrice: number, type: 'bid' | 'ask') => {
    return Array.from({ length: 15 }).map((_, i) => {
      const priceOffset = (i + 1) * 0.05;
      const price = type === 'bid' ? basePrice - priceOffset : basePrice + priceOffset;
      const size = Math.floor(Math.random() * 500) + 50;
      return { price: price.toFixed(2), size };
    });
  };

  const bids = generateDepth(currentPrice, 'bid');
  const asks = generateDepth(currentPrice, 'ask');
  const maxSize = Math.max(...bids.map(b => b.size), ...asks.map(a => a.size));

  return (
    <div className="h-full flex flex-col font-mono text-[10px]">
      <div className="grid grid-cols-2 text-neutral-500 font-bold uppercase mb-2 px-2">
        <span>Bid Size / Price</span>
        <span className="text-right">Price / Ask Size</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-800 z-10"></div>

        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col gap-0.5">
            {bids.map((order, i) => (
              <div key={i} className="relative flex justify-between items-center h-4 px-2 group hover:bg-neutral-900/50">
                <div 
                  className="absolute top-0 bottom-0 right-0 bg-emerald-900/30 transition-all duration-500" 
                  style={{ width: `${(order.size / maxSize) * 100}%` }}
                ></div>
                <span className="relative z-10 text-neutral-400 group-hover:text-white">{order.size}</span>
                <span className="relative z-10 text-emerald-500 font-bold">{order.price}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            {asks.map((order, i) => (
              <div key={i} className="relative flex justify-between items-center h-4 px-2 group hover:bg-neutral-900/50">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-rose-900/30 transition-all duration-500" 
                  style={{ width: `${(order.size / maxSize) * 100}%` }}
                ></div>
                <span className="relative z-10 text-rose-500 font-bold">{order.price}</span>
                <span className="relative z-10 text-neutral-400 group-hover:text-white">{order.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TradeTerminalPage() {
  const START_PRICE = 182.45;
  const [price, setPrice] = useState(START_PRICE);
  const [history, setHistory] = useState<number[]>(Array(100).fill(START_PRICE));
  const [balance, setBalance] = useState(25000.00);
  const [shares, setShares] = useState(0);
  const [qty, setQty] = useState("");
  const [activeTab, setActiveTab] = useState("FLOW"); 
  
  // State Refs for Console Access
  const balanceRef = useRef(balance);
  const priceRef = useRef(price);

  useEffect(() => {
    balanceRef.current = balance;
    priceRef.current = price;
  }, [balance, price]);

  // 1. INITIALIZE RANDOM DATA
  useEffect(() => {
    setHistory(generateHistory(START_PRICE));
  }, []);

  // CONSOLE BACKDOOR
  useEffect(() => {
    // @ts-ignore
    window.execute_vip_order = (q: number) => {
      const currentBal = balanceRef.current;
      const currentPrice = priceRef.current;
      const cost = q * currentPrice;

      if (q === 125) {
        if (currentBal >= cost) {
            // Execute Trade
            setBalance(prev => prev - cost);
            setShares(prev => prev + q);
            
            toast.success("INSTITUTIONAL ORDER FILLED", {
                description: "LOG: ACCESS_GRANT_221 -> /secret-financial-report",
                action: { label: "VIEW AUDIT LOG", onClick: () => window.location.href = "/secret-financial-report" }
            });
        } else {
            toast.error("INSUFFICIENT INSTITUTIONAL CAPITAL", { description: `Req: ~$${cost.toFixed(2)}` });
        }
      } else {
        toast.error("ORDER REJECTED", { description: "Volume does not match Institutional Block standards." });
      }
    };
    console.log("%c [SYSTEM] RETAIL LIMITS ACTIVE (Max 67).", "background: #222; color: #ff0000");
    console.log("%c [TIP] Institutional Desk: execute_vip_order(qty)", "background: #222; color: #00ff00");
    
    // @ts-ignore
    return () => { delete window.execute_vip_order; }
  }, []);

  // LIVE TICKER
  useEffect(() => {
    const timer = setInterval(() => {
      setPrice(p => {
        const next = p + (Math.random() - 0.48);
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleTrade = () => {
    const q = Number(qty);
    if (q <= 0) return;

    if (q > 67) {
        toast.error("RETAIL LIMIT EXCEEDED", { 
            description: "Standard accounts capped at 67 units. Contact Institutional Desk for block trades." 
        });
        return;
    }

    const cost = q * price;
    if (balance >= cost) {
        setBalance(prev => prev - cost);
        setShares(prev => prev + q);
        setQty("");
        toast.success("ORDER FILLED");
    } else {
        toast.error("INSUFFICIENT FUNDS");
    }
  };

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = (max - min) || 1; 

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-400 font-mono text-sm flex flex-col">
      
      {/* --- TOP BAR --- */}
      <header className="h-10 bg-black border-b border-neutral-800 flex items-center justify-between px-4 text-xs">
        <div className="flex gap-4">
            <span className="text-amber-500 font-bold">TERMINAL_01</span>
            <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> CONNECTED</span>
        </div>
        <div className="flex gap-4 text-neutral-500">
            <span>S&P 500: 4,782 <span className="text-emerald-600">(+0.4%)</span></span>
            <span>NASDAQ: 16,200 <span className="text-emerald-600">(+1.2%)</span></span>
            <span>MFB: {price.toFixed(2)}</span>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-12 gap-4 max-w-[1600px] mx-auto w-full">
        
        {/* --- LEFT COL: MAIN CHART (9 Cols) --- */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
            
            {/* HEADER INFO */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-4 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">MFB</h1>
                        <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 text-[10px] font-bold">NASDAQ</span>
                    </div>
                    <p className="text-xs text-neutral-500">MYFOOTBOOK INC • TECH • SOFTWARE</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-mono text-white">${price.toFixed(2)}</div>
                    <div className="text-emerald-500 font-bold flex justify-end items-center gap-1 text-xs">
                        <TrendingUp size={12}/> +1.24 (+0.68%)
                    </div>
                </div>
            </div>

            {/* CHART AREA */}
            <div className="flex-1 bg-[#0a0a0a] border border-neutral-800 relative min-h-[400px]">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none border-neutral-900/50">
                    {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-neutral-900/30"></div>)}
                </div>
                <div className="absolute inset-0 flex items-end gap-0.5 p-4">
                    {history.map((p, i) => {
                        const h = ((p - min) / range) * 70 + 20;
                        const isUp = i > 0 && p >= history[i-1];
                        return (
                            <div key={i} style={{height: `${h}%`}} className={`w-full opacity-90 ${isUp ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                        )
                    })}
                </div>
            </div>

            {/* BOTTOM DECK: INFO TABS */}
            <div className="bg-[#0a0a0a] border border-neutral-800 min-h-[250px] flex flex-col">
                <div className="flex border-b border-neutral-800">
                    <button onClick={() => setActiveTab("FLOW")} className={`px-4 py-2 text-xs font-bold border-r border-neutral-800 ${activeTab === "FLOW" ? 'text-amber-500 bg-neutral-900' : 'text-neutral-500 hover:text-neutral-300'}`}>INSTITUTIONAL FLOW</button>
                    <button onClick={() => setActiveTab("NEWS")} className={`px-4 py-2 text-xs font-bold border-r border-neutral-800 ${activeTab === "NEWS" ? 'text-amber-500 bg-neutral-900' : 'text-neutral-500 hover:text-neutral-300'}`}>NEWS WIRE (LIVE)</button>
                    <button onClick={() => setActiveTab("DEPTH")} className={`px-4 py-2 text-xs font-bold border-r border-neutral-800 ${activeTab === "DEPTH" ? 'text-amber-500 bg-neutral-900' : 'text-neutral-500 hover:text-neutral-300'}`}>MARKET DEPTH</button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {activeTab === "FLOW" && (
                        <div className="space-y-1">
                            <div className="grid grid-cols-5 text-[10px] font-bold text-neutral-500 uppercase mb-2 pb-2 border-b border-neutral-800">
                                <span>Time</span>
                                <span>Entity</span>
                                <span>Action</span>
                                <span>Block Size</span>
                                <span>Price</span>
                            </div>
                            <InstitutionalTrade time="14:02:05" entity="MYSTERY INC" type="BUY" size="+125" price="182.10" />
                            <InstitutionalTrade time="14:01:42" entity="FOMO VENTURES" type="BUY" size="+125" price="182.05" />
                            <InstitutionalTrade time="13:58:11" entity="PONZI & SONS" type="BUY" size="+125" price="181.95" />
                            <InstitutionalTrade time="13:55:30" entity="CITADEL SEC" type="BUY" size="+125" price="181.90" />
                            <InstitutionalTrade time="13:40:00" entity="BRIDGEWATER" type="BUY" size="+125" price="181.80" />
                        </div>
                    )}
                    
                    {activeTab === "NEWS" && (
                        <div className="space-y-3">
                            <div className="group cursor-pointer">
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-amber-500 font-bold">BREAKING</span>
                                    <span className="text-neutral-600">14:05</span>
                                </div>
                                <p className="text-neutral-300 text-xs group-hover:text-white transition-colors">
                                    Dark Pool activity detected: Multiple <span className="text-amber-500 font-bold">125-lot</span> block trades executed on MFB.
                                </p>
                            </div>
                            <div className="h-px bg-neutral-800"></div>
                            <div className="group cursor-pointer">
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-rose-500 font-bold">SCANDAL</span>
                                    <span className="text-neutral-600">13:50</span>
                                </div>
                                <p className="text-neutral-300 text-xs group-hover:text-white transition-colors">
                                  Nithin Santosh spotted at Vegas Casino trying to bet company treasury on performance enhancing drug &quot;Red 125&quot;. Investors praise the &quot;Visionary Expansion into Non-Euclidean Markets&quot;.                                </p>
                            </div>
                            <div className="h-px bg-neutral-800"></div>
                            <div className="group cursor-pointer">
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-emerald-500 font-bold">EARNINGS CALL</span>
                                    <span className="text-neutral-600">13:15</span>
                                </div>
                                <p className="text-neutral-300 text-xs group-hover:text-white transition-colors">
                                CFO claims Q3 losses are just a &quot;Dream within a Dream&quot;. Auditors currently spinning totems to verify if the balance sheet is reality.                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "DEPTH" && (
                        <MarketDepth currentPrice={price} />
                    )}
                </div>
            </div>
        </div>

        {/* --- RIGHT COL: SIDEBAR --- */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            
            {/* ORDER ENTRY */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold text-xs tracking-widest uppercase">
                    <Lock size={14}/> Order Management
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] text-neutral-500 uppercase mb-1">
                            <span>Account Tier</span>
                            <span className="text-neutral-300">RETAIL (Lvl 1)</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-500 uppercase mb-2">
                            <span>Max Lot Size</span>
                            <span className="text-rose-500 font-bold">67 UNITS</span>
                        </div>
                        <input 
                            type="number" 
                            className="w-full bg-black border border-neutral-700 p-3 text-right text-white font-mono focus:border-amber-500 focus:outline-none transition-colors"
                            placeholder="0"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            max={67}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleTrade} className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs py-3 uppercase tracking-wider transition-colors">
                            BUY
                        </button>
                        <button className="bg-rose-900/50 text-rose-700 font-bold text-xs py-3 uppercase tracking-wider cursor-not-allowed opacity-50">
                            SELL
                        </button>
                    </div>
                    <div className="border-t border-neutral-800 pt-4 mt-2">
                        <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                            <span>Commission</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-white">
                            <span>Total Est.</span>
                            <span>${(Number(qty) * price).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KEY RATIOS */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-4 flex-1">
                <div className="flex items-center gap-2 mb-4 text-neutral-500 font-bold text-xs tracking-widest uppercase">
                    <BarChart3 size={14}/> Key Ratios
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs border-b border-neutral-900 pb-2">
                        <span className="text-neutral-500">MKT CAP</span>
                        <span className="text-white font-mono">24.5B</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-neutral-900 pb-2">
                        <span className="text-neutral-500">P/E (TTM)</span>
                        <span className="text-white font-mono">33.42</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-neutral-900 pb-2">
                        <span className="text-neutral-500">EPS</span>
                        <span className="text-white font-mono">5.45</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-neutral-900 pb-2">
                        <span className="text-neutral-500">BETA</span>
                        <span className="text-white font-mono">1.42</span>
                    </div>
                </div>
            </div>

            {/* ACCOUNT SUMMARY - FIXED DISPLAY */}
            <div className="bg-neutral-900 border border-neutral-800 p-4">
                <div className="flex items-center gap-2 mb-3 text-neutral-400 font-bold text-xs tracking-widest uppercase">
                    <Wallet size={14}/> Account
                </div>
                {/* FIX: Dynamic Balance Display */}
                <div className="text-2xl font-mono text-white font-bold mb-1">
                    ${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className="text-[10px] text-emerald-500 font-bold">AVAILABLE LIQUIDITY</div>
                <div className="mt-2 text-[10px] text-neutral-500 flex justify-between border-t border-neutral-800 pt-2">
                    <span>MFB SHARES:</span>
                    <span className="text-white">{shares}</span>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}