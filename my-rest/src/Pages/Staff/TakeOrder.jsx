import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Minus, Receipt, Save, IndianRupee, Flame, ArrowLeft } from 'lucide-react';
import { menuData } from '../../assets/data';
import Header from '../../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';
import toast from 'react-hot-toast';

const OrderLayout = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const { saveOrder, activeTables } = useHotelcontext();

  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load Existing Order
  useEffect(() => {
    if (activeTables && activeTables.length > 0) {
      // JSON tableNumber is a string "5", make sure we match correctly
      const existingOrder = activeTables.find(order => order.tableNumber === tableId.toString());
      if (existingOrder) {
        setCart(existingOrder.items);
      }
    }
  }, [activeTables, tableId]);

  const categoryList = useMemo(() => ['All', ...new Set(menuData.map(item => item.category))], []);

  const displayItems = menuData.filter(item =>
    (activeCat === 'All' || item.category === activeCat) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Add to Cart (Fixed to match by Name)
  const addToCart = (item) => {
    // We match by NAME because backend items lose their original menu ID
    const existing = cart.find(i => i.name === item.name);

    if (existing) {
      setCart(cart.map(i =>
        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {

      setCart([...cart, {
        name: item.name,
        price: item.price,
        qty: 1,
        id: item.id // Keep menu ID for reference if needed locally
      }]);
    }
  };

  // 3. Remove from Cart (Fixed to match by Name)
  const removeFromCart = (itemName) => {
    const existing = cart.find(i => i.name === itemName);
    if (existing.qty === 1) {
      setCart(cart.filter(i => i.name !== itemName));
    } else {
      setCart(cart.map(i =>
        i.name === itemName ? { ...i, qty: i.qty - 1 } : i
      ));
    }
  };

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  const handleSave = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");

    setLoading(true);
    // Call Context Function
    const success = await saveOrder(tableId, cart, subtotal);

    if (success) {
      navigate('/staff');
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-80px)] bg-[#F8FAFC] overflow-hidden font-sans">

        {/* PANE 1: CATEGORIES */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col p-6 gap-3 shadow-sm overflow-y-auto custom-scrollbar">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Menu Section</h2>
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`py-4 px-5 rounded-2xl text-sm font-black text-left transition-all ${activeCat === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PANE 2: ITEM GRID */}
        <div className="flex-1 flex flex-col p-8 overflow-hidden">
          <div className="relative mb-8">
            <Search className="absolute left-5 top-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={`Search in ${activeCat}...`}
              className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-14 pr-6 shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto pr-2 custom-scrollbar pb-20">
            {displayItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all text-left flex flex-col justify-between h-40 group active:scale-95"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`w-3 h-3 border-2 rounded-sm ${item.type === 'Veg' ? 'border-green-500' : 'border-red-500'}`}></div>
                    {item.spicyLevel > 2 && <Flame size={14} className="text-orange-500" />}
                  </div>
                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{item.name}</h4>
                </div>
                <p className="font-black text-xl text-slate-900">₹{item.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* PANE 3: BILLING / CART */}
        <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-10">
          <div className="p-8 border-b border-slate-100 bg-[#ef4444] text-white flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Current Table</p>
              <h2 className="text-3xl font-black">T-{tableId}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Items</p>
              <h2 className="text-xl font-black">{cart.length}</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-500">
                <Receipt size={48} className="mb-2" />
                <p className="font-bold">Add items to start</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs font-bold text-blue-600">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-2xl shadow-sm">
                    {/* Pass Name instead of ID */}
                    <button onClick={() => removeFromCart(item.name)} className="text-slate-400 hover:text-red-500 transition-colors"><Minus size={16} /></button>
                    <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="text-slate-400 hover:text-blue-600 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-10 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-8">
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Total Amount</p>
              <p className="text-4xl font-black text-slate-900 flex items-center">
                <IndianRupee size={28} strokeWidth={3} className="mr-1" /> {subtotal.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-slate-100 text-slate-600 py-5 rounded-[1.8rem] font-black hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                <Save size={20} /> {loading ? "Saving..." : "Save Order"}
              </button>
              <button
                // 🔴 OLD: onClick={() => navigate('/staff/bill')} 
                // 🟢 NEW: Pass the tableId dynamically
                onClick={() => navigate(`/staff/bill/${tableId}`)}

                className="flex items-center justify-center gap-3 bg-blue-600..."
              >
                <Receipt size={20} /> Bill
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default OrderLayout;