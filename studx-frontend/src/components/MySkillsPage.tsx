import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { Plus, Trash2, ShieldCheck, Trophy, ChevronRight, Zap, Image as ImageIcon, Award, Loader, Star } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

interface Skill {
  _id: string;
  skillName: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  verificationType: string;
  verificationStatus: string;
  badge: string;
  testScore?: number;
  testCompleted: boolean;
  mediaProofs: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  createdAt: string;
}

interface MySkillsPageEnhancedProps {
  onBack: () => void;
  onAdd: () => void;
  onNavigate: (s: AppState) => void;
}

const MySkillsPageEnhanced: React.FC<MySkillsPageEnhancedProps> = ({ onAdd, onNavigate }) => {
  const { user } = useAuth();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Fetch skills from backend
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/skills/my-skills`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }

      const data = await response.json();
      setSkills(data.skills || []);
    } catch (err: any) {
      console.error('Fetch skills error:', err);
      setError(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await fetch(`${API_BASE}/skills/${skillId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete skill');
      }

      // Remove from local state
      setSkills(prev => prev.filter(s => s._id !== skillId));
    } catch (err: any) {
      console.error('Delete skill error:', err);
      alert(err.message || 'Failed to delete skill');
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Master':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'Expert':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Verified':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-slate-300 text-slate-700';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Master':
        return <Trophy size={14} />;
      case 'Expert':
        return <Award size={14} />;
      case 'Verified':
        return <ShieldCheck size={14} />;
      default:
        return <Star size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-slate-600 font-bold">Loading your skills...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />
      
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">My Verified Skills</h1>
            <p className="text-slate-500 font-medium">
              {skills.length} skill{skills.length !== 1 ? 's' : ''} verified
            </p>
          </div>
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-3"
          >
            <Plus size={20} /> Add New Skill
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-8">
               <Zap size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">No skills added yet</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">
              Verified skills help you stand out in the campus marketplace and skill exchange
            </p>
            <button 
              onClick={onAdd} 
              className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
            >
              Start Verification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             {skills.map((skill, idx) => (
               <div 
                 key={skill._id} 
                 className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-2xl transition-all animate-fade-in-up"
                 style={{ animationDelay: `${idx * 0.1}s` }}
               >
                 <div className="flex items-start gap-6">
                   {/* Icon */}
                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg flex-shrink-0">
                      {skill.skillName[0]}
                   </div>

                   {/* Content */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between mb-3">
                       <div>
                         <h3 className="text-2xl font-black text-slate-900 mb-2">{skill.skillName}</h3>
                         <div className="flex items-center gap-3 flex-wrap">
                           {/* Badge */}
                           <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${getBadgeColor(skill.badge)}`}>
                              {getBadgeIcon(skill.badge)}
                              {skill.badge}
                           </div>

                           {/* Level */}
                           <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                             {skill.level}
                           </span>

                           {/* Category */}
                           <span className="text-slate-400 text-sm font-medium">
                             {skill.category}
                           </span>
                         </div>
                       </div>
                     </div>

                     {/* Stats */}
                     <div className="flex items-center gap-6 mt-4">
                       {skill.testCompleted && skill.testScore !== undefined && (
                         <div className="flex items-center gap-2 text-sm">
                           <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                             <Trophy className="text-blue-600" size={16} />
                           </div>
                           <div>
                             <p className="text-slate-400 text-xs font-medium">Test Score</p>
                             <p className="text-slate-900 font-black">{skill.testScore}%</p>
                           </div>
                         </div>
                       )}

                       {skill.mediaProofs && skill.mediaProofs.length > 0 && (
                         <button
                           onClick={() => {
                             setSelectedSkill(skill);
                             setShowMediaModal(true);
                           }}
                           className="flex items-center gap-2 text-sm bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-all"
                         >
                           <ImageIcon size={16} />
                           {skill.mediaProofs.length} Proof{skill.mediaProofs.length !== 1 ? 's' : ''}
                         </button>
                       )}

                       <div className="flex items-center gap-2 text-sm text-slate-400">
                         <span className="text-xs">Added {new Date(skill.createdAt).toLocaleDateString()}</span>
                       </div>
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-3">
                     <button className="p-4 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={20} />
                     </button>
                     <button 
                       onClick={() => handleDelete(skill._id)} 
                       className="p-4 bg-rose-50 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 size={20} />
                     </button>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Media Modal */}
      {showMediaModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setShowMediaModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                Verification Proofs - {selectedSkill.skillName}
              </h2>
              <button
                onClick={() => setShowMediaModal(false)}
                className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                <Zap size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSkill.mediaProofs.map((media, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                  {media.type === 'image' ? (
                    <img src={media.url} alt={media.description} className="w-full h-64 object-cover" />
                  ) : (
                    <video src={media.url} controls className="w-full h-64 object-cover" />
                  )}
                  <div className="p-4">
                    <p className="text-sm font-medium text-slate-700">{media.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default MySkillsPageEnhanced;
