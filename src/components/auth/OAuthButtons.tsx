import { getGoogleOAuthUrl, getGithubOAuthUrl } from '../../api/auth';

export default function OAuthButtons() {
  return (
    <div className="space-y-3">
      <a
        href={getGoogleOAuthUrl()}
        className="flex h-11 w-full items-center justify-center gap-2.5 border border-outline-variant bg-transparent px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
      >
        <GoogleIcon />
        Continue with Google
      </a>
      <a
        href={getGithubOAuthUrl()}
        className="flex h-11 w-full items-center justify-center gap-2.5 border border-outline-variant bg-transparent px-4 text-sm text-on-surface-variant transition-colors duration-150 hover:bg-surface-bright"
      >
        <GithubIcon />
        Continue with GitHub
      </a>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 3.3c1.2 0 2.2.4 3 1.2l2.2-2.2C11.8.9 10 0 8 0 4.9 0 2.2 1.8.8 4.4l2.6 2C4 4.5 5.8 3.3 8 3.3z" />
      <path d="M15.6 8.2c0-.6-.1-1.2-.2-1.8H8v3.4h4.3c-.2 1-.7 1.8-1.5 2.4l2.5 1.9c1.4-1.3 2.3-3.3 2.3-5.9z" />
      <path d="M3.4 9.6c-.2-.6-.3-1-.3-1.6s.1-1.1.3-1.6L.8 4.4C.3 5.5 0 6.7 0 8s.3 2.5.8 3.6l2.6-2z" />
      <path d="M8 16c2 0 3.8-.7 5.1-1.8l-2.5-1.9c-.7.5-1.6.7-2.6.7-2.2 0-4-1.5-4.6-3.4l-2.6 2C2.2 14.2 4.9 16 8 16z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
