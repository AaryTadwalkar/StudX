import React, { useState } from 'react';
import { Mail, Lock, User, Phone, GraduationCap, Hash } from 'lucide-react';
import type { User as UserType } from '../types';

interface AuthPageProps {
  onAuthSubmit: (userData: UserType & { password?: string }, mode: "login" | "signup") => void;
  onForgotPassword: () => void;  // 🆕 ADD THIS
}


const AuthPage: React.FC<AuthPageProps> = ({ onAuthSubmit, onForgotPassword }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    year: '1',
    branch: '',
    prn: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission:", { mode, formData });

    // Validation
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    if (!formData.email.endsWith('@vit.edu')) {
      alert("Please use your @vit.edu email");
      return;
    }

    if (mode === "signup") {
      // Validate all signup fields
      if (!formData.name || !formData.phone || !formData.branch || !formData.prn) {
        alert("All fields are required for signup");
        return;
      }

      if (formData.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      // Submit signup data
      const userData: UserType & { password: string } = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        year: formData.year,
        branch: formData.branch,
        prn: formData.prn
      };

      console.log("Submitting signup:", userData);
      onAuthSubmit(userData, "signup");

    } else {
      // Login mode - only need email and password
      const userData: UserType & { password: string } = {
        name: '', // These fields won't be used in login
        email: formData.email,
        password: formData.password,
        phone: '',
        year: '1',
        branch: '',
        prn: ''
      };

      console.log("Submitting login:", { email: userData.email, password: "***" });
      onAuthSubmit(userData, "login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Panel - Branding */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white p-12 rounded-3xl hidden md:flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">
              Stud<span className="text-blue-300">X</span>
            </h1>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Empowering Campus Connections.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Join 5,000+ students buying, selling, and innovating together.
            </p>
          </div>

          <div className="pt-8 border-t border-blue-400">
            <p className="text-sm text-blue-200">VERIFIED STUDENT NETWORK</p>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Welcome Back" : "Join StudX"}
            </h2>
            <p className="text-gray-600">
              {mode === "login" ? "Enter your details to login" : "Create your student account"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === "login"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Signup Fields */}
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required={mode === "signup"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                      required={mode === "signup"}
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Branch (e.g., CSE)"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required={mode === "signup"}
                  />
                </div>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="prn"
                    value={formData.prn}
                    onChange={handleChange}
                    placeholder="PRN Number"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required={mode === "signup"}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required={mode === "signup"}
                  />
                </div>
              </>
            )}

            {/* Common Fields */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="College Email (@vit.edu)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to StudX{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
