import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Heart, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  Search
} from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/api/images/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (imgId) => {
    try {
      const res = await api.post(`/api/images/${imgId}/favorite`);
      if (res.data.success) {
        // Filter out of current state list
        setFavorites(prev => prev.filter(img => img._id !== imgId));
      }
    } catch (err) {
      console.error(err);
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
    link.download = `aetherart-fav-${img._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Title Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          <span>Saved Favorites</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">Manage and download your curated collection of inspiring AI creations.</p>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {favorites.map((img) => (
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
              
              {/* Style badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[8px] uppercase font-extrabold tracking-wider text-neonCyan">
                  {img.style}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 text-left flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-300 font-semibold line-clamp-2 italic">
                  "{img.prompt}"
                </p>
                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500 font-semibold uppercase">
                  <span>By {img.user?.name || 'Anonymous'}</span>
                  <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-4">
                
                {/* Copy Prompt */}
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

                {/* Unfavorite */}
                <button 
                  onClick={() => handleRemoveFavorite(img._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/5 p-1 px-2.5 rounded-lg border border-transparent hover:border-red-500/10 transition-all"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && favorites.length === 0 && (
        <div className="text-center py-24 glass-panel max-w-lg mx-auto rounded-3xl border border-white/5 shadow-2xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 mb-6 mx-auto animate-float">
            <Heart className="w-7 h-7 text-gray-600" />
          </div>
          <h3 className="font-bold text-white text-lg">No saved favorites yet</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Browse the community gallery or run generations in the studio and save them to build your personal inspiration book.
          </p>
        </div>
      )}

      {/* Loading Skeletons */}
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

export default Favorites;
