import React, { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import axios from 'axios';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// 1. Register Chart Components OUTSIDE
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    // State to hold Backend Data
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        todayOrders: 0
    });
    const [paymentData, setPaymentData] = useState([]);
    const [topItems, setTopItems] = useState([]);

    // 2. Fetch Data from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats');
                if (data.success) {
                    setStats(data.stats);
                    setPaymentData(data.paymentStats); // [{_id: "Cash", amount: 500}, {_id: "UPI", amount: 1000}]
                    setTopItems(data.topItems);
                }
            } catch (error) {
                console.error("Error loading dashboard:", error);
            }
        };
        fetchStats();
    }, []);

    // Prepare Chart Data
    // 1. Prepare Chart Data Object
    const chartData = {

        // Step A: Extract the Names (Labels)
        // We take the paymentData list and say: "Give me just the _id of every item."
        // Result: ["Cash", "UPI", "Card"]
        labels: paymentData.map(item => item._id || "Unknown"),

        datasets: [
            {
                // Step B: Extract the Numbers (Data)
                // We take the paymentData list and say: "Give me just the amount of every item."
                // Result: [5000, 8000, 1200]
                data: paymentData.map(item => item.amount),

                // Step C: Styling
                // We pick 3 colors for the slices. 
                // 1st number gets Blue, 2nd gets Green, 3rd gets Orange.
                backgroundColor: ['#2563EB', '#10B981', '#F59E0B'],
                borderWidth: 0, // Removes the white outline
            },
        ],
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden">
            <main className="flex-1 overflow-y-auto p-8">

                {/* TOP METRICS (Real Data) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Total Revenue"
                        value={`₹${stats.totalRevenue.toLocaleString()}`} // Formats number (e.g., 42,000)
                        icon={<DollarSign className="text-emerald-500" />}
                    />
                    <StatCard
                        label="Total Orders"
                        value={stats.totalOrders}
                        icon={<Users className="text-blue-500" />}
                    />
                    <StatCard
                        label="Orders Today"
                        value={stats.todayOrders}
                        icon={<TrendingUp className="text-orange-500" />}
                    />
                </div>

                {/* MIDDLE SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Payment Split Chart (Simple & Visual) */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 col-span-2">
                        <h3 className="text-lg font-black text-slate-800 mb-4">Revenue by Payment</h3>
                        <div className="h-64 flex items-center justify-center">
                            {paymentData.length > 0 ? (
                                <div className="w-64 h-64">
                                    <Doughnut
                                        data={chartData}  // <--- The object we built above
                                        options={{ maintainAspectRatio: false }} // <--- Tells it to stretch to fit the box
                                    />                                </div>
                            ) : (
                                <p className="text-slate-400 font-bold">No sales data yet</p>
                            )}
                        </div>
                    </div>

                    {/* 2. Best Sellers List (Real Data) */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Top Items</h3>
                        <div className="space-y-6">
                            {topItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                        <span className="text-sm font-bold text-slate-600">{item._id}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{item.count} orders</span>
                                </div>
                            ))}
                            {topItems.length === 0 && <p className="text-slate-400 text-sm">No items sold yet</p>}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

// Simple Card Component
const StatCard = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
        <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        </div>
    </div>
);

export default Dashboard;