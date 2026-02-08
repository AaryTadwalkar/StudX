import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { 
  ChevronLeft, UserCheck, UserPlus, Clock, X, Check, 
  MessageSquare, Users, Search
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

interface Connection {
  _id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  connectedUserDetails: {
    name: string;
    email: string;
    branch: string;
    year: number;
  };
  initiatorId: string;
  createdAt: string;
}

const ConnectionsPage: React.FC<{
  onBack: () => void;
  onNavigate: (s: AppState) => void;
}> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/skill-barter/connections`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Fetch connections error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/skill-barter/connections/${connectionId}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Connection accepted!');
        fetchConnections();
      } else {
        alert('Failed to accept connection');
      }
    } catch (error) {
      console.error('Accept connection error:', error);
      alert('Failed to accept connection');
    }
  };

  const handleMessage = async (connection: Connection) => {
    try {
      const response = await fetch(`${API_BASE}/messages/conversations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          otherUserId: connection.connectedUserId,
          otherUserName: connection.connectedUserDetails.name
        })
      });

      if (response.ok) {
        onNavigate('messages');
      } else {
        alert('Failed to start conversation');
      }
    } catch (error) {
      console.error('Start chat error:', error);
      alert('Failed to start conversation');
    }
  };

  // Filter connections
  const filteredConnections = connections.filter(conn => {
    const matchesTab = activeTab === 'all' || conn.status === activeTab;
    const matchesSearch = conn.connectedUserDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.connectedUserDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.connectedUserDetails.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Separate pending requests (where I'm not the initiator) vs sent requests (where I am)
  const pendingReceived = connections.filter(c => 
    c.status === 'pending' && c.initiatorId !== user?._id
  );
  const pendingSent = connections.filter(c => 
    c.status === 'pending' && c.initiatorId === user?._id
  );
  const accepted = connections.filter(c => c.status === 'accepted');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-4 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              My <span className="text-blue-600">Connections</span>
            </h1>
            <p className="text-slate-500 text-lg mt-2">
              Manage your network of {accepted.length} connections
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="text-3xl font-black text-blue-600">{accepted.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase">Connected</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="text-3xl font-black text-amber-600">{pendingReceived.length}</div>
              <div className="text-xs text-slate-500 font-bold uppercase">Requests</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending ({pendingReceived.length + pendingSent.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'accepted'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Connected ({accepted.length})
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Pending Requests Received */}
            {pendingReceived.length > 0 && (activeTab === 'all' || activeTab === 'pending') && (
              <div className="mb-12">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Connection Requests ({pendingReceived.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingReceived.map(connection => (
                    <ConnectionCard
                      key={connection._id}
                      connection={connection}
                      type="received"
                      onAccept={() => handleAccept(connection._id)}
                      onMessage={() => handleMessage(connection)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pending Requests Sent */}
            {pendingSent.length > 0 && (activeTab === 'all' || activeTab === 'pending') && (
              <div className="mb-12">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Sent Requests ({pendingSent.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingSent.map(connection => (
                    <ConnectionCard
                      key={connection._id}
                      connection={connection}
                      type="sent"
                      onAccept={() => {}}
                      onMessage={() => handleMessage(connection)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Connections */}
            {filteredConnections.filter(c => c.status === 'accepted').length > 0 && 
             (activeTab === 'all' || activeTab === 'accepted') && (
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Your Connections ({accepted.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConnections
                    .filter(c => c.status === 'accepted')
                    .map(connection => (
                      <ConnectionCard
                        key={connection._id}
                        connection={connection}
                        type="accepted"
                        onAccept={() => {}}
                        onMessage={() => handleMessage(connection)}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredConnections.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <Users size={64} className="mx-auto mb-6 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Connections Yet</h3>
                <p className="text-slate-500 mb-6">
                  Start connecting with peers in Skill Barter
                </p>
                <button
                  onClick={() => onNavigate('skills')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Find People
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ========== CONNECTION CARD COMPONENT ==========
const ConnectionCard: React.FC<{
  connection: Connection;
  type: 'received' | 'sent' | 'accepted';
  onAccept: () => void;
  onMessage: () => void;
}> = ({ connection, type, onAccept, onMessage }) => {
  const { name, email, branch, year } = connection.connectedUserDetails;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
          {name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-slate-900 truncate">{name}</h3>
          <p className="text-xs text-slate-400">{branch} • Year {year}</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <p className="text-sm text-slate-600 truncate">{email}</p>
      </div>

      {type === 'received' && (
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Accept
          </button>
          <button
            onClick={onMessage}
            className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      )}

      {type === 'sent' && (
        <div className="flex items-center justify-center gap-2 py-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm">
          <Clock size={16} /> Pending
        </div>
      )}

      {type === 'accepted' && (
        <div className="flex gap-3">
          <button
            onClick={onMessage}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Message
          </button>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <UserCheck size={18} />
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
        Connected {new Date(connection.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ConnectionsPage;
