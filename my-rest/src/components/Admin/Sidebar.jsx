import React from 'react';
import { 
    Utensils, PlusCircle, LayoutDashboard, LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useHotelcontext } from '../../Context/HotelContext'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { logout } = useHotelcontext(); 

    const NavItem = ({ icon, label, path }) => {
        const isActive = location.pathname === path;

        return (
            <button
                onClick={() => navigate(path)}
                className={`flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
                {icon}
                {label}
            </button>
        );
    };

    return (
        <aside className="w-72 h-screen bg-[#0F172A] text-white flex flex-col shadow-2xl">
            {/* Logo Section */}
            <div className="p-8 pb-12">
                <div onClick={() => navigate('/')} className="flex items-center gap-3 mb-2 cursor-pointer">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Utensils size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter">
                        NILKANTH<span className="text-blue-500">.</span>
                    </h1>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                    Management Suite
                </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" path="/admin" />
                <NavItem icon={<Utensils size={20} />} label="Menu Manager" path="/admin/menulist" />
                <NavItem icon={<PlusCircle size={20} />} label="Add Item" path="/admin/additem" />
            </nav>

            {/* Logout Section */}
            <div className="p-6 border-t border-slate-800">
                <button 
                    onClick={logout} // Call the context logout function
                    className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;