import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar';
import { AdminFooter } from './AdminFooter';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4FBFB]">
      <AdminNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};
