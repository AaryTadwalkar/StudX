import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import { GlobalNav } from './HomePage';
import type { AppState } from '../types';
import { Package, Edit, Trash2, Eye, MapPin, Calendar, Loader, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

interface ListingItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  condition: string;
  images: Array<{ url: string; publicId: string }>;
  location: string;
  status: string;
  views: number;
  isAvailable: boolean;
  createdAt: string;
}

interface MyListingsPageProps {
  onNavigate: (s: AppState) => void;
}

const MyListingsPage: React.FC<MyListingsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/items/user/my-listings`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (response.ok) {
        setListings(data);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Item deleted successfully');
        fetchMyListings();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}/sold`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        alert('Item marked as sold');
        fetchMyListings();
      } else {
        alert('Failed to update item');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update item');
    }
  };

  const filteredListings = listings.filter(item => {
    if (filter === 'available') return item.status === 'available';
    if (filter === 'sold') return item.status === 'sold';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">My Listings</h1>
          <p className="text-slate-500 font-medium">Manage your marketplace items</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({listings.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              filter === 'available'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Available ({listings.filter(i => i.status === 'available').length})
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              filter === 'sold'
                ? 'bg-slate-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Sold ({listings.filter(i => i.status === 'sold').length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <Package className="mx-auto text-slate-300 mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No listings yet</h3>
            <p className="text-slate-400 mb-8">Start selling by creating your first listing</p>
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              Create Listing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredListings.map(item => (
              <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className="p-8 flex gap-8">
                  <div className="w-48 h-48 rounded-[2rem] overflow-hidden bg-slate-100 flex-shrink-0">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].url} className="w-full h-full object-cover" alt={item.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={48} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-slate-900">{item.name}</h3>
                          {item.status === 'sold' ? (
                            <span className="bg-slate-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase">Sold</span>
                          ) : (
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase">Available</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">
                          {item.category === 'Other' && item.customCategory ? item.customCategory : item.category}
                        </p>
                      </div>
                      <span className="text-3xl font-black text-blue-600">₹{item.price}</span>
                    </div>

                    <p className="text-slate-600 mb-6 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-6 mb-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span className="font-bold">{item.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="font-bold">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span className="font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {item.status === 'available' && (
                        <button
                          onClick={() => handleMarkAsSold(item._id)}
                          className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Mark as Sold
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
