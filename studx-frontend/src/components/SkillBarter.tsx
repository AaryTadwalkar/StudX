
import React, { useState } from 'react';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, Search, Star, MessageSquare, Plus, X, ShieldCheck, Clock, Target, UserCheck, SearchX, ArrowRightLeft } from 'lucide-react';

interface SkillExchange {
  id: string;
  user: string;
  offering: string;
  requesting: string;
  tags: string[];
  type: 'OFFERING' | 'REQUESTING';
  rating: number;
  exchangeValue: string;
  description: string;
  category: string;
  verificationBadge: string;
}

const SkillBarter: React.FC<{ onBack: () => void; onNavigate: (s: AppState) => void; onStartChat: (name: string) => void }> = ({ onBack, onNavigate, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<SkillExchange | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  // Mock student profiles with skills for search results
  const studentProfiles: SkillExchange[] = [
    { 
      id: 'p1',
      user: 'Rahul Sharma', 
      offering: 'React Website Development', 
      requesting: 'Guitar Basics', 
      tags: ['React', 'TypeScript', 'Tailwind'],
      type: 'OFFERING',
      rating: 4.8,
      exchangeValue: 'Backend Help',
      description: 'Expert in building responsive landing pages.',
      category: 'Technology',
      verificationBadge: 'Verified (Intermediate)'
    },
    { 
      id: 'p2',
      user: 'Sarah Khan', 
      offering: 'Python Data Analysis', 
      requesting: 'Graphic Design', 
      tags: ['Python', 'Pandas', 'NumPy'],
      type: 'OFFERING',
      rating: 4.9,
      exchangeValue: 'Design Lesson',
      description: 'Can help with Pandas and Matplotlib.',
      category: 'Technology',
      verificationBadge: 'Verified (Intermediate)'
    },
    { 
      id: 'p3',
      user: 'Amit Verma', 
      offering: 'Calculus Tutoring', 
      requesting: 'Web Basics', 
      tags: ['Math', 'Calculus'],
      type: 'OFFERING',
      rating: 4.7,
      exchangeValue: 'HTML/CSS Basics',
      description: 'Integration and derivation expert.',
      category: 'Academic',
      verificationBadge: 'Self-declared'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setIsSearched(true);
  };

  const filteredProfiles = studentProfiles.filter(p => 
    p.offering.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in-up">
           <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">Find <span className="text-blue-600">Expertise</span></h1>
           <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">Search for peers by skill. Accounts only visible via specific skill search.</p>
        </div>

        <div className="max-w-3xl mx-auto mb-20 animate-fade-in-up">
           <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={28} />
              <input 
                type="text" 
                placeholder="Search by skill (e.g. React, Java, Calculus)" 
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[2.5rem] border border-slate-200 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-lg text-slate-900 shadow-xl"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all">Search</button>
           </form>
        </div>

        {isSearched ? (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900">Found {filteredProfiles.length} Student Profiles for "{searchQuery}"</h2>
              <button onClick={() => { setIsSearched(false); setSearchQuery(''); }} className="text-slate-400 hover:text-rose-500 font-bold text-sm flex items-center gap-2 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">Clear Search <X size={16} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProfiles.map((p, idx) => (
                <div key={p.id} onClick={() => setSelectedProfile(p)} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/10 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-14 h-14 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 text-xl font-black">{p.user[0]}</div>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 leading-none mb-1">{p.user}</h3>
                          <div className="flex items-center gap-1.5 text-amber-500 font-black text-[11px]"><Star size={12} fill="currentColor" /> {p.rating}</div>
                       </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                       <div>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Expert in</p>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{p.offering}</h4>
                       </div>
                       <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                          <ArrowRightLeft size={16} className="text-slate-400 shrink-0" />
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Looking for</p>
                            <p className="text-sm font-bold text-slate-700 leading-tight">{p.requesting}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map(tag => <span key={tag} className="bg-white border border-slate-100 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">#{tag}</span>)}
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">View Full Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
             <SearchX size={64} className="mx-auto mb-6 text-slate-300" />
             <p className="font-black text-slate-400 uppercase tracking-widest">Search to discover peers with specific expertise</p>
          </div>
        )}
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedProfile(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto p-10 md:p-16">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-4 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all"><ChevronLeft size={24} /> Back to Search</button>
                <button onClick={() => setSelectedProfile(null)} className="w-12 h-12 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-10">
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-900 flex items-center justify-center relative">
                    <img src={`https://picsum.photos/seed/${selectedProfile.id}/1200/800`} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-900 text-4xl font-black relative z-10 shadow-2xl">{selectedProfile.user[0]}</div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-start gap-6">
                     <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0"><Target size={24} /></div>
                     <div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Exchange Preference</span>
                       <div className="text-xl font-black text-blue-600 leading-tight">{selectedProfile.exchangeValue}</div>
                     </div>
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col justify-between py-2">
                  <div>
                    <div className="inline-flex gap-2 mb-6">
                       <span className="bg-blue-600 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">OFFERING</span>
                       <span className="bg-slate-900 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">{selectedProfile.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">{selectedProfile.offering}</h1>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium mb-10 opacity-90">{selectedProfile.description}</p>
                    
                    <div className="flex items-center gap-6 p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-black shadow-xl shrink-0">{selectedProfile.user[0]}</div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Campus Mentor</p>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedProfile.user}</h3>
                           <div className="text-emerald-600 font-black text-[11px] flex items-center gap-2 mt-1"><ShieldCheck size={14} /> {selectedProfile.verificationBadge}</div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-12">
                     <button onClick={() => onStartChat(selectedProfile.user)} className="bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"><MessageSquare size={20} /> Message</button>
                     <button className="bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"><UserCheck size={20} /> Connect</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBarter;
