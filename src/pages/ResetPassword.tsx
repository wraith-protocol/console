import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-[400px] px-6">
        <div className="mb-8 flex flex-col items-center">
          <WraithLogo />
          <span className="mt-3 font-heading text-sm font-semibold tracking-[0.15em] text-on-surface uppercase">
            WRAITH
          </span>
        </div>

        <h1 className="mb-1 text-center font-heading text-2xl font-bold text-on-surface">
          Reset Password
        </h1>
        <p className="mb-8 text-center text-sm text-outline">Choose a new password</p>

        {done ? (
          <div className="space-y-6">
            <div className="border border-tertiary/30 bg-tertiary/10 p-5">
              <p className="text-sm text-on-surface-variant">
                Your password has been reset successfully.
              </p>
            </div>
            <Link
              to="/login"
              className="block h-12 w-full bg-primary text-center font-heading text-[13px] font-semibold leading-[48px] tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110"
            >
              GO TO LOGIN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
              >
                NEW PASSWORD
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
            >
              {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
          </form>
        )}
      </div>
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
