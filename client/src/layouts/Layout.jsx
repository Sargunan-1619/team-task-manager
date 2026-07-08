import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/layouts/Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout() {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const normalizedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8faff_0%,_#fdfcff_40%,_#f4f8ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:px-4 lg:py-4">
        <Sidebar />
        <div className="flex-1 lg:ml-3">
          <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <Outlet context={{ searchTerm: normalizedSearchTerm, currentPath: location.pathname }} />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
