import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, GitBranch, Swords, Users, Award, KanbanSquare, BarChart3, GraduationCap, Settings as SettingsIcon, LogOut } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { base44 } from '@/api/base44Client';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/skill-tree', label: 'Skill Tree', icon: GitBranch },
  { to: '/interview', label: 'Boss Battle', icon: Swords },
  { to: '/networking', label: 'Networking', icon: Users },
  { to: '/badges', label: 'Badges', icon: Award },
  { to: '/applications', label: 'Applications', icon: KanbanSquare },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Layout() {
  const location = useLocation();
  const isFaculty = location.pathname.startsWith('/faculty');

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl fixed inset-y-0 z-30">
        <div className="p-5 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center glow-primary shrink-0 border-2 border-primary-foreground/20" aria-hidden="true">
              <span className="text-[11px] font-black text-primary-foreground tracking-tight">L&amp;C</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">CareerQuest</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lewis &amp; Clark College</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-border/60">
            <NavLink
              to="/faculty"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`
              }
            >
              <Shield className="w-4.5 h-4.5" />
              Faculty Portal
            </NavLink>
          </div>
        </nav>
        <div className="p-4 border-t border-border/60 space-y-3">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-2">Theme</p>
            <ThemeSwitcher compact />
          </div>
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
              AC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Alex Chen</p>
              <p className="text-[10px] text-muted-foreground">Student · Lv 3</p>
            </div>
            <button
              onClick={() => base44.auth.logout('/login')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-60">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-border/60 bg-card/80 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border border-primary-foreground/20" aria-hidden="true">
              <span className="text-[8px] font-black text-primary-foreground">L&amp;C</span>
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm">CareerQuest</span>
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Lewis &amp; Clark</p>
            </div>
          </div>
          <Link to="/settings" className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          </Link>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around h-14 border-t border-border/60 bg-card/90 backdrop-blur-xl">
      {navItems.slice(0, 5).map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          {item.label.split(' ')[0]}
        </NavLink>
      ))}
    </nav>
  );
}
