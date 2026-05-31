import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  ChevronDown, 
  User as UserIcon, 
  CreditCard, 
  LogOut,
  Sparkles,
  Zap
} from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Visual Studio';
      case '/gallery': return 'Community Showcase';
      case '/favorites': return 'Saved Collection';
      case '/profile': return 'User Profile';
      case '/billing': return 'Plan Benefits';
      case '/admin': return 'Admin Control Center';
      default: return 'Studio';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 glass-panel border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger on mobile + Active page title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-1 rounded-md text-gray-400 hover:text-white lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h1 className="text-lg lg:text-xl font-bold tracking-wide font-sans text-white">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">AetherArt AI - Powered by Stable Diffusion</p>
        </div>
      </div>

      {/* Right side: Credits shortcut + User dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Active plan status indicator */}
        {user && (
          <Link 
            to="/billing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neonCyan/10 border border-neonCyan/20 text-neonCyan hover:bg-neonCyan/20 transition-all duration-300"
          >
            <Zap className="w-3.5 h-3.5 fill-neonCyan animate-pulse" />
            <span>Unlimited Plan</span>
          </Link>
        )}

        {/* User profile dropdown button */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-3 rounded-full hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neonPurple to-neonCyan text-white text-sm font-semibold flex items-center justify-center border border-white/10 uppercase shadow-inner">
                {user.name.substring(0, 2)}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-card border border-white/10 shadow-2xl z-50 py-2 animate-float" style={{ animationDuration: '4s' }}>
                  <div className="px-4 py-2 border-b border-white/5 mb-1.5">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>

                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-neonCyan" />
                    <span>My Profile</span>
                  </Link>

                  <Link 
                    to="/billing" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-neonPurple" />
                    <span>Plan Benefits</span>
                  </Link>

                  <button 
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
