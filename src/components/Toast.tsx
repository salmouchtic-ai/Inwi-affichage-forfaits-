import { IconCheck } from './Icons';

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-5 z-[60] -translate-x-1/2">
      <div className="flex animate-[toast-in_0.2s_ease-out] items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
        <IconCheck className="h-4 w-4 text-white" />
        {message}
      </div>
    </div>
  );
}
