
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden text-white">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-3xl animate-pulse opacity-50 delay-1000"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse opacity-60 delay-2000"></div>
      </div>
      <NavBar />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
