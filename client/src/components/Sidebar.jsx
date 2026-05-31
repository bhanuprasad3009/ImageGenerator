import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Heart, 
  User as UserIcon, 
  CreditCard, 
  ShieldAlert, 
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', name: 'AI Generator', icon: Sparkles },
    { path: '/gallery', name: 'Community Art', icon: ImageIcon },
    { path: '/favorites', name: 'Saved Favorites', icon: Heart },
    { path: '/profile', name: 'My Profile', icon: UserIcon },
    { path: '/billing', name: 'Plan Benefits', icon: CreditCard },
  ];

  // If user is admin, add Admin panel link
  if (user && user.role === 'admin') {
    navLinks.push({ path: '/admin', name: 'Admin Hub', icon: ShieldAlert });
  }

  const getPlanBadgeClass = () => {
    return 'bg-gradient-to-r from-neonPurple to-neonCyan text-white border border-neonPurple/50 glow-purple';
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 glass-panel border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-neonPurple to-neonCyan text-white glow-purple">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-neonPurple to-neonCyan">
              AetherArt
            </span>
          </div>

          <button onClick={toggleSidebar} className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="px-6 py-6 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neonPurple/50 to-neonCyan/50 flex items-center justify-center text-white border border-white/10 font-bold uppercase shadow-inner">
                {user.name.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold truncate text-white">{user.name}</h4>
                <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1 rounded-full ${getPlanBadgeClass()}`}>
                  Unlimited Free Plan
                </span>
              </div>
            </div>

            {/* Credit Counter */}
            <div className="mt-5 p-3 rounded-lg bg-black/40 border border-white/5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Generation Credits:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                  <span>UNLIMITED</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium
                  ${isActive 
                    ? 'bg-gradient-to-r from-neonPurple/20 to-neonCyan/5 text-white border border-neonPurple/30 shadow-neon-purple' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-neonCyan' : 'text-gray-400 group-hover:text-neonPurple'
                    }`} />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-gray-400 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
