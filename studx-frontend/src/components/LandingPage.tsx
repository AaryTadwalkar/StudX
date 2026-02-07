
import React from 'react';
import { Recycle, Users, Rocket, ShieldCheck, Zap, Heart } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const features = [
    {
      title: 'Sustainable Exchange',
      description: 'Give your old textbooks, notes, and materials a second life. Help fellow students save money and reduce waste.',
      icon: <Recycle className="text-white" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'Campus Community',
      description: 'Connect with students from your college. Build a trusted marketplace within your campus community.',
      icon: <Users className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Student Startups',
      description: 'Discover and support innovative startups created by your fellow students. Be part of the entrepreneurial revolution.',
      icon: <Rocket className="text-white" />,
      color: 'bg-cyan-500',
    },
    {
      title: 'Safe & Secure',
      description: 'Verified college students only. Trade with confidence in a trusted environment.',
      icon: <ShieldCheck className="text-white" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Lightning Fast',
      description: 'List items in seconds, find what you need instantly. Optimized for the busy student life.',
      icon: <Zap className="text-white" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Built for Students',
      description: 'By students, for students. Every feature designed with your campus life in mind.',
      icon: <Heart className="text-white" />,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-[#1a73e8]">Stud</span>
          <span className="text-xl font-bold text-[#34a853]">X</span>
        </div>
        <button onClick={onExplore} className="text-gray-500 text-sm font-medium hover:text-black">Skip &rarr;</button>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Welcome to StudX</h1>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">
          The ultimate platform for college students to buy, sell, and exchange materials while supporting campus innovation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 border border-gray-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onExplore}
          className="mt-16 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          Explore StudX
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
