import React, { useEffect, useRef, useState } from 'react';
import { useCafeContext } from '../../Context/CafeContext';
import { useHotelcontext } from '../../Context/HotelContext';
import { useNavigate } from 'react-router-dom';
import { Coffee, CheckCircle, Clock, ChefHat, Bell, XCircle, IndianRupee } from 'lucide-react';

const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Preparing: 'bg-blue-100 text-blue-700 border-blue-200',
  Ready:     'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const NEXT_STATUS = { Pending: 'Preparing', Preparing: 'Ready', Ready: 'Completed' };

const Kitchen = () => {
  const { cafeOrders, fetchCafeOrders, updateCafeStatus, markCafePaid, cancelCafeOrder } = useCafeContext();
  const { logout } = useHotelcontext();
  const navigate   = useNavigate();
  const prevCount  = useRef(0);
  const audioRef   = useRef(null);
  const [payModal, setPayModal] = useState(null); // { id, total }
  const [payMethod, setPayMethod] = useState('Cash');

  // Sound alert on new orders
  useEffect(() => {
    if (cafeOrders.length > prevCount.current && prevCount.current !== 0) {
      try { audioRef.current?.play(); } catch (_) {}
    }
    prevCount.current = cafeOrders.length;
  }, [cafeOrders]);

  const pending   = cafeOrders.filter(o => o.status === 'Pending');
  const preparing = cafeOrders.filter(o => o.status === 'Preparing');
  const ready     = cafeOrders.filter(o => o.status === 'Ready');

  const OrderCard = ({ order }) => (
    <div className={`bg-white rounded-[1.5rem] border-2 ${STATUS_COLORS[order.status] || 'border-slate-100'} p-5 shadow-sm`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-2xl font-black text-slate-900">{order.orderToken}</span>
          <p className="text-xs text-slate-400 font-bold mt-0.5">{new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>
      <div className="space-y-1 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="font-bold text-slate-700">{item.name}</span>
            <span className="font-black text-slate-500">×{item.qty}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
        <span className="font-black text-slate-900 flex items-center gap-1"><IndianRupee size={14} />{order.totalAmount}</span>
        <div className="flex gap-2">
          {order.status !== 'Cancelled' && order.status !== 'Completed' && (
            <>
              <button onClick={() => cancelCafeOrder(order._id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                <XCircle size={18} />
              </button>
              {order.status === 'Ready' ? (
                <button onClick={() => { setPayModal({ id: order._id, total: order.totalAmount }); setPayMethod('Cash'); }}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl font-black text-sm hover:bg-green-600 transition-colors flex items-center gap-1">
                  <IndianRupee size={14} /> Pay
                </button>
              ) : (
                <button onClick={() => updateCafeStatus(order._id, NEXT_STATUS[order.status])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-colors">
                  {NEXT_STATUS[order.status]}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <audio ref={audioRef} src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" preload="auto" />

      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Cafe Kitchen</h1>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pending.length > 0 && (
            <span className="bg-yellow-500 text-white text-sm font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Bell size={14} /> {pending.length} new
            </span>
          )}
          <button onClick={() => navigate('/staff')}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50">
            Restaurant
          </button>
          <button onClick={logout}
            className="text-sm font-bold text-red-400 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50">
            Logout
          </button>
        </div>
      </header>

      {/* Columns */}
      <div className="grid grid-cols-3 gap-5 p-6 h-[calc(100vh-73px)]">
        {[
          { label: 'New Orders', orders: pending,   color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Preparing',  orders: preparing, color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Ready',      orders: ready,     color: 'text-green-600',  bg: 'bg-green-50' },
        ].map(col => (
          <div key={col.label} className={`${col.bg} rounded-[2rem] p-4 overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-black uppercase text-sm tracking-widest ${col.color}`}>{col.label}</h2>
              <span className={`font-black text-sm ${col.color}`}>{col.orders.length}</span>
            </div>
            <div className="space-y-3">
              {col.orders.length === 0
                ? <p className="text-center text-slate-400 font-bold text-sm py-8">No orders</p>
                : col.orders.map(o => <OrderCard key={o._id} order={o} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2">Record Payment</h3>
            <p className="text-slate-400 font-bold mb-6">Total: ₹{payModal.total}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Cash', 'UPI', 'Card'].map(m => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`py-3 rounded-xl font-black text-sm transition-all
                    ${payMethod === m ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={() => { markCafePaid(payModal.id, payMethod); setPayModal(null); }}
                className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black hover:bg-green-600">
                Confirm ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kitchen;
