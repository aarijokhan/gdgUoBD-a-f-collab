"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Search, Bell, Settings, Lock, Activity, Zap, 
  BarChart3, TrendingUp, TrendingDown, Clock, Layout,
  MoreHorizontal, ArrowUp, ArrowDown
} from "lucide-react";

// --- COMPONENTS ---

const WatchlistItem = ({ symbol, name, price, change, isUp }: any) => (
  <div className="flex justify-between items-center p-3 hover:bg-white/5 cursor-pointer rounded-lg transition-colors group">
    <div>
      <div className="font-bold text-sm text-white">{symbol}</div>
      <div className="text-[10px] text-slate-500 group-hover:text-slate-400">{name}</div>
    </div>
    <div className="text-right">
      <div className="font-mono text-sm font-medium text-slate-200">{price}</div>
      <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {change}
      </div>
    </div>
  </div>
);

const OrderBookRow = ({ price, amount, total, type }: any) => (
  <div className="grid grid-cols-3 text-[10px] font-mono py-0.5 hover:bg-white/5 cursor-pointer">
    <span className={type === 'ask' ? 'text-rose-500' : 'text-emerald-500'}>{price}</span>
    <span className="text-slate-400 text-right">{amount}</span>
    <span className="text-slate-500 text-right">{total}</span>
  </div>
);

export default function DashboardPage() {
  const [shares, setShares] = useState("");
  const [time, setTime] = useState(new Date());

  // CTF LOGIC
  const STOCK_PRICE = 50.00;
  const TARGET_PROFIT = 2500;

  // Clock for realism
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuy = async () => {
    const response = await fetch("/api/verify-flag", {
      method: "POST",
      body: JSON.stringify({ stage: "stage1", input: shares }),
    });
    const data = await response.json();

    if (data.success) {
      toast.success("Order Filled", { 
        description: data.flag,
        action: { label: "Copy Flag", onClick: () => navigator.clipboard.writeText(data.flag) }
      });
    } else {
      toast.error("Order Rejected", { description: "Volume incorrect for target profit strategy." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-300 font-sans flex flex-col overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="h-14 border-b border-slate-800 bg-[#0b0e14] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-600/20">
                 <Zap size={14} fill="currentColor" />
              </div>
              <span className="font-bold tracking-tight">Uni<span className="text-indigo-500">Trade</span> Pro</span>
           </div>
           <div className="hidden md:flex gap-1 bg-slate-900 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold text-white bg-slate-800 rounded shadow-sm">Trade</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-300">Markets</button>
              <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-300">Screeners</button>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              MARKET OPEN
           </div>
           <div className="w-px h-6 bg-slate-800"></div>
           <Bell size={16} className="hover:text-white cursor-pointer" />
           <Settings size={16} className="hover:text-white cursor-pointer" />
           <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">JS</div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* COL 1: WATCHLIST (Left Sidebar) */}
        <aside className="hidden lg:block col-span-2 border-r border-slate-800 bg-[#0f141c] flex flex-col">
           <div className="p-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider">Watchlist</span>
              <MoreHorizontal size={14} />
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <WatchlistItem symbol="ACM" name="ACME Corp" price="50.00" change="-0.39%" isUp={false} />
              <WatchlistItem symbol="MFB" name="MyFootbook" price="178.45" change="+4.20%" isUp={true} />
              <WatchlistItem symbol="GGL" name="Google" price="150.00" change="+1.12%" isUp={true} />
              <WatchlistItem symbol="NVDA" name="NVIDIA" price="824.11" change="+2.50%" isUp={true} />
              <WatchlistItem symbol="BTC" name="Bitcoin" price="42,105" change="+0.15%" isUp={true} />
           </div>
        </aside>

        {/* COL 2: CHART & ORDER BOOK (Middle) */}
        <main className="col-span-12 lg:col-span-7 flex flex-col border-r border-slate-800">
           
           {/* Chart Header */}
           <div className="h-14 border-b border-slate-800 flex justify-between items-center px-4 bg-[#0f141c]">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">ACME</span>
                    <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-bold">NASDAQ</span>
                 </div>
                 <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-emerald-500">${STOCK_PRICE.toFixed(2)}</span>
                        <span className="text-xs text-slate-500 line-through">$50.82</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 {['1m', '5m', '15m', '1H', '4H', '1D'].map(t => (
                    <button key={t} className={`text-xs font-bold px-2 py-1 rounded ${t === '1H' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                 ))}
              </div>
           </div>

           {/* The Chart Area (Visual Only) */}
           <div className="flex-1 bg-[#0b0e14] relative p-4 flex items-center justify-center border-b border-slate-800">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                 {[...Array(24)].map((_, i) => <div key={i} className="border-r border-b border-slate-800/30"></div>)}
              </div>
              
              {/* Fake Candlestick Visualization */}
              <div className="relative z-10 flex items-end gap-1 h-64 opacity-80">
                 {[...Array(40)].map((_, i) => {
                    const h = Math.random() * 60 + 20;
                    const isGreen = Math.random() > 0.4;
                    return (
                       <div key={i} className="w-3 flex flex-col items-center gap-1">
                          <div className={`w-[1px] h-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'} opacity-50`}></div>
                          <div style={{height: `${h}%`}} className={`w-full ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'} rounded-sm`}></div>
                       </div>
                    )
                 })}
              </div>

              {/* The Clue Overlay */}
              <div className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg backdrop-blur-sm">
                 <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity size={12} /> Strategy Target
                 </div>
                 <div className="text-2xl font-black text-amber-400">${TARGET_PROFIT.toLocaleString()}</div>
                 <div className="text-[10px] text-amber-200/60 font-mono uppercase">Required Profit</div>
              </div>
           </div>

           {/* Positions / Bottom Panel */}
           <div className="h-48 bg-[#0f141c] flex flex-col">
              <div className="flex border-b border-slate-800">
                 <button className="px-4 py-2 text-xs font-bold text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5">Open Orders</button>
                 <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300">Positions</button>
                 <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300">Trade History</button>
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-wider">
                 No Active Orders
              </div>
           </div>
        </main>

        {/* COL 3: ORDER ENTRY (Right Sidebar) */}
        <aside className="col-span-12 lg:col-span-3 bg-[#0f141c] flex flex-col">
           
           {/* ORDER ENTRY WIDGET (THE PUZZLE) */}
           <div className="p-4 border-b border-slate-800">
              <div className="bg-amber-400 text-slate-900 rounded-t-xl p-3 flex justify-between items-center">
                 <span className="font-black text-xs uppercase tracking-wider flex items-center gap-1">
                    <Lock size={12} /> Order Entry
                 </span>
                 <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-bold">SPOT</span>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 border-t-0 rounded-b-xl p-4 space-y-4">
                 
                 <div className="grid grid-cols-2 gap-2 mb-2">
                    <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 py-2 rounded text-xs font-bold">Buy</button>
                    <button className="bg-slate-700 text-slate-400 py-2 rounded text-xs font-bold hover:text-slate-200">Sell</button>
                 </div>

                 <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                           <span>Order Type</span>
                           <span>Market</span>
                        </div>
                        <div className="bg-black/20 border border-slate-600 rounded px-3 py-2 text-sm font-bold text-slate-300">
                           Market Order
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                           <span>Quantity (Shares)</span>
                        </div>
                        <div className="relative">
                           <input 
                              type="number" 
                              placeholder="0" 
                              value={shares}
                              onChange={(e) => setShares(e.target.value)}
                              className="w-full bg-black/20 border border-amber-500/50 rounded px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                           />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                           <span>Est. Cost</span>
                        </div>
                        <div className="bg-black/20 border border-slate-600 rounded px-3 py-2 text-sm font-bold text-slate-500">
                           ${shares ? (Number(shares) * STOCK_PRICE).toFixed(2) : '0.00'}
                        </div>
                    </div>

                    {/* THE EXPLOIT BUTTON */}
                    <button 
                        onClick={handleBuy}
                        disabled={true} 
                        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-3 rounded-lg shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-2"
                    >
                        <Lock size={14} /> Place Buy Order
                    </button>
                 </div>
              </div>
           </div>

           {/* ORDER BOOK (Visual Filler) */}
           <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                 <span>Price(USD)</span>
                 <span>Amount</span>
                 <span>Total</span>
              </div>
              <div className="p-2 space-y-0.5 overflow-y-auto no-scrollbar">
                 {[...Array(8)].map((_, i) => (
                    <OrderBookRow key={`ask-${i}`} price={(50 + (Math.random())).toFixed(2)} amount={(Math.random()*100).toFixed(0)} total={(Math.random()*5000).toFixed(2)} type="ask" />
                 ))}
                 <div className="py-1 my-1 border-y border-slate-800 text-center text-lg font-bold text-emerald-500 bg-emerald-500/5">
                    ${STOCK_PRICE.toFixed(2)}
                 </div>
                 {[...Array(8)].map((_, i) => (
                    <OrderBookRow key={`bid-${i}`} price={(49.99 - (Math.random())).toFixed(2)} amount={(Math.random()*100).toFixed(0)} total={(Math.random()*5000).toFixed(2)} type="bid" />
                 ))}
              </div>
           </div>

        </aside>
      </div>
      
      {/* FOOTER STATUS BAR */}
      <footer className="h-6 bg-[#0b0e14] border-t border-slate-800 flex items-center px-4 justify-between text-[10px] font-mono text-slate-500 shrink-0">
         <div className="flex gap-4">
            <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Operational</span>
            <span>Latency: 24ms</span>
         </div>
         <div>
            {time.toLocaleTimeString()} UTC
         </div>
      </footer>
    </div>
  );
}