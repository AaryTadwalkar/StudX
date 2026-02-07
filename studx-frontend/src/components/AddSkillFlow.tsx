
import React, { useState } from 'react';
import type { AppState, SkillExchange, SkillLevel, VerificationType } from '../types';
import { GlobalNav } from './HomePage';
import { ChevronLeft, ChevronRight, Code, Music, Briefcase, GraduationCap, Zap, CheckCircle, ShieldCheck, Info, X, Trophy } from 'lucide-react';

interface AddSkillFlowProps {
  onBack: () => void;
  onComplete: (skill: SkillExchange) => void;
  onNavigate: (s: AppState) => void;
}

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

  const skillOptionsMap: Record<string, string[]> = {
    'Technical': ['React', 'JavaScript', 'Python', 'Java', 'C++', 'Node.js', 'AI/ML', 'DevOps'],
    'Creative / Artistic': ['UI Design', 'Music Production', 'Photography', 'Video Editing', 'Graphic Design', '3D Modeling'],
    'Professional / Business': ['Marketing', 'Finance', 'Sales', 'Public Speaking', 'Management', 'Networking'],
    'Academic / Tutoring': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'History'],
    'Physical / Lifestyle': ['Fitness Coaching', 'Yoga', 'Dance', 'Football', 'Cricket', 'Nutrition'],
  };

  const categories = [
    { name: 'Technical', icon: <Code />, items: ['Web', 'Mobile', 'AI/ML', 'Data', 'DevOps', 'Cyber'] },
    { name: 'Creative / Artistic', icon: <Music />, items: ['Design', 'Music', 'Art', 'Video', 'Photography'] },
    { name: 'Professional / Business', icon: <Briefcase />, items: ['Marketing', 'Finance', 'Product', 'Sales'] },
    { name: 'Academic / Tutoring', icon: <GraduationCap />, items: ['Math', 'Science', 'Programming'] },
    { name: 'Physical / Lifestyle', icon: <Zap />, items: ['Fitness', 'Dance', 'Sports'] },
  ];

  const currentSkillOptions = formData.category ? [...skillOptionsMap[formData.category], 'Other (Type below)'] : ['Other (Type below)'];

  const handleComplete = () => {
    const finalOffering = formData.offering === 'Other (Type below)' ? customSkill : formData.offering;
    onComplete({
      id: Date.now().toString(),
      user: 'Current User',
      offering: finalOffering || 'New Skill',
      requesting: 'Open for offers',
      tags: formData.tags || [],
      type: 'OFFERING',
      rating: 5.0,
      category: formData.category,
      level: formData.level,
      verificationBadge: testResult?.badge || 'Self-declared',
    });
  };

  const isReactSkill = (formData.offering === 'React');

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

        {step === 1 && (
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Select Category</h1>
            <p className="text-slate-500 text-lg mb-12 font-medium">Choose the domain that best fits your skill.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(cat => (
                <div 
                  key={cat.name} 
                  onClick={() => { setFormData({...formData, category: cat.name, offering: ''}); setStep(2); }}
                  className={`p-10 bg-white border-2 rounded-[3rem] flex items-center gap-8 cursor-pointer hover:shadow-2xl transition-all group ${formData.category === cat.name ? 'border-blue-600 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:-translate-y-1'}`}
                >
                  <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 ${formData.category === cat.name ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 shadow-inner'}`}>
                    {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 36 })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{cat.items.join(' • ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up space-y-10 max-w-2xl mx-auto bg-white p-12 rounded-[4rem] shadow-xl border border-slate-50">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Skill Details</h1>
            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select {formData.category} Skill</label>
                 <select 
                   className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 px-8 font-black text-lg text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
                   value={formData.offering}
                   onChange={e => setFormData({...formData, offering: e.target.value})}
                 >
                    <option value="">Choose a skill...</option>
                    {currentSkillOptions.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               {formData.offering === 'Other (Type below)' && (
                 <div className="space-y-3 animate-fade-in">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type Skill Name</label>
                   <input 
                     placeholder="Enter your skill" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-5 px-8 font-black text-lg text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" 
                     value={customSkill}
                     onChange={e => setCustomSkill(e.target.value)}
                   />
                 </div>
               )}

               <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Level</label>
                 <div className="flex gap-4">
                   {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                     <button key={lvl} onClick={() => setFormData({...formData, level: lvl as SkillLevel})} className={`flex-1 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest border-2 transition-all ${formData.level === lvl ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>{lvl}</button>
                   ))}
                 </div>
               </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button onClick={() => setStep(1)} className="px-8 py-5 rounded-[1.5rem] bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
              <button disabled={!formData.offering} onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-200 disabled:opacity-50 hover:bg-blue-700 transition-all">Next: Verification</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up space-y-10 max-w-4xl mx-auto">
            {isTakingTest ? (
              <ReactSkillTest 
                level={formData.level || 'Intermediate'}
                onComplete={(res) => { 
                  let badge: VerificationType = 'Self-declared';
                  if (res.score >= 8) badge = 'Verified (Intermediate)';
                  else if (res.score >= 5) badge = 'Verified (Basic)';
                  
                  setTestResult({ ...res, badge }); 
                  setStep(4); 
                }} 
                onCancel={() => setIsTakingTest(false)} 
              />
            ) : (
              <>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Skill Verification</h1>
                <p className="text-slate-500 text-lg font-medium">Verify your expertise to earn a trusted campus badge.</p>
                
                <div className="grid grid-cols-1 gap-6">
                  {isReactSkill ? (
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all" onClick={() => setIsTakingTest(true)}>
                      <div className="flex gap-10 items-center">
                         <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-inner ring-1 ring-blue-100/50"><GraduationCap size={48} /></div>
                         <div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Intermediate React Demo Test</h3>
                            <p className="text-base font-medium text-slate-400 max-w-lg">8 Hybrid Questions (MCQ + Code). Test your side-effects, state management, and list rendering knowledge.</p>
                            <div className="flex gap-6 mt-4">
                               <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">11 Total Points</span>
                               <span className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">10 Minutes</span>
                            </div>
                         </div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ChevronRight size={32} /></div>
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all" onClick={() => { setTestResult({score: 11, total: 11, badge: 'Verified (Intermediate)'}); setStep(4); }}>
                      <div className="flex gap-10 items-center">
                         <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner ring-1 ring-emerald-100/50"><ShieldCheck size={48} /></div>
                         <div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Quick Verification</h3>
                            <p className="text-base font-medium text-slate-400 max-w-lg">Standard proficiency check for {formData.offering === 'Other (Type below)' ? customSkill : formData.offering}. One-click verification active for this category.</p>
                         </div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"><CheckCircle size={32} /></div>
                    </div>
                  )}
                  
                  <button onClick={() => {setTestResult(null); setStep(4)}} className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-900 mt-10 underline decoration-slate-200 flex items-center justify-center gap-2">Skip for now (Continue with Self-declared)</button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in-up space-y-12 text-center max-w-2xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100">
             <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner ring-8 ${testResult?.score && testResult.score >= 5 ? 'bg-emerald-50 text-emerald-600 ring-emerald-50/50' : 'bg-slate-50 text-slate-400 ring-slate-100/50'}`}>
               {testResult?.score && testResult.score >= 5 ? <Trophy size={64} /> : <Info size={64} />}
             </div>
             <div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Review & Confirm</h1>
                <div className="bg-slate-50 rounded-[3rem] p-10 text-left space-y-8 border border-slate-100">
                   <div className="flex justify-between items-center border-b border-slate-200/50 pb-5">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Skill Name</span>
                      <span className="font-black text-slate-900 text-xl">{formData.offering === 'Other (Type below)' ? customSkill : formData.offering}</span>
                   </div>
                   {testResult && (
                     <div className="flex justify-between items-center border-b border-slate-200/50 pb-5">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Technical Score</span>
                        <span className={`font-black text-lg ${testResult.score >= 8 ? 'text-emerald-600' : (testResult.score >= 5 ? 'text-blue-600' : 'text-slate-600')}`}>
                          {testResult.score} / {testResult.total} Points
                        </span>
                     </div>
                   )}
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Badge Tier</span>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className={testResult?.score && testResult.score >= 5 ? 'text-emerald-600' : 'text-slate-400'} />
                        <span className="font-black text-slate-900">{testResult?.badge || 'Self-declared'}</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-100 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Edit Details</button>
                <button onClick={handleComplete} className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Confirm & Publish</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReactSkillTest: React.FC<{ level: string; onComplete: (res: {score: number; total: number}) => void; onCancel: () => void }> = ({ level, onComplete, onCancel }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typingInput, setTypingInput] = useState('');

  const mcqs = [
    { q: 'What is the primary purpose of useEffect in React?', options: ['To create components', 'To manage state', 'To handle side effects', 'To render JSX'], correct: 2 }, // C
    { q: 'Which correctly updates state based on previous state?', options: ['setCount(count + 1)', 'setCount = count + 1', 'setCount(prev => prev + 1)', 'count++'], correct: 2 }, // C
    { q: 'What happens when a component’s state changes?', options: ['Only state updates', 'Component re-renders', 'DOM reloads', 'Page refreshes'], correct: 1 }, // B
    { q: 'Which prop is required when rendering a list in React?', options: ['id', 'index', 'key', 'value'], correct: 2 }, // C
    { q: 'JSX is best defined as:', options: ['A template engine', 'HTML inside JavaScript', 'Syntax extension for JS', 'A React compiler'], correct: 2 }  // C
  ];

  const typingQuestions = [
    { 
      q: 'Write a functional React component called Greeting that displays: "Hello, User!"', 
      expected: ['function Greeting', 'return', '<h1>Hello, User!</h1>'] 
    },
    { 
      q: 'Fix the error in the following code: <button onClick={setCount(count + 1)}>', 
      expected: ['=> setCount(count + 1)', 'onClick={() =>'] 
    },
    { 
      q: 'Write a React snippet that renders items: ["Apple", "Banana", "Mango"] in a list.', 
      expected: ['items.map', 'key={', '<li>', '<ul>'] 
    }
  ];

  const currentSection = qIndex < 5 ? 'MCQ' : 'Typing';
  const displayIndex = currentSection === 'MCQ' ? qIndex : qIndex - 5;

  const handleNextSection = (choiceIndex?: number) => {
    let earned = 0;
    if (currentSection === 'MCQ') {
      if (choiceIndex === mcqs[qIndex].correct) earned = 1;
    } else {
      const input = typingInput.toLowerCase().replace(/\s/g, '');
      const keywords = typingQuestions[qIndex - 5].expected;
      let matches = 0;
      keywords.forEach(kw => {
        if (input.includes(kw.toLowerCase().replace(/\s/g, ''))) matches++;
      });
      // 2 points if most keywords present
      if (matches >= Math.ceil(keywords.length * 0.75)) earned = 2;
    }

    const newScore = score + earned;
    setScore(newScore);

    if (qIndex < mcqs.length + typingQuestions.length - 1) {
      setQIndex(qIndex + 1);
      setTypingInput('');
    } else {
      onComplete({ score: newScore, total: 11 });
    }
  };

  return (
    <div className="bg-[#1E2128] p-12 md:p-16 rounded-[4rem] text-white animate-scale-up border border-slate-800 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
       <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800">
          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${((qIndex + 1) / 8) * 100}%` }}></div>
       </div>
       <button onClick={onCancel} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
       
       <div className="flex items-center gap-4 mb-14">
          <div className="bg-blue-600/20 text-blue-400 px-5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-500/20">
            Section {currentSection}: {currentSection === 'MCQ' ? 'Fundamentals' : 'Code Application'}
          </div>
          <div className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Question {qIndex + 1} of 8 • React Intermediate</div>
       </div>
       
       <h2 className="text-3xl font-black mb-12 leading-tight tracking-tight text-white/95">
         {currentSection === 'MCQ' ? mcqs[qIndex].q : typingQuestions[qIndex - 5].q}
       </h2>
       
       {currentSection === 'MCQ' ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {mcqs[qIndex].options!.map((opt, i) => (
             <button 
               key={i} 
               onClick={() => handleNextSection(i)} 
               className="p-8 bg-slate-800/40 hover:bg-blue-600 transition-all border border-slate-700/50 rounded-[2rem] text-left font-black text-sm tracking-tight group flex items-center gap-6"
             >
               <span className="w-10 h-10 rounded-xl bg-slate-700 group-hover:bg-blue-500 flex items-center justify-center transition-colors font-mono text-lg">{String.fromCharCode(65 + i)}</span>
               <span className="opacity-90">{opt}</span>
             </button>
           ))}
         </div>
       ) : (
         <div className="space-y-8 animate-fade-in">
           <div className="relative">
             <textarea 
               autoFocus 
               value={typingInput} 
               onChange={e => setTypingInput(e.target.value)} 
               className="w-full bg-black/40 border-2 border-slate-700/50 rounded-[2.5rem] p-12 font-mono text-base md:text-lg h-64 focus:outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/10 transition-all text-blue-400 placeholder:text-slate-700" 
               placeholder="// Write your component or fix here..." 
             />
             <div className="absolute bottom-6 right-8 text-[11px] font-black text-slate-600 uppercase tracking-widest">Intelligent Parsing Active</div>
           </div>
           <div className="flex justify-between items-center">
              <p className="text-slate-500 text-sm font-bold">Press Shift+Enter to submit</p>
              <button 
                onClick={() => handleNextSection()} 
                className="bg-white text-slate-900 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
              >
                Submit Answer
              </button>
           </div>
         </div>
       )}
    </div>
  );
};

export default AddSkillFlow;
