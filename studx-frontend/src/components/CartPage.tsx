import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import { GlobalNav } from './HomePage';
import type { AppState } from '../types';
import { ShoppingCart, Trash2, Plus, Minus, Loader, ImageIcon, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

interface CartItem {
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
  quantity: number; // Added for cart functionality
}

interface CartPageProps {
  cart: string[];
  onRemoveFromCart: (id: string) => void;
  onNavigate: (s: AppState) => void;
}

const CartPage: React.FC<CartPageProps> = ({ 
  cart, 
  onRemoveFromCart, 
  onNavigate 
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (cart.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch each item in cart
        const promises = cart.map(id => 
          fetch(`${API_URL}/items/${id}`).then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        const validItems = results.filter(item => item._id);
        setItems(validItems);
        
        // Initialize quantities
        const initialQuantities: { [key: string]: number } = {};
        validItems.forEach(item => {
          initialQuantities[item._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [cart]);

  const updateQuantity = (id: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change)
    }));
  };

  const handleRemove = (id: string) => {
    onRemoveFromCart(id);
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.price * (quantities[item._id] || 1));
    }, 0);
  };

  const handleCheckout = () => {
    alert('Checkout feature coming soon! Total: ₹' + calculateTotal());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight flex items-center gap-4">
            <ShoppingCart size={40} className="text-blue-600" />
            Shopping Cart
          </h1>
          <p className="text-slate-500 font-medium">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <ShoppingCart className="mx-auto text-slate-300 mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-slate-400 mb-8">Add some items to get started!</p>
            <button
              onClick={() => onNavigate('marketplace')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-xl hover:scale-105 transition-all"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} className="w-full h-full object-cover" alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            {item.category === 'Other' && item.customCategory ? item.customCategory : item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-2">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-8 h-8 rounded-xl bg-white text-slate-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-black text-slate-900 min-w-[2rem] text-center">
                            {quantities[item._id] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-8 h-8 rounded-xl bg-white text-slate-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-slate-400 text-xs font-bold mb-1">Item Total</p>
                          <p className="text-2xl font-black text-blue-600">
                            ₹{item.price * (quantities[item._id] || 1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8 sticky top-8">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-bold">Subtotal</span>
                    <span className="font-black">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-bold">Shipping</span>
                    <span className="font-black text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-black text-slate-900">Total</span>
                      <span className="text-2xl font-black text-blue-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <p className="text-slate-400 text-xs text-center mt-4 font-medium">
                  Secure checkout • Campus delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
