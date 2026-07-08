import { useState } from 'react';
import { Menu, Sparkles, LayoutGrid, FolderKanban, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarClass = collapsed ? 'lg:w-24' : 'lg:w-72';

  return (
    <>
      <button type="button" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-40 rounded-2xl border border-slate-200 bg-white/80 p-2.5 shadow-lg backdrop-blur lg:hidden">
        <Menu size={18} className="text-slate-700" />
      </button>

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200/80 bg-slate-950/95 text-slate-200 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:static lg:rounded-[30px] lg:border lg:border-white/60 lg:bg-white/70 lg:text-slate-700 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarClass}`}>
        <div className="flex h-full flex-col px-4 py-5 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 shadow-lg shadow-indigo-200">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Workspace</p>
                <h1 className="text-lg font-semibold text-white lg:text-slate-900">Team Task Manager</h1>
              </div>
            </div>
            <button type="button" onClick={() => setCollapsed((value) => !value)} className="hidden rounded-full border border-slate-200/70 p-2 text-slate-500 transition hover:bg-slate-100 lg:inline-flex">
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 lg:bg-slate-900 lg:text-white'
                        : 'text-slate-400 hover:bg-white/70 hover:text-slate-900 lg:text-slate-600'
                    }`
                  }
                >
                  <Icon size={18} />
                  {!collapsed ? <span>{item.label}</span> : null}
                </NavLink>
              );
            })}
          </nav>

        </div>
      </aside>

      {mobileOpen ? <button type="button" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-20 bg-slate-950/70 lg:hidden" aria-label="Close menu" /> : null}
    </>
  );
}

export default Sidebar;
