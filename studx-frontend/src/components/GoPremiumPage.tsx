
import React, { useRef } from 'react';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { Zap, Star, ShieldCheck, Target, Check, Clock, Brain, RefreshCcw, Briefcase, ChevronLeft, CreditCard, Sparkles } from 'lucide-react';

const GoPremiumPage: React.FC<{ onBack: () => void; onNavigate: (s: AppState) => void }> = ({ onBack, onNavigate }) => {
  const benefitsRef = useRef<HTMLElement>(null);

  const scrollToBenefits = () => {
    benefitsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white pb-32 overflow-x-hidden">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      {/* Hero Section */}
      <section className="bg-slate-900 pt-40 pb-56 px-6 text-center relative">
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
         </div>
         <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 text-blue-400 font-black text-[11px] uppercase tracking-[0.3em] mb-10 shadow-2xl">
               <Sparkles size={16} fill="currentColor" /> Premium 🚀
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">Go <span className="text-blue-500">Premium</span></h1>
            <p className="text-slate-400 text-xl md:text-2xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">Sell faster. Get noticed. Build trust on campus.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
               <button className="bg-blue-600 text-white px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(37,99,235,0.5)] hover:scale-105 transition-all">Upgrade Now</button>
               <button onClick={scrollToBenefits} className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">See Benefits</button>
            </div>
         </div>
      </section>

      {/* Why Go Premium */}
      <section ref={benefitsRef} className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard icon={<Zap className="text-blue-500"/>} title="Faster Selling" text="Your listings appear higher and get more views." />
            <BenefitCard icon={<Star className="text-amber-500"/>} title="More Visibility" text="Featured tag makes your item stand out." />
            <BenefitCard icon={<ShieldCheck className="text-emerald-500"/>} title="Trusted Profile" text="Premium badge increases buyer confidence." />
            <BenefitCard icon={<Target className="text-rose-500"/>} title="Campus Edge" text="Reach students nearby, not random users." />
         </div>

         {/* Pricing Sections */}
         <div className="mt-48 text-center">
            <h2 className="text-5xl font-black text-slate-900 mb-24 tracking-tight">Simple Student Pricing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
               <PricingCard 
                  title="Boost Listing" 
                  subtitle="Best for urgent selling" 
                  price="₹29" 
                  duration="per 3 days"
                  features={['Push item to the top', 'Highlighted Featured tag', 'Reach 5x more buyers']}
                  btnText="Boost a Listing"
                  badge="HOT PICK"
                  priceNote="Or ₹49 for 7 days"
               />
               <PricingCard 
                  title="Power Seller" 
                  subtitle="For active students & seniors" 
                  price="₹99" 
                  duration="per month"
                  features={['Unlimited listings', '2 free boosts per month', 'Verified Seller badge', 'Priority Support']}
                  btnText="Become Power Seller"
                  highlight
               />
            </div>
         </div>

         {/* Comparison Table */}
         <div className="mt-48 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-16 text-center tracking-tight">Compare Plans</h2>
            <div className="bg-slate-50 rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-inner overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] border-b border-slate-200">
                        <th className="pb-8">Feature</th>
                        <th className="pb-8 text-center">Free</th>
                        <th className="pb-8 text-center text-blue-600">Premium</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-600">
                     <tr className="border-b border-slate-200/50"><td className="py-8">List items</td><td className="text-center">Limited</td><td className="text-center text-blue-600 font-black">Unlimited</td></tr>
                     <tr className="border-b border-slate-200/50"><td className="py-8">Visibility</td><td className="text-center opacity-40 font-medium">Normal</td><td className="text-center text-blue-600 font-black">Boosted</td></tr>
                     <tr className="border-b border-slate-200/50"><td className="py-8">Featured Tag</td><td className="text-center opacity-30">❌</td><td className="text-center text-blue-600 font-black">✅</td></tr>
                     <tr className="border-b border-slate-200/50"><td className="py-8">Seller Badge</td><td className="text-center opacity-30">❌</td><td className="text-center text-blue-600 font-black">✅</td></tr>
                     <tr><td className="py-8">Faster Selling</td><td className="text-center opacity-30">❌</td><td className="text-center text-blue-600 font-black">✅</td></tr>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Coming Soon */}
         <div className="mt-48">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Future Advantages</h2>
              <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">Exclusively for Premium Users</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <ComingSoonCard icon={<Brain />} title="AI Price Suggestions" text="Get the best price to sell your items faster than others." />
               <ComingSoonCard icon={<RefreshCcw />} title="Rental Listing" text="Rent cycles, calculators, lab coats to peers and earn." />
               <ComingSoonCard icon={<Briefcase />} title="Campus Jobs Board" text="Apply for internships based on your verified skills." />
            </div>
         </div>

         {/* Final CTA Section */}
         <div className="mt-32 bg-blue-600 rounded-[5rem] p-16 md:p-32 text-center text-white shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48 transition-all duration-1000 group-hover:scale-110"></div>
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter">Ready to sell faster?</h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
                 <button className="bg-white text-blue-600 px-14 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Upgrade to Premium</button>
                 <button className="bg-blue-900 text-white px-14 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest border-2 border-blue-400 hover:bg-blue-800 transition-all">Boost a Listing Now</button>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center hover:-translate-y-2 transition-all group">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-blue-50 group-hover:scale-110 transition-all">{icon}</div>
    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-80">{text}</p>
  </div>
);

const PricingCard: React.FC<{ title: string; subtitle: string; price: string; duration: string; features: string[]; btnText: string; highlight?: boolean; badge?: string; priceNote?: string }> = ({ title, subtitle, price, duration, features, btnText, highlight, badge, priceNote }) => (
  <div className={`p-14 rounded-[4rem] text-left relative overflow-hidden transition-all hover:shadow-2xl flex flex-col justify-between h-full ${highlight ? 'bg-slate-900 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] scale-105 lg:scale-110' : 'bg-white border border-slate-100 shadow-xl'}`}>
    {badge && <div className="absolute top-10 right-10 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em]">{badge}</div>}
    <div>
      <h3 className={`text-3xl font-black mb-2 tracking-tight ${highlight ? 'text-blue-400' : 'text-slate-900'}`}>{title}</h3>
      <p className={`text-sm font-medium mb-12 ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
      <div className="flex items-end gap-3 mb-4">
         <span className="text-6xl font-black">{price}</span>
         <span className="text-lg font-bold opacity-40 pb-2">{duration}</span>
      </div>
      {priceNote && <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-10">{priceNote}</p>}
      <ul className="space-y-5 mb-14">
         {features.map(f => (
           <li key={f} className="flex gap-4 items-center text-sm font-bold opacity-90 transition-all hover:translate-x-1"><Check size={20} className="text-blue-500" /> {f}</li>
         ))}
      </ul>
    </div>
    <button className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all ${highlight ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>{btnText}</button>
  </div>
);

const ComingSoonCard: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 text-center group transition-all hover:bg-white hover:shadow-2xl">
    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-all shadow-sm">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 36 })}
    </div>
    <h3 className="text-xl font-black text-slate-400 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-300 text-sm font-bold leading-relaxed">{text}</p>
    <div className="mt-8 inline-flex bg-slate-100 px-4 py-1.5 rounded-full border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">Coming Soon</div>
  </div>
);

export default GoPremiumPage;
