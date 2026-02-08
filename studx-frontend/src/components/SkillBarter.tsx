import React, { useState, useEffect, useRef } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';
import { GlobalNav } from './HomePage';
import { 
  Search, MessageSquare, X, Clock, UserCheck, Send, Calendar,
  Handshake, CheckCircle, AlertCircle, Users
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

interface UserSkill {
  skillId: string;
  skillName: string;
  category: string;
  level: string;
  badge: string;
  testScore?: number;
  verificationStatus: string;
}

interface SearchUser {
  userId: string;
  name: string;
  email: string;
  branch: string;
  year: number;
  skills: UserSkill[];
}

interface SkillRequest {
  _id: string;
  userId: string;
  skillName: string;
  category: string;
  description: string;
  deadline?: string;
  duration?: string;
  offeringInReturn?: string;
  status: string;
  userDetails: {
    name: string;
    email: string;
    branch: string;
    year: number;
  };
  interestedUsers: any[];
  createdAt: string;
}

const SkillBarter: React.FC<{ 
  onBack: () => void; 
  onNavigate: (s: AppState) => void;
}> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Selected items
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SkillRequest | null>(null);

  // Skill requests state
  const [skillRequests, setSkillRequests] = useState<SkillRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<Map<string, string>>(new Map());

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBarterModal, setShowBarterModal] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success'
  });

  // Fetch data on mount
  useEffect(() => {
    fetchSkillRequests();
    fetchMyConnections();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search as user types
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleRealtimeSearch();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchSkillRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await fetch(`${API_BASE}/skill-barter/requests?status=open`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        setSkillRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchMyConnections = async () => {
    try {
      const response = await fetch(`${API_BASE}/skill-barter/connections`, {
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        const statusMap = new Map();
        data.connections.forEach((conn: any) => {
          statusMap.set(conn.connectedUserId, conn.status);
        });
        setConnectionStatus(statusMap);
      }
    } catch (error) {
      console.error('Fetch connections error:', error);
    }
  };

  const handleRealtimeSearch = async () => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `${API_BASE}/skill-barter/search?query=${encodeURIComponent(searchQuery)}`,
        { headers: getAuthHeaders() }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Filter to search by both skill name AND user name
        // Filter to search by both skill name AND user name
        // Filter to search by both skill name AND user name
        const filtered = (data.users || []).filter((userResult: SearchUser) => {
          // 1. EXCLUDE CURRENT USER (Add this check)
          if (user && userResult.userId === user._id) return false;

          const query = searchQuery.toLowerCase();
          const nameMatch = userResult.name.toLowerCase().includes(query);
          const skillMatch = userResult.skills.some(skill => 
            skill.skillName.toLowerCase().includes(query)
          );
          return nameMatch || skillMatch;
        });
        
        // Sort by skill level
        const sorted = filtered.sort((a: SearchUser, b: SearchUser) => {
          const getBadgeScore = (skills: UserSkill[]) => {
            const badges = skills.map(s => s.badge);
            if (badges.includes('Master')) return 4;
            if (badges.includes('Expert')) return 3;
            if (badges.includes('Verified')) return 2;
            return 1;
          };
          return getBadgeScore(b.skills) - getBadgeScore(a.skills);
        });
        
        setSearchResults(sorted);
        setShowDropdown(sorted.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = async (targetUserId: string) => {
    try {
      const response = await fetch(`${API_BASE}/skill-barter/connections/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetUserId })
      });

      if (response.ok) {
        showToast('Connection request sent!', 'success');
        fetchMyConnections();
        setSelectedUser(null);
      } else {
        const data = await response.json();
        showToast(data.message || 'Failed to send request', 'error');
      }
    } catch (error) {
      showToast('Failed to send connection request', 'error');
    }
  };

  const handleCreateRequest = async (requestData: any) => {
    try {
      const response = await fetch(`${API_BASE}/skill-barter/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        showToast('Skill request created successfully!', 'success');
        setShowRequestModal(false);
        fetchSkillRequests();
      } else {
        showToast('Failed to create request', 'error');
      }
    } catch (error) {
      showToast('Failed to create request', 'error');
    }
  };

  const handleProposeBarter = async (proposalData: any) => {
    try {
      const response = await fetch(`${API_BASE}/skill-barter/proposals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          toUserId: selectedRequest?.userId,
          offeringSkill: {
            skillName: proposalData.offeringSkill,
            description: proposalData.offeringDescription
          },
          requestingSkill: {
            skillName: proposalData.wantingSkill, // NEW: What you want
            description: selectedRequest?.description
          },
          message: proposalData.message,
          duration: proposalData.duration,
          proposedSchedule: proposalData.schedule,
          skillRequestId: selectedRequest?._id
        })
      });

      if (response.ok) {
        showToast('Barter proposal sent successfully!', 'success');
        setShowBarterModal(false);
        setSelectedRequest(null);
      } else {
        showToast('Failed to send proposal', 'error');
      }
    } catch (error) {
      showToast('Failed to send proposal', 'error');
    }
  };

  const handleStartChat = async (targetUserId: string, userName: string) => {
    try {
      const response = await fetch(`${API_BASE}/messages/conversations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          otherUserId: targetUserId, 
          otherUserName: userName 
        })
      });
      
      if (response.ok) {
        // Direct navigation to messages
        onNavigate('messages');
      } else {
        showToast('Failed to start conversation', 'error');
      }
    } catch (error) {
      showToast('Failed to start conversation', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-6 z-[60] animate-slide-in-right">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="text-emerald-600" size={24} />
            ) : (
              <AlertCircle className="text-rose-600" size={24} />
            )}
            <p className={`font-bold ${
              toast.type === 'success' ? 'text-emerald-900' : 'text-rose-900'
            }`}>
              {toast.message}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
            Skill <span className="text-blue-600">Exchange</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
            Find peers with specific skills. Share knowledge, grow together.
          </p>
        </div>

        {/* Search Bar with Dropdown */}
        <div className="max-w-3xl mx-auto mb-12" ref={searchRef}>
          <div className="relative">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" size={24} />
              <input 
                type="text" 
                placeholder="Search by skill or name (e.g., React, John Doe)"
                className="w-full pl-16 pr-6 py-5 bg-white rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-lg text-slate-900 shadow-lg"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              />
              {isSearching && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border-2 border-slate-100 max-h-[400px] overflow-y-auto z-50 animate-slide-down">
                {searchResults.map(userResult => (
                  <div
                    key={userResult.userId}
                    onClick={() => {
                      setSelectedUser(userResult);
                      setShowDropdown(false);
                    }}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                        {userResult.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 truncate">{userResult.name}</h3>
                        <p className="text-xs text-slate-500">{userResult.branch} • Year {userResult.year}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {userResult.skills.slice(0, 2).map(skill => (
                            <span key={skill.skillId} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                              {skill.skillName} • {skill.level}
                            </span>
                          ))}
                          {userResult.skills.length > 2 && (
                            <span className="text-xs text-slate-400">+{userResult.skills.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Request Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <Calendar size={20} /> Request a Skill
          </button>
        </div>

        {/* Skill Requests Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900">Open Skill Requests</h2>
            <span className="text-slate-400 font-bold text-sm">{skillRequests.length} active</span>
          </div>

          {loadingRequests ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : skillRequests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake size={40} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-400">No open skill requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillRequests.map(request => (
                <div
                  key={request._id}
                  onClick={() => setSelectedRequest(request)}
                  className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-300 hover:shadow-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                      {request.status}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                      {request.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2">{request.skillName}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{request.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black">
                      {request.userDetails.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate text-sm">{request.userDetails.name}</p>
                      <p className="text-xs text-slate-400">{request.userDetails.branch} • Year {request.userDetails.year}</p>
                    </div>
                  </div>

                  {request.deadline && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                      <Clock size={14} />
                      Deadline: {new Date(request.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onConnect={() => handleConnect(selectedUser.userId)}
          onMessage={() => handleStartChat(selectedUser.userId, selectedUser.name)}
          connectionStatus={connectionStatus.get(selectedUser.userId) || 'none'}
          isCurrentUser={selectedUser.userId === user?._id}
        />
      )}

      {/* Create Request Modal */}
      {showRequestModal && (
        <CreateRequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onPropose={() => setShowBarterModal(true)}
          onMessage={() => handleStartChat(selectedRequest.userId, selectedRequest.userDetails.name)}
          isOwnRequest={selectedRequest.userId === user?._id}
        />
      )}

      {/* Barter Proposal Modal */}
      {showBarterModal && selectedRequest && (
        <BarterProposalModal
          request={selectedRequest}
          onClose={() => setShowBarterModal(false)}
          onSubmit={handleProposeBarter}
        />
      )}
    </div>
  );
};

// ==================== MODALS ====================

const UserProfileModal: React.FC<{
  user: SearchUser;
  onClose: () => void;
  onConnect: () => void;
  onMessage: () => void;
  connectionStatus: string;
  isCurrentUser: boolean;
}> = ({ user, onClose, onConnect, onMessage, connectionStatus, isCurrentUser }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl rounded-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
        >
          <X size={20} className="text-slate-900 font-bold" />
        </button>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-1">{user.name}</h2>
            <p className="text-slate-600 font-medium">{user.email}</p>
            <p className="text-slate-500 text-sm">{user.branch} • Year {user.year}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-black text-slate-900 mb-4">Verified Skills</h3>
          <div className="grid grid-cols-1 gap-3">
            {user.skills.map(skill => (
              <div key={skill.skillId} className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-slate-900">{skill.skillName}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    skill.badge === 'Master' ? 'bg-yellow-100 text-yellow-700' :
                    skill.badge === 'Expert' ? 'bg-purple-100 text-purple-700' :
                    skill.badge === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {skill.badge}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span>{skill.category}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-bold">{skill.level}</span>
                  {skill.testScore && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">{skill.testScore}% score</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isCurrentUser && (
          <div className="flex gap-3">
            <button 
              onClick={onMessage}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} /> Message
            </button>
            {connectionStatus === 'none' && (
              <button 
                onClick={onConnect}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <UserCheck size={18} /> Connect
              </button>
            )}
            {connectionStatus === 'pending' && (
              <div className="flex-1 bg-amber-100 text-amber-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <Clock size={18} /> Pending
              </div>
            )}
            {connectionStatus === 'accepted' && (
              <div className="flex-1 bg-emerald-100 text-emerald-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <UserCheck size={18} /> Connected
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CreateRequestModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Technical',
    description: '',
    deadline: '',
    duration: '',
    offeringInReturn: ''
  });

  const categories = [
    'Technical', 'Creative / Artistic', 'Professional / Business', 
    'Academic / Tutoring', 'Physical / Lifestyle'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skillName || !formData.description) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Request a Skill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Skill Name *</label>
            <input
              type="text"
              value={formData.skillName}
              onChange={e => setFormData({...formData, skillName: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
              placeholder="e.g., React Development, Guitar Basics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-slate-900 placeholder-slate-400"
              rows={4}
              placeholder="Describe what you want to learn and your current level..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
                placeholder="e.g., 1 week"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Offering in Return</label>
            <input
              type="text"
              value={formData.offeringInReturn}
              onChange={e => setFormData({...formData, offeringInReturn: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
              placeholder="What can you offer in exchange?"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RequestDetailModal: React.FC<{
  request: SkillRequest;
  onClose: () => void;
  onPropose: () => void;
  onMessage: () => void;
  isOwnRequest: boolean;
}> = ({ request, onClose, onPropose, onMessage, isOwnRequest }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl rounded-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-10 h-10 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-all z-10"
        >
          <X size={20} className="text-white font-bold" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
              {request.status}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
              {request.category}
            </span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3">{request.skillName}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">{request.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {request.deadline && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="text-blue-600" size={18} />
                <span className="text-xs font-bold text-slate-500 uppercase">Deadline</span>
              </div>
              <p className="font-bold text-slate-900">{new Date(request.deadline).toLocaleDateString()}</p>
            </div>
          )}
          {request.duration && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-blue-600" size={18} />
                <span className="text-xs font-bold text-slate-500 uppercase">Duration</span>
              </div>
              <p className="font-bold text-slate-900">{request.duration}</p>
            </div>
          )}
        </div>

        {request.offeringInReturn && (
          <div className="p-4 bg-blue-50 rounded-xl mb-6 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="text-blue-600" size={20} />
              <span className="text-sm font-bold text-blue-900 uppercase">Offering in Return</span>
            </div>
            <p className="text-blue-800 font-medium">{request.offeringInReturn}</p>
          </div>
        )}

        <div className="p-4 bg-slate-50 rounded-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg font-black">
              {request.userDetails.name[0]}
            </div>
            <div>
              <p className="font-bold text-slate-900">{request.userDetails.name}</p>
              <p className="text-sm text-slate-600">{request.userDetails.email}</p>
              <p className="text-xs text-slate-500">{request.userDetails.branch} • Year {request.userDetails.year}</p>
            </div>
          </div>
        </div>

        {!isOwnRequest && (
          <div className="flex gap-3">
            <button 
              onClick={onMessage}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} /> Message
            </button>
            <button 
              onClick={onPropose}
              className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <Handshake size={18} /> Propose Barter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BarterProposalModal: React.FC<{
  request: SkillRequest;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ request, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    offeringSkill: '',
    offeringDescription: '',
    wantingSkill: request.skillName, // NEW: Pre-fill what they want
    message: '',
    duration: '',
    schedule: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.offeringSkill || !formData.message) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Propose a Barter</h2>
        <p className="text-slate-600 mb-8">They need: <strong className="text-slate-900">{request.skillName}</strong></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">What skill are you offering? *</label>
            <input
              type="text"
              value={formData.offeringSkill}
              onChange={e => setFormData({...formData, offeringSkill: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
              placeholder="e.g., Python Programming"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Describe what you're offering</label>
            <textarea
              value={formData.offeringDescription}
              onChange={e => setFormData({...formData, offeringDescription: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-slate-900 placeholder-slate-400"
              rows={3}
              placeholder="What can you teach them?"
            />
          </div>

          {/* NEW: What you want in exchange */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">What you want in exchange *</label>
            <input
              type="text"
              value={formData.wantingSkill}
              onChange={e => setFormData({...formData, wantingSkill: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
              placeholder="e.g., React Development"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Your Message *</label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-slate-900 placeholder-slate-400"
              rows={4}
              placeholder="Introduce yourself and explain how you can help..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
                placeholder="e.g., 2 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Proposed Schedule</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={e => setFormData({...formData, schedule: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-900 placeholder-slate-400"
                placeholder="e.g., Weekends"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} /> Send Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillBarter;
