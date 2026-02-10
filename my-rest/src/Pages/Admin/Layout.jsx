import React from 'react';
import Sidebar from '../../components/Admin/Sidebar'; // Adjust path
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Navigation on the left (Desktop) or top (Mobile) */}
      <Sidebar />

      {/* Main Content on the right */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* This renders Dashboard, Add Faculty, etc. based on the URL */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;