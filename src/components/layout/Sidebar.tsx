import { NavLink, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/agents', label: 'Agents' },
  { to: '/keys', label: 'API Keys' },
  { to: '/usage', label: 'Usage' },
  { to: '/billing', label: 'Billing' },
  { to: '/team', label: 'Team' },
  { to: '/webhooks', label: 'Webhooks' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const { developer } = useAuth();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-outline-variant bg-surface-container transition-transform duration-150 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-outline-variant px-5">
          <img src="/logo.png" alt="Wraith" className="h-6 opacity-90" />
          <span className="font-heading text-sm font-semibold tracking-[0.05em] text-on-surface">
            Wraith
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <ul>
            {navItems.map((item) => {
              const isActive =
                item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={`flex h-9 items-center px-5 text-[13px] transition-colors duration-150 ${
                      isActive
                        ? 'border-l-2 border-primary bg-surface-bright text-on-surface'
                        : 'border-l-2 border-transparent text-outline hover:bg-surface-bright hover:text-on-surface-variant'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {developer && (
          <div className="border-t border-outline-variant px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-surface-bright text-xs font-medium text-on-surface-variant">
                {developer.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-on-surface">{developer.name}</p>
                <p className="truncate text-xs text-outline">{developer.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
