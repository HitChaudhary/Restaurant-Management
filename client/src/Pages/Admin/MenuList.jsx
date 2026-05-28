import React, { useState } from 'react';
import { Trash2, Search, Flame, Coffee, Utensils, ToggleLeft, ToggleRight } from 'lucide-react';
import { useHotelcontext } from '../../Context/HotelContext';
import { useCafeContext } from '../../Context/CafeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MenuList = () => {
  const { dishes, removeDish, token, fetchRestaurantMenu: fetchRest } = useHotelcontext();
  const { cafeMenu, fetchCafeMenu } = useCafeContext();
  const [search, setSearch]     = useState('');
  const [section, setSection]   = useState('restaurant');

  const allItems  = section === 'restaurant' ? dishes : cafeMenu;
  const filtered  = allItems.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvail = async (id) => {
    try {
      const { data } = await axios.patch(`/api/menu/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Availability updated');
        section === 'restaurant' ? fetchRest() : fetchCafeMenu();
      }
    } catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this dish?')) return;
    removeDish(id);
    if (section === 'cafe') fetchCafeMenu();
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Menu Manager</h1>
          <p className="text-sm text-slate-400 font-bold mt-1">{filtered.length} items</p>
        </div>
        {/* Section toggle */}
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1">
          <button onClick={() => setSection('restaurant')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all
              ${section === 'restaurant' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>
            <Utensils size={16} /> Restaurant
          </button>
          <button onClick={() => setSection('cafe')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all
              ${section === 'cafe' ? 'bg-amber-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>
            <Coffee size={16} /> Cafe
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3 mb-6 relative shadow-sm">
        <Search className="absolute left-5 top-4 text-slate-400" size={18} />
        <input type="text" placeholder="Search by name or category..."
          className="w-full bg-transparent pl-10 pr-4 py-1 font-bold text-sm outline-none"
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Spicy</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(item => (
              <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-black text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black uppercase">{item.category}</span>
                </td>
                <td className="p-5 font-black text-slate-900">₹{item.price}</td>
                <td className="p-5 text-center">
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: item.spicyLevel }).map((_, i) => <Flame key={i} size={13} className="text-orange-500 fill-orange-500" />)}
                  </div>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => toggleAvail(item._id)}
                    className={`text-xs font-black px-3 py-1 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {item.isAvailable ? 'Available' : 'Hidden'}
                  </button>
                </td>
                <td className="p-5 text-right">
                  <button onClick={() => handleRemove(item._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-bold">No items found</div>
        )}
      </div>
    </div>
  );
};

export default MenuList;
