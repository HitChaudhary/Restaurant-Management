import React, { useState } from 'react';
import { X, Save, IndianRupee, Flame, Tag, Layout, Loader } from 'lucide-react'; // Added Loader icon
import { useNavigate } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';
const AddItem = ({ onClose }) => {
  const navigate = useNavigate();
  const { addNewDish, loading } = useHotelcontext(); // 2. Get function from Context

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Punjabi',
    type: 'Veg',
    spicyLevel: 1,
    description: '',
    isAvailable: true // Added default as per your backend logic
  });

  const categories = ['Breakfast', 'Punjabi', 'Veg Main', 'Kofta', 'Rice', 'Breads', 'Sides', 'Drinks', 'Thali'];

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();

    // 3. Call the API function
    const result = await addNewDish(formData);

    if (result.success) {
        alert(result.message); // Success Message
        if(onClose) onClose(); // Close modal if prop exists
        else navigate('/admin'); // Or redirect
    } else {
        alert("Error: " + result.message); // Error Message
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* LEFT: LIVE PREVIEW */}
        <div className="w-full md:w-1/3 bg-[#0F172A] p-10 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-8">Live Preview</h3>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm">
                <div className={`w-3 h-3 rounded-full mb-4 ${formData.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h4 className="text-xl font-bold mb-2">{formData.name || 'Item Name'}</h4>
                <p className="text-slate-400 text-xs mb-4 line-clamp-2">{formData.description || 'Add a short description...'}</p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-blue-400">₹{formData.price || '0'}</span>
                    <div className="flex gap-1">
                        {[...Array(Number(formData.spicyLevel))].map((_, i) => <Flame key={i} size={14} className="text-orange-500 fill-orange-500" />)}
                    </div>
                </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Ensure all pricing includes the base GST as per Nilkanth Kitchen policy.
          </p>
        </div>

        {/* RIGHT: ENTRY FORM */}
        <form onSubmit={handleSubmit} className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Dish</h2>
            <button type="button" onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item Name */}
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Dish Name</label>
              <div className="relative">
                <Layout className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="e.g. Paneer Tikka Masala"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Price (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Category</label>
              <div className="relative">
                <Tag className="absolute left-4 top-4 text-slate-300" size={18} />
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Type Selector (Veg/Non-Veg) */}
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Dietary Type</label>
                <div className="flex gap-4">
                    {['Veg', 'Non-Veg'].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, type})}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${formData.type === type ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spicy Level */}
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Spiciness (1-5)</label>
                <input 
                    type="range" min="1" max="5" 
                    value={formData.spicyLevel}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    onChange={(e) => setFormData({...formData, spicyLevel: Number(e.target.value)})}
                />
                <div className="flex justify-between mt-2 px-1 text-[10px] font-black text-slate-300">
                    <span>MILD</span><span>HOT</span>
                </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              type="submit" 
              disabled={loading} // Disable button while loading
              className={`flex-1 text-white py-5 rounded-[1.8rem] font-black shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;