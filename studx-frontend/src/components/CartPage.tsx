
import React from 'react';
import type { MarketplaceItem, AppState } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, Trash2, ShoppingCart, ShoppingBag, Plus, Minus, ChevronRight, ShieldCheck } from 'lucide-react';

interface CartPageProps {
  items: MarketplaceItem[];
  cart: string[];
  onBack: () => void;
  onRemove: (id: string) => void;
  onGoMarketplace: () => void;
  onNavigate: (s: AppState) => void;
}

const CartPage: React.FC<CartPageProps> = ({ items, cart, onBack, onRemove, onGoMarketplace, onNavigate }) => {
  const cartItems = items.filter(item => cart.includes(item.id));
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-16 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <ShoppingCart size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Your Cart</h1>
              <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest mt-1">{cartItems.length} items ready for checkout</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
             <ChevronLeft size={20} /> Back
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center animate-fade-in-up">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10 shadow-inner">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Your cart is empty</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-xs mx-auto leading-relaxed">Items you add to your cart from the marketplace will appear here.</p>
            <button 
              onClick={onGoMarketplace}
              className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row gap-10 items-center animate-fade-in-up hover:shadow-2xl transition-all duration-500 group" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-48 h-48 bg-slate-100 rounded-[2.5rem] overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight line-clamp-1">{item.name}</h3>
                        <p className="text-slate-500 text-base font-medium line-clamp-2 leading-relaxed opacity-80">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">{item.condition}</span>
                        <button onClick={() => onRemove(item.id)} className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"><Trash2 size={22} /></button>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all"><Minus size={18} /></button>
                        <span className="font-black text-xl text-slate-900">1</span>
                        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all"><Plus size={18} /></button>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Item Total</span>
                         <span className="text-4xl font-black text-blue-600">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter relative z-10">Order Summary</h2>
                <div className="space-y-8 mb-12 relative z-10">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-slate-900 font-black">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-400">Campus Pickup</span>
                    <span className="text-emerald-600 uppercase font-black text-xs tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">FREE</span>
                  </div>
                  <div className="h-px bg-slate-100"></div>
                  <div className="flex justify-between items-end">
                    <div>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block">Grand Total</span>
                       <span className="text-5xl font-black text-blue-600 tracking-tighter">₹{subtotal}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:scale-105 transition-all mb-6 relative z-10">
                  Proceed to Checkout
                </button>
                <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">
                   <ShieldCheck size={16} /> Campus Secure Checkout
                </div>
              </div>
              
              <div className="bg-blue-50/50 p-10 rounded-[3rem] border border-blue-100 border-dashed text-center">
                 <p className="text-blue-600 text-xs font-bold leading-relaxed">
                   Meet sellers in public campus locations. Check product condition thoroughly before completing payment.
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CartPage;
