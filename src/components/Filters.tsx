import type { BudgetRange, DataProfile, UsageTag } from '../types';
import { BUDGET_LABELS, DATA_PROFILE_LABELS, USAGE_LABELS } from '../types';
import { IconFilter } from './Icons';

type FiltersState = {
  budget: BudgetRange | null;
  usage: UsageTag | null;
  dataProfile: DataProfile | null;
};

type FiltersProps = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  resultCount: number;
};

const BUDGET_OPTIONS: BudgetRange[] = ['under100', '100to200', '200to300', 'over300'];
const USAGE_OPTIONS: UsageTag[] = ['internet', 'social', 'calls', 'international'];
const DATA_OPTIONS: DataProfile[] = ['essential', 'comfort', 'intensive'];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-inwi-600 bg-inwi-600 text-white'
          : 'border-ink-200 bg-white text-ink-700 hover:border-inwi-300 hover:text-inwi-600'
      }`}
    >
      {label}
    </button>
  );
}

export function Filters({ value, onChange, resultCount }: FiltersProps) {
  const hasActiveFilters = value.budget || value.usage || value.dataProfile;

  return (
    <section id="forfaits" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:p-5">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <IconFilter className="h-4 w-4" />
          Filtrer les forfaits
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Budget</p>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={BUDGET_LABELS[option]}
                  active={value.budget === option}
                  onClick={() =>
                    onChange({ ...value, budget: value.budget === option ? null : option })
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Mon usage principal</p>
            <div className="flex flex-wrap gap-2">
              {USAGE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={USAGE_LABELS[option]}
                  active={value.usage === option}
                  onClick={() => onChange({ ...value, usage: value.usage === option ? null : option })}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Consommation data</p>
            <div className="flex flex-wrap gap-2">
              {DATA_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={DATA_PROFILE_LABELS[option]}
                  active={value.dataProfile === option}
                  onClick={() =>
                    onChange({ ...value, dataProfile: value.dataProfile === option ? null : option })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-3">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-900">{resultCount}</span>{' '}
            {resultCount > 1 ? 'forfaits correspondent' : 'forfait correspond'} à vos critères
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChange({ budget: null, usage: null, dataProfile: null })}
              className="text-sm font-semibold text-inwi-600 hover:text-inwi-700"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export type { FiltersState };
