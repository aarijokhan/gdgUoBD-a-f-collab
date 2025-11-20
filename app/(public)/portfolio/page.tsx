"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, Zap, Trophy, Menu, X, Activity, 
  Wallet, ShoppingCart, Globe, Clock, AlertTriangle, Lock, BarChart3 
} from 'lucide-react';

// --- STYLED COMPONENTS ---

const BentoCard = ({ children, className = "", title, icon: Icon, dark = false }: any) => (
  <div className={`
    ${dark ? 'bg-[#4F46E5] text-white' : 'bg-white text-slate-900'} 
    rounded-[1.5rem] p-5 flex flex-col shadow-lg relative overflow-hidden border ${dark ? 'border-indigo-500' : 'border-slate-100'}
    ${className}
  `}>
    {title && (
      <div className={`flex items-center gap-2 mb-4 font-bold uppercase text-[10px] tracking-widest ${dark ? 'text-indigo-200' : 'text-slate-400'}`}>
        {Icon && <Icon size={12} />}
        {title}
      </div>
    )}
    <div className="relative z-10 flex flex-col h-full">
        {children}
    </div>
  </div>
);

// --- HELPER: FAKE HISTORY ---
const generateInitialHistory = (startPrice: number, count: number) => {
  const history = [startPrice];
  let current = startPrice;
  for (let i = 1; i < count; i++) {
    const change = (Math.random() - 0.5) * 3;
    current += change;
    history.push(parseFloat(current.toFixed(2)));
  }
  return history;
};

// --- MAIN COMPONENT ---

export default function TradeTerminalPage() {
  // Game State
  const [currentPrice, setCurrentPrice] = useState(178.45);
  const [stockHistory, setStockHistory] = useState<number[]>(() => generateInitialHistory(178.45, 60));
  const [balance, setBalance] = useState(25000.00);
  const [shares, setShares] = useState(0);
  const [trend, setTrend] = useState(1); 
  const [buyQuantity, setBuyQuantity] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // PUZZLE CONSTANTS
  const MYFOOTBOOK_TARGET_SHARES = 125;
  const MYFOOTBOOK_BUY_LIMIT = 67; 

  // --- 1. BACKDOOR EXPLOIT (Console Hack) ---
  useEffect(() => {
    // @ts-ignore
    window.execute_vip_order = (qty: number) => {
      if (qty === 125) {
        toast.success("⚠️ VIP OVERRIDE SUCCESS", {
            description: (
              <div className="space-y-2">
                <p>Block trade executed. 125 Units Acquired.</p>
                <div className="bg-slate-900 text-slate-50 p-2 rounded text-xs font-mono">
                    LOG: ACCESS_GRANT_221<br/>
                    <Link href="/secret-financial-report" className="text-indigo-400 underline">/secret-financial-report</Link>
                </div>
              </div>
            ),
            duration: Infinity,
            action: { label: "View Report", onClick: () => window.location.href = "/secret-financial-report" }
        });
      } else {
        toast.error("VIP Order Failed", { description: `Quantity ${qty} != 125.` });
      }
    };
    console.log("%c ⚠️ DEV MODE ENABLED: Retail Limits Active.", "background: #222; color: #bada55; font-size: 12px");
    console.log("%c Debug function 'execute_vip_order(qty)' is available for Block Trading.", "background: #222; color: #fff");
    // @ts-ignore
    return () => { delete window.execute_vip_order; }
  }, []);

  // --- 2. MARKET SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.45) * 2;
      setCurrentPrice(prev => {
        const newPrice = Math.max(10, parseFloat((prev + change).toFixed(2)));
        setTrend(change > 0 ? 1 : -1);
        setStockHistory(history => [...history.slice(1), newPrice]);
        return newPrice;
      });
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (type: 'buy' | 'sell') => {
    const quantity = Number(buyQuantity);
    if (quantity <= 0 || isNaN(quantity)) { toast.error("Invalid Quantity"); return; }

    if (type === 'buy') {
        if (quantity > MYFOOTBOOK_BUY_LIMIT) {
            toast.error("Retail Limit Exceeded", { description: `Tier 1 Accounts are capped at ${MYFOOTBOOK_BUY_LIMIT} units per trade.` });
            return; 
        }
        if (balance >= quantity * currentPrice) {
            setBalance(b => b - (quantity * currentPrice));
            setShares(s => s + quantity);
            setBuyQuantity("");
            toast.success("Order Executed");
        } else {
            toast.error("Insufficient Funds");
        }
    } else {
        if (shares >= quantity) {
            setBalance(b => b + (quantity * currentPrice));
            setShares(s => s - quantity);
            setBuyQuantity("");
            toast.success("Order Executed");
        } else {
            toast.error("Insufficient Shares");
        }
    }
  };

  // Chart Helpers
  const minPrice = Math.min(...stockHistory);
  const maxPrice = Math.max(...stockHistory);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-900 font-sans pb-10">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-lg font-black tracking-tight">
              Uni<span className="text-indigo-400">Trade</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-xs font-bold tracking-wide">
                <BarChart3 size={12} />
                TERMINAL VIEW
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-bold tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                MARKET OPEN
             </div>
          </div>
          <button className="md:hidden p-2 text-white" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- TICKER MARQUEE --- */}
      <div className="bg-indigo-950 border-b border-indigo-900 py-1.5 overflow-hidden whitespace-nowrap flex gap-12">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] font-bold tracking-widest">
            <span className="text-indigo-200">MFB</span>
            <span className="text-emerald-400">▲ 4.2%</span>
            <span className="text-slate-600">///</span>
            <span className="text-indigo-200">ACME</span>
            <span className="text-rose-400">▼ 1.2%</span>
            <span className="text-slate-600">///</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* --- LEFT COLUMN (Main Action) - Span 9 --- */}
        <div className="lg:col-span-9 flex flex-col gap-4 md:gap-6">
          
          {/* 1. ASSET DETAIL CHART */}
          <BentoCard className="min-h-[380px] h-full" title="Asset Detail" icon={Activity}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide">TECH</span>
                   <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide">MFB</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1">MyFootbook</h2>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-medium text-slate-400 tracking-tighter">${currentPrice.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-md ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {(Math.random() * 2).toFixed(2)}%
                    </div>
                </div>
              </div>
              {/* Decorative Badge */}
              <div className="hidden sm:flex flex-col items-end">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Volume</div>
                 <div className="text-xl font-black text-slate-800">24.5M</div>
              </div>
            </div>

            {/* DYNAMIC GRAPH */}
            <div className="flex-1 flex items-end justify-between gap-1 mt-4 min-h-[200px]">
              {stockHistory.map((price, i) => {
                const heightPercent = ((price - minPrice) / priceRange) * 85 + 5; 
                const isUp = i > 0 && price >= stockHistory[i-1];
                return (
                   <div 
                    key={i} 
                    style={{ height: `${heightPercent}%` }} 
                    className={`w-full rounded-t-[2px] transition-all duration-500 ease-out ${isUp ? 'bg-indigo-500' : 'bg-slate-200'}`}
                   ></div>
                )
              })}
            </div>
          </BentoCard>

          {/* 2. TRADING & INSIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* TRADE CARD */}
            <BentoCard title="Execute Order" icon={ShoppingCart} className="min-h-[240px]">
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                <Lock size={10} /> RETAIL LIMIT: {MYFOOTBOOK_BUY_LIMIT}
                            </div>
                        </div>
                        <input 
                            type="number" 
                            value={buyQuantity}
                            onChange={(e) => setBuyQuantity(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-xl focus:outline-none focus:border-indigo-500 transition-colors mb-4"
                            max={MYFOOTBOOK_BUY_LIMIT}
                        />
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">
                            *Tier 1 accounts are restricted to small lot sizes to prevent volatility.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button onClick={() => handleTrade('buy')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 text-sm">
                            Buy
                        </button>
                        <button onClick={() => handleTrade('sell')} className="bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 font-bold py-3 rounded-xl transition-all active:scale-95 text-sm">
                            Sell
                        </button>
                    </div>
                </div>
            </BentoCard>

            {/* ANALYST INSIGHTS (The Clue) */}
            <BentoCard title="Analyst Insights" icon={Globe} className="min-h-[240px]">
               <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                 <div className="group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[9px] font-black text-white bg-indigo-600 px-1.5 py-0.5 rounded">MUST READ</span>
                       <span className="text-[9px] font-bold text-slate-400">Just Now</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-indigo-600 transition-colors">
                       Institutional "Block Trades" detected at 125+ unit volumes. 
                       Whales are accumulating MFB.
                    </h4>
                 </div>
                 <div className="h-px bg-slate-100"></div>
                 <div className="group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">RUMOR</span>
                       <span className="text-[9px] font-bold text-slate-400">1h ago</span>
                    </div>
                    {/* FIXED LINE: Escaped > character to &gt; */}
                    <h4 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-emerald-600 transition-colors">
                       Compliance audit scheduled for accounts moving large volumes (&gt;125).
                    </h4>
                 </div>
               </div>
            </BentoCard>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Side Panel) - Span 3 --- */}
        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
          
          {/* 3. ACCOUNT OVERVIEW (Renamed) */}
          <BentoCard dark={true} title="Account Overview" icon={Wallet} className="min-h-[200px]">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
             
             <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                <div>
                    <p className="text-indigo-300 text-[10px] font-bold uppercase mb-1">Buying Power</p>
                    <p className="text-3xl font-black text-white tracking-tight">${balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5 flex justify-between items-center">
                    <div>
                        <p className="text-indigo-300 text-[9px] font-bold uppercase mb-0.5">Net Equity</p>
                        <p className="text-sm font-bold text-white">${(balance + (shares * currentPrice)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-indigo-300 text-[9px] font-bold uppercase mb-0.5">MFB Pos.</p>
                        <p className="text-sm font-bold text-white">{shares}</p>
                    </div>
                </div>
             </div>
          </BentoCard>

          {/* 4. LEADERBOARD */}
          <BentoCard title="Top Traders" icon={Trophy} className="flex-1">
            <ul className="space-y-3">
              {[
                { name: 'CryptoKing99', profit: '+420%', status: 'up' },
                { name: 'ElonMuskRato', profit: '+120%', status: 'up' },
                { name: 'WallStBetz', profit: '+89%', status: 'up' },
                { name: 'You', profit: '-2%', status: 'down' },
              ].map((user, i) => (
                <li key={i} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${i === 3 ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        {i+1}
                    </div>
                    <span className={`text-xs font-bold ${i === 3 ? 'text-slate-900' : 'text-slate-500'}`}>{user.name}</span>
                  </div>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${user.status === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    {user.profit}
                  </span>
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* 5. COUNTDOWN */}
          <div className="bg-slate-800 rounded-2xl p-4 text-center border border-slate-700 shadow-lg">
             <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                <Clock size={12} /> Session Close
             </div>
             <div className="text-xl font-mono font-bold text-white tracking-widest">
                00:45:00
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}