import { useEffect } from 'react';
import type { Plan } from '../types';
import { IconClose } from './Icons';

type CompareModalProps = {
  plans: Plan[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onChoose: (plan: Plan) => void;
};

type Row = {
  label: string;
  render: (plan: Plan) => string;
  highlight?: (plan: Plan, plans: Plan[]) => boolean;
};

const rows: Row[] = [
  {
    label: 'Prix mensuel',
    render: (plan) => `${plan.price} DH/mois`,
    highlight: (plan, plans) => plan.price === Math.min(...plans.map((p) => p.price)),
  },
  {
    label: 'Data',
    render: (plan) => `${plan.dataGB} Go`,
    highlight: (plan, plans) => plan.dataGB === Math.max(...plans.map((p) => p.dataGB)),
  },
  { label: 'Appels', render: (plan) => plan.calls },
  { label: 'SMS', render: (plan) => plan.sms },
  { label: 'Réseaux sociaux', render: (plan) => plan.social },
  {
    label: 'International',
    render: (plan) => plan.international,
    highlight: (plan) => plan.international !== 'Non inclus',
  },
  {
    label: 'Engagement',
    render: (plan) => plan.commitment,
    highlight: (plan) => plan.commitment === 'Sans engagement',
  },
  { label: 'Avantages inclus', render: (plan) => plan.benefits.join(' · ') },
];

export function CompareModal({ plans, onClose, onRemove, onChoose }: CompareModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-ink-900">Comparer les forfaits</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le comparateur"
            className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-auto px-5 py-4 sm:px-6">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-36 bg-white pb-4 text-left align-bottom text-xs font-medium uppercase tracking-wide text-ink-500">
                  &nbsp;
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="min-w-[160px] bg-white px-3 pb-4 text-left align-bottom">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{plan.name}</p>
                        <p className="mt-0.5 text-xl font-extrabold text-ink-900">
                          {plan.price} <span className="text-sm font-medium text-ink-500">DH/mois</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(plan.id)}
                        aria-label={`Retirer ${plan.name}`}
                        className="rounded-full p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
                      >
                        <IconClose className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-ink-100">
                  <th className="sticky left-0 z-10 w-36 bg-white py-3 pr-3 text-left text-sm font-medium text-ink-500">
                    {row.label}
                  </th>
                  {plans.map((plan) => {
                    const isHighlighted = row.highlight?.(plan, plans) ?? false;
                    return (
                      <td key={plan.id} className="min-w-[160px] bg-white px-3 py-3 align-top text-sm">
                        <span
                          className={
                            isHighlighted
                              ? 'rounded-md bg-inwi-50 px-2 py-1 font-semibold text-inwi-700'
                              : 'text-ink-700'
                          }
                        >
                          {row.render(plan)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-ink-100">
                <th className="sticky left-0 z-10 w-36 bg-white py-4" />
                {plans.map((plan) => (
                  <td key={plan.id} className="min-w-[160px] bg-white px-3 py-4 align-top">
                    <button
                      type="button"
                      onClick={() => onChoose(plan)}
                      className="w-full rounded-full bg-inwi-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
                    >
                      Choisir ce forfait
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
