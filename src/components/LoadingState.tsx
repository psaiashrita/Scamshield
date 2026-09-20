import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Analyzing…' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-10 h-10 text-blue-900 animate-spin" />
      <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Checking for warning signs and risk indicators</p>
    </div>
  );
}
