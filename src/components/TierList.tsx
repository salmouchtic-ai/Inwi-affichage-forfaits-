import type { Variant } from '../types';
import { groupVariantsByTier } from '../data/plans';
import { TierCard } from './TierCard';

type TierListProps = {
  variants: Variant[];
  selectedIds: string[];
  maxSelection: number;
  onToggleCompare: (id: string) => void;
  onChoose: (variant: Variant) => void;
};

export function TierList({ variants, selectedIds, maxSelection, onToggleCompare, onChoose }: TierListProps) {
  const tiers = groupVariantsByTier(variants);

  if (tiers.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
        <p className="text-base font-medium text-ink-700">Aucune offre ne correspond à ces critères.</p>
        <p className="mt-1 text-sm text-ink-500">Essayez d’élargir votre sélection de filtres.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
      {tiers.map((tier) => (
        <TierCard
          key={tier.price}
          variants={tier.variants}
          selectedIds={selectedIds}
          canSelectMore={selectedIds.length < maxSelection}
          onToggleCompare={onToggleCompare}
          onChoose={onChoose}
        />
      ))}
    </div>
  );
}
