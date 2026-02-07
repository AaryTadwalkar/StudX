
import React, { useState } from 'react';
import type { User } from '../types';
import type { AppState } from '../types';
import { ShoppingBag, Rocket, RefreshCw, MessageSquare, User as UserIcon, LogOut, ChevronRight, Heart, ShoppingCart, Home, ChevronDown, Shield, CreditCard, Box, Zap, Sparkles } from 'lucide-react';

interface HomePageProps {
  user: User | null;
  onNavigate: (state: AppState) => void;
  onLogout: () => void;
}

export const GlobalNav: React.FC<{ user: User | null; onNavigate: (s: AppState) => void; onLogout: () => void }> = ({ user, onNavigate, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <nav className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
           <div className="relative flex items-center h-12">
             <div className="flex items-center">
               <span className="text-4xl font-black italic text-[#1a73e8] tracking-tighter">Stud</span>
               <span className="text-5xl font-black italic text-[#84cc16] relative -ml-1">X</span>
             </div>
             <div className="absolute -top-3 left-4 text-[#1a73e8]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 3L1 9l11 6l9-4.91V17h2V9L12 3z" />
                 <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
               </svg>
             </div>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-4">Campus Marketplace</span>
           </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => onNavigate('marketplace')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Marketplace</button>
            <button onClick={() => onNavigate('startups')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Startups</button>
            <button onClick={() => onNavigate('skills')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Skills</button>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 text-slate-400 border-l border-slate-100 pl-6 md:pl-10">
             <div className="relative cursor-pointer hover:text-blue-600 group transition-all" onClick={() => onNavigate('messages')}>
               <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
               <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-[10px] font-black text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm">2</span>
             </div>
             <div className="relative cursor-pointer hover:text-rose-500 group transition-all" onClick={() => onNavigate('wishlist')}>
               <Heart size={22} className="group-hover:scale-110 transition-transform" />
             </div>
             <div className="relative cursor-pointer hover:text-slate-900 group transition-all" onClick={() => onNavigate('cart')}>
               <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
             </div>
             
             <div className="relative">
               <div className="flex items-center gap-3 bg-slate-50 px-3 md:px-4 py-2 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-lg transition-all" onClick={() => setShowUserMenu(!showUserMenu)}>
                 <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                    {user?.name?.[0] || 'S'}
                 </div>
                 <ChevronDown size={14} className={`transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
               </div>
               
               {showUserMenu && (
                 <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 animate-scale-up ring-1 ring-black/5">
                   <div className="px-6 py-4 border-b border-slate-50 mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Dashboard</p>
                      <p className="text-sm font-black text-slate-900 truncate">{user?.name || 'Campus Student'}</p>
                   </div>
                   <button onClick={() => {onNavigate('my-account'); setShowUserMenu(false)}} className="w-full px-6 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-4 transition-all"><UserIcon size={16}/> My Account</button>
                   <button onClick={() => {onNavigate('my-orders'); setShowUserMenu(false)}} className="w-full px-6 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-4 transition-all"><Box size={16}/> My Orders</button>
                   <button onClick={() => {onNavigate('my-skills'); setShowUserMenu(false)}} className="w-full px-6 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-4 transition-all"><Zap size={16}/> My Skills</button>
                   <button onClick={() => {onNavigate('premium'); setShowUserMenu(false)}} className="w-full px-6 py-3 text-left text-xs font-black text-blue-600 hover:bg-blue-50 flex items-center gap-4 transition-all"><CreditCard size={16}/> Go Premium</button>
                   <div className="h-px bg-slate-100 my-2 mx-4"></div>
                   <button onClick={onLogout} className="w-full px-6 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-4 transition-all"><LogOut size={16}/> Logout</button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const HomePage: React.FC<HomePageProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen bg-white">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Hero Section */}
      <section className="relative h-[480px] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-30" alt="Campus" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-12 md:p-16 rounded-[4rem] border border-white/20 shadow-2xl animate-fade-in-up max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 drop-shadow-xl tracking-tighter leading-tight">Welcome to <span className="text-blue-400">StudX</span></h1>
          <p className="text-blue-50 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-2xl mx-auto opacity-90">
            The ultimate platform for college students to buy, sell, and exchange materials while supporting campus innovation.
          </p>
          <div className="text-[10px] font-black text-blue-300 uppercase tracking-[0.6em] opacity-80 animate-pulse">Connect • Collaborate • Innovate</div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureMainCard title="Marketplace" description="Buy and sell textbooks, electronics, and essentials within your campus." icon={<ShoppingBag className="text-blue-600" />} btnText="Browse Items" onClick={() => onNavigate('marketplace')} />
          <FeatureMainCard title="Startup Showcase" description="Discover student-led innovations and support the next big thing." icon={<Rocket className="text-purple-600" />} btnText="Discover" onClick={() => onNavigate('startups')} />
          <FeatureMainCard title="Skill Barter" description="Exchange skills ranging from coding to music. Learn and earn together." icon={<RefreshCw className="text-emerald-600" />} btnText="Start Bartering" onClick={() => onNavigate('skills')} />
        </div>

        {/* Why StudX - Boxed Subtle Animation */}
        <div className="mt-32">
          <div className="bg-slate-50 rounded-[4rem] p-16 md:p-24 border border-slate-100 shadow-inner overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-20 -mr-48 -mt-48 animate-pulse-slow"></div>
            <div className="relative z-10 text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Why StudX?</h2>
              <p className="text-slate-600 font-medium text-lg">Empowering students through collaboration and sustainable exchange.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 relative z-10">
              <SmallFeature icon="🌱" title="Sustainable Exchange" text="Give your old materials a second life. Help save money and reduce waste." />
              <SmallFeature icon="🤝" title="Campus Community" titleColor="text-slate-900" text="Connect with students from your college in a trusted network." />
              <SmallFeature icon="🚀" title="Student Startups" text="Discover and support innovative startups created by fellow students." />
              <SmallFeature icon="🔒" title="Safe & Secure" text="Verified college students only. Trade with confidence in your campus." />
              <SmallFeature icon="⚡" title="Lightning Fast" text="List items in seconds, find what you need instantly. Optimized for life." />
              <SmallFeature icon="🎓" title="Built for Students" text="By students, for students. Every feature designed with your campus life in mind." />
            </div>
          </div>
        </div>

        {/* About & Aim Sections - Redesigned side-by-side */}
        <div className="mt-40 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-20 items-stretch animate-fade-in-up">
           <div className="flex-1 flex flex-col justify-center space-y-12 py-10">
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Our Aim</h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  We aim to revolutionize the college experience by creating a self-sustaining ecosystem where students can seamlessly share resources, skills, and ideas. StudX helps reduce financial burdens while fostering a culture of innovation and collaboration across campuses.
                </p>
              </div>
              <div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">About Us</h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                  Founded by students for students, StudX understands the unique challenges of university life. Whether it's finding an affordable textbook, getting help with a coding project, or launching your first startup, we're here to make it happen.
                </p>
              </div>
           </div>
           <div className="flex-1 min-h-[500px] md:min-h-[700px] w-full rounded-[4rem] overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                alt="Students collaborating" 
              />
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors"></div>
           </div>
        </div>

        {/* Community Section */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 mb-12">Join Our <span className="text-blue-600">Community</span></h2>
              <CommunityLink icon="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" title="Follow us on Instagram" subtitle="@studx2026" href="https://www.instagram.com/studx2026" />
              <CommunityLink icon="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" title="Join WhatsApp Group" subtitle="Connect with the community" href="https://chat.whatsapp.com/Ff1JWYf0KzF3XOiTSTgJUF" />
           </div>
           <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-500"></div>
              <h2 className="text-4xl font-black mb-10 relative z-10">Contact Us</h2>
              <div className="space-y-8 relative z-10">
                 <div className="flex items-center gap-6 group/item">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-lg">📞</div>
                    <span className="font-bold text-2xl tracking-tight">9552911703</span>
                 </div>
                 <div className="flex items-center gap-6 group/item">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-lg">📞</div>
                    <span className="font-bold text-2xl tracking-tight">9309722160</span>
                 </div>
                 <div className="flex items-center gap-6 group/item">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-lg">📞</div>
                    <span className="font-bold text-2xl tracking-tight">7499216839</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-24 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg">S</div>
             <span className="text-slate-900 font-black text-xl tracking-tighter">StudX</span>
           </div>
           <span>© 2024 StudX. Built with passion for Campus Pioneers.</span>
           <div className="flex gap-10">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
           </div>
        </div>
      </footer>
      
      <style>{`
        .pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const FeatureMainCard: React.FC<{ title: string; description: string; icon: React.ReactNode; btnText: string; onClick: () => void }> = ({ title, description, icon, btnText, onClick }) => (
  <div onClick={onClick} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 group-hover:bg-blue-50 transition-all duration-500"></div>
    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform relative z-10">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 40 }) : icon}
    </div>
    <h3 className="text-3xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 relative z-10 opacity-80">{description}</p>
    <div className="flex items-center text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] relative z-10 group-hover:gap-3 transition-all">{btnText} <ChevronRight size={18} /></div>
  </div>
);

const SmallFeature: React.FC<{ icon: string; title: string; text: string; titleColor?: string }> = ({ icon, title, text, titleColor = "text-slate-900" }) => (
  <div className="flex flex-col items-center hover:scale-110 transition-all duration-500 cursor-default group p-6 rounded-[2rem] hover:bg-white hover:shadow-xl">
    <div className="text-7xl mb-10 group-hover:rotate-12 transition-transform drop-shadow-2xl">{icon}</div>
    <h4 className={`text-2xl font-black mb-4 ${titleColor} tracking-tight`}>{title}</h4>
    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px] mx-auto opacity-70 text-center">{text}</p>
  </div>
);

const CommunityLink: React.FC<{ icon: string; title: string; subtitle: string; href: string }> = ({ icon, title, subtitle, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="bg-slate-50 border border-slate-100 p-8 rounded-[3rem] flex items-center gap-8 hover:bg-white hover:shadow-2xl hover:-translate-x-3 transition-all cursor-pointer group">
    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
      <img src={icon} alt={title} className="w-10 h-10" />
    </div>
    <div>
       <h4 className="font-black text-2xl text-slate-900 mb-1 tracking-tight">{title}</h4>
       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">{subtitle}</p>
    </div>
  </a>
);

export default HomePage;
