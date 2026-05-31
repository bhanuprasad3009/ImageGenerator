import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MessageSquare, 
  Search, 
  Sparkles, 
  Send,
  X,
  Clock,
  Download
} from 'lucide-react';

const Gallery = () => {
  const { user } = useAuth();
  
  // Data State
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters State
  const [search, setSearch] = useState('');
  const [activeStyle, setActiveStyle] = useState('All');
  
  // Comment Modal Overlay State
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const styleCategories = ['All', 'Realistic', 'Anime', 'Cyberpunk', 'Fantasy', '3D Render', 'Pixel Art'];

  useEffect(() => {
    fetchGallery();
  }, [page, activeStyle]);

  const fetchGallery = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      const res = await api.get('/api/images', {
        params: {
          search: search || undefined,
          style: activeStyle,
          page: currentPage,
          limit: 8
        }
      });

      if (res.data.success) {
        if (currentPage === 1) {
          setImages(res.data.images);
        } else {
          setImages(prev => [...prev, ...res.data.images]);
        }
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchGallery(true);
  };

  const handleStyleSelect = (style) => {
    setActiveStyle(style);
    setPage(1);
  };

  // Like/Unlike Toggle Action
  const handleLike = async (imgId) => {
    if (!user) {
      alert('Please log in to like artworks.');
      return;
    }

    try {
      const res = await api.post(`/api/images/${imgId}/like`);
      if (res.data.success) {
        setImages(prev => prev.map(img => {
          if (img._id === imgId) {
            const alreadyLiked = img.likes.includes(user.id);
            const updatedLikes = alreadyLiked 
              ? img.likes.filter(id => id !== user.id) 
              : [...img.likes, user.id];
            return { ...img, likes: updatedLikes };
          }
          return img;
        }));

        // Keep modal context synced
        if (selectedImage && selectedImage._id === imgId) {
          const alreadyLiked = selectedImage.likes.includes(user.id);
          const updatedLikes = alreadyLiked 
            ? selectedImage.likes.filter(id => id !== user.id) 
            : [...selectedImage.likes, user.id];
          setSelectedImage(prev => ({ ...prev, likes: updatedLikes }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal and fetch full details
  const handleOpenComments = (img) => {
    setSelectedImage(img);
    setCommentText('');
  };

  // Submit new comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/api/images/${selectedImage._id}/comment`, {
        text: commentText
      });

      if (res.data.success) {
        const addedComment = res.data.comment;
        
        // Update images list inside grid
        setImages(prev => prev.map(img => {
          if (img._id === selectedImage._id) {
            return { ...img, comments: [...img.comments, addedComment] };
          }
          return img;
        }));

        // Update active modal image
        setSelectedImage(prev => ({
          ...prev,
          comments: [...prev.comments, addedComment]
        }));
        
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
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
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full relative">
      
      {/* Search Bar & Title Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-neonPurple" />
            <span>Community Gallery</span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">Explore trending artificial masterpieces generated by creators.</p>
        </div>

        {/* Dynamic Search box */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompt keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
          <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Categories filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scroll-smooth select-none">
        {styleCategories.map((style) => (
          <button
            key={style}
            onClick={() => handleStyleSelect(style)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider whitespace-nowrap transition-all border ${
              activeStyle === style 
                ? 'bg-gradient-to-r from-neonPurple/20 to-neonCyan/5 border-neonPurple text-white shadow-neon-purple' 
                : 'bg-black/35 border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {images.map((img) => (
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
              
              {/* Floating tags */}
              <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[8px] uppercase font-extrabold tracking-wider text-neonCyan">
                  {img.style}
                </span>
              </div>
            </div>

            {/* Content Details */}
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
                
                {/* Likes */}
                <button 
                  onClick={() => handleLike(img._id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    user && img.likes.includes(user.id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${user && img.likes.includes(user.id) ? 'fill-red-400' : ''}`} />
                  <span>{img.likes.length}</span>
                </button>

                {/* Comments */}
                <button 
                  onClick={() => handleOpenComments(img)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-neonPurple transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{img.comments.length}</span>
                </button>

                {/* Download */}
                <button 
                  onClick={() => handleDownload(img)}
                  className="p-1 rounded bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white transition-all"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Empty Fallback */}
      {!loading && images.length === 0 && (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 mb-4 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">No artworks found</h3>
          <p className="text-xs text-gray-400 mt-1">Try another search keyword or active style preset.</p>
        </div>
      )}

      {/* Skeletons while loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {[1, 2, 4].map((n) => (
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

      {/* Paginated Load More */}
      {!loading && page < totalPages && (
        <div className="flex justify-center mt-12 mb-8">
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="px-6 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 hover:bg-white/[0.05] hover:text-white transition-all text-sm font-semibold tracking-wider"
          >
            LOAD MORE CREATIONS
          </button>
        </div>
      )}

      {/* Comment Overlay Drawer / Modal */}
      {selectedImage && (
        <>
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40" 
            onClick={() => setSelectedImage(null)}
          />

          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] glass-card border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between animate-float" style={{ animationDuration: '0s' }}>
            
            {/* Modal Header */}
            <div className="h-20 px-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neonCyan" />
                <span>Creations Feedback</span>
              </h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Artwork preview */}
              <div className="rounded-xl overflow-hidden border border-white/5 relative aspect-video bg-black">
                <img 
                  src={`http://localhost:5000${selectedImage.url}`} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Prompt detailed */}
              <div className="p-4 rounded-xl bg-black/45 border border-white/5">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1.5">Original Prompt</p>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{selectedImage.prompt}"
                </p>
              </div>

              {/* Social Like metrics */}
              <div className="flex items-center gap-6 border-y border-white/5 py-4">
                <button 
                  onClick={() => handleLike(selectedImage._id)}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                    user && selectedImage.likes.includes(user.id) ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${user && selectedImage.likes.includes(user.id) ? 'fill-red-400' : ''}`} />
                  <span>{selectedImage.likes.length} Likes</span>
                </button>
                <span className="text-xs text-gray-400 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                  <Clock className="w-4 h-4 text-neonCyan" />
                  {new Date(selectedImage.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Comments stream */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-0.5">Comments ({selectedImage.comments.length})</h4>
                
                <div className="space-y-3.5 max-h-56 overflow-y-auto pr-2">
                  {selectedImage.comments.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <div className="flex justify-between items-center mb-1 text-[10px] text-gray-500 font-semibold uppercase">
                        <span className="text-neonCyan font-bold">{c.userName}</span>
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                    </div>
                  ))}

                  {selectedImage.comments.length === 0 && (
                    <p className="text-xs text-gray-500 italic pl-1 py-3 text-center">No comments left yet. Write the first one!</p>
                  )}
                </div>
              </div>

            </div>

            {/* Comment Form Submit Footer */}
            {user ? (
              <form onSubmit={handlePostComment} className="p-4 border-t border-white/5 bg-black/20 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this art..."
                  className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neonPurple to-neonCyan text-white shadow-neon-purple transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 border-t border-white/5 bg-black/20 text-center">
                <p className="text-xs text-gray-500 italic">Please log in to post feedback comments.</p>
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
};

export default Gallery;
