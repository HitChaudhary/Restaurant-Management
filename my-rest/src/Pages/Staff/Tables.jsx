import React from 'react';
import { Clock, IndianRupee, ChevronRight, LayoutGrid, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';

const TableDashboard = () => {
  // Default to empty array if context returns null/undefined
  const { activeTables = [] } = useHotelcontext(); 
  const navigate = useNavigate();

  const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

 
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Safe check for array
  const safeActiveTables = Array.isArray(activeTables) ? activeTables : [];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">

      {/* LEFT SIDE: TABLE GRID */}
      <div className="w-[35%] bg-white border-r border-slate-200 flex flex-col shadow-xl z-10">
        <div className="flex items-center border-b p-8 border-slate-200 gap-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
              NILKANTH <span className="text-blue-600">KITCHEN</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Online • Floor 01</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-black text-slate-700">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-5 overflow-y-auto">
          {allTables.map(num => {
            // FIX: Safe check using safeActiveTables variable
            const activeOrder = safeActiveTables.find(t => t.tableNumber === num.toString());
            
            return (
              <button
                onClick={() => navigate(`/staff/takeorder/${num}`)}
                key={num}
                className={`group relative h-32 rounded-[2.5rem] text-4xl font-black transition-all duration-300 border-2 flex flex-col items-center justify-center active:scale-95 ${
                  activeOrder
                    ? 'bg-red-50 border-red-200 text-red-600 shadow-md shadow-red-100'
                    : 'bg-white border-slate-100 text-slate-300 hover:border-blue-400 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-50'
                }`}
              >
                {num}
                {activeOrder ? (
                  <span className="text-[10px] font-black uppercase mt-2 tracking-widest animate-pulse">In Service</span>
                ) : (
                  <span className="text-[10px] font-bold uppercase mt-2 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: ACTIVE DETAILS */}
      <div className="flex-1 p-8 flex flex-col bg-[#F8FAFC]">
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Occupancy</p>
            {/* FIX: Use safeActiveTables for length */}
            <p className="text-sm font-black text-slate-800">{safeActiveTables.length} / {allTables.length} Tables</p>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
            <PlusCircle size={16} />
            <span>Quick Order</span>
          </button>
        </div>

        <div className="p-10 overflow-y-auto space-y-6">
          {/* FIX: Map over safeActiveTables */}
          {safeActiveTables.map((order) => {
            // Calculate total items (sum of qty)
            const totalItemsCount = order.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

            return (
              <div key={order._id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group hover:-translate-y-1">

                {/* Table Info */}
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-slate-400 relative overflow-hidden group-hover:bg-blue-600 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                    <span className="relative">{order.tableNumber}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Order Status</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{totalItemsCount} Items</p>
                  </div>
                </div>

                {/* Time & Price Info */}
                <div className="flex gap-16">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ordered At</p>
                    <div className="flex items-center gap-2 font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl ring-1 ring-blue-100">
                      <Clock size={16} strokeWidth={3} /> {formatTime(order.orderTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current Total</p>
                    <p className="text-3xl font-black flex items-center justify-end text-slate-900">
                      <IndianRupee size={22} strokeWidth={3.5} className="mr-1" /> {order.subtotal}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-8 w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-90 transition-all duration-500 shadow-inner">
                  <ChevronRight size={28} strokeWidth={3} />
                </div>
              </div>
            );
          })}

          {/* FIX: Use safeActiveTables for length check */}
          {safeActiveTables.length === 0 && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-200">
              <LayoutGrid size={120} strokeWidth={1} className="mb-6 opacity-20" />
              <p className="text-3xl font-black tracking-tighter opacity-30">Floor is Clear</p>
              <p className="text-sm font-bold opacity-20 uppercase tracking-widest mt-2">No active dining sessions</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default TableDashboard;