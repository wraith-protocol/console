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
      <div className="w-full max-w-[400px] px-6">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="Wraith" className="h-10 opacity-90" />
          <span className="mt-3 font-heading text-sm font-semibold tracking-[0.15em] text-on-surface uppercase">
            WRAITH
          </span>
        </div>

        <h1 className="mb-1 text-center font-heading text-2xl font-bold text-on-surface">
          Forgot Password
        </h1>
        <p className="mb-8 text-center text-sm text-outline">
          Enter your email to receive a reset link
        </p>

        {sent ? (
          <div className="space-y-6">
            <div className="border border-outline-variant bg-surface-container p-5">
              <p className="text-sm text-on-surface-variant">
                If an account exists for {email}, you will receive a password reset link.
              </p>
            </div>
            <Link
              to="/login"
              className="block text-center text-sm text-outline transition-colors duration-150 hover:text-on-surface-variant"
            >
              &larr; Back to login
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

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm text-outline transition-colors duration-150 hover:text-on-surface-variant"
            >
              &larr; Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
