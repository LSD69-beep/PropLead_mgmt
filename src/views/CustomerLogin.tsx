import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export const CustomerLogin: React.FC = () => {
  const { setRole, setCustomerName, setCustomerEmail, navigate } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('priya_sharma');
  const [fullName, setFullName] = useState('Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('glasswindow2026');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('customer');
    if (authMode === 'signup' && fullName) {
      setCustomerName(fullName);
    } else {
      setCustomerName(username === 'priya_sharma' ? 'Priya Sharma' : username);
    }
    if (email) setCustomerEmail(email);

    setFeedback(
      authMode === 'signup'
        ? `Account created for ${fullName || username}. Redirecting to city selection...`
        : `Welcome back, ${username}. Redirecting to city selection...`
    );

    setTimeout(() => {
      navigate('customer-city-select');
    }, 600);
  };

  const fillDemoCredentials = () => {
    setUsername('priya_sharma');
    setFullName('Priya Sharma');
    setEmail('priya.sharma@example.com');
    setPassword('glasswindow2026');
    setFeedback('Loaded demo buyer credentials for Bangalore.');
  };

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6">
      {/* Background with soft overlay */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida/ALJJyrB3jP7Jo0hGOQVD7bwLSLpPDWeTjncFURZG832qR5rZcOBCNkWuLExTHG6eAs0L4fqSL92PsixXTyrktkrcog3LOGyO4zSSHp1whxjfMklaMBjlsR0Zh6GH4LTS0vDOLehbJ1WBr8GX4_jQdzsuZQARORd0UENypmhaipamLsxjomZrs2wxq7U3TSBbOpAqW4iYvRSvb4ulENmYUel5-DbctPkscHXdAKbtLLLdSl6huMnv3ZLKZ4V4PFGo"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#F2F5F3]/75 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0DDD7] p-8 shadow-xl flex flex-col gap-6">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#D2E8ED] text-[#0F4C5C] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#D2E8ED] text-[#09323D] text-xs font-semibold">
              Customer Portal
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#E9EFEA] border border-[#D0DDD7] gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setFeedback(null);
              }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-[#0F4C5C] shadow-xs'
                  : 'text-[#4B5E63] hover:text-[#152226]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setFeedback(null);
              }}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-[#0F4C5C] shadow-xs'
                  : 'text-[#4B5E63] hover:text-[#152226]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Titles */}
          <div className="flex flex-col gap-1">
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#152226]">
              {authMode === 'signin' ? 'Customer Login' : 'Create Customer Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5E63]">
              {authMode === 'signin'
                ? 'Sign in to inspect verified flats across Hyderabad, Bangalore, and Delhi.'
                : 'Register to unlock 80-point RERA audits and customized shortlists.'}
            </p>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#E9EFEA] hover:bg-[#DDE6E0] text-[#0F4C5C] text-xs font-medium border border-[#D0DDD7] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B44D27]" />
            <span>Use Demo Customer (Priya Sharma)</span>
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {authMode === 'signup' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#152226]">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#0F4C5C] focus:bg-white focus:ring-1 focus:ring-[#0F4C5C] outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#152226]">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#0F4C5C] focus:bg-white focus:ring-1 focus:ring-[#0F4C5C] outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#152226]">Username</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#0F4C5C] focus:bg-white focus:ring-1 focus:ring-[#0F4C5C] outline-hidden transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#152226]">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full min-h-[44px] pl-9 pr-10 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#0F4C5C] focus:bg-white focus:ring-1 focus:ring-[#0F4C5C] outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#4B5E63] hover:text-[#152226] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {feedback && (
              <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#1F7A4C]/30 text-[#14532D] text-xs font-medium">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-[#0F4C5C] hover:bg-[#09323D] text-white font-semibold text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>{authMode === 'signin' ? 'Sign in to Customer Portal' : 'Register Customer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#D0DDD7] text-center">
            <button
              type="button"
              onClick={() => navigate('portal-chooser')}
              className="text-xs text-[#4B5E63] hover:text-[#0F4C5C] transition-colors cursor-pointer"
            >
              ← Back to All Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
