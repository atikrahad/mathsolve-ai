'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProblemSolvePageRedirect() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string | undefined;

  useEffect(() => {
    if (problemId) {
      router.replace(`/problems/${problemId}`);
    } else {
      router.replace('/problems');
    }
  }, [problemId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <p className="text-sm text-slate-300">Redirecting you to the unified solve experience...</p>
    </div>
  );
}
