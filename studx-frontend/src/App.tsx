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
import type { AppState, User, MarketplaceItem, SkillExchange, Startup } from './types';

const API_BASE = "http://localhost:5000/api";

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
    const savedWishlist = localStorage.getItem('studx_wishlist');
    const savedCart = localStorage.getItem('studx_cart');
    const savedSkills = localStorage.getItem('studx_my_skills');

    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedSkills) setMySkills(JSON.parse(savedSkills));

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
        
        // ✅ Backend now returns _id, so no workaround needed
        if (!data.user._id) {
          console.error("Backend error: User ID missing", data.user);
          alert("Server Error: Please restart your backend server");
          return;
        }

        login(data.token, data.user);
        setState("home");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication failed");
    }
  };

  const handleOTPVerify = (token: string, user: User) => {
    if (!user._id) {
      console.error("User ID missing in OTP verification");
      alert("Server Error: Please restart your backend server");
      return;
    }
    login(token, user as any);
    setPendingUser(null);
    setState("landing");
  };

  const handleLogout = () => {
    logout();
    setHistory([]);
    setState('auth');
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
              wishlist={wishlist} 
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
              onStartChat={() => navigateTo('messages')} 
            />
          </ProtectedRoute>
        );
      
      case 'startups': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <StartupShowcase 
              startups={startups} 
              onBack={goBack} 
              onNavigate={navigateTo} 
              onAddStartup={(startup) => {
                const updated = [startup, ...startups];
                setStartups(updated);
              }} 
              onStartChat={() => navigateTo('messages')} 
            />
          </ProtectedRoute>
        );
      
      case 'skills': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <SkillBarter 
              onBack={goBack} 
              onNavigate={navigateTo} 
              onStartChat={() => navigateTo('messages')} 
            />
          </ProtectedRoute>
        );
      
      case 'wishlist': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <WishlistPage 
              wishlist={wishlist} 
              onToggleWishlist={(id) => {
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
              onNavigate={navigateTo} 
            />
          </ProtectedRoute>
        );
      
      case 'cart': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <CartPage 
              cart={cart} 
              onRemoveFromCart={(id) => {
                const newC = cart.filter(x => x !== id);
                setCart(newC);
                localStorage.setItem('studx_cart', JSON.stringify(newC));
              }} 
              onNavigate={navigateTo} 
            />
          </ProtectedRoute>
        );
      
      case 'messages': 
        return (
          <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
            <MessagesPage onBack={goBack} onNavigate={navigateTo} />
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
             <MyListingsPage onNavigate={navigateTo} />
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
