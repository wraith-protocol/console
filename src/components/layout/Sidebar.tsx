import { NavLink, useLocation } from 'react-router';

const navItems = [
  { to: '/', label: 'Overview', icon: OverviewIcon },
  { to: '/agents', label: 'Agents', icon: AgentsIcon },
  { to: '/keys', label: 'API Keys', icon: KeysIcon },
  { to: '/usage', label: 'Usage', icon: UsageIcon },
  { to: '/billing', label: 'Billing', icon: BillingIcon },
  { to: '/team', label: 'Team', icon: TeamIcon },
  { to: '/webhooks', label: 'Webhooks', icon: WebhooksIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-outline-variant bg-surface-container">
      <div className="flex h-14 items-center gap-2 border-b border-outline-variant px-5">
        <WraithLogo />
        <span className="font-heading text-lg font-semibold text-on-surface">Wraith</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-surface-bright text-on-surface'
                      : 'text-outline hover:bg-surface-bright hover:text-on-surface-variant'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function WraithLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 9v6l-8 4-8-4V9l8-4.82z" fill="#c6c6c7" />
      <path d="M12 6L6 9v6l6 3 6-3V9l-6-3zm0 1.5L16 10v4l-4 2-4-2v-4l4-2.5z" fill="#c6c6c7" />
    </svg>
  );
}

function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="6" height="6" />
      <rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

function AgentsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}

function KeysIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="5" cy="8" r="3" />
      <path d="M8 8h7M12 6v4" />
    </svg>
  );
}

function UsageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 14L5 8l3 4 3-7 4 9" />
    </svg>
  );
}

function BillingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="3" width="14" height="10" />
      <path d="M1 7h14" />
    </svg>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="11" cy="5" r="2" />
      <path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M10 14c0-2 1.3-3.5 3-3.5S16 12 16 14" />
    </svg>
  );
}

function WebhooksIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 1v4M8 11v4M1 8h4M11 8h4" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" />
    </svg>
  );
}
