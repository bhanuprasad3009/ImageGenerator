import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Layers, 
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';

const Landing = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const sampleArtworks = [
    { name: 'Cyborg Warrior', style: 'Realistic', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80' },
    { name: 'Enchanted Forest', style: 'Fantasy', src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=500&q=80' },
    { name: 'Neo-Tokyo Drifter', style: 'Cyberpunk', src: 'https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Cozy Tavern', style: 'Pixel Art', src: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&w=500&q=80' }
  ];

  return (
    <div className="min-h-screen bg-darkBg text-white relative overflow-hidden">
      
      {/* Decorative Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neonPurple/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neonCyan/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-neonPink/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <nav className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-neonPurple to-neonCyan text-white glow-purple">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-neonPurple to-neonCyan">
            AetherArt
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/gallery" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">
            Explore Gallery
          </Link>
          {token ? (
            <Link 
              to="/dashboard" 
              className="px-5 py-2 rounded-full bg-gradient-to-r from-neonPurple to-neonCyan text-white text-sm font-bold glow-hover-purple transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Visual Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="px-5 py-2 rounded-full bg-gradient-to-r from-neonPurple to-neonCyan text-white text-sm font-bold glow-hover-purple transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-bold text-neonCyan mb-6 tracking-wide animate-pulse">
          <Sparkles className="w-4 h-4 text-neonPurple" />
          <span>NEXT-GENERATION ART ENGINE IS NOW LIVE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Turn Your Imagination <br className="hidden md:block"/>
          Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonPurple via-neonPink to-neonCyan drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">AI Masterpieces</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          Unlock your inner artist. Design photorealistic graphics, stunning anime, retro pixel scenes, and cinematic rendering designs with our advanced AI suite.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link 
            to={token ? '/dashboard' : '/auth'}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-neonPurple via-neonPink to-neonCyan text-white font-bold text-base shadow-neon-purple hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-neon-cyan"
          >
            <span>Start Generating Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/gallery"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.02] border border-white/10 text-gray-200 font-bold text-base hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-5 h-5 text-neonCyan" />
            <span>Explore Community Art</span>
          </Link>
        </div>
      </section>

      {/* Floating Gallery Showcase Preview */}
      <section className="max-w-7xl mx-auto px-6 pb-28 relative z-10">
        <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-darkBg border border-white/10 text-xs font-bold tracking-wider text-neonPurple uppercase">
            COMMUNITY CREATIONS PREVIEW
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {sampleArtworks.map((art, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-2xl overflow-hidden border border-white/5 shadow-lg bg-black/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-square w-full overflow-hidden relative">
                  <img 
                    src={art.src} 
                    alt={art.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4" />
                </div>
                <div className="p-3 text-left">
                  <h4 className="text-sm font-semibold truncate text-white">{art.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neonCyan mt-0.5 block">{art.style} Preset</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-28 text-center relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-sans text-white">Advanced AI Art Suite</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">Equipped with state-of-the-art tools to craft, refine, and upgrade your creative ideas.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-2xl border border-white/5 text-left glow-hover-purple transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-neonPurple/20 flex items-center justify-center text-neonPurple mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Prompt Enhancement</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">Turn basic words into cinematic master prompts with a single click using our smart semantic expander.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/5 text-left glow-hover-cyan transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-neonCyan/20 flex items-center justify-center text-neonCyan mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Multi-Style Rendering</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">Instantly overlay presets such as Realistic Photorealism, Cyberpunk, 3D Octane Renders, Anime, or Pixel Grid.</p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/5 text-left glow-hover-pink transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-neonPink/20 flex items-center justify-center text-neonPink mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Upscaling & BG Removal</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">Upscale artwork to high-res crisp displays and isolate subjects with background transparency masks.</p>
          </div>

        </div>
      </section>

      {/* Social / Call to Action */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center relative z-10">
        <div className="glass-card p-12 rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-tr from-neonPurple/5 to-neonCyan/5">
          <h2 className="text-3xl font-extrabold font-sans text-white">Ready to Paint the Future?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mt-4 leading-relaxed">
            Create an account today. Get 20 free credits to test our high-definition servers instantly. No credit card required.
          </p>
          
          <div className="mt-8">
            <Link 
              to={token ? '/dashboard' : '/auth'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neonPurple to-neonCyan text-white font-bold text-base glow-purple hover:scale-105 transition-all duration-300"
            >
              <span>Launch Creative Studio</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500 relative z-10 max-w-7xl mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} AetherArt AI. All rights reserved. Designed for elite creative engineering.</p>
      </footer>
    </div>
  );
};

export default Landing;
