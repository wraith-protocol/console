import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';

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

export default function Header({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
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
    <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container px-6">
      <h1 className="font-heading text-lg font-semibold text-on-surface">{title}</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 items-center justify-center border border-outline-variant bg-surface-bright text-sm text-on-surface-variant hover:bg-surface"
        >
          D
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 border border-outline-variant bg-surface-container py-1">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left text-sm text-on-surface-variant hover:bg-surface-bright"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
