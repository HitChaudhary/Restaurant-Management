import React from 'react'
import { LayoutGrid, UtensilsCrossed, Bell, User, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full h-20 bg-[#1e1e1e] border-b border-white/10 px-8 flex justify-between items-center shadow-2xl">

      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="bg-[#ef4444] p-2 rounded-lg">
          <UtensilsCrossed className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold tracking-tight">
            Nilkanth<span className="text-[#ef4444]">Resto</span>
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[2px] leading-none">
            Management Suite
          </p>
        </div>
      </div>

      {/* Right Side  */}
      <div className="flex items-center gap-6">

        <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 pl-4 pr-2 py-1.5 rounded-xl transition-all group active:scale-95">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-white font-semibold group-hover:text-[#ef4444] transition-colors">
              login Portal
            </p>
            <p className="text-[10px] text-gray-500">Secure Login</p>
          </div>

          <div onClick={()=>navigate('/staff')} className="w-10 h-10 bg-gradient-to-tr from-[#ef4444] to-orange-400 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-900/20 group-hover:shadow-red-600/40 transition-all">
            <LockKeyhole size={18} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header;