import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import OAuthButtons from './OAuthButtons';

export default function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] px-6">
      <div className="mb-8 flex flex-col items-center">
        <img src="/logo.png" alt="Wraith" className="h-10 opacity-90" />
        <span className="mt-3 font-heading text-sm font-semibold tracking-[0.15em] text-on-surface uppercase">
          WRAITH
        </span>
      </div>

      <h1 className="mb-1 text-center font-heading text-2xl font-bold text-on-surface">
        Create Account
      </h1>
      <p className="mb-8 text-center text-sm text-outline">Get started with Wraith</p>

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
            htmlFor="name"
            className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
          >
            NAME
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface placeholder:text-outline outline-none transition-colors duration-150 focus:border-primary"
          />
        </div>

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
            className="h-11 w-full border border-outline-variant bg-surface px-4 text-sm text-on-surface placeholder:text-outline outline-none transition-colors duration-150 focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
          >
            PASSWORD
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

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-primary font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
        >
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-outline">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-on-surface-variant transition-colors duration-150 hover:text-on-surface"
        >
          Sign in &rarr;
        </Link>
      </p>
    </div>
  );
}
