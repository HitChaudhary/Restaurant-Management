import React from 'react';
import { Utensils, PlusCircle, LayoutDashboard, LogOut, Coffee, ChefHat } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useHotelcontext();

  const NavItem = ({ icon, label, path, color }) => {
    const isActive = location.pathname === path;
    return (
      <button onClick={() => navigate(path)}
        className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-sm transition-all
          ${isActive ? `${color || 'bg-blue-600'} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        {icon}{label}
      </button>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0F172A] text-white flex flex-col shadow-2xl">
      <div className="p-7 pb-10">
        <div className="flex items-center gap-3 mb-1 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Utensils size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter">NILKANTH<span className="text-blue-500">.</span></h1>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-2">Overview</p>
        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard"    path="/admin"          color="bg-blue-600" />

        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mt-4 mb-2">Restaurant</p>
        <NavItem icon={<Utensils size={18} />}       label="Menu Manager"  path="/admin/menulist" color="bg-blue-600" />
        <NavItem icon={<PlusCircle size={18} />}     label="Add Item"      path="/admin/additem"  color="bg-blue-600" />

        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mt-4 mb-2">Operations</p>
        <NavItem icon={<Utensils size={18} />}       label="Tables"        path="/staff"          color="bg-slate-700" />
        <NavItem icon={<ChefHat size={18} />}        label="Cafe Kitchen"  path="/kitchen"        color="bg-amber-600" />
        <NavItem icon={<Coffee size={18} />}         label="Cafe Menu"     path="/cafeteria"      color="bg-amber-600" />
      </nav>

      <div className="p-5 border-t border-slate-800">
        <button onClick={logout}
          className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
