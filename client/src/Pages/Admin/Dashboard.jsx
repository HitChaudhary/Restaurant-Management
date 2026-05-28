import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp, Coffee, Utensils } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useHotelcontext } from '../../Context/HotelContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ label, value, icon, sub }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900">{value}</h4>
      {sub && <p className="text-xs font-bold text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { token } = useHotelcontext();
  const [stats, setStats]       = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [topRest, setTopRest]   = useState([]);
  const [topCafe, setTopCafe]   = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setStats(data.stats);
          setPaymentData(data.paymentStats);
          setTopRest(data.topRestaurantItems);
          setTopCafe(data.topCafeItems);
        }
      } catch (err) {
        console.error('Dashboard stats error:', err.message);
      }
    };
    fetchStats();
  }, [token]);

  const chartData = {
    labels: paymentData.map(p => p._id || 'Other'),
    datasets: [{
      data: paymentData.map(p => p.amount),
      backgroundColor: ['#2563EB', '#10B981', '#F59E0B'],
      borderWidth: 0,
    }]
  };

  if (!stats) return (
    <div className="flex items-center justify-center h-64 text-slate-400 font-bold">Loading dashboard...</div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Dashboard</h1>
      <p className="text-sm text-slate-400 font-bold mb-8">Combined Restaurant + Cafe overview</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          sub={`₹${stats.restaurantRevenue.toLocaleString()} rest · ₹${stats.cafeRevenue.toLocaleString()} cafe`}
          icon={<IndianRupee className="text-emerald-500" size={22} />} />
        <StatCard label="Total Orders" value={stats.totalOrders}
          sub={`${stats.restaurantOrders} rest · ${stats.cafeOrders} cafe`}
          icon={<ShoppingBag className="text-blue-500" size={22} />} />
        <StatCard label="Today's Orders" value={stats.todayOrders}
          icon={<TrendingUp className="text-orange-500" size={22} />} />
        <StatCard label="Sections" value="2" sub="Restaurant + Cafe"
          icon={<Coffee className="text-amber-500" size={22} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Doughnut */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-base font-black text-slate-800 mb-4">Revenue by Payment</h3>
          <div className="flex items-center justify-center h-52">
            {paymentData.length > 0
              ? <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
              : <p className="text-slate-400 font-bold text-sm">No sales data yet</p>}
          </div>
        </div>

        {/* Top Restaurant Items */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <Utensils size={18} className="text-blue-500" />
            <h3 className="text-base font-black text-slate-800">Top Restaurant Items</h3>
          </div>
          <div className="space-y-4">
            {topRest.length === 0 && <p className="text-slate-400 text-sm font-bold">No data yet</p>}
            {topRest.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-orange-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-bold text-slate-600">{item._id}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cafe Items */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-5">
            <Coffee size={18} className="text-amber-500" />
            <h3 className="text-base font-black text-slate-800">Top Cafe Items</h3>
          </div>
          <div className="space-y-4">
            {topCafe.length === 0 && <p className="text-slate-400 text-sm font-bold">No data yet</p>}
            {topCafe.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-bold text-slate-600">{item._id}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
