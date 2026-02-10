import React, { useState } from 'react';
import { UtensilsCrossed, LockKeyhole, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useHotelcontext } from '../Context/HotelContext';

const LoginPage = () => {// 1. Add states at the top of your component
  const [role, setRole] = useState('staff'); // 'admin' or 'staff'
  const {login,loading,navigate} = useHotelcontext();
const [userId, setUserId] = useState('');
const [password, setPassword] = useState('');
const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Use the login function from Context
        const result = await login(userId, password, role);

        if (result.success) {
            // Redirect based on the role returned by the context/backend
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/staff');
            }
        }
        // No need for 'else' alert here because your context already shows a toast.error
    };
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 font-sans">
      {/* Login Card */}
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ef4444] rounded-2xl mb-4 shadow-lg shadow-red-900/40">
            <UtensilsCrossed className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Nilkanth Resto</h1>
          <p className="text-gray-400 text-sm mt-1">Management Portal Access</p>
        </div>

        {/* Role Switcher */}
        <div className="px-8 mb-6">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setRole('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'staff' ? 'bg-[#ef4444] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <User size={16} /> Staff
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'admin' ? 'bg-[#4287a9] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form className="px-8 pb-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              {role === 'admin' ? 'Administrator ID' : 'Staff ID'}
            </label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Enter ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ef4444]/50 focus:ring-1 focus:ring-[#ef4444]/50 transition-all"
              />
              <User className="absolute right-4 top-3 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative group">
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ef4444]/50 focus:ring-1 focus:ring-[#ef4444]/50 transition-all"
              />
              <LockKeyhole className="absolute right-4 top-3 text-gray-600 group-focus-within:text-[#ef4444] transition-colors" size={20} />
            </div>
          </div>

          <button 
                      className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"

            type="submit"
            disabled={loading}
            
        >
            {loading ? "Authenticating..." : "Login to Dashboard"}
        </button>

          <div className="text-center">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-4">
              Forgot login credentials?
            </a>
          </div>
        </form>

      </div>
      
      {/* Decorative background element */}
      <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#ef4444]/5 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
};

export default LoginPage;