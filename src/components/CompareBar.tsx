import type { Plan } from '../types';
import { IconClose } from './Icons';

type CompareBarProps = {
  plans: Plan[];
  onOpenCompare: () => void;
  onRemove: (id: string) => void;
};

export function CompareBar({ plans, onOpenCompare, onRemove }: CompareBarProps) {
  if (plans.length < 2) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-ink-100 bg-white px-4 py-3 shadow-[0_8px_30px_rgba(20,10,30,0.12)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {plans.map((plan) => (
            <span
              key={plan.id}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-50 py-1 pl-3 pr-1.5 text-sm font-medium text-ink-700"
            >
              {plan.name}
              <button
                type="button"
                onClick={() => onRemove(plan.id)}
                aria-label={`Retirer ${plan.name} du comparateur`}
                className="rounded-full p-0.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm font-medium text-ink-500">{plans.length} forfaits sélectionnés</p>
          <button
            type="button"
            onClick={onOpenCompare}
            className="rounded-full bg-inwi-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
          >
            Comparer
          </button>
        </div>
      </div>
    </div>
  );
}
