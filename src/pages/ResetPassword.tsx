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
      <div className="w-full max-w-sm border border-outline-variant bg-surface-container p-8">
        <h1 className="mb-6 font-heading text-2xl font-semibold text-on-surface">Reset Password</h1>

        {done ? (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Your password has been reset successfully.
            </p>
            <Link
              to="/login"
              className="block w-full bg-primary px-4 py-2 text-center text-sm font-medium text-surface transition-colors hover:bg-primary/90"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-error bg-error/10 px-3 py-2 text-sm text-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-on-surface-variant">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1 block text-sm text-on-surface-variant">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
