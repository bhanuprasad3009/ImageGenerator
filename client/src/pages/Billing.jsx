import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Zap, 
  Maximize2, 
  Layers, 
  Crop, 
  Globe, 
  Heart,
  MessageSquare
} from 'lucide-react';

const Billing = () => {
  const { user } = useAuth();

  const benefits = [
    {
      title: 'Unlimited Synthesizing',
      desc: 'Feed the diffusion models as many descriptive photographic prompts as your imagination holds. Zero caps, zero daily limits.',
      icon: Sparkles,
      color: 'text-neonCyan border-neonCyan/20 bg-neonCyan/5',
      glow: 'shadow-neon-cyan'
    },
    {
      title: 'Priority Rendering Pipeline',
      desc: 'Get fast, dedicated rendering thread speeds. Your creative visual requests are prioritized with no queues.',
      icon: Zap,
      color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
      glow: 'shadow-neon-yellow'
    },
    {
      title: 'High-Res 4K Upscaler',
      desc: 'Upscale your generated drafts using noise reduction and sharpening algorithms to restore cinematic textures.',
      icon: Maximize2,
      color: 'text-neonPurple border-neonPurple/20 bg-neonPurple/5',
      glow: 'shadow-neon-purple'
    },
    {
      title: 'Isolated BG Cutout Tool',
      desc: 'Strip backgrounds with precise alpha-outline threshold masks to output transparent PNG layers instantly.',
      icon: Layers,
      color: 'text-neonPink border-neonPink/20 bg-neonPink/5',
      glow: 'shadow-neon-pink'
    },
    {
      title: 'Multi-Aspect Ratio Canvas',
      desc: 'Design beautiful compositions using 1:1 square, 16:9 cinematic landscape, or 9:16 high-portrait grids.',
      icon: Crop,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glow: 'shadow-neon-emerald'
    },
    {
      title: 'Community Interaction Hub',
      desc: 'Publish your master creations to the shared gallery. Like trending art pieces, save favorites, and write comments.',
      icon: Globe,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      glow: 'shadow-neon-blue'
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full relative">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-neonPurple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-neonCyan/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/20 text-neonCyan text-[11px] font-extrabold uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 fill-neonCyan animate-pulse" />
          <span>100% Free Creative Suite</span>
        </div>
        <h2 className="text-3xl font-extrabold font-sans text-white tracking-tight">
          AetherArt Creative Benefits
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Welcome to the ultimate AI art playground. To empower visual storytellers worldwide, we have unlocked all premium generation engines, auxiliary tools, and aspect ratios completely free.
        </p>
      </div>

      {/* Main Glass Status Banner */}
      {user && (
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden bg-gradient-to-r from-neonPurple/5 via-black/50 to-neonCyan/5">
          <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
          
          <div className="text-center md:text-left space-y-2">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Plan Level</span>
            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <h3 className="text-2xl font-black text-white tracking-wide">Unlimited Free Plan</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neonCyan/10 border border-neonCyan/20 text-neonCyan shadow-neon-cyan">
                Active Forever
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Your account is preloaded with infinite generation capabilities and full toolbox permissions.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <div className="w-full md:w-auto px-6 py-4.5 rounded-2xl bg-black/40 border border-white/5 text-center">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Usage Status</span>
              <span className="text-lg font-black text-neonCyan mt-1 block">No Limitations</span>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Showcase Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div 
              key={idx} 
              className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between text-left space-y-4"
            >
              <div className="space-y-4">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${benefit.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base leading-snug">{benefit.title}</h4>
                  <p className="text-gray-400 text-xs mt-2.5 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Billing;
