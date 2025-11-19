"use client";

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Link from "next/link";
import { TrendingUp, TrendingDown, Zap, Trophy, Menu, X, Activity, ArrowRight, Wallet, ShoppingCart, AlertTriangle } from 'lucide-react';

// --- BENTO COMPONENTS (Keep these the same) ---
const BentoCard = ({ children, className = "", title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) => (
  <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full transition-all hover:shadow-md ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4 text-slate-500 font-medium text-sm uppercase tracking-wider">
        {Icon && <Icon size={16} />}
        {title}
      </div>
    )}
    {children}
  </div>
);

const BentoButton = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "danger", className?: string }) => (
  <button 
    onClick={onClick}
    className={`
      relative overflow-hidden
      font-semibold rounded-xl px-6 py-3 
      transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
      ${variant === 'primary' 
        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

// --- HELPER: GENERATE HISTORY ---
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

export default function PortfolioPage() {
  const [currentPrice, setCurrentPrice] = useState(178.45);
  const [stockHistory, setStockHistory] = useState<number[]>(() => generateInitialHistory(178.45, 40));
  const [balance, setBalance] = useState(25000.00); // $25k Balance
  const [shares, setShares] = useState(0);
  const [trend, setTrend] = useState(1); 
  const [buyQuantity, setBuyQuantity] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const MYFOOTBOOK_TARGET_SHARES = 125;
  const MYFOOTBOOK_BUY_LIMIT = 67; 

  // --- 1. THE BACKDOOR EXPLOIT ---
  useEffect(() => {
    // Define the function that runs when they type in the console
    // @ts-ignore - Ignoring type check for window injection
    window.execute_vip_order = (qty: number) => {
      console.log(`⚡ EXECUTING VIP ORDER FOR ${qty} UNITS...`);
      
      if (qty === 125) {
        // Success Logic
        toast.success("⚠️ VIP OVERRIDE SUCCESS", {
            description: (
              <div className="space-y-2">
                <p className="text-slate-600">
                  Backdoor executed. Limit ignored. 125 Units Acquired.
                </p>
                <div className="bg-slate-950 text-slate-50 p-3 rounded-lg text-xs font-mono">
                    LOG: ACCESS_GRANT_221<br/>
                    <Link href="/secret-financial-report" className="text-blue-400 underline font-bold hover:text-blue-300">
                        /secret-financial-report
                    </Link>
                </div>
              </div>
            ),
            duration: Infinity,
            action: {
                label: "View Report",
                onClick: () => window.location.href = "/secret-financial-report"
            }
        });
      } else {
        // Fail Logic (Wrong Number)
        toast.error("VIP Order Failed", { description: `Quantity ${qty} does not match Audit Requirement (125).` });
      }
    };

    // The Clue in the Console
    console.log("%c ⚠️ DEV MODE ENABLED: UI Limits Active.", "background: #222; color: #bada55; font-size: 12px");
    console.log("%c Debug function 'execute_vip_order(quantity)' is available for testing.", "background: #222; color: #fff");

    // Cleanup
    return () => {
      // @ts-ignore
      delete window.execute_vip_order;
    }
  }, []); // Runs once on mount

  // Live Market Simulation
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
    
    if (quantity <= 0 || isNaN(quantity)) {
      toast.error("Invalid Order");
      return;
    }

    if (type === 'buy') {
        // --- HARD BLOCK ---
        // Even if they remove the HTML max attribute, this JS check stops them.
        // This forces them to use the Console Backdoor instead.
        if (quantity > MYFOOTBOOK_BUY_LIMIT) {
            toast.error("Limit Exceeded", { 
                description: `Standard accounts are capped at ${MYFOOTBOOK_BUY_LIMIT} units. Upgrade to VIP or contact admin.` 
            });
            return; 
        }

        // Standard Buy
        if (balance >= quantity * currentPrice) {
            setBalance(b => b - (quantity * currentPrice));
            setShares(s => s + quantity);
            setBuyQuantity("");
            toast.success("Buy Order Executed", { description: `+${quantity} MFB added.` });
        } else {
            toast.error("Insufficient Funds");
        }
    } else {
        // Standard Sell
        if (shares >= quantity) {
            setBalance(b => b + (quantity * currentPrice));
            setShares(s => s - quantity);
            setBuyQuantity("");
            toast.success("Sell Order Executed", { description: `Sold ${quantity} MFB.` });
        } else {
            toast.error("Insufficient Assets");
        }
    }
  };

  // Chart Math
  const minPrice = Math.min(...stockHistory);
  const maxPrice = Math.max(...stockHistory);
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 pb-20">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Zap size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Uni<span className="text-blue-600">Trade</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Market Open
             </div>
          </div>
          <button className="md:hidden p-2 text-slate-600" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 pt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-8 space-y-6">
          
          {/* MAIN CHART CARD */}
          <BentoCard className="min-h-[400px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">TECH</div>
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">MFB</div>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">MyFootbook</h2>
                <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-semibold text-slate-900">${currentPrice.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 font-medium text-sm px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {(Math.random() * 2).toFixed(2)}%
                    </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Activity className="text-slate-400" size={24} />
              </div>
            </div>

            {/* DYNAMIC SCALED GRAPH */}
            <div className="h-48 flex items-end justify-between gap-1 mt-auto px-1">
              {stockHistory.map((price, i) => {
                const heightPercent = ((price - minPrice) / priceRange) * 80 + 10; 
                const isUp = i > 0 && price >= stockHistory[i-1];
                return (
                   <div 
                    key={i} 
                    style={{ height: `${heightPercent}%` }} 
                    className={`w-full rounded-t-[2px] transition-all duration-500 ease-out ${isUp ? 'bg-blue-500' : 'bg-slate-300'}`}
                   ></div>
                )
              })}
            </div>
          </BentoCard>

          {/* CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoCard title="Execute Order" icon={ShoppingCart}>
              <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Quantity</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={buyQuantity}
                            onChange={(e) => setBuyQuantity(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            max={MYFOOTBOOK_BUY_LIMIT}
                        />
                        {/* Limit Badge */}
                        <div className="absolute right-3 top-3.5 text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm flex items-center gap-1">
                            <AlertTriangle size={10} className="text-amber-500"/>
                            LIMIT: {MYFOOTBOOK_BUY_LIMIT}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <BentoButton onClick={() => handleTrade('buy')} variant="primary">Buy</BentoButton>
                    <BentoButton onClick={() => handleTrade('sell')} variant="danger">Sell</BentoButton>
                </div>
              </div>
            </BentoCard>

            <BentoCard title="Market News" icon={Zap}>
               <div className="space-y-4">
                 <div className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">BREAKING</span>
                       <span className="text-xs text-slate-400">2m ago</span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                       MyFootbook "Smart Shoes" recall affects 2M units
                    </h4>
                 </div>
                 <div className="h-px bg-slate-100"></div>
                 <div className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">EARNINGS</span>
                       <span className="text-xs text-slate-400">1h ago</span>
                    </div>
                    <h4 className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">
                       Tech sector rallies ahead of quarterly reports
                    </h4>
                 </div>
               </div>
            </BentoCard>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-4 space-y-6">
          
          {/* WALLET */}
          <BentoCard title="My Portfolio" icon={Wallet} className="bg-slate-900 text-white border-slate-800">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-medium text-slate-400 uppercase mb-1">Available Cash</div>
                <div className="text-3xl font-bold text-emerald-400 tracking-tight">
                  ${balance.toFixed(2)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Shares (MFB)</div>
                    <div className="text-xl font-semibold text-white">{shares}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Net Worth</div>
                    <div className="text-xl font-semibold text-white">${(balance + (shares * currentPrice)).toFixed(0)}</div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* LEADERBOARD */}
          <BentoCard title="Top Traders" icon={Trophy}>
            <ul className="space-y-4">
              {[
                { name: 'CryptoKing99', profit: '+420%', status: 'up' },
                { name: 'ElonMuskRato', profit: '+120%', status: 'up' },
                { name: 'WallStBetz', profit: '+89%', status: 'up' },
                { name: 'You', profit: '-2%', status: 'down' },
              ].map((user, i) => (
                <li key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 3 ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                        {i+1}
                    </div>
                    <span className={`text-sm font-medium ${i === 3 ? 'text-slate-900' : 'text-slate-600'}`}>{user.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {user.profit}
                  </span>
                </li>
              ))}
            </ul>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}