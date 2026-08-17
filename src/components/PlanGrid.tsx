import type { Plan } from '../types';
import { PlanCard } from './PlanCard';

type PlanGridProps = {
  plans: Plan[];
  selectedIds: string[];
  maxSelection: number;
  onToggleCompare: (id: string) => void;
  onChoose: (plan: Plan) => void;
};

export function PlanGrid({ plans, selectedIds, maxSelection, onToggleCompare, onChoose }: PlanGridProps) {
  if (plans.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
        <p className="text-base font-medium text-ink-700">Aucun forfait ne correspond à ces critères.</p>
        <p className="mt-1 text-sm text-ink-500">Essayez d’élargir votre sélection de filtres.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isSelected={selectedIds.includes(plan.id)}
          canSelect={selectedIds.length < maxSelection}
          onToggleCompare={onToggleCompare}
          onChoose={onChoose}
        />
      ))}
    </div>
  );
}
