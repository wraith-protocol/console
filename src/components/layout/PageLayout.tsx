import Sidebar from './Sidebar';
import Header from './Header';

export default function PageLayout({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-60">
        <Header onLogout={onLogout} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
