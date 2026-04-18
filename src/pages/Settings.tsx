import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../api/client';
import { getGoogleOAuthUrl, getGithubOAuthUrl } from '../api/auth';

export default function Settings() {
  const { developer } = useAuth();
  const [name, setName] = useState(developer?.name ?? '');
  const [email, setEmail] = useState(developer?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const profileMutation = useMutation({
    mutationFn: () =>
      apiClient<void>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, email }),
      }),
    onSuccess: () => {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      apiClient<void>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient<void>('/auth/me', { method: 'DELETE' }),
    onSuccess: () => {
      window.location.href = '/login';
    },
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6">
      <div className="border border-outline-variant bg-surface-container p-6">
        <h3 className="mb-5 font-heading text-sm font-semibold text-on-surface">Profile</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            profileMutation.mutate();
          }}
          className="space-y-4"
        >
          {profileMutation.error && (
            <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {profileMutation.error instanceof Error
                ? profileMutation.error.message
                : 'Failed to update'}
            </div>
          )}
          {profileSuccess && (
            <div className="border border-tertiary/30 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
              Profile updated
            </div>
          )}

          <div>
            <label
              htmlFor="settings-name"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              NAME
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="settings-email"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              EMAIL
            </label>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
          >
            {profileMutation.isPending ? 'SAVING...' : 'SAVE PROFILE'}
          </button>
        </form>
      </div>

      <div className="border border-outline-variant bg-surface-container p-6">
        <h3 className="mb-5 font-heading text-sm font-semibold text-on-surface">Change Password</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            passwordMutation.mutate();
          }}
          className="space-y-4"
        >
          {passwordMutation.error && (
            <div className="border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {passwordMutation.error instanceof Error
                ? passwordMutation.error.message
                : 'Failed to change password'}
            </div>
          )}
          {passwordSuccess && (
            <div className="border border-tertiary/30 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
              Password changed
            </div>
          )}

          <div>
            <label
              htmlFor="current-pw"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              CURRENT PASSWORD
            </label>
            <input
              id="current-pw"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="new-pw"
              className="mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.05em] text-outline uppercase"
            >
              NEW PASSWORD
            </label>
            <input
              id="new-pw"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 w-full max-w-sm border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none transition-colors duration-150 focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={passwordMutation.isPending}
            className="h-10 bg-primary px-5 font-heading text-[13px] font-semibold tracking-[0.05em] text-surface uppercase transition-colors duration-150 hover:brightness-110 disabled:opacity-30"
          >
            {passwordMutation.isPending ? 'CHANGING...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </div>

      <div className="border border-outline-variant bg-surface-container p-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-on-surface">
          Connected Accounts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Google</span>
            <a
              href={getGoogleOAuthUrl()}
              className="flex h-8 items-center border border-outline-variant px-3 text-xs text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
            >
              Link
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">GitHub</span>
            <a
              href={getGithubOAuthUrl()}
              className="flex h-8 items-center border border-outline-variant px-3 text-xs text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
            >
              Link
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-error/30 bg-surface-container p-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-error">Danger Zone</h3>
        <p className="mb-4 text-sm text-outline">
          Permanently delete your account and all associated data.
        </p>
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="h-10 bg-error px-5 text-sm font-medium text-surface transition-colors duration-150 hover:bg-error/90 disabled:opacity-30"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex h-10 items-center border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex h-10 items-center border border-error/30 px-4 text-sm text-error transition-colors duration-150 hover:bg-error/10"
          >
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
