import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Sparkles, 
  Mic, 
  MicOff,
  Maximize2, 
  Download, 
  Share2, 
  Copy, 
  Heart, 
  Trash2, 
  Crop,
  Layers,
  Check,
  Zap,
  Globe,
  Lock,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateCredits } = useAuth();
  
  // Input Settings
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('None');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isPublic, setIsPublic] = useState(true);
  
  // States
  const [generating, setGenerating] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);
  
  // Output Image
  const [generatedImage, setGeneratedImage] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  
  // Advanced Tools Simulation States
  const [upscaling, setUpscaling] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch recent user creations on load
  useEffect(() => {
    fetchRecentImages();
  }, []);

  const fetchRecentImages = async () => {
    try {
      const res = await api.get('/api/images/my');
      if (res.data.success) {
        setRecentImages(res.data.images);
      }
    } catch (err) {
      console.error('Failed to fetch recent creations:', err);
    }
  };

  // Web Speech API Voice Recognizer
  const handleVoicePrompt = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice-to-Text transcription is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    setListening(true);
    setStatusMessage('Listening to voice...');
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setStatusMessage('');
    };

    recognition.onerror = (e) => {
      console.error(e);
      setStatusMessage('Voice recognition error.');
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  // AI Prompt Enhancer
  const handleEnhancePrompt = async () => {
    if (!prompt) return;
    setEnhancing(true);
    try {
      const res = await api.post('/api/tools/enhance-prompt', { prompt });
      if (res.data.success) {
        setPrompt(res.data.enhancedPrompt);
      }
    } catch (err) {
      console.error('Failed to enhance prompt:', err);
    } finally {
      setEnhancing(false);
    }
  };

  // Main Generator Action
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setGenerating(true);
    setGeneratedImage(null);
    setFavorited(false);
    
    // Rotation of loader statements
    const loadSteps = [
      'Authenticating credits...',
      'Validating prompt vocabulary...',
      'Feeding parameters to Stable Diffusion...',
      'Synthesizing noise channels...',
      'Denoising diffusion steps...',
      'Rendering final pixel array...',
      'Writing local storage artifacts...'
    ];
    
    let step = 0;
    setStatusMessage(loadSteps[0]);
    const timer = setInterval(() => {
      step = (step + 1) % loadSteps.length;
      setStatusMessage(loadSteps[step]);
    }, 1500);

    try {
      const res = await api.post('/api/generate', {
        prompt,
        style,
        aspectRatio,
        isPublic
      });

      if (res.data.success) {
        setGeneratedImage(res.data.image);
        updateCredits(res.data.creditsRemaining);
        
        // Add to recents
        setRecentImages(prev => [res.data.image, ...prev]);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Generation aborted. Please try again.');
    } finally {
      clearInterval(timer);
      setGenerating(false);
      setStatusMessage('');
    }
  };

  // Image actions: Download
  const handleDownload = () => {
    if (!generatedImage) return;
    const url = `http://localhost:5000${generatedImage.url}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `aetherart-${generatedImage._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Prompt
  const handleCopyPrompt = () => {
    if (!generatedImage) return;
    navigator.clipboard.writeText(generatedImage.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save/Unsave Favorites
  const handleFavorite = async () => {
    if (!generatedImage) return;
    try {
      const res = await api.post(`/api/images/${generatedImage._id}/favorite`);
      if (res.data.success) {
        setFavorited(res.data.favorited);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate Upscaling
  const handleUpscale = async () => {
    if (!generatedImage || upscaling) return;
    setUpscaling(true);
    setStatusMessage('Interpolating 4K dimensions...');
    
    setTimeout(async () => {
      try {
        const res = await api.post('/api/tools/upscale', { imageId: generatedImage._id });
        if (res.data.success) {
          alert('Success! Image scaled up 4x using sharpening filters.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUpscaling(false);
        setStatusMessage('');
      }
    }, 2500);
  };

  // Simulate BG Removal
  const handleRemoveBg = async () => {
    if (!generatedImage || removingBg) return;
    setRemovingBg(true);
    setStatusMessage('Analyzing alpha outlines...');
    
    setTimeout(async () => {
      try {
        const res = await api.post('/api/tools/remove-bg', { imageId: generatedImage._id });
        if (res.data.success) {
          alert('Background isolated successfully. Download transparent file enabled.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRemovingBg(false);
        setStatusMessage('');
      }
    }, 2500);
  };

  const handleSelectRecent = (img) => {
    setGeneratedImage(img);
    setFavorited(false);
  };

  // Dynamic aspect classes
  const getAspectPreviewClass = (ratio) => {
    if (ratio === '1:1') return 'w-10 h-10 border-2 border-white';
    if (ratio === '16:9') return 'w-14 h-8 border-2 border-white';
    return 'w-8 h-14 border-2 border-white';
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
      
      {/* Left side: Inputs */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-neonCyan" />
            <span>Generate Artwork</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Prompt text area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Text Prompt</label>
                <div className="flex items-center gap-2">
                  
                  {/* Microphone */}
                  <button
                    type="button"
                    onClick={handleVoicePrompt}
                    className={`p-1.5 rounded-lg border transition-all ${
                      listening 
                        ? 'bg-neonPink/20 border-neonPink text-neonPink animate-pulse' 
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                    title="Speak prompt"
                  >
                    {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Prompt Enhancer */}
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={enhancing || !prompt}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neonPurple/10 border border-neonPurple/20 hover:bg-neonPurple/20 hover:border-neonPurple/40 text-[11px] font-bold text-neonPurple transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${enhancing ? 'animate-spin' : ''}`} />
                    <span>AI Enhance</span>
                  </button>

                </div>
              </div>

              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A hyper-detailed majestic lion sitting on a ledge overlooking a neon-flooded Tokyo cyberpunk street at night..."
                  className="w-full h-32 p-4 rounded-2xl glass-input text-sm resize-none pr-8"
                  required
                />
              </div>
            </div>

            {/* Layout Aspect Ratios */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-3">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-gradient-to-tr from-neonPurple/30 to-neonCyan/10 border-neonPurple text-white shadow-neon-purple' 
                        : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className={`rounded-md flex items-center justify-center overflow-hidden border-opacity-35 ${getAspectPreviewClass(ratio)} ${
                      aspectRatio === ratio ? 'border-neonCyan' : 'border-gray-500'
                    }`} />
                    <span className="text-xs font-bold">{ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Styles Presets Dropdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Art Style Preset</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3.5 rounded-xl glass-input text-sm cursor-pointer"
                >
                  <option value="None">Default Standard</option>
                  <option value="Realistic">Realistic Photorealism</option>
                  <option value="Anime">Anime (Vibrant Keyart)</option>
                  <option value="Cyberpunk">Cyberpunk Neon</option>
                  <option value="Fantasy">Magical Fantasy Land</option>
                  <option value="3D Render">3D Octane Render</option>
                  <option value="Pixel Art">16-bit Retro Pixel Grid</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Publish Level</label>
                <div className="flex items-center h-[50px]">
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`flex items-center justify-between w-full p-3.5 rounded-xl border transition-all ${
                      isPublic 
                        ? 'bg-neonCyan/10 border-neonCyan/40 text-neonCyan' 
                        : 'bg-black/40 border-white/5 text-gray-400'
                    }`}
                  >
                    <span className="text-sm font-semibold flex items-center gap-1.5">
                      {isPublic ? <Globe className="w-4 h-4 text-neonCyan" /> : <Lock className="w-4 h-4 text-gray-500" />}
                      {isPublic ? 'Public Gallery' : 'Private Draft'}
                    </span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${isPublic ? 'bg-neonCyan' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-all ${isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Generate Trigger */}
            <button
              type="submit"
              disabled={generating || !prompt}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-neonPurple via-neonPink to-neonCyan text-white font-bold text-base shadow-neon-purple hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none hover:shadow-neon-cyan"
            >
              {generating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>FUSE IMAGINATION</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      {/* Right side: Output View */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl flex-1 flex flex-col justify-between min-h-[450px]">
          
          <div className="h-full flex items-center justify-center flex-1">
            {generating ? (
              /* Skeleton Loader */
              <div className="w-full max-w-sm aspect-square glass-card rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center gap-4 animate-pulse">
                <div className="relative w-16 h-16 mb-2">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-neonPurple border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute top-1.5 left-1.5 w-13 h-13 border-4 border-b-neonCyan border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                </div>
                <h3 className="font-bold text-white text-base">Weaving AI Dreams</h3>
                <p className="text-xs text-gray-400 max-w-xs">{statusMessage}</p>
              </div>
            ) : generatedImage ? (
              /* Generated Output Card */
              <div className="flex flex-col items-center w-full">
                <div className={`relative max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 ${
                  generatedImage.aspectRatio === '16:9' ? 'aspect-video w-full' : (generatedImage.aspectRatio === '9:16' ? 'w-64 aspect-[9/16]' : 'w-80 aspect-square')
                }`}>
                  <img 
                    src={`http://localhost:5000${generatedImage.url}`} 
                    alt={generatedImage.prompt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating tag badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[9px] uppercase font-extrabold tracking-wider text-neonCyan">
                      {generatedImage.style}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-[9px] uppercase font-extrabold tracking-wider text-white">
                      {generatedImage.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Sub title prompt preview */}
                <div className="mt-4 px-6 text-center">
                  <p className="text-xs text-gray-400 italic leading-relaxed max-w-sm line-clamp-2">
                    "{generatedImage.prompt}"
                  </p>
                </div>

                {/* Action buttons toolbar */}
                <div className="flex items-center gap-3 mt-6">
                  
                  {/* Download */}
                  <button 
                    onClick={handleDownload}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                    title="Download high-res PNG"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Copy Prompt */}
                  <button 
                    onClick={handleCopyPrompt}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                    title="Copy visual prompt"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Save Favorite */}
                  <button 
                    onClick={handleFavorite}
                    className={`p-2.5 rounded-xl border transition-all ${
                      favorited 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : 'bg-white/[0.03] border-white/10 text-gray-300 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/10'
                    }`}
                    title="Save to favorites"
                  >
                    <Heart className={`w-4 h-4 ${favorited ? 'fill-red-400' : ''}`} />
                  </button>

                  {/* Upscale 4X */}
                  <button 
                    onClick={handleUpscale}
                    disabled={upscaling}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neonPurple/10 border border-neonPurple/25 hover:bg-neonPurple/20 hover:border-neonPurple/40 text-xs font-bold text-neonPurple transition-all disabled:opacity-50"
                    title="Simulate 4k Upscale"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>4K Upscale</span>
                  </button>

                  {/* Remove Background */}
                  <button 
                    onClick={handleRemoveBg}
                    disabled={removingBg}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neonCyan/10 border border-neonCyan/25 hover:bg-neonCyan/20 hover:border-neonCyan/40 text-xs font-bold text-neonCyan transition-all disabled:opacity-50"
                    title="Simulate Background Removal"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cutout</span>
                  </button>

                </div>
              </div>
            ) : (
              /* Idle screen */
              <div className="text-center p-8 max-w-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 mb-6 shadow-inner animate-float">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base">Your Studio Awaits</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Overlay preset visual styles, pick canvas ratios, and hit generate to turn text prompts into premium graphics.
                </p>
              </div>
            )}
          </div>

          {/* Bottom section: Recent generations carousel */}
          {recentImages.length > 0 && (
            <div className="border-t border-white/5 pt-6 mt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 mb-3">Recent Creations</h4>
              <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
                {recentImages.map((img) => (
                  <div 
                    key={img._id}
                    onClick={() => handleSelectRecent(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border cursor-pointer hover:scale-105 transition-all shrink-0 ${
                      generatedImage?._id === img._id ? 'border-neonCyan ring-2 ring-neonCyan/30' : 'border-white/10'
                    }`}
                  >
                    <img 
                      src={`http://localhost:5000${img.url}`} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
