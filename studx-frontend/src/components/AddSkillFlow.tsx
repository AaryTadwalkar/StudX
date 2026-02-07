import React, { useState } from 'react';
import type { AppState, SkillExchange, SkillLevel, VerificationType } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, ChevronRight, Code, Music, Briefcase, GraduationCap, Zap, CheckCircle, ShieldCheck, Info, X, Trophy, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { getAuthHeaders } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

interface AddSkillFlowProps {
  onBack: () => void;
  onComplete: (skill: SkillExchange) => void;
  onNavigate: (s: AppState) => void;
}

// --- 1. LOCAL TEST DATABASE (Add your skills here) ---
const testDatabase: Record<string, { mcqs: any[], coding: any[] }> = {
  'React': {
    mcqs: [
      { q: 'What is the primary purpose of useEffect?', options: ['Side effects', 'State', 'Routing', 'Styling'], correct: 0 },
      { q: 'How do you prevent re-renders?', options: ['useMemo', 'useState', 'useEffect', 'useRef'], correct: 0 },
      { q: 'What is the virtual DOM?', options: ['A copy of DOM', 'Direct DOM', 'Browser Engine', 'API'], correct: 0 },
      { q: 'Which hook manages state?', options: ['useEffect', 'useState', 'useReducer', 'useContext'], correct: 1 },
      { q: 'Parent to child data passing is done via?', options: ['State', 'Props', 'Redux', 'Context'], correct: 1 }
    ],
    coding: [
      { q: 'Create a component that prints "Hello"', expected: ['function', 'return', 'Hello'] },
      { q: 'Use useState to toggle a button', expected: ['useState', 'onClick', 'set'] },
      { q: 'Map through a list of items', expected: ['.map', 'key', 'return'] }
    ]
  },
  'Node.js': {
    mcqs: [
      { q: 'What is Node.js?', options: ['Framework', 'Runtime', 'Language', 'Database'], correct: 1 },
      { q: 'Which module handles file systems?', options: ['http', 'fs', 'path', 'os'], correct: 1 },
      { q: 'What is npm?', options: ['Package Manager', 'Module', 'Server', 'Framework'], correct: 0 },
      { q: 'Default local server port usually is?', options: ['3000', '8080', '5000', 'Any'], correct: 3 },
      { q: 'How to import modules in ES6?', options: ['require', 'import', 'include', 'fetch'], correct: 1 }
    ],
    coding: [
      { q: 'Create a simple HTTP server', expected: ['createServer', 'listen', 'http'] },
      { q: 'Read a file named "data.txt"', expected: ['fs.readFile', 'data.txt', 'err'] },
      { q: 'Export a function named "add"', expected: ['module.exports', 'export', 'add'] }
    ]
  }
  // Add more skills here...
};

const AddSkillFlow: React.FC<AddSkillFlowProps> = ({ onBack, onComplete, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SkillExchange>>({
    offering: '',
    category: '',
    level: 'Beginner' as SkillLevel,
    tags: [],
    verificationBadge: 'Self-declared'
  });
  
  const [customSkill, setCustomSkill] = useState('');
  const [testResult, setTestResult] = useState<{ score: number; total: number; badge: VerificationType } | null>(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  
  // --- 2. NEW MEDIA STATE ---
  const [mediaProof, setMediaProof] = useState<{data: string, type: 'image' | 'video', name: string} | null>(null);

  const categories = [
    { name: 'Technical', icon: <Code />, items: ['Web', 'Mobile', 'AI/ML', 'Data', 'DevOps', 'Cyber'] },
    { name: 'Creative / Artistic', icon: <Music />, items: ['Design', 'Music', 'Art', 'Video', 'Photography'] },
    { name: 'Professional / Business', icon: <Briefcase />, items: ['Marketing', 'Finance', 'Product', 'Sales'] },
    { name: 'Academic / Tutoring', icon: <GraduationCap />, items: ['Math', 'Science', 'Programming'] },
    { name: 'Physical / Lifestyle', icon: <Zap />, items: ['Fitness', 'Dance', 'Sports'] },
  ];

  const skillOptionsMap: Record<string, string[]> = {
    'Technical': ['React', 'Node.js', 'Python', 'Java', 'C++', 'JavaScript', 'AI/ML', 'DevOps'],
    'Creative / Artistic': ['UI Design', 'Music Production', 'Photography', 'Video Editing', 'Graphic Design'],
    'Professional / Business': ['Marketing', 'Finance', 'Sales', 'Public Speaking', 'Management'],
    'Academic / Tutoring': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'],
    'Physical / Lifestyle': ['Fitness Coaching', 'Yoga', 'Dance', 'Football', 'Cricket'],
  };

  const currentSkillOptions = formData.category ? [...(skillOptionsMap[formData.category] || []), 'Other (Type below)'] : ['Other (Type below)'];

  // --- 3. FILE UPLOAD HANDLER ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (limit to 5MB for base64 safety)
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Please upload under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaProof({
        data: reader.result as string,
        type: file.type.startsWith('video') ? 'video' : 'image',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // --- 4. SUBMIT FUNCTION ---
  const submitSkill = async () => {
    try {
      const finalSkillName = formData.offering === 'Other (Type below)' ? customSkill : formData.offering || 'Unknown';
      
      // Determine verification type dynamically
      let verificationType = 'self-declared';
      if (testResult && mediaProof) verificationType = 'both';
      else if (testResult) verificationType = 'test';
      else if (mediaProof) verificationType = 'media';

      const badgeStatus = testResult?.badge || 'Self-declared';

      // 1. Create the Skill
      const response = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          skillName: finalSkillName,
          category: formData.category,
          level: formData.level,
          verificationType,
          badge: badgeStatus,
          testScore: testResult?.score,
          description: `Skill added via StudX. ${mediaProof ? 'Includes media proof.' : ''}`,
          experience: ''
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create skill');
      }

      const data = await response.json();
      
      // 2. Upload Media if selected
      if (mediaProof) {
        await fetch(`${API_BASE}/skills/media-proof`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            skillId: data.skill._id,
            mediaType: mediaProof.type,
            description: `Proof for ${finalSkillName}`,
            image: mediaProof.data
          })
        });
      }

      // Success!
      onComplete(data.skill); 
      onNavigate('my-skills');

    } catch (error: any) {
      console.error('Create skill error:', error);
      alert(`Failed to create skill: ${error.message}`);
    }
  };

  // Check if we have a test for this skill
  const targetSkill = formData.offering === 'Other (Type below)' ? customSkill : formData.offering;
  const availableTest = testDatabase[targetSkill || ''];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {!isTakingTest && (
          <div className="flex items-center justify-between mb-12">
             <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors"><ChevronLeft size={20} /> Back</button>
             <div className="flex gap-3">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`h-2.5 w-14 rounded-full transition-all duration-700 ${step >= s ? (step === s ? 'bg-blue-600 w-24 shadow-lg shadow-blue-100' : 'bg-blue-200') : 'bg-slate-200'}`}></div>
                ))}
             </div>
          </div>
        )}

        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Select Category</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(cat => (
                <div 
                  key={cat.name} 
                  onClick={() => { setFormData({...formData, category: cat.name, offering: ''}); setStep(2); }}
                  className={`p-10 bg-white border-2 rounded-[3rem] flex items-center gap-8 cursor-pointer hover:shadow-2xl transition-all group ${formData.category === cat.name ? 'border-blue-600 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:-translate-y-1'}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.items.join(' • ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-10 max-w-2xl mx-auto bg-white p-12 rounded-[4rem] shadow-xl border border-slate-50">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Skill Details</h1>
            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select {formData.category} Skill</label>
                 <select 
                   className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 px-8 font-black text-lg text-slate-900 outline-none"
                   value={formData.offering}
                   onChange={e => setFormData({...formData, offering: e.target.value})}
                 >
                    <option value="">Choose a skill...</option>
                    {currentSkillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               {formData.offering === 'Other (Type below)' && (
                 <div className="space-y-3">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type Skill Name</label>
                   <input 
                     placeholder="Enter your skill" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 px-8 font-black text-lg text-slate-900 outline-none" 
                     value={customSkill}
                     onChange={e => setCustomSkill(e.target.value)}
                   />
                 </div>
               )}

               <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Level</label>
                 <div className="flex gap-4">
                   {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                     <button key={lvl} onClick={() => setFormData({...formData, level: lvl as SkillLevel})} className={`flex-1 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest border-2 transition-all ${formData.level === lvl ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400'}`}>{lvl}</button>
                   ))}
                 </div>
               </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={() => setStep(1)} className="px-8 py-5 rounded-[1.5rem] bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-100">Back</button>
              <button disabled={!formData.offering} onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-700">Next: Verification</button>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFICATION */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-10 max-w-4xl mx-auto">
            {isTakingTest ? (
              <InlineSkillTest 
                skillName={targetSkill || 'Skill'}
                questions={availableTest}
                onComplete={(res) => { 
                  let badge: VerificationType = 'Self-declared';
                  if (res.score >= 8) badge = 'Verified (Intermediate)';
                  else if (res.score >= 5) badge = 'Verified (Basic)';
                  setTestResult({ ...res, badge }); 
                  setIsTakingTest(false);
                }} 
                onCancel={() => setIsTakingTest(false)} 
              />
            ) : (
              <>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Verify {targetSkill}</h1>
                <p className="text-slate-500 text-lg font-medium">Choose a method to earn your verified badge.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OPTION 1: SKILL TEST */}
                  {availableTest ? (
                    <div className={`bg-white p-10 rounded-[3rem] border-2 cursor-pointer transition-all hover:shadow-xl ${testResult ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-100 hover:border-blue-500'}`} onClick={() => setIsTakingTest(true)}>
                      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6">
                        <GraduationCap size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Take Skill Test</h3>
                      <p className="text-sm text-slate-500 font-bold mb-4">8 Questions • 10 Minutes</p>
                      {testResult ? (
                        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black inline-block">Score: {testResult.score}/11</div>
                      ) : (
                        <div className="text-blue-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">Start Test <ChevronRight size={16}/></div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 opacity-60">
                       <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400 mb-6"><GraduationCap size={40} /></div>
                       <h3 className="text-xl font-black text-slate-400">No Test Available</h3>
                       <p className="text-sm text-slate-400 font-bold mt-2">Test verification is not yet available for this skill.</p>
                    </div>
                  )}

                  {/* OPTION 2: MEDIA UPLOAD */}
                  <div className={`bg-white p-10 rounded-[3rem] border-2 cursor-pointer transition-all hover:shadow-xl ${mediaProof ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-slate-100 hover:border-purple-500'}`} onClick={() => document.getElementById('media-upload')?.click()}>
                    <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-600 mb-6">
                      {mediaProof?.type === 'video' ? <Video size={40} /> : <ImageIcon size={40} />}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Upload Proof</h3>
                    <p className="text-sm text-slate-500 font-bold mb-4">Certificates, Projects, Demo</p>
                    
                    <input type="file" id="media-upload" className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                    
                    {mediaProof ? (
                      <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl text-sm font-black inline-block truncate max-w-full">{mediaProof.name}</div>
                    ) : (
                      <div className="text-purple-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">Upload File <Upload size={16}/></div>
                    )}
                  </div>
                </div>

                <div className="pt-8">
                   <button onClick={() => setStep(4)} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl">
                     Continue to Review
                   </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="animate-fade-in-up space-y-12 text-center max-w-2xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100">
             <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <ShieldCheck size={64} />
             </div>
             
             <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Confirm Skill</h1>
             
             <div className="text-left bg-slate-50 p-8 rounded-3xl space-y-4">
                <div className="flex justify-between">
                   <span className="font-bold text-slate-400">Skill</span>
                   <span className="font-black text-slate-900">{targetSkill}</span>
                </div>
                <div className="flex justify-between">
                   <span className="font-bold text-slate-400">Test Score</span>
                   <span className="font-black text-slate-900">{testResult ? `${testResult.score}/11` : 'Skipped'}</span>
                </div>
                <div className="flex justify-between">
                   <span className="font-bold text-slate-400">Media Proof</span>
                   <span className="font-black text-slate-900">{mediaProof ? 'Attached' : 'None'}</span>
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 py-5 bg-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200">Back</button>
                <button onClick={submitSkill} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105">Confirm & Publish</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 5. GENERIC INLINE TEST COMPONENT ---
const InlineSkillTest: React.FC<{ 
  skillName: string; 
  questions: any; 
  onComplete: (res: {score: number; total: number}) => void; 
  onCancel: () => void 
}> = ({ skillName, questions, onComplete, onCancel }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typingInput, setTypingInput] = useState('');

  const mcqs = questions?.mcqs || [];
  const coding = questions?.coding || [];
  const totalQs = mcqs.length + coding.length;

  const currentSection = qIndex < mcqs.length ? 'MCQ' : 'Coding';
  
  const handleAnswer = (correct?: boolean) => {
    let newScore = score;
    if (currentSection === 'MCQ') {
      if (correct) newScore += 1;
    } else {
      // Coding logic (simple keyword check)
      const input = typingInput.toLowerCase();
      const expected = coding[qIndex - mcqs.length].expected;
      const matches = expected.filter((w: string) => input.includes(w.toLowerCase())).length;
      if (matches >= expected.length * 0.7) newScore += 2;
    }
    
    setScore(newScore);
    if (qIndex + 1 < totalQs) {
      setQIndex(qIndex + 1);
      setTypingInput('');
    } else {
      onComplete({ score: newScore, total: totalQs * 1 + coding.length }); // Approx total points
    }
  };

  const currentQ = currentSection === 'MCQ' ? mcqs[qIndex] : coding[qIndex - mcqs.length];

  return (
    <div className="bg-[#1E2128] p-12 rounded-[3rem] text-white max-w-4xl mx-auto shadow-2xl relative">
       <button onClick={onCancel} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X /></button>
       <div className="mb-8">
         <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{skillName} Test</span>
         <span className="ml-4 text-slate-500 text-xs font-bold uppercase tracking-widest">{currentSection} • Q{qIndex + 1}/{totalQs}</span>
       </div>
       
       <h2 className="text-2xl font-bold mb-10">{currentQ.q}</h2>

       {currentSection === 'MCQ' ? (
         <div className="grid grid-cols-1 gap-4">
           {currentQ.options.map((opt: string, i: number) => (
             <button key={i} onClick={() => handleAnswer(i === currentQ.correct)} className="p-6 bg-slate-800 rounded-2xl text-left hover:bg-blue-600 transition-all font-bold text-sm text-slate-300 hover:text-white">
               {opt}
             </button>
           ))}
         </div>
       ) : (
         <div className="space-y-6">
           <textarea 
             className="w-full h-48 bg-black/30 rounded-2xl p-6 font-mono text-blue-400 outline-none border border-slate-700 focus:border-blue-500 transition-all"
             placeholder="// Type your code here..."
             value={typingInput}
             onChange={e => setTypingInput(e.target.value)}
           />
           <button onClick={() => handleAnswer()} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Submit Answer</button>
         </div>
       )}
    </div>
  );
};

export default AddSkillFlow;