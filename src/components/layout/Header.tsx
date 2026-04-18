import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/agents': 'Agents',
  '/keys': 'API Keys',
  '/usage': 'Usage',
  '/billing': 'Billing',
  '/team': 'Team',
  '/webhooks': 'Webhooks',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/agents/')) return 'Agent Detail';
  return 'Wraith Console';
}

export default function Header({
  onLogout,
  onMenuToggle,
}: {
  onLogout: () => void;
  onMenuToggle: () => void;
}) {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const { developer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-outline-variant px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center text-outline transition-colors duration-150 hover:text-on-surface-variant lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 4.5h14M2 9h14M2 13.5h14" />
          </svg>
        </button>
        <h1 className="font-heading text-lg font-semibold text-on-surface">{title}</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 items-center justify-center border border-outline-variant bg-surface-bright text-xs font-medium text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-high"
        >
          {developer?.name?.charAt(0)?.toUpperCase() ?? 'U'}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 border border-outline-variant bg-surface-container py-1">
            {developer && (
              <div className="border-b border-outline-variant px-4 py-2.5">
                <p className="truncate text-sm text-on-surface">{developer.name}</p>
                <p className="truncate text-xs text-outline">{developer.email}</p>
              </div>
            )}
            <button
              onClick={onLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
