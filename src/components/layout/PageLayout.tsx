import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function PageLayout({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-60">
        <Header onLogout={onLogout} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
