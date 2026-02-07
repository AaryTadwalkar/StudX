import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import type { User } from '../types';

interface OTPPageProps {
  pendingUser: (User & { password?: string }) | null;
  onVerify: (token: string, user: User) => void;
  onBack: () => void;
}

const API_BASE = "http://localhost:5000/api";

const OTPPage: React.FC<OTPPageProps> = ({ pendingUser, onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!pendingUser) {
      setError('Session expired. Please signup again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingUser.email,
          otp: otpString,
          password: pendingUser.password || '',
          fullName: pendingUser.name,
          year: Number(pendingUser.year),
          branch: pendingUser.branch,
          prn: pendingUser.prn,
          phone: pendingUser.phone
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Verification failed');
      }

      const data = await res.json();
      
      // Call the parent's onVerify with token and user data
      onVerify(data.token, data.user);
      
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !pendingUser) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: pendingUser.name,
          year: Number(pendingUser.year),
          branch: pendingUser.branch,
          prn: pendingUser.prn,
          email: pendingUser.email,
          phone: pendingUser.phone,
          password: pendingUser.password || ''
        })
      });

      if (!res.ok) throw new Error('Failed to resend OTP');

      setTimer(40);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] text-white p-12 rounded-3xl hidden md:flex flex-col justify-center space-y-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">EDIT DETAILS</span>
          </button>

          <div className="bg-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center">
            <Shield size={48} />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">Verify Identity</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Please enter the security code sent to your email to verify your student status.
            </p>
          </div>

          <div className="pt-8 border-t border-blue-400">
            <p className="text-sm text-blue-200">SESSION SECURE</p>
          </div>
        </div>

        {/* Right Panel - OTP Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm Code</h2>
            <p className="text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="text-blue-600 font-medium mt-1">
              {pendingUser?.email || 'your email'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.some(d => !d)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'VERIFYING...' : 'CONFIRM IDENTITY'}
          </button>

          <div className="text-center mt-6">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 font-medium hover:underline disabled:text-gray-400"
              >
                Resend code
              </button>
            ) : (
              <p className="text-gray-500">
                RESEND IN <span className="font-bold">{timer}s</span>
              </p>
            )}
          </div>

          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden mt-6 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            <ArrowLeft size={20} />
            <span>Back to signup</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
