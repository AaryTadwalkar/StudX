
import React, { useState } from 'react';
import type { AppState, Startup } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, ExternalLink, MessageCircle, TrendingUp, Users, Package, Rocket, X, Star, Globe, Plus, Camera } from 'lucide-react';

interface StartupShowcaseProps {
  startups: Startup[];
  onBack: () => void;
  onNavigate: (s: AppState) => void;
  onAddStartup: (s: Startup) => void;
  onStartChat: (name: string) => void;
}

const StartupShowcase: React.FC<StartupShowcaseProps> = ({ startups, onBack, onNavigate, onAddStartup, onStartChat }) => {
  const [filter, setFilter] = useState('All');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['All', 'Food Tech', 'EdTech', 'Sustainability', 'Finance', 'Events'];
  const filteredStartups = startups.filter(s => filter === 'All' || s.category === filter);

  const handleAddStartup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStartup: Startup = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      description: 'Visionary student project.',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
      founder: 'Current User',
      followers: 0,
      products: 1,
      isTrending: false,
      category: formData.get('category') as string
    };
    onAddStartup(newStartup);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-8">
             <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-purple-100 rotate-6 hover:rotate-0 transition-transform duration-500"><Rocket size={44} /></div>
             <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Campus <span className="text-blue-600">Startups</span></h1>
          </div>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Supporting the next generation of campus entrepreneurs.</p>
          <button onClick={() => setIsAddModalOpen(true)} className="mt-10 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-3 mx-auto hover:scale-105 transition-all"><Plus size={20}/> Showcase Your Startup</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-10 mb-12 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`whitespace-nowrap px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 ${filter === cat ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredStartups.map((startup, idx) => (
            <div key={startup.id} onClick={() => setSelectedStartup(startup)} className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer animate-fade-in-up">
              <div className="h-72 relative overflow-hidden">
                <img src={startup.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt={startup.name} />
                <div className="absolute top-8 left-8 flex gap-3">
                  {startup.isTrending && <span className="bg-orange-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Trending</span>}
                  <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">{startup.category}</span>
                </div>
              </div>
              <div className="p-12">
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{startup.name}</h3>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Founded by {startup.founder}</p>
                <p className="text-slate-500 text-base font-medium leading-relaxed mb-12 line-clamp-2 opacity-80">{startup.tagline}</p>
                <button className="w-full bg-slate-50 text-slate-900 py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">Explore Venture <ChevronLeft size={20} className="rotate-180" /></button>
              </div>
            </div>
          ))}
        </div>

        {selectedStartup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedStartup(null)}></div>
            <div className="relative bg-white w-full max-w-6xl rounded-[5rem] overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
                <div className="p-12 md:p-20">
                    <div className="flex justify-between items-center mb-12">
                      <button onClick={() => setSelectedStartup(null)} className="flex items-center gap-4 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all"><ChevronLeft size={24} /> Back to Showcase</button>
                      <button onClick={() => setSelectedStartup(null)} className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-inner"><X size={28} /></button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                      <div className="space-y-10">
                        <div className="rounded-[4rem] overflow-hidden shadow-2xl aspect-[16/10] lg:aspect-square bg-slate-50 ring-1 ring-black/5">
                          <img src={selectedStartup.image} className="w-full h-full object-cover" alt={selectedStartup.name} />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between pt-4">
                        <div>
                          <div className="inline-flex gap-3 mb-8">
                            <span className="bg-blue-600/10 text-blue-600 px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-600/10">{selectedStartup.category}</span>
                            {selectedStartup.isTrending && <span className="bg-orange-500/10 text-orange-600 px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-orange-500/10 flex items-center gap-2"><TrendingUp size={14} /> Trending</span>}
                          </div>
                          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-[0.9]">{selectedStartup.name}</h1>
                          <p className="text-blue-600 text-xl font-bold italic mb-10 tracking-tight leading-relaxed">{selectedStartup.tagline}</p>
                          <p className="text-slate-600 text-lg leading-relaxed font-medium opacity-90">{selectedStartup.description}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
                           <button onClick={() => onStartChat(selectedStartup.founder)} className="bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"><MessageCircle size={22} /> Contact Founder</button>
                           <button className="bg-white border-2 border-slate-100 text-slate-900 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"><ExternalLink size={20} /> Visit Website</button>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative bg-[#1E2128] text-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up p-10">
              <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-black tracking-tight">Showcase Startup</h2><button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white"><X size={28} /></button></div>
              <form className="space-y-8" onSubmit={handleAddStartup}>
                <div className="space-y-5">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Startup Name *</label><input name="name" required placeholder="e.g. EcoBox" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold outline-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">One Liner *</label><input name="tagline" required placeholder="Brief mission statement" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold outline-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400">Category</label><select name="category" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-xs font-black uppercase outline-none">{categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-105 transition-all">Submit for Showcase</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupShowcase;