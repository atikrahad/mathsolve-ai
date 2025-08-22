'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, initializeAuth } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        // Rehydrate the persisted state first
        await useAuthStore.persist.rehydrate();
        // Then initialize auth
        await initializeAuth();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}