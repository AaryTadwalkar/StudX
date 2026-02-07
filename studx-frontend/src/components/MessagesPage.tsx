
import React, { useState } from 'react';
import type { AppState, Conversation } from '../types';
import { ChevronLeft, Search, Send, MoreVertical, MessageSquare, X } from 'lucide-react';

interface MessagesPageProps {
  conversations: Conversation[];
  onSendMessage: (convoId: string, text: string) => void;
  onBack: () => void;
  onNavigate: (s: AppState) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ conversations, onSendMessage, onBack, onNavigate }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSend = () => {
    if (inputText.trim() && activeChatId) {
      onSendMessage(activeChatId, inputText);
      setInputText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-slate-100 px-6 h-20 flex items-center justify-between sticky top-0 z-40">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">S</div>
           <span className="text-xl font-black text-slate-900 tracking-tighter">StudX</span>
        </div>
        <div className="w-24"></div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-6 mb-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <MessageSquare size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Messenger</h1>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Secure Campus Communication</p>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 h-[700px] flex overflow-hidden animate-fade-in-up ring-1 ring-black/5">
          {/* Sidebar */}
          <div className="w-96 border-r border-slate-50 flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
               <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input placeholder="Search chats..." className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-xs font-black border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
               {conversations.length > 0 ? (
                 conversations.map(chat => (
                   <div 
                     key={chat.id} 
                     onClick={() => setActiveChatId(chat.id)}
                     className={`p-8 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50/50 relative ${activeChatId === chat.id ? 'bg-slate-50' : ''}`}
                   >
                      <div className={`w-14 h-14 rounded-[1.5rem] bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg shadow-inner`}>{chat.name[0]}</div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="font-black text-slate-900 text-sm tracking-tight">{chat.name}</h4>
                            <span className="text-[10px] text-slate-400 font-black">{chat.time}</span>
                         </div>
                         <p className="text-xs text-slate-500 font-medium truncate opacity-70">{chat.lastMessage}</p>
                      </div>
                      {activeChatId === chat.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-l-full"></div>}
                   </div>
                 ))
               ) : (
                 <div className="p-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">No chats active</div>
               )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50/10">
            {activeChat ? (
              <>
                <div className="p-8 bg-white border-b border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-100">{activeChat.name[0]}</div>
                      <div>
                         <h3 className="font-black text-slate-900 text-lg tracking-tight">{activeChat.name}</h3>
                         <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Online</p></div>
                      </div>
                   </div>
                   <button className="p-4 hover:bg-slate-100 rounded-2xl transition-all"><MoreVertical size={20} className="text-slate-400" /></button>
                </div>
                
                <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-slate-50/20 scrollbar-hide">
                   {activeChat.messages.map((m) => (
                     <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'} gap-2 animate-scale-up`}>
                        <div className={`${m.isMe ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'} p-5 rounded-[2rem] max-w-[70%] ring-1 ring-black/5`}>
                           <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.timestamp}</span>
                     </div>
                   ))}
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                   <div className="flex items-center gap-4 bg-slate-50 rounded-[2.5rem] p-2 pr-4 shadow-inner ring-1 ring-black/5">
                      <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent py-4 px-8 text-sm font-black text-slate-900 focus:outline-none placeholder:text-slate-400" 
                      />
                      <button 
                        onClick={handleSend}
                        className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200 hover:scale-105 transition-all group"
                      >
                        <Send size={24} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
                 <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-8">
                    <MessageSquare size={64} />
                 </div>
                 <h2 className="text-4xl font-black text-slate-400 uppercase tracking-tighter">Campus Connect</h2>
                 <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-4">Select a student profile to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default MessagesPage;