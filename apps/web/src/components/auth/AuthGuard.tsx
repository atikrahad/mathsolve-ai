'use client';

import { useAuthStore } from '@/store/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showWhenAuthenticated?: boolean;
}

/**
 * A simple component that shows/hides content based on authentication status
 * Useful for showing different UI elements to authenticated vs non-authenticated users
 */
export default function AuthGuard({
  children,
  fallback = null,
  showWhenAuthenticated = true,
}: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();

  const shouldShow = showWhenAuthenticated ? isAuthenticated : !isAuthenticated;

  return shouldShow ? <>{children}</> : <>{fallback}</>;
}
