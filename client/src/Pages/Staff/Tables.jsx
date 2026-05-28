import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';
import { Coffee, LogOut, Plus } from 'lucide-react';

const TOTAL_TABLES = 10;

const Tables = () => {
  const navigate = useNavigate();
  const { activeTables, fetchActiveTables, logout, role } = useHotelcontext();

  useEffect(() => { fetchActiveTables(); }, []);

  const occupiedIds = activeTables.map(o => String(o.tableNumber));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nilkanth Kitchen</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Table Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/cafeteria')}
            className="flex items-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-100 transition-colors">
            <Coffee size={16} /> Cafe
          </button>
          {role === 'admin' && (
            <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
              Admin Panel
            </button>
          )}
          <button onClick={logout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors font-bold text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Table Grid */}
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-bold text-slate-400">
            {occupiedIds.length} occupied · {TOTAL_TABLES - occupiedIds.length} free
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: TOTAL_TABLES }, (_, i) => String(i + 1)).map(tableId => {
            const order    = activeTables.find(o => String(o.tableNumber) === tableId);
            const occupied = !!order;
            return (
              <button key={tableId} onClick={() => navigate(`/staff/order/${tableId}`)}
                className={`rounded-[2rem] p-6 flex flex-col items-center justify-between h-36 border-2 transition-all active:scale-95 shadow-sm hover:shadow-lg
                  ${occupied
                    ? 'bg-red-500 border-red-400 text-white shadow-red-100'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${occupied ? 'text-red-100' : 'text-slate-400'}`}>
                  {occupied ? 'Occupied' : 'Available'}
                </span>
                <span className="text-4xl font-black">{tableId}</span>
                {occupied
                  ? <span className="text-xs font-bold text-red-100">₹{order.subtotal}</span>
                  : <Plus size={16} className="text-slate-300" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tables;
