import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Minus, Receipt, Save, IndianRupee, Flame, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';
import toast from 'react-hot-toast';

const TakeOrder = () => {
  const { tableId } = useParams();
  const navigate    = useNavigate();
  const { saveOrder, activeTables, dishes } = useHotelcontext();

  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch]       = useState('');
  const [cart, setCart]           = useState([]);
  const [loading, setLoading]     = useState(false);

  // Pre-load existing order
  useEffect(() => {
    if (activeTables?.length) {
      const existing = activeTables.find(o => String(o.tableNumber) === String(tableId));
      if (existing) setCart(existing.items);
    }
  }, [activeTables, tableId]);

  const menuData   = dishes.filter(d => d.isAvailable);
  const categories = useMemo(() => ['All', ...new Set(menuData.map(d => d.category))], [menuData]);
  const displayed  = menuData.filter(d =>
    (activeCat === 'All' || d.category === activeCat) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.name === item.name);
      return ex
        ? prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (name) => {
    setCart(prev => {
      const ex = prev.find(i => i.name === name);
      if (!ex) return prev;
      return ex.qty === 1
        ? prev.filter(i => i.name !== name)
        : prev.map(i => i.name === name ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const handleSave = async () => {
    if (!cart.length) return toast.error('Cart is empty');
    setLoading(true);
    const ok = await saveOrder(tableId, cart, subtotal);
    if (ok) navigate('/staff');
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Categories */}
      <div className="w-52 bg-white border-r border-slate-200 flex flex-col p-5 gap-2 overflow-y-auto">
        <button onClick={() => navigate('/staff')} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-bold mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</p>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)}
            className={`py-3 px-4 rounded-2xl text-sm font-black text-left transition-all
              ${activeCat === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input type="text" placeholder="Search items..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
          {displayed.map(item => {
            const inCart = cart.find(c => c.name === item.name);
            return (
              <button key={item._id} onClick={() => addToCart(item)}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col justify-between h-36 group active:scale-95">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <div className={`w-3 h-3 border-2 rounded-sm ${item.type === 'Veg' ? 'border-green-500' : 'border-red-500'}`} />
                    {item.spicyLevel > 2 && <Flame size={13} className="text-orange-500" />}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-600">{item.name}</h4>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-black text-lg text-slate-900">₹{item.price}</p>
                  {inCart && <span className="bg-blue-600 text-white text-xs font-black px-2 py-0.5 rounded-full">{inCart.qty}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart / Bill */}
      <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl">
        <div className="p-7 border-b bg-red-500 text-white flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Table</p>
            <h2 className="text-3xl font-black">T-{tableId}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Items</p>
            <h2 className="text-xl font-black">{cart.reduce((a, c) => a + c.qty, 0)}</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0
            ? <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-500"><Receipt size={48} className="mb-2" /><p className="font-bold">Add items to start</p></div>
            : cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs font-bold text-blue-600">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm">
                    <button onClick={() => removeFromCart(item.name)} className="text-slate-400 hover:text-red-500"><Minus size={14} /></button>
                    <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="text-slate-400 hover:text-blue-600"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
        </div>
        <div className="p-6 border-t bg-white">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Total</p>
            <p className="text-3xl font-black text-slate-900 flex items-center"><IndianRupee size={22} strokeWidth={3} className="mr-1" />{subtotal.toLocaleString('en-IN')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleSave} disabled={loading}
              className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all disabled:opacity-50">
              <Save size={18} />{loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => navigate(`/staff/bill/${tableId}`)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
              <Receipt size={18} /> Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeOrder;
