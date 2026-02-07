
import React from 'react';
import type { MarketplaceItem, AppState } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, Trash2, ShoppingCart, Heart, ShoppingBag } from 'lucide-react';

interface WishlistPageProps {
  items: MarketplaceItem[];
  wishlist: string[];
  onBack: () => void;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
  onGoMarketplace: () => void;
  onNavigate: (s: AppState) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ items, wishlist, onBack, onRemove, onAddToCart, onGoMarketplace, onNavigate }) => {
  const wishItems = items.filter(item => wishlist.includes(item.id));
  const totalValue = wishItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-16 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100">
              <Heart size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">Your Wishlist</h1>
              <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest mt-1">{wishItems.length} {wishItems.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
             <ChevronLeft size={20} /> Back
          </button>
        </div>

        {wishItems.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-32 text-center border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center animate-fade-in-up">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10 shadow-inner">
              <Heart size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Your wishlist is empty</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-xs mx-auto leading-relaxed">Discover amazing products in the campus marketplace and save them here.</p>
            <button 
              onClick={onGoMarketplace}
              className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {wishItems.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="h-72 relative overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                    <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                      {item.condition}
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md text-rose-500 rounded-2xl flex items-center justify-center shadow-2xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{item.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-10 line-clamp-2 leading-relaxed opacity-80">{item.description}</p>
                    <div className="flex items-center justify-between mb-10 border-t border-slate-50 pt-8">
                       <span className="text-3xl font-black text-blue-600">₹{item.price}</span>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">{item.seller}</span>
                    </div>
                    <button 
                      onClick={() => onAddToCart(item.id)}
                      className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                      <ShoppingCart size={20} /> Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in-up">
               <div className="text-center md:text-left">
                  <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.4em] mb-3">Total Estimated Savings</p>
                  <h2 className="text-5xl font-black text-white tracking-tighter">₹{totalValue} <span className="text-slate-500 text-2xl font-medium ml-2">Total Value</span></h2>
               </div>
               <div className="text-center md:text-right">
                  <p className="text-slate-400 font-bold mb-6 italic">Secure these {wishItems.length} student deals before they sell out!</p>
                  <button onClick={onGoMarketplace} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">Continue Shopping</button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
