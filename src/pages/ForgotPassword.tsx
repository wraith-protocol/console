import { useState } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-sm border border-outline-variant bg-surface-container p-8">
        <h1 className="mb-6 font-heading text-2xl font-semibold text-on-surface">
          Forgot Password
        </h1>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              If an account exists for {email}, you will receive a password reset link.
            </p>
            <Link
              to="/login"
              className="block text-center text-sm text-outline hover:text-on-surface-variant"
            >
              Back to login
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
              <label htmlFor="email" className="mb-1 block text-sm text-on-surface-variant">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-outline-variant bg-surface-bright px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm text-outline hover:text-on-surface-variant"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
