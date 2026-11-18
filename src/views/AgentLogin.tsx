import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const AgentLogin: React.FC = () => {
  const { setRole, setAgentName, setAgentPartnerId, navigate } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('advisor_vikram');
  const [fullName, setFullName] = useState('Vikramaditya Nair');
  const [partnerId, setPartnerId] = useState('GW-RERA-2048');
  const [password, setPassword] = useState('agentpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('agent');
    if (fullName) setAgentName(fullName);
    if (partnerId) setAgentPartnerId(partnerId);

    setFeedback(
      authMode === 'signup'
        ? `Agent account registered for ${fullName || username}. Opening your Agent Portal...`
        : `Welcome back, ${fullName || username}. Opening your Agent Portal...`
    );

    setTimeout(() => {
      navigate('agent-flats');
    }, 550);
  };

  const fillDemoCredentials = () => {
    setUsername('advisor_vikram');
    setFullName('Vikramaditya (Senior Advisor)');
    setPartnerId('GW-RERA-2048');
    setPassword('agentpassword');
    setFeedback('Loaded demo verified RERA advisor credentials.');
  };

  return (
    <div className="relative flex-1 flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6">
      {/* Background with soft overlay */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida/ALJJyrCotgPsq5zWboW9ofDqaAqctVdepVTWSFKNKquKian4iZNxw2RH5_voKo9aWPvqqIoZGENsjbzdQwo3bpX1n6FlX6sPFYAPCwCVXD7J8ubf3ZeFXbxQzUbll4_-A-SAAipGts8w-o_3IEiNk9Rg8bsKsRcqaKGpxR0_6r2_0zI16F4O-bQmRFPoS3tq_iSUNpl4sR82EenJ70cauLIVfL9srPyl08Z3KcbNyA0H66ahh7l3qMMOa1lhN4xyBUY"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#F2F5F3]/75 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-[#D0DDD7] p-8 shadow-xl flex flex-col gap-6">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#FCE8E0] text-[#B44D27] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FCE8E0] text-[#5C220D] text-xs font-semibold">
              Agent Portal
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
                  ? 'bg-white text-[#B44D27] shadow-xs'
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
                  ? 'bg-white text-[#B44D27] shadow-xs'
                  : 'text-[#4B5E63] hover:text-[#152226]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Titles */}
          <div className="flex flex-col gap-1">
            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#152226]">
              {authMode === 'signin' ? 'Agent Login' : 'Register as Advisor'}
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5E63]">
              {authMode === 'signin'
                ? 'Sign in with your agent credentials to manage buyer briefs, site audits, and deal conversions.'
                : 'Register your advisor profile with your RERA Partner ID.'}
            </p>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#FCE8E0] hover:bg-[#FCE8E0]/80 text-[#B44D27] text-xs font-medium border border-[#B44D27]/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Demo Advisor (Vikramaditya • GW-RERA-2048)</span>
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {authMode === 'signup' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#152226]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#B44D27] focus:bg-white focus:ring-1 focus:ring-[#B44D27] outline-hidden transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#152226]">RERA / Partner ID</label>
                  <div className="relative flex items-center">
                    <ShieldCheck className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={partnerId}
                      onChange={(e) => setPartnerId(e.target.value)}
                      placeholder="e.g. GW-RERA-2048"
                      className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#B44D27] focus:bg-white focus:ring-1 focus:ring-[#B44D27] outline-hidden transition-colors font-['Red_Hat_Mono']"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#152226]">Agent Username</label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-[#4B5E63] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your agent username"
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#B44D27] focus:bg-white focus:ring-1 focus:ring-[#B44D27] outline-hidden transition-colors"
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
                  className="w-full min-h-[44px] pl-9 pr-10 py-2 rounded-lg bg-[#F2F5F3] border border-[#D0DDD7] text-sm text-[#152226] focus:border-[#B44D27] focus:bg-white focus:ring-1 focus:ring-[#B44D27] outline-hidden transition-colors"
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
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-[#B44D27] hover:bg-[#5C220D] text-white font-semibold text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>{authMode === 'signin' ? 'Sign in to Agent Portal' : 'Register Advisor Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#D0DDD7] text-center">
            <button
              type="button"
              onClick={() => navigate('portal-chooser')}
              className="text-xs text-[#4B5E63] hover:text-[#B44D27] transition-colors cursor-pointer"
            >
              ← Back to All Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
