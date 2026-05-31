import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Sparkles, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  User as UserIcon,
  Zap,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMyCreations();
  }, []);

  const fetchMyCreations = async () => {
    try {
      const res = await api.get('/api/images/my');
      if (res.data.success) {
        setCreations(res.data.images);
      }
    } catch (err) {
      console.error('Failed to load user creations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imgId) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this artwork? This cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/api/images/${imgId}`);
      if (res.data.success) {
        // Dynamic filter out of current UI list
        setCreations(prev => prev.filter(img => img._id !== imgId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleCopyPrompt = (promptText, id) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (img) => {
    const url = `http://localhost:5000${img.url}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `aetherart-${img._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Title Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-neonCyan" />
          <span>My Profile Studio</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">Review your visual statistics and manage your historical creations draft portfolio.</p>
      </div>

      {/* Stats Cards Dashboard */}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neonPurple/10 border border-neonPurple/20 flex items-center justify-center text-neonPurple">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Masterpieces</span>
              <span className="text-2xl font-extrabold text-white font-sans mt-0.5 block">{creations.length}</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neonCyan/10 border border-neonCyan/20 flex items-center justify-center text-neonCyan">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Membership Plan</span>
              <span className="text-xl font-extrabold text-white capitalize mt-1.5 block">{user.plan} Badge</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Credits Remaining</span>
              <span className="text-2xl font-extrabold text-white font-sans mt-0.5 block">
                {user.plan === 'premium' ? 'INFINITE' : user.credits}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Creations Section Title */}
      <div className="border-b border-white/5 pb-4 mb-6">
        <h3 className="text-base font-bold text-white font-sans">Draft Portfolio History</h3>
      </div>

      {/* Creations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {creations.map((img) => (
          <div 
            key={img._id}
            className="group relative rounded-2xl overflow-hidden glass-panel border border-white/5 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className={`relative overflow-hidden w-full bg-black/40 ${
              img.aspectRatio === '16:9' ? 'aspect-video' : (img.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square')
            }`}>
              <img 
                src={`http://localhost:5000${img.url}`} 
                alt={img.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating badges */}
              <div className="absolute top-2 left-2 flex gap-1 z-10">
                <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[8px] uppercase font-extrabold tracking-wider text-neonCyan">
                  {img.style}
                </span>
                <span className={`px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[8px] uppercase font-extrabold tracking-wider ${
                  img.isPublic ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {img.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Core details */}
            <div className="p-4 text-left flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-300 font-semibold line-clamp-2 italic">
                  "{img.prompt}"
                </p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase mt-3">
                  Generated {new Date(img.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                
                {/* Copy */}
                <button 
                  onClick={() => handleCopyPrompt(img.prompt, img._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  title="Copy Prompt"
                >
                  {copiedId === img._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-neonCyan" />}
                  <span>{copiedId === img._id ? 'Copied' : 'Prompt'}</span>
                </button>

                {/* Download */}
                <button 
                  onClick={() => handleDownload(img)}
                  className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button 
                  onClick={() => handleDelete(img._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 p-1 px-2.5 rounded-lg border border-transparent hover:border-red-500/10 transition-all"
                  title="Delete artwork"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && creations.length === 0 && (
        <div className="text-center py-24 glass-panel max-w-lg mx-auto rounded-3xl border border-white/5 shadow-2xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 mb-6 mx-auto animate-float">
            <ImageIcon className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="font-bold text-white text-lg">No creations yet</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Head to the visual studio workspace, type a creative text prompt, select style parameters, and hit generate!
          </p>
        </div>
      )}

      {/* Loading spinners */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {[1, 2].map((n) => (
            <div key={n} className="glass-panel p-4 rounded-2xl border border-white/5 animate-pulse h-80 flex flex-col justify-between">
              <div className="bg-white/5 rounded-xl aspect-square w-full" />
              <div className="space-y-3 mt-4">
                <div className="bg-white/5 h-3.5 rounded w-full" />
                <div className="bg-white/5 h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Profile;
