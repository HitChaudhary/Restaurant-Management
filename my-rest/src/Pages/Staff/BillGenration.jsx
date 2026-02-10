import React, { useState, useEffect, useMemo } from 'react';
import { IndianRupee, Printer, X, CreditCard, Smartphone, Banknote, Clock, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext'; // Import Context
import toast from 'react-hot-toast';

const FinalBillModal = () => {
    const navigate = useNavigate();
    const { tableId } = useParams(); // Get Table ID (e.g., '1')
    const { activeTables, finalizeOrder } = useHotelcontext();
    
    // --- STATES ---
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [paidAmount, setPaidAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [loading, setLoading] = useState(false);

    // --- 1. FIND ORDER FOR THIS TABLE ---
    const currentOrder = useMemo(() => {
        if (!activeTables) return null;
        // Make sure to match string to string
        return activeTables.find(order => order.tableNumber === tableId.toString());
    }, [activeTables, tableId]);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- IF NO ORDER FOUND ---
    if (!currentOrder) {
        return (
            <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4 text-white text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">No Active Order Found</h2>
                    <p className="mb-6 text-slate-400">This table is currently empty or the order has been closed.</p>
                    <button onClick={() => navigate('/staff')} className="bg-blue-600 px-6 py-3 rounded-xl font-bold">Go to Dashboard</button>
                </div>
            </div>
        );
    }

    // --- CALCULATION LOGIC ---
    const subtotal = currentOrder.subtotal || 0;
    const discount = 0; // You can add logic for this later
    const taxableAmount = subtotal - discount;
    const cgst = taxableAmount * 0.025;
    const sgst = taxableAmount * 0.025;
    const total = Math.round(taxableAmount + cgst + sgst);
    
    const changeAmount = paidAmount ? (parseFloat(paidAmount) - total) : -total;

    // --- HANDLE FINALIZE ---
    const handleFinalize = async () => {
        if (!paymentMethod) return toast.error("Select Payment Method");
        
        setLoading(true);
        const finalData = {
            tax: (cgst + sgst),
            totalAmount: total,
            paymentMethod: paymentMethod
        };

        const success = await finalizeOrder(tableId, finalData);
        
        if (success) {
            navigate('/staff'); // Go back to dashboard (Table will turn white)
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 overflow-scroll">
            <div className="bg-white w-full max-w-md rounded-[3rem] mt-auto overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20 transform transition-all">

                {/* Header */}
                <div className="bg-slate-900 text-white p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
                    <button onClick={() => navigate(-1)} className="absolute right-6 top-8 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                    <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 shadow-inner">
                        <Clock size={14} className="text-blue-400" />
                        <span className="text-xs font-mono font-bold tracking-[0.2em] text-blue-100">{currentTime}</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Nilkanth Kitchen</h2>
                    <div className="flex justify-center gap-4 mt-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700/50">{new Date().toLocaleDateString()}</span>
                        <span className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded-md border border-blue-800/50">Table {tableId}</span>
                    </div>
                </div>

                {/* Item List (REAL DATA) */}
                <div className="p-8 space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">
                        <span className="col-span-2">Particulars</span>
                        <span className="text-center">Qty</span>
                        <span className="text-right">Price</span>
                    </div>
                    {currentOrder.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 items-center text-sm font-bold group border-b border-dashed border-slate-100 py-2 last:border-0">
                            <span className="col-span-2 text-slate-700">{item.name}</span>
                            <span className="text-center text-slate-400 font-medium">×{item.qty}</span>
                            <span className="text-right text-slate-900 font-black">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                </div>

                {/* Financial Summary */}
                <div className="px-8 py-6 bg-slate-50/80 space-y-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-slate-900">₹{subtotal}</span>
                    </div>
                    {/* CGST/SGST */}
                    <div className="grid grid-cols-2 gap-8 pt-1 border-b border-slate-200 pb-4">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>CGST (2.5%)</span><span className="text-slate-600">₹{cgst.toFixed(2)}</span></div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>SGST (2.5%)</span><span className="text-slate-600">₹{sgst.toFixed(2)}</span></div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-xs">Net Payable</span>
                        <span className="text-4xl font-black text-slate-900 flex items-center tracking-tighter">
                            <IndianRupee size={28} strokeWidth={4} className="text-blue-600 mr-1" /> {total}
                        </span>
                    </div>
                </div>

                {/* Payment Input Section */}
                <div className="px-8 py-6 border-y border-slate-100 bg-white flex items-center gap-6">
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Amount Received</label>
                        <div className="relative group">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} strokeWidth={3} />
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-black text-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="text-right min-w-[120px]">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">
                            {changeAmount >= 0 ? 'Balance' : 'Due Amount'}
                        </label>
                        <div className={`text-2xl font-black tabular-nums transition-colors duration-300 ${changeAmount >= 0 ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`}>
                            ₹{Math.abs(changeAmount).toFixed(0)}
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="p-8 grid grid-cols-3 gap-4">
                    {['Cash', 'UPI', 'Card'].map((method, idx) => {
                        const Icons = [Banknote, Smartphone, CreditCard];
                        const ActiveIcon = Icons[idx];
                        const isSelected = paymentMethod === method;
                        return (
                            <button 
                                key={method} 
                                onClick={() => setPaymentMethod(method)}
                                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all group active:scale-95 ${
                                    isSelected 
                                    ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-500/10' 
                                    : 'border-slate-50 hover:border-blue-200'
                                }`}
                            >
                                <ActiveIcon className={`transition-transform duration-300 ${isSelected ? 'text-blue-600 scale-110' : 'text-slate-400'}`} size={24} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>{method}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Final Action */}
                <div className="p-8 pt-0">
                    <button 
                        onClick={handleFinalize}
                        disabled={loading}
                        className='w-full py-5 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group relative overflow-hidden bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 disabled:opacity-50'
                    >
                        {loading ? (
                           <span>Processing...</span>
                        ) : (
                           <>
                             <Printer size={20} />
                             <span className="uppercase tracking-[0.15em] text-sm">Print & Finalize Order</span>
                           </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalBillModal;