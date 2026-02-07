import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Search, Trash2, MessageCircle } from 'lucide-react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';

const API_BASE = "http://localhost:5000/api";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  email?: string;
  branch?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  messages?: Message[];
}

interface MessagesPageProps {
  onBack: () => void;
  onNavigate: (state: AppState) => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update 2: Real-time Polling Logic
  
  // Poll for new messages in the ACTIVE chat every 3 seconds
  useEffect(() => {
    if (!selectedConversation) return;

    const intervalId = setInterval(() => {
      // We reuse your existing loadMessages function
      loadMessages(selectedConversation);
    }, 3000); 

    return () => clearInterval(intervalId);
  }, [selectedConversation]);

  // Poll for conversation list updates (e.g. unread counts) every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Call with true to hide the loading spinner
      loadConversations(true); 
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Update 1: Add isBackground parameter
  const loadConversations = async (isBackground = false) => {
    try {
      // Only show spinner if NOT a background update
      if (!isBackground) setLoading(true);
      
      const response = await fetch(`${API_BASE}/messages/conversations`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to load conversations');
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Load conversations error:', error);
      // Don't wipe conversations on background error
      if (!isBackground) setConversations([]); 
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to load messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Load messages error:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation || sending) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_BASE}/messages/conversations/${selectedConversation}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newMessage.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add new message to messages list
      setMessages(prev => [...prev, data.message]);
      
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage.trim(), time: 'Just now' }
          : conv
      ));

      setNewMessage('');
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Delete this conversation?')) return;

    try {
      const response = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      // Remove from list
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      // If this was selected, deselect
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Delete conversation error:', error);
      alert('Failed to delete conversation');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Messenger</h1>
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 bg-white border-r flex flex-col">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start chatting from Marketplace or Skills sections
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Go to Marketplace
                  </button>
                  <button
                    onClick={() => onNavigate('skills')}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Go to Skills
                  </button>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    selectedConversation === conv.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.branch && (
                        <p className="text-xs text-gray-500 mb-1">{conv.branch}</p>
                      )}
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{conv.time}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">{currentConversation.name}</h2>
                {currentConversation.branch && (
                  <p className="text-sm text-gray-600">{currentConversation.branch}</p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.isMe
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {!msg.isMe && (
                          <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                        )}
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
