
import React from 'react';
import type { SkillExchange, AppState } from '../types';
import { GlobalNav } from './HomePage';
import { Plus, Trash2, ShieldCheck, Star, ChevronRight, Zap } from 'lucide-react';

interface MySkillsPageProps {
  skills: SkillExchange[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onNavigate: (s: AppState) => void;
}

const MySkillsPage: React.FC<MySkillsPageProps> = ({ skills, onDelete, onAdd, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />
      
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">My Skills</h1>
            <p className="text-slate-500 font-medium">Manage your verified skills and exchange requests.</p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-3"
          >
            <Plus size={20} /> Add New Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-8">
               <Zap size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">You haven't added any skills yet</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">Verified skills help you get noticed for exchange and startup roles.</p>
            <button onClick={onAdd} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl">Start Verification</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             {skills.map((skill, idx) => (
               <div key={skill.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center gap-8 group animate-fade-in-up hover:shadow-xl transition-all" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-black">
                     {skill.offering[0]}
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-slate-900">{skill.offering}</h3>
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                           <ShieldCheck size={12} /> {skill.verificationBadge || 'Self-Declared'}
                        </div>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span>Level: <span className="text-blue-600">{skill.level || 'Beginner'}</span></span>
                        <span>Category: {skill.category}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="p-4 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                        <ChevronRight size={20} />
                     </button>
                     <button onClick={() => onDelete(skill.id)} className="p-4 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                        <Trash2 size={20} />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySkillsPage;
