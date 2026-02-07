import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import { GlobalNav } from './HomePage';
import type { AppState } from '../types';
import { Heart, Trash2, ShoppingCart, Loader, ImageIcon } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface WishlistItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  condition: string;
  images: Array<{ url: string; publicId: string }>;
  sellerName: string;
  location: string;
}

interface WishlistPageProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onNavigate: (s: AppState) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ 
  wishlist, 
  onToggleWishlist, 
  onAddToCart, 
  onNavigate 
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (wishlist.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch each item in wishlist
        const promises = wishlist.map(id => 
          fetch(`${API_URL}/items/${id}`).then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        setItems(results.filter(item => item._id)); // Filter out any errors
      } catch (error) {
        console.error('Failed to fetch wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [wishlist]);

  const handleAddToCart = (id: string) => {
    onAddToCart(id);
    alert('Added to cart!');
  };

  const handleRemoveFromWishlist = (id: string) => {
    onToggleWishlist(id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight flex items-center gap-4">
            <Heart size={40} className="text-rose-500" fill="currentColor" />
            My Wishlist
          </h1>
          <p className="text-slate-500 font-medium">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <Heart className="mx-auto text-slate-300 mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-400 mb-8">Start adding items you love!</p>
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                <div className="h-60 relative overflow-hidden bg-slate-100">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-6 right-6 w-14 h-14 bg-rose-500 text-white backdrop-blur-md rounded-2xl flex items-center justify-center transition-all hover:bg-rose-600 hover:scale-110 shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1 tracking-tight">{item.name}</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-2 tracking-widest">
                    {item.category === 'Other' && item.customCategory ? item.customCategory : item.category}
                  </p>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
