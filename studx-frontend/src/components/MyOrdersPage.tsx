
import React from 'react';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { Box, ChevronRight, ShoppingBag } from 'lucide-react';

const MyOrdersPage: React.FC<{ onBack: () => void; onNavigate: (s: AppState) => void }> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={null} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-12">My Orders</h1>
        
        <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">No orders found</h2>
          <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">Items you buy on the marketplace will appear here.</p>
          <button onClick={() => onNavigate('marketplace')} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl">Go Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
