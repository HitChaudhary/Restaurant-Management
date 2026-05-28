import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelcontext } from '../../Context/HotelContext';
import { Utensils, Coffee, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useHotelcontext();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else navigate('/staff');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Utensils size={22} className="text-white" />
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Coffee size={22} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">NILKANTH</h1>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Restaurant & Cafe</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-[2rem] p-8 backdrop-blur-sm">
          <h2 className="text-lg font-black text-white mb-6">Staff Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Username</label>
              <input type="text" required placeholder="Enter username"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3.5 px-4 font-bold outline-none focus:border-blue-500 transition-colors"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required placeholder="Enter password"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3.5 px-4 font-bold outline-none focus:border-blue-500 transition-colors"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black transition-all mt-2 disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/cafeteria')}
            className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl py-3 text-sm font-bold hover:bg-amber-500/20 transition-colors">
            <Coffee size={16} /> Cafe Menu
          </button>
          <button onClick={() => navigate('/kitchen')}
            className="flex items-center justify-center gap-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-xl py-3 text-sm font-bold hover:bg-slate-700 transition-colors">
            <Utensils size={16} /> Kitchen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
