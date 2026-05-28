import React, { useState } from 'react';
import { X, Save, IndianRupee, Flame, Tag, Layout, Loader, Coffee, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';

const RESTAURANT_CATS = ['Breakfast', 'Punjabi', 'Veg Main', 'Dal', 'Kofta', 'Rice', 'Breads', 'Sides', 'Drinks', 'Thali'];
const CAFE_CATS       = ['Coffee', 'Tea', 'Beverages', 'Bakery', 'Food', 'Breakfast', 'Desserts'];

const AddItem = () => {
  const navigate = useNavigate();
  const { addNewDish, loading } = useHotelcontext();
  const [section, setSection] = useState('restaurant');
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Punjabi',
    type: 'Veg', spicyLevel: 1, description: '', isAvailable: true
  });

  const categories = section === 'restaurant' ? RESTAURANT_CATS : CAFE_CATS;

  const handleSectionChange = (s) => {
    setSection(s);
    setFormData(prev => ({ ...prev, category: s === 'restaurant' ? 'Punjabi' : 'Coffee' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addNewDish({ ...formData, section });
    if (result.success) navigate('/admin/menulist');
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Add New Item</h1>
            <p className="text-sm text-slate-400 font-bold mt-1">Fill in details and select section</p>
          </div>
          <button onClick={() => navigate('/admin/menulist')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
          {/* Left preview */}
          <div className="md:w-64 bg-[#0F172A] p-8 text-white flex flex-col">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Preview</p>
            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex-1">
              <div className={`w-3 h-3 rounded-full mb-3 ${formData.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
              <h4 className="text-lg font-bold mb-1">{formData.name || 'Item Name'}</h4>
              <p className="text-slate-400 text-xs mb-3 line-clamp-2">{formData.description || 'Description...'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-blue-400">₹{formData.price || '0'}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: Number(formData.spicyLevel) }).map((_, i) => <Flame key={i} size={12} className="text-orange-500 fill-orange-500" />)}
                </div>
              </div>
              <span className={`mt-3 block text-[10px] font-black uppercase tracking-widest ${section === 'cafe' ? 'text-amber-400' : 'text-blue-400'}`}>
                {section}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-8">
            {/* Section toggle */}
            <div className="mb-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Section</label>
              <div className="flex bg-slate-50 rounded-2xl p-1 gap-1">
                <button type="button" onClick={() => handleSectionChange('restaurant')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all
                    ${section === 'restaurant' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>
                  <Utensils size={16} /> Restaurant
                </button>
                <button type="button" onClick={() => handleSectionChange('cafe')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all
                    ${section === 'cafe' ? 'bg-amber-500 text-white shadow' : 'text-slate-500'}`}>
                  <Coffee size={16} /> Cafe
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Dish Name</label>
                <input required type="text" placeholder="e.g. Paneer Tikka Masala"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3.5 px-4 font-bold outline-none transition-all"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price (₹)</label>
                <input required type="number" placeholder="0"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3.5 px-4 font-bold outline-none transition-all"
                  value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                <select className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3.5 px-4 font-bold outline-none transition-all appearance-none"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                <div className="flex gap-3">
                  {['Veg', 'Non-Veg'].map(t => (
                    <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t })}
                      className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all
                        ${formData.type === t ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Spiciness: {formData.spicyLevel}
                </label>
                <input type="range" min="0" max="5"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={formData.spicyLevel} onChange={e => setFormData({ ...formData, spicyLevel: Number(e.target.value) })} />
                <div className="flex justify-between text-[10px] font-black text-slate-300 mt-1"><span>None</span><span>Hot</span></div>
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                <textarea rows={2} placeholder="Short description (optional)"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-3.5 px-4 font-bold outline-none transition-all resize-none"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`mt-8 w-full flex items-center justify-center gap-3 text-white py-5 rounded-[1.5rem] font-black shadow-xl transition-all active:scale-95
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${section === 'cafe' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
              {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'Saving...' : `Add to ${section === 'cafe' ? 'Cafe' : 'Restaurant'} Menu`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
