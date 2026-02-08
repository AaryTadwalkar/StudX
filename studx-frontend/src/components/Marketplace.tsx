import React, { useState, useRef, useEffect } from 'react';
import type { AppState } from '../types';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import { GlobalNav } from './HomePage';
import { startConversation } from './services/chatService';
import { Search, Grid, List, Plus, MapPin, User, Heart, X, ShoppingCart, MessageCircle, Loader, Upload, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api"; // ✅ GOOD

interface MarketplaceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  condition: string;
  images: Array<{ url: string; publicId: string }>;
  seller: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    branch?: string;
  };
  sellerName: string;
  location: string;
  status: string;
  views: number;
  createdAt: string;
}

interface MarketplaceProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onNavigate: (s: AppState) => void;
  onStartChat: (name: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ 
  wishlist, 
  onToggleWishlist, 
  onAddToCart, 
  onNavigate, 
  onStartChat 
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; publicId: string }>>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'All',
    'Textbooks',
    'Electronics',
    'Notes & Study Material',
    'Lab Equipment',
    'Stationery',
    'Sports & Fitness',
    'Room Essentials',
    'Fashion & Accessories',
    'Gadgets & Tech',
    'Musical Instruments',
    'Art Supplies',
    'Bikes & Vehicles',
    'Furniture',
    'Food & Snacks',
    'Event Tickets',
    'Other'
  ];

  // Fetch items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== 'All') queryParams.append('category', filter);
      if (search) queryParams.append('search', search);

      const response = await fetch(`${API_URL}/items?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle starting a chat with seller
const handleChatSeller = async (item: MarketplaceItem) => {
  try {
    // Check if seller info exists
    if (!item.seller?._id) {
      alert('Seller information not available');
      return;
    }

    // Check if trying to chat with yourself
    if (user && item.seller._id === user._id) {
      alert('This is your own listing!');
      return;
    }

    // Start conversation with seller
    const conversationId = await startConversation(
      item.seller._id, 
      item.seller.name,
      item.seller.email
    );

    console.log('Conversation started:', conversationId);

    // Navigate to messages page
    onNavigate('messages');
  } catch (error) {
    console.error('Failed to start chat:', error);
    alert('Failed to start conversation. Please try again.');
  }
};


  useEffect(() => {
    fetchItems();
  }, [filter, search]);

  // Category scroll functions
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const response = await fetch(`${API_URL}/items/upload-image`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image: base64Image })
        });

        const data = await response.json();
        
        if (response.ok) {
          setUploadedImages(prev => [...prev, { url: data.url, publicId: data.publicId }]);
        } else {
          alert('Image upload failed: ' + data.message);
        }
      };
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle create listing
  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const category = formData.get('category') as string;
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || 'No description provided',
      price: Number(formData.get('price')),
      category: category,
      customCategory: category === 'Other' ? formData.get('customCategory') as string : undefined,
      condition: formData.get('condition') as string || 'Good',
      images: uploadedImages,
      location: formData.get('location') as string || 'VIT Campus'
    };

    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Item listed successfully!');
        setIsModalOpen(false);
        setUploadedImages([]);
        setShowCustomCategory(false);
        fetchItems(); // Refresh items
      } else {
        alert('Failed to create listing: ' + data.message);
      }
    } catch (error) {
      console.error('Create listing error:', error);
      alert('Failed to create listing');
    }
  };

  const filteredItems = items.filter(item => 
    (filter === 'All' || item.category === filter) && 
    (item.name.toLowerCase().includes(search.toLowerCase()) || 
     item.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <GlobalNav user={user} onNavigate={onNavigate} onLogout={() => onNavigate('auth')} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="w-full md:max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for items..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl border border-slate-200 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-slate-900 shadow-sm placeholder:text-slate-300" 
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} /></button>
              <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-105 transition-all"><Plus size={20} /> Add Listing</button>
          </div>
        </div>

        {/* Category Filter with Scroll Buttons */}
        <div className="relative mb-12">
          <button 
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          
          <div 
            ref={categoryScrollRef}
            className="flex gap-3 overflow-x-auto px-10 py-2 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)} 
                className={`whitespace-nowrap px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${filter === cat ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-slate-50 transition-all"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-bold">No items found</p>
            <p className="text-slate-300 text-sm mt-2">Try adjusting your filters or be the first to add a listing!</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
            {filteredItems.map(item => (
              <div key={item._id} onClick={() => setSelectedItem(item)} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer animate-fade-in-up">
                <div className="h-60 relative overflow-hidden bg-slate-100">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(item._id); }} 
                    className={`absolute top-6 right-6 w-14 h-14 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all ${wishlist.includes(item._id) ? 'bg-rose-500 text-white shadow-lg scale-110' : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:scale-110 shadow-sm'}`}
                  >
                    <Heart size={24} fill={wishlist.includes(item._id) ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">{item.name}</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-6 tracking-widest">{item.category === 'Other' && item.customCategory ? item.customCategory : item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">₹{item.price}</span>
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item._id); }} className="bg-blue-50 text-blue-600 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-inner"><ShoppingCart size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedItem(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="p-10 md:p-14">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setSelectedItem(null)} className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all"><ChevronLeft size={22} /> Back to Marketplace</button>
                <button onClick={() => setSelectedItem(null)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square ring-1 ring-black/5 bg-slate-100">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <img src={selectedItem.images[0].url} className="w-full h-full object-cover" alt={selectedItem.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={96} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2 mb-6">
                       <span className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedItem.condition}</span>
                       <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{selectedItem.category === 'Other' && selectedItem.customCategory ? selectedItem.customCategory : selectedItem.category}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{selectedItem.name}</h1>
                    <div className="flex items-center gap-6 mb-10">
                      <span className="text-5xl font-black text-blue-600">₹{selectedItem.price}</span>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4 mb-10">
                       <div className="flex items-center gap-4 text-sm font-bold text-slate-600"><User size={20} className="text-blue-500" /> Sold by <span className="text-slate-900 font-black">{selectedItem.sellerName}</span></div>
                       <div className="flex items-center gap-4 text-sm font-bold text-slate-600"><MapPin size={20} className="text-emerald-500" /> <span className="text-slate-900 font-black">{selectedItem.location}</span></div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Details</h4>
                      <p className="text-slate-600 text-base leading-relaxed font-medium">{selectedItem.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-12">
                    <button onClick={() => onAddToCart(selectedItem._id)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:scale-105 transition-all"><ShoppingCart size={20} /> Add to Cart</button>
                    <button 
                      onClick={() => handleChatSeller(selectedItem)} 
                      className="bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <MessageCircle size={20} /> Chat Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#1E2128] text-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tight">Add New Listing</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
              </div>
              <form className="space-y-8" onSubmit={handleCreateListing}>
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Media</label>
                  
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden">
                          <img src={img.url} className="w-full h-full object-cover" alt={`Upload ${idx + 1}`} />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={uploadingImage}
                      className="border-2 border-dashed border-slate-700 rounded-[2rem] h-28 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader className="animate-spin text-blue-500" size={24} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="text-slate-500" />
                          <span className="text-[10px] font-black uppercase tracking-wider">Upload Image</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Title *</label>
                    <input name="name" required placeholder="e.g. Scientific Calculator" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                    <textarea name="description" rows={3} placeholder="Describe your item..." className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (₹) *</label>
                      <input name="price" type="number" required placeholder="0" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Condition</label>
                      <select name="condition" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 text-white">
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category *</label>
                    <select 
                      name="category" 
                      required
                      onChange={(e) => setShowCustomCategory(e.target.value === 'Other')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {showCustomCategory && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Custom Category *</label>
                      <input name="customCategory" required placeholder="Enter your category" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Location</label>
                    <input name="location" defaultValue="VIT Campus" placeholder="e.g. A Block, VIT" className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none text-white" />
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:opacity-90 hover:scale-[1.02] transition-all">List Item Now</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Marketplace;
