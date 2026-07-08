import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ searchTerm, onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/70 bg-white/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Operations</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Welcome back, {user?.name || 'there'}</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500 shadow-sm">
            <Search size={16} />
            <input value={searchTerm || ''} onChange={(event) => onSearchChange?.(event.target.value)} className="w-full bg-transparent outline-none sm:w-48" placeholder="Search workspace" />
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-slate-500">{user?.role || 'Member'}</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
