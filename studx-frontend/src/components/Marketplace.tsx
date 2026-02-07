
import React, { useState, useRef } from 'react';
import type { MarketplaceItem, AppState } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, Search, Grid, List, Plus, MapPin, User, Heart, X, Camera, Image as ImageIcon, ShoppingCart, Star, Shield, MessageCircle } from 'lucide-react';

interface MarketplaceProps {
  items: MarketplaceItem[];
  wishlist: string[];
  onBack: () => void;
  onAddItem: (item: MarketplaceItem) => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onNavigate: (s: AppState) => void;
  onStartChat: (name: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ items, wishlist, onAddItem, onToggleWishlist, onAddToCart, onNavigate, onStartChat }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Textbooks', 'Electronics', 'Notes', 'Lab equipment', 'Stationery'];
  const filteredItems = items.filter(item => (filter === 'All' || item.category === filter) && (item.name.toLowerCase().includes(search.toLowerCase())));

  const handleCreateListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: MarketplaceItem = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      condition: 'Good',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      description: 'Newly added student listing.',
      seller: 'Current User',
      location: 'Campus'
    };
    onAddItem(newItem);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="w-full md:max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for items..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl border border-slate-200 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-slate-900 shadow-sm placeholder:text-slate-300" 
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} /></button>
              <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-105 transition-all"><Plus size={20} /> Add Listing</button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 mb-12 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`whitespace-nowrap px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 ${filter === cat ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{cat}</button>
          ))}
        </div>

        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer animate-fade-in-up">
              <div className="h-60 relative overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(item.id); }} className={`absolute top-6 right-6 w-12 h-12 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all ${wishlist.includes(item.id) ? 'bg-rose-50 text-white shadow-lg' : 'bg-white/90 text-slate-400 hover:text-rose-500 shadow-sm'}`}><Heart size={20} fill={wishlist.includes(item.id) ? "currentColor" : "none"} /></button>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">{item.name}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-6 tracking-widest">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(item.id); }} className="bg-blue-50 text-blue-600 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-inner"><ShoppingCart size={20} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedItem(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="p-10 md:p-14">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setSelectedItem(null)} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all"><ChevronLeft size={22} /> Back to Marketplace</button>
                <button onClick={() => setSelectedItem(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square ring-1 ring-black/5">
                  <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 mb-6">
                       <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedItem.condition}</span>
                       <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedItem.category}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{selectedItem.name}</h1>
                    <div className="flex items-center gap-6 mb-10">
                      <span className="text-5xl font-black text-blue-600">₹{selectedItem.price}</span>
                      <span className="text-slate-300 line-through font-bold text-2xl">₹{Math.floor(selectedItem.price * 1.3)}</span>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 mb-10">
                       <div className="flex items-center gap-4 text-sm font-bold text-slate-600"><User size={20} className="text-blue-500" /> Sold by <span className="text-slate-900 font-black">{selectedItem.seller}</span></div>
                       <div className="flex items-center gap-4 text-sm font-bold text-slate-600"><MapPin size={20} className="text-emerald-500" /> <span className="text-slate-900 font-black">{selectedItem.location}</span></div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Details</h4>
                      <p className="text-slate-600 text-base leading-relaxed font-medium">{selectedItem.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-12">
                    <button onClick={() => onAddToCart(selectedItem.id)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:scale-105 transition-all"><ShoppingCart size={20} /> Add to Cart</button>
                    <button onClick={() => onStartChat(selectedItem.seller)} className="bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all"><MessageCircle size={20} /> Chat Seller</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#1E2128] text-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black tracking-tight">Add New Listing</h2><button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={28} /></button></div>
              <form className="space-y-8" onSubmit={handleCreateListing}>
                <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Media</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="border-2 border-dashed border-slate-700 rounded-[2rem] h-28 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-slate-800 transition-all"><Camera size={24} className="text-slate-500" /><span className="text-[10px] font-black uppercase tracking-wider">Camera</span></button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-[2rem] h-28 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-slate-800 transition-all"><ImageIcon size={24} className="text-slate-500" /><span className="text-[10px] font-black uppercase tracking-wider">Gallery</span><input type="file" ref={fileInputRef} className="hidden" accept="image/*" /></button>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Title *</label><input name="name" required placeholder="e.g. Scientific Calculator" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (₹) *</label><input name="price" type="number" required placeholder="0" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label><select name="category" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 text-white">{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:opacity-90 hover:scale-[1.02] transition-all">List Item Now</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
