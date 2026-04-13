export default function Login({ onLogin }: { onLogin?: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-sm border border-outline-variant bg-surface-container p-8">
        <h1 className="mb-6 font-heading text-2xl font-semibold text-on-surface">Login</h1>
        <button
          onClick={onLogin}
          className="w-full border border-outline-variant bg-surface-bright px-4 py-2 text-sm text-on-surface-variant hover:bg-surface"
        >
          Login (dev)
        </button>
      </div>
    </div>
  );
}
