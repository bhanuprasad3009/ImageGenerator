import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  Image as ImageIcon, 
  Percent, 
  Trash2, 
  PlusCircle, 
  Check, 
  UserPlus, 
  Lock, 
  Unlock,
  Coins
} from 'lucide-react';

const Admin = () => {
  // Statistics States
  const [metrics, setMetrics] = useState(null);
  const [plans, setPlans] = useState(null);
  const [stylePopularity, setStylePopularity] = useState([]);
  
  // Lists States
  const [usersList, setUsersList] = useState([]);
  const [blocklist, setBlocklist] = useState([]);
  
  // Interactive States
  const [loading, setLoading] = useState(true);
  const [newBannedPhrase, setNewBannedPhrase] = useState('');
  const [addingPhrase, setAddingPhrase] = useState(false);
  
  // Manual overrides tracking
  const [editingCreditsId, setEditingCreditsId] = useState(null);
  const [tempCredits, setTempCredits] = useState('');
  const [savingCredits, setSavingCredits] = useState(false);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/api/admin/stats');
      if (statsRes.data.success) {
        setMetrics(statsRes.data.metrics);
        setPlans(statsRes.data.plans);
        setStylePopularity(statsRes.data.stylePopularity);
      }

      const usersRes = await api.get('/api/admin/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.users);
      }

      const blocklistRes = await api.get('/api/admin/blocklist');
      if (blocklistRes.data.success) {
        setBlocklist(blocklistRes.data.blocklist);
      }

    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add word to prompt blocklist
  const handleAddBannedPhrase = async (e) => {
    e.preventDefault();
    if (!newBannedPhrase.trim() || addingPhrase) return;

    setAddingPhrase(true);
    try {
      const res = await api.post('/api/admin/blocklist', { phrase: newBannedPhrase });
      if (res.data.success) {
        setBlocklist(prev => [res.data.phrase, ...prev]);
        setNewBannedPhrase('');
        if (metrics) {
          setMetrics(prev => ({ ...prev, totalBlockedPhrases: prev.totalBlockedPhrases + 1 }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block phrase.');
    } finally {
      setAddingPhrase(false);
    }
  };

  // Delete phrase from blocklist
  const handleDeleteBannedPhrase = async (id) => {
    try {
      const res = await api.delete(`/api/admin/blocklist/${id}`);
      if (res.data.success) {
        setBlocklist(prev => prev.filter(item => item._id !== id));
        if (metrics) {
          setMetrics(prev => ({ ...prev, totalBlockedPhrases: Math.max(0, prev.totalBlockedPhrases - 1) }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Set User Credits manually
  const handleUpdateCreditsSubmit = async (userId) => {
    if (tempCredits === '' || isNaN(tempCredits) || savingCredits) return;

    setSavingCredits(true);
    try {
      const res = await api.post(`/api/admin/users/${userId}/credits`, { credits: parseInt(tempCredits) });
      if (res.data.success) {
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, credits: parseInt(tempCredits) } : u));
        setEditingCreditsId(null);
        setTempCredits('');
        alert('Credits updated successfully.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update credits.');
    } finally {
      setSavingCredits(false);
    }
  };

  // Change User Plan subscription manually
  const handleUpdatePlan = async (userId, plan) => {
    try {
      const res = await api.post(`/api/admin/users/${userId}/plan`, { plan });
      if (res.data.success) {
        setUsersList(prev => prev.map(u => {
          if (u._id === userId) {
            return { 
              ...u, 
              plan: plan, 
              subscriptionStatus: plan === 'free' ? 'inactive' : 'active' 
            };
          }
          return u;
        }));
        alert(`Plan manually upgraded to ${plan.toUpperCase()}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upgrade plan.');
    }
  };

  const getPlanClass = (plan) => {
    if (plan === 'premium') return 'bg-neonPink/10 text-neonPink border-neonPink/30';
    if (plan === 'pro') return 'bg-neonPurple/10 text-neonPurple border-neonPurple/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-neonPink" />
          <span>Admin Control Center</span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">Superuser monitoring suite, prompt keyword blocklists, and user credit controls.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse font-sans tracking-widest text-sm">LOADING ADMIN METRICS...</div>
      ) : (
        <>
          {/* Top Aggregation Row */}
          {metrics && plans && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neonPurple/10 flex items-center justify-center text-neonPurple">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Members</span>
                  <span className="text-xl font-extrabold text-white font-sans mt-0.5 block">{metrics.totalUsers}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neonCyan/10 flex items-center justify-center text-neonCyan">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Generated Artworks</span>
                  <span className="text-xl font-extrabold text-white font-sans mt-0.5 block">{metrics.totalImages}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Avg Credit Balance</span>
                  <span className="text-xl font-extrabold text-white font-sans mt-0.5 block">{metrics.avgCredits}</span>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neonPink/10 flex items-center justify-center text-neonPink">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Blocked Keywords</span>
                  <span className="text-xl font-extrabold text-white font-sans mt-0.5 block">{metrics.totalBlockedPhrases}</span>
                </div>
              </div>

            </div>
          )}

          {/* Middle Row: Subscriptions Distribution + Blocklist Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Subscriptions Matrix */}
            {plans && (
              <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2.5">
                    Plan Distibutions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                      <span>Premium Members (Fair Use cap)</span>
                      <span className="text-neonPink font-extrabold">{plans.premium} users</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                      <span>Pro Creators (200 cr/mo)</span>
                      <span className="text-neonPurple font-extrabold">{plans.pro} users</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                      <span>Free Starter Tier (20 cr/starter)</span>
                      <span className="text-gray-400 font-extrabold">{plans.free} users</span>
                    </div>
                  </div>
                </div>
                
                {/* Total circulating metrics */}
                {metrics && (
                  <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[10px] text-gray-500 mt-6 leading-relaxed">
                    Total active credits in circulation: <span className="text-white font-bold">{metrics.totalCreditsInCirculation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Prompt Blocklist control */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2.5">
                  Banned Keywords Blocklist
                </h3>
                
                {/* Blocklist form */}
                <form onSubmit={handleAddBannedPhrase} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newBannedPhrase}
                    onChange={(e) => setNewBannedPhrase(e.target.value)}
                    placeholder="Enter banned phrase (e.g. violence, gore)..."
                    className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                  <button
                    type="submit"
                    disabled={addingPhrase || !newBannedPhrase.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neonPink to-neonPurple text-white text-xs font-bold shadow-neon-pink flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Block</span>
                  </button>
                </form>

                {/* Banned lists pill boxes */}
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {blocklist.map((item) => (
                    <div 
                      key={item._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <span>{item.phrase}</span>
                      <button 
                        onClick={() => handleDeleteBannedPhrase(item._id)}
                        className="text-red-400 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {blocklist.length === 0 && (
                    <p className="text-xs text-gray-500 italic pl-1 py-4">No banned phrases added yet.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: Full User Table Grid */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg overflow-hidden">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2.5">
              Registered Users Database
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-wider h-10">
                    <th className="pl-4">Name</th>
                    <th>Email</th>
                    <th>Sub Tier</th>
                    <th>Credits balance</th>
                    <th className="pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="border-b border-white/[0.02] hover:bg-white/[0.01] h-14">
                      {/* Name */}
                      <td className="pl-4 font-bold text-white">{usr.name} {usr.role === 'admin' && <span className="text-[8px] px-1.5 py-0.5 rounded bg-neonCyan/20 text-neonCyan font-black uppercase ml-1 border border-neonCyan/30">Admin</span>}</td>
                      
                      {/* Email */}
                      <td className="text-gray-400">{usr.email}</td>
                      
                      {/* Tier dropdown changes */}
                      <td>
                        <select
                          value={usr.plan}
                          onChange={(e) => handleUpdatePlan(usr._id, e.target.value)}
                          className="p-1 px-2.5 rounded bg-black/40 border border-white/10 text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      
                      {/* Credits manual input topup */}
                      <td>
                        {editingCreditsId === usr._id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={tempCredits}
                              onChange={(e) => setTempCredits(e.target.value)}
                              className="w-16 p-1 rounded bg-black/50 border border-neonPurple text-xs text-white text-center"
                              placeholder={usr.credits}
                              required
                            />
                            <button 
                              onClick={() => handleUpdateCreditsSubmit(usr._id)}
                              className="p-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { setEditingCreditsId(null); setTempCredits(''); }}
                              className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{usr.plan === 'premium' ? 'UNLIMITED' : usr.credits}</span>
                            <button 
                              onClick={() => { setEditingCreditsId(usr._id); setTempCredits(usr.credits); }}
                              className="p-1 text-gray-500 hover:text-neonPurple"
                              title="Modify credits"
                            >
                              <Coins className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      
                      {/* Dates / Actions */}
                      <td className="pr-4 text-right text-gray-500 text-[10px]">
                        Joined {new Date(usr.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Admin;
