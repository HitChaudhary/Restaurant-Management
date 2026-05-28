import React, { useState, useMemo, useEffect } from 'react';
import { useCafeContext } from '../../Context/CafeContext';
import { Plus, Minus, ShoppingBag, Coffee, CheckCircle, X } from 'lucide-react';

const Cafeteria = () => {
  const { cafeMenu, placeCafeOrder, cafeLoading } = useCafeContext();
  const [activeCat, setActiveCat]   = useState('All');
  const [cart, setCart]             = useState([]);
  const [payMethod, setPayMethod]   = useState('Cash');
  const [confirmed, setConfirmed]   = useState(null); // { token, total }

  const categories = useMemo(() => ['All', ...new Set(cafeMenu.map(d => d.category))], [cafeMenu]);
  const displayed  = cafeMenu.filter(d =>
    d.isAvailable && (activeCat === 'All' || d.category === activeCat)
  );

  const add = (item) => setCart(prev => {
    const ex = prev.find(i => i.name === item.name);
    return ex ? prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i)
               : [...prev, { name: item.name, price: item.price, qty: 1 }];
  });

  const remove = (name) => setCart(prev => {
    const ex = prev.find(i => i.name === name);
    if (!ex) return prev;
    return ex.qty === 1 ? prev.filter(i => i.name !== name)
                        : prev.map(i => i.name === name ? { ...i, qty: i.qty - 1 } : i);
  });

  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const gst      = Math.round(subtotal * 0.05);
  const total    = subtotal + gst;

  const handleOrder = async () => {
    if (!cart.length) return;
    const result = await placeCafeOrder(cart, subtotal, payMethod);
    if (result.success) {
      setConfirmed({ token: result.order.orderToken, total: result.order.totalAmount });
      setCart([]);
    }
  };

  if (confirmed) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] p-10 text-center max-w-sm w-full shadow-2xl">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Order Placed!</h2>
        <p className="text-slate-500 mb-6">Show this token at the counter</p>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
          <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">Your Token</p>
          <p className="text-5xl font-black text-amber-700">{confirmed.token}</p>
          <p className="text-sm font-bold text-slate-500 mt-2">Total: ₹{confirmed.total}</p>
        </div>
        <button onClick={() => setConfirmed(null)}
          className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black hover:bg-amber-600 transition-colors">
          Order More
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEFCE8] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <Coffee size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Nilkanth Cafe</h1>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Self Order</p>
          </div>
        </div>
        <div className="relative">
          <ShoppingBag size={26} className="text-slate-600" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cart.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </div>
      </header>

      <div className="flex h-[calc(100vh-69px)]">
        {/* Category Sidebar */}
        <div className="w-28 bg-white border-r border-amber-100 flex flex-col items-center py-4 gap-2 overflow-y-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`w-20 py-3 rounded-2xl text-[10px] font-black text-center transition-all
                ${activeCat === cat ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-amber-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cafeMenu.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-400 font-bold">Loading menu...</div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayed.map(item => {
              const inCart = cart.find(c => c.name === item.name);
              return (
                <div key={item._id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-amber-100">
                  <div className="h-28 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Coffee size={40} className="text-amber-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-slate-800 text-sm mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mb-3">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-600 text-lg">₹{item.price}</span>
                      {inCart ? (
                        <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-2 py-1">
                          <button onClick={() => remove(item.name)} className="text-amber-400 hover:text-red-500"><Minus size={14} /></button>
                          <span className="font-black text-sm w-4 text-center text-amber-700">{inCart.qty}</span>
                          <button onClick={() => add(item)} className="text-amber-400 hover:text-amber-600"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => add(item)}
                          className="bg-amber-500 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-amber-600 transition-colors active:scale-95">
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="w-72 bg-white border-l border-amber-100 flex flex-col shadow-2xl">
            <div className="p-5 border-b border-amber-100 bg-amber-500 text-white">
              <h3 className="font-black text-lg">Your Order</h3>
              <p className="text-amber-100 text-xs font-bold">{cart.reduce((a,c)=>a+c.qty,0)} items</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-amber-50 p-3 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-amber-600 font-bold">₹{item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => remove(item.name)} className="text-slate-400 hover:text-red-500"><Minus size={13} /></button>
                    <span className="font-black text-sm">{item.qty}</span>
                    <button onClick={() => add(item)} className="text-slate-400 hover:text-amber-600"><Plus size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-amber-100">
              <div className="space-y-1 mb-4 text-sm">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-slate-500"><span>GST (5%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between font-black text-slate-900 text-base border-t border-amber-100 pt-2">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
              {/* Payment */}
              <div className="flex gap-2 mb-3">
                {['Cash', 'UPI', 'Card'].map(m => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all
                      ${payMethod === m ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={handleOrder} disabled={cafeLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black transition-all disabled:opacity-50">
                {cafeLoading ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cafeteria;
