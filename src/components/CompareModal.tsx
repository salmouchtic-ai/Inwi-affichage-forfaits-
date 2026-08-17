import { useEffect } from 'react';
import type { Variant } from '../types';
import { variantDisplayName } from '../types';
import { callsSortValue, internationalSummary } from '../lib/variantDisplay';
import { IconClose } from './Icons';

type CompareModalProps = {
  variants: Variant[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onChoose: (variant: Variant) => void;
};

const DASH = '—';

type Row = {
  label: string;
  render: (v: Variant) => string;
  /** true si cette variante doit être mise en évidence sur cette ligne */
  highlight?: (v: Variant, all: Variant[]) => boolean;
};

function bestOfDiffering(v: Variant, all: Variant[], getValue: (x: Variant) => number, pickMax: boolean): boolean {
  const values = all.map(getValue);
  if (new Set(values).size <= 1) return false; // pas de différence réelle sur cette ligne
  const best = pickMax ? Math.max(...values) : Math.min(...values);
  return getValue(v) === best;
}

const rows: Row[] = [
  {
    label: 'Prix',
    render: (v) => `${v.price} DH/mois`,
    highlight: (v, all) => bestOfDiffering(v, all, (p) => p.price, false),
  },
  {
    label: 'Data',
    render: (v) => `${v.dataGB} Go`,
    highlight: (v, all) => bestOfDiffering(v, all, (p) => p.dataGB, true),
  },
  {
    label: 'Appels',
    render: (v) => v.callsLabel + (v.callsBonus ? ` · ${v.callsBonus}` : ''),
    highlight: (v, all) => bestOfDiffering(v, all, callsSortValue, true),
  },
  {
    label: 'Réseaux sociaux / WhatsApp',
    render: (v) => v.socialBenefit ?? DASH,
  },
  {
    label: 'International',
    render: (v) => {
      const parts = internationalSummary(v);
      return parts.length ? parts.join(' · ') : DASH;
    },
  },
  {
    label: 'Autres avantages',
    render: (v) => (v.otherBenefits.length ? v.otherBenefits.join(' · ') : DASH),
  },
];

// Pour les lignes sans règle de "meilleure valeur" objective (social, international,
// autres avantages), on met en évidence les cellules non vides dès que la ligne
// contient au moins une différence entre les variantes comparées.
function isVariableRow(row: Row, variants: Variant[]): boolean {
  if (row.highlight) return false;
  const values = variants.map((v) => row.render(v));
  return new Set(values).size > 1;
}

export function CompareModal({ variants, onClose, onRemove, onChoose }: CompareModalProps) {
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
          <h2 className="text-lg font-bold text-ink-900">Comparer les offres</h2>
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
                <th className="sticky left-0 z-10 w-40 bg-white pb-4 text-left align-bottom text-xs font-medium uppercase tracking-wide text-ink-500">
                  &nbsp;
                </th>
                {variants.map((v) => (
                  <th key={v.id} className="min-w-[180px] bg-white px-3 pb-4 text-left align-bottom">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xl font-extrabold text-ink-900">
                          {v.price} <span className="text-sm font-medium text-ink-500">DH/mois</span>
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-inwi-600">{variantDisplayName(v)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(v.id)}
                        aria-label={`Retirer ${variantDisplayName(v)} ${v.price} DH`}
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
              {rows.map((row) => {
                const variable = isVariableRow(row, variants);
                return (
                  <tr key={row.label} className="border-t border-ink-100">
                    <th className="sticky left-0 z-10 w-40 bg-white py-3 pr-3 text-left text-sm font-medium text-ink-500">
                      {row.label}
                    </th>
                    {variants.map((v) => {
                      const text = row.render(v);
                      const isHighlighted = row.highlight
                        ? row.highlight(v, variants)
                        : variable && text !== DASH;
                      return (
                        <td key={v.id} className="min-w-[180px] bg-white px-3 py-3 align-top text-sm">
                          <span
                            className={
                              isHighlighted
                                ? 'rounded-md bg-inwi-50 px-2 py-1 font-semibold text-inwi-700'
                                : 'text-ink-700'
                            }
                          >
                            {text}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr className="border-t border-ink-100">
                <th className="sticky left-0 z-10 w-40 bg-white py-4" />
                {variants.map((v) => (
                  <td key={v.id} className="min-w-[180px] bg-white px-3 py-4 align-top">
                    <button
                      type="button"
                      onClick={() => onChoose(v)}
                      className="w-full rounded-full bg-inwi-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
                    >
                      Choisir ce forfait
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink-500">— : non précisé dans les données source.</p>
        </div>
      </div>
    </div>
  );
}
