import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import OAuthButtons from './OAuthButtons';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] px-6">
      <div className="mb-8 flex flex-col items-center">
        <WraithLogo />
        <span className="mt-3 font-heading text-sm font-semibold tracking-[0.15em] text-on-surface uppercase">
          WRAITH
        </span>
      </div>

      <h1 className="mb-1 text-center font-heading text-2xl font-bold text-on-surface">
        Welcome back
      </h1>
      <p className="mb-8 text-center text-sm text-outline">Sign in to your console</p>

      <OAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant" />
        <span className="font-mono text-[10px] tracking-widest text-outline uppercase">OR</span>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
          >
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface placeholder:text-outline outline-none transition-colors duration-150 focus:border-primary"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              PASSWORD
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-outline transition-colors duration-150 hover:text-on-surface-variant"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
        >
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-outline">
        No account?{' '}
        <Link
          to="/register"
          className="text-on-surface-variant transition-colors duration-150 hover:text-on-surface"
        >
          Request access &rarr;
        </Link>
      </p>
    </div>
  );
}

function WraithLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 9v6l-8 4-8-4V9l8-4.82z" fill="#c6c6c7" />
      <path d="M12 6L6 9v6l6 3 6-3V9l-6-3zm0 1.5L16 10v4l-4 2-4-2v-4l4-2.5z" fill="#c6c6c7" />
    </svg>
  );
}
