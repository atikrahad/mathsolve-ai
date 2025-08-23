import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - MathSolve AI',
  description: 'Sign in or create an account to access MathSolve AI',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      {/* Navigation back to home */}
      <nav className="absolute top-4 left-4 z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Home
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-500 text-center">
          © 2024 MathSolve AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
