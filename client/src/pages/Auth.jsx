import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User as UserIcon, AlertTriangle } from 'lucide-react';

const Auth = () => {
  const { login, register, token } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, skip auth
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password } = formData;

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-neonPurple/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-neonCyan/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main glass wrapper card */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer mb-3"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-neonPurple to-neonCyan text-white shadow-neon-purple">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <span className="text-2xl font-bold tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-neonPurple to-neonCyan">
              AetherArt
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {isLogin ? 'Welcome back to the art dimension.' : 'Join the elite creative collective.'}
          </p>
        </div>

        {/* Form panel */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative">
          
          <div className="flex items-center justify-center gap-2 px-1 py-1 rounded-xl bg-black/40 border border-white/5 mb-8">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-all duration-300 ${
                isLogin ? 'bg-gradient-to-r from-neonPurple/40 to-neonCyan/20 text-white border border-neonPurple/25 shadow-neon-purple' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-all duration-300 ${
                !isLogin ? 'bg-gradient-to-r from-neonPurple/40 to-neonCyan/20 text-white border border-neonPurple/25 shadow-neon-purple' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase pl-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full py-3.5 pl-10 pr-4 rounded-xl glass-input text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full py-3.5 pl-10 pr-4 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 tracking-wide uppercase pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-3.5 pl-10 pr-4 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neonPurple via-neonPink to-neonCyan text-white font-bold text-sm tracking-wider shadow-neon-purple hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 mt-4 hover:shadow-neon-cyan disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'ACCESS STUDIO' : 'CREATE PORTAL'}</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Mock Instructions (Extremely helperful for testing!) */}
          <div className="mt-8 p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-500 leading-relaxed text-left">
            <span className="font-bold text-neonCyan block mb-1">💡 Quick Sandbox Accounts</span>
            • Test User: <code className="text-white">john@aetherart.com</code> / <code className="text-white">user123</code><br/>
            • Admin: <code className="text-white">admin@aetherart.com</code> / <code className="text-white">admin123</code>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Auth;
