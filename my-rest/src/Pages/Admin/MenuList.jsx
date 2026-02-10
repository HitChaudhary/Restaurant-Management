import React, { useState } from 'react';
import { 
  Edit3, Trash2, Search, Plus, 
  Filter, MoreVertical, Flame 
} from 'lucide-react';
import { menuData } from '../../assets/data.js'; // Importing your menu items

const AdminMenuList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic for the admin search bar
  const filteredMenu = menuData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Menu Manager</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Total Items: {menuData.length}</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or category..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-sm outline-none ring-1 ring-slate-100 focus:ring-blue-500/20"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-slate-50 px-6 rounded-xl font-bold text-slate-500 flex items-center gap-2 hover:bg-slate-100 transition-colors">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Details</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Spicy</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredMenu.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-black text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                </td>
                <td className="p-6 font-black text-slate-900 text-lg">
                  ₹{item.price}
                </td>
                <td className="p-6 text-center">
                  <div className="flex justify-center gap-1">
                    {[...Array(item.spicyLevel)].map((_, i) => (
                      <Flame key={i} size={14} className="text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenuList;