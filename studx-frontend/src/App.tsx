import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './components/AuthPage';
import OTPPage from './components/OTPPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import Marketplace from './components/Marketplace';
import StartupShowcase from './components/StartupShowcase';
import SkillBarter from './components/SkillBarter';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import MessagesPage from './components/MessagesPage';
import MySkillsPage from './components/MySkillsPage';
import AddSkillFlow from './components/AddSkillFlow';
import MyAccountPage from './components/MyAccountPage';
import MyOrdersPage from './components/MyOrdersPage';
import GoPremiumPage from './components/GoPremiumPage';
import MyListingsPage from './components/MyListingsPage';
import type { AppState, User, MarketplaceItem, SkillExchange, Startup, Conversation, Message } from './types';

const API_BASE = "http://localhost:5000/api";

// Added 'my-listings' to the type definition to ensure TypeScript accepts the new state
type ExtendedAppState = AppState | 'forgot-password' | 'my-listings';

const App: React.FC = () => {
  const { user, login, logout, loading: authLoading, isAuthenticated } = useAuth();
  
  const [state, setState] = useState<ExtendedAppState>('loading');
  const [history, setHistory] = useState<ExtendedAppState[]>([]);
  const [pendingUser, setPendingUser] = useState<(User & { password?: string }) | null>(null);
  
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [mySkills, setMySkills] = useState<SkillExchange[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state]);

  // Initial load - check if user is authenticated
  useEffect(() => {
    if (authLoading) {
      setState('loading');
      return;
    }

    // Load saved data
    const savedItems = localStorage.getItem('studx_items');
    const savedStartups = localStorage.getItem('studx_startups');
    const savedWishlist = localStorage.getItem('studx_wishlist');
    const savedCart = localStorage.getItem('studx_cart');
    const savedSkills = localStorage.getItem('studx_my_skills');
    const savedChats = localStorage.getItem('studx_chats');

    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedSkills) setMySkills(JSON.parse(savedSkills));
    if (savedChats) setConversations(JSON.parse(savedChats));
    
    if (!savedItems) {
      const seedItems: MarketplaceItem[] = [
        { id: '1', name: 'Engineering Mathematics Textbook', price: 450, category: 'Textbooks', condition: 'Like New', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', description: 'Complete set of engineering mathematics books for first year.', seller: 'Rahul Sharma', location: 'North Campus', rating: 4.8 },
        { id: '2', name: 'HP Laptop i5 8th Gen', price: 25000, category: 'Electronics', condition: 'Good', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400', description: '8GB RAM, 256GB SSD, excellent for coding.', seller: 'Priya Patel', location: 'Main Building', rating: 4.5 }
      ];
      setItems(seedItems);
      localStorage.setItem('studx_items', JSON.stringify(seedItems));
    } else {
      setItems(JSON.parse(savedItems));
    }

    if (!savedStartups) {
      const seedStartups: Startup[] = [
        { id: 's1', name: 'CampusEats', tagline: 'Fast hostel delivery.', founder: 'Arjun Malhotra', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', followers: 1250, products: 15, isTrending: true, category: 'Food Tech', description: 'Hostel delivery platform.' }
      ];
      setStartups(seedStartups);
      localStorage.setItem('studx_startups', JSON.stringify(seedStartups));
    } else {
      setStartups(JSON.parse(savedStartups));
    }

    // Set initial state based on authentication
    setState(isAuthenticated ? 'home' : 'auth');
  }, [authLoading, isAuthenticated]);

  const navigateTo = (newState: ExtendedAppState) => {
    if (state !== newState) {
      setHistory(prev => [...prev, state]);
      setState(newState);
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevState = newHistory.pop();
      setHistory(newHistory);
      setState(prevState!);
    } else {
      setState('home');
    }
  };

  const handleSendMessage = (convoId: string, text: string) => {
    const updated = conversations.map(c => {
      if (c.id === convoId) {
        const newMessage: Message = { id: Date.now().toString(), sender: 'Me', text, timestamp: new Date().toLocaleTimeString(), isMe: true };
        return { ...c, lastMessage: text, time: 'Just now', messages: [...c.messages, newMessage] };
      }
      return c;
    });
    setConversations(updated);
    localStorage.setItem('studx_chats', JSON.stringify(updated));
  };

  const startConversation = (name: string) => {
    const existing = conversations.find(c => c.name === name);
    if (existing) {
      navigateTo('messages');
      return;
    }
    const newConvo: Conversation = {
      id: Date.now().toString(),
      name,
      lastMessage: 'Hi, I would like to connect!',
      time: 'Just now',
      messages: [{ id: 'm1', sender: 'Me', text: 'Hi, I would like to connect!', timestamp: new Date().toLocaleTimeString(), isMe: true }]
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    localStorage.setItem('studx_chats', JSON.stringify(updated));
    navigateTo('messages');
  };

  const handleAuthSubmit = async (userData: User & { password?: string }, mode: "login" | "signup") => {
    try {
      if (mode === "signup") {
        const signupPayload = {
          fullName: userData.name,
          year: Number(userData.year),
          branch: userData.branch,
          prn: userData.prn,
          email: userData.email,
          phone: userData.phone,
          password: userData.password || ''
        };

        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupPayload)
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Signup failed");
          return;
        }

        setPendingUser(userData);
        setState("otp");
      }

      if (mode === "login") {
        const loginPayload = {
          email: userData.email,
          password: userData.password || ''
        };

        if (!loginPayload.email || !loginPayload.password) {
          alert("Please enter both email and password");
          return;
        }

        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload)
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Invalid credentials");
          return;
        }

        const data = await res.json();
        
        // Use AuthContext login function
        login(data.token, data.user);
        setState("home");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication failed");
    }
  };

  const handleOTPVerify = (token: string, user: User) => {
    // Use AuthContext login function
    login(token, user);
    setPendingUser(null);
    setState("landing");
  };

  const handleLogout = () => {
    // Use AuthContext logout function
    logout();
    setHistory([]);
    setState('auth');
  };

  const addMarketplaceItem = (item: MarketplaceItem) => {
    const updated = [item, ...items];
    setItems(updated);
    localStorage.setItem('studx_items', JSON.stringify(updated));
  };

  const addStartupItem = (startup: Startup) => {
    const updated = [startup, ...startups];
    setStartups(updated);
    localStorage.setItem('studx_startups', JSON.stringify(updated));
  };

  const addSkill = (skill: SkillExchange) => {
    const updated = [skill, ...mySkills];
    setMySkills(updated);
    localStorage.setItem('studx_my_skills', JSON.stringify(updated));
    setState('my-skills');
  };

  const deleteSkill = (id: string) => {
    const updated = mySkills.filter(s => s.id !== id);
    setMySkills(updated);
    localStorage.setItem('studx_my_skills', JSON.stringify(updated));
  };

  const renderContent = () => {
    switch (state) {
      case 'loading': 
        return <LoadingScreen />;
      
      case 'auth': 
        return <AuthPage onAuthSubmit={handleAuthSubmit} onForgotPassword={() => setState('forgot-password')} />;
      
      case 'otp': 
        return <OTPPage pendingUser={pendingUser} onVerify={handleOTPVerify} onBack={() => setState("auth")} />;
      
      case 'forgot-password': 
        return <ForgotPasswordPage onBack={() => setState('auth')} onSuccess={() => setState('auth')} />;
      
      case 'landing': 
        return <LandingPage onExplore={() => setState('home')} />;
      
      case 'home': 
        return <HomePage user={user} onNavigate={navigateTo} onLogout={handleLogout} />;
      
      // Protected routes below
      case 'marketplace': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <Marketplace 
              items={items} 
              wishlist={wishlist} 
              onBack={goBack} 
              onAddItem={addMarketplaceItem} 
              onToggleWishlist={(id) => {
                const newW = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
                setWishlist(newW);
                localStorage.setItem('studx_wishlist', JSON.stringify(newW));
              }} 
              onAddToCart={(id) => {
                if (!cart.includes(id)) {
                  const newC = [...cart, id];
                  setCart(newC);
                  localStorage.setItem('studx_cart', JSON.stringify(newC));
                }
              }} 
              onNavigate={navigateTo} 
              onStartChat={startConversation} 
            />
          </ProtectedRoute>
        );
      
      case 'startups': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <StartupShowcase startups={startups} onBack={goBack} onNavigate={navigateTo} onAddStartup={addStartupItem} onStartChat={startConversation} />
          </ProtectedRoute>
        );
      
      case 'skills': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <SkillBarter onBack={goBack} onNavigate={navigateTo} onStartChat={startConversation} />
          </ProtectedRoute>
        );
      
      case 'wishlist': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <WishlistPage 
              items={items} 
              wishlist={wishlist} 
              onBack={goBack} 
              onRemove={(id) => {
                const newW = wishlist.filter(x => x !== id);
                setWishlist(newW);
                localStorage.setItem('studx_wishlist', JSON.stringify(newW));
              }} 
              onAddToCart={(id) => {
                if (!cart.includes(id)) {
                  const newC = [...cart, id];
                  setCart(newC);
                  localStorage.setItem('studx_cart', JSON.stringify(newC));
                }
              }} 
              onGoMarketplace={() => navigateTo('marketplace')} 
              onNavigate={navigateTo} 
            />
          </ProtectedRoute>
        );
      
      case 'cart': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <CartPage 
              items={items} 
              cart={cart} 
              onBack={goBack} 
              onRemove={(id) => {
                const newC = cart.filter(x => x !== id);
                setCart(newC);
                localStorage.setItem('studx_cart', JSON.stringify(newC));
              }} 
              onGoMarketplace={() => navigateTo('marketplace')} 
              onNavigate={navigateTo} 
            />
          </ProtectedRoute>
        );
      
      case 'messages': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <MessagesPage conversations={conversations} onSendMessage={handleSendMessage} onBack={goBack} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      
      case 'my-skills': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <MySkillsPage skills={mySkills} onBack={goBack} onDelete={deleteSkill} onAdd={() => navigateTo('add-skill')} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      
      case 'add-skill': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <AddSkillFlow onBack={goBack} onComplete={addSkill} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      
      case 'my-account': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <MyAccountPage user={user} onBack={goBack} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      
      case 'my-orders': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <MyOrdersPage onBack={goBack} onNavigate={navigateTo} />
          </ProtectedRoute>
        );

      case 'my-listings':
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
             <MyListingsPage onNavigate={navigateTo} onBack={goBack} />
          </ProtectedRoute>
        );
      
      case 'premium': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <GoPremiumPage onBack={goBack} onNavigate={navigateTo} />
          </ProtectedRoute>
        );
      
      default: 
        return <HomePage user={user} onNavigate={navigateTo} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {renderContent()}
    </div>
  );
};

export default App;