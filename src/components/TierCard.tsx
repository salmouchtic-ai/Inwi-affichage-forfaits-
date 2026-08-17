import { useEffect, useState } from 'react';
import type { Family, UsageTag, Variant } from '../types';
import { FAMILY_LABELS, variantDisplayName } from '../types';
import { callsShortValue, compactBenefits, pickDefaultVariant } from '../lib/variantDisplay';
import { IconCall, IconCheck, IconChat, IconCompare, IconGift, IconGlobe } from './Icons';

const SHORT_FAMILY_LABELS: Record<Family, string> = {
  social: 'RS',
  internet: 'Internet',
  appels: 'Appels',
  illimite: 'Illimité',
};

function gridHeaderLabel(v: Variant): string {
  // Avec une note de variante (2 offres de même famille au même prix), la note
  // seule suffit à distinguer les colonnes : la famille est déjà rappelée
  // sous la grille pour la colonne active, pas besoin de la répéter ici où
  // la place est comptée (jusqu'à 4 colonnes sur une carte mobile).
  return v.variantNote ?? SHORT_FAMILY_LABELS[v.family];
}

function BenefitIcon({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const className = 'h-3.5 w-3.5 text-inwi-600';
  if (lower.includes('réseaux sociaux') || lower.includes('whatsapp')) return <IconChat className={className} />;
  if (lower.includes('international') || lower.includes('roaming')) return <IconGlobe className={className} />;
  if (lower.includes('appel')) return <IconCall className={className} />;
  return <IconGift className={className} />;
}

type TierCardProps = {
  variants: Variant[];
  selectedIds: string[];
  canSelectMore: boolean;
  onToggleCompare: (id: string) => void;
  onChoose: (variant: Variant) => void;
  usageFilter: UsageTag | null;
};

export function TierCard({ variants, selectedIds, canSelectMore, onToggleCompare, onChoose, usageFilter }: TierCardProps) {
  const [selectedId, setSelectedId] = useState(() => pickDefaultVariant(variants, usageFilter).id);

  // Quand le filtre d'usage change, on remet en avant la variante la plus
  // pertinente pour ce nouvel usage. Un changement de budget seul, ou une
  // sélection manuelle de l'utilisateur, ne sont pas écrasés.
  useEffect(() => {
    setSelectedId(pickDefaultVariant(variants, usageFilter).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageFilter]);

  const active = variants.find((v) => v.id === selectedId) ?? variants[0];
  const isSelected = selectedIds.includes(active.id);
  const isMultiVariant = variants.length > 1;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-4 transition-shadow hover:shadow-[0_4px_20px_rgba(20,10,30,0.06)] ${
        isSelected ? 'border-inwi-400 ring-1 ring-inwi-400' : 'border-ink-100'
      }`}
    >
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold tracking-tight text-ink-900">{active.price}</span>
        <span className="text-sm font-semibold text-ink-900">DH</span>
        <span className="text-xs text-ink-500">/mois</span>
      </div>

      {isMultiVariant ? (
        <div className="mt-3 overflow-x-auto border-t border-ink-100 pt-3">
          <table className="w-full min-w-[220px] table-fixed border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-12" />
                {variants.map((v) => (
                  <th key={v.id} className="px-0.5 pb-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedId(v.id)}
                      aria-pressed={v.id === active.id}
                      className={`w-full rounded-md px-1 py-1 text-[11px] font-semibold leading-tight transition-colors ${
                        v.id === active.id ? 'bg-inwi-600 text-white' : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                      }`}
                    >
                      {gridHeaderLabel(v)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="pr-1 text-left text-[11px] font-medium text-ink-500">Data</th>
                {variants.map((v) => (
                  <td
                    key={v.id}
                    className={`px-0.5 py-1 text-center text-sm ${
                      v.id === active.id ? 'font-bold text-inwi-600' : 'text-ink-400'
                    }`}
                  >
                    {v.dataGB} Go
                  </td>
                ))}
              </tr>
              <tr>
                <th className="pr-1 text-left text-[11px] font-medium text-ink-500">Appels</th>
                {variants.map((v) => (
                  <td
                    key={v.id}
                    className={`px-0.5 py-1 text-center text-sm ${
                      v.id === active.id ? 'font-bold text-inwi-600' : 'text-ink-400'
                    }`}
                  >
                    {callsShortValue(v)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs font-semibold text-inwi-600">{variantDisplayName(active)}</p>
        </div>
      ) : (
        <div className="mt-3 border-t border-ink-100 pt-3">
          <p className="text-xs font-semibold text-inwi-600">{FAMILY_LABELS[active.family]}</p>
          <p className="mt-1 text-lg font-bold text-inwi-600">{active.dataGB} Go</p>
          <p className="text-sm font-medium text-ink-700">{active.callsLabel}</p>
        </div>
      )}

      <ul className="mt-2 space-y-1.5">
        {compactBenefits(active, 2).map((benefit) => (
          <li key={benefit} className="flex items-start gap-1.5 text-xs leading-snug text-ink-700">
            <span className="mt-0.5">
              <BenefitIcon text={benefit} />
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => onChoose(active)}
          className="w-full rounded-full bg-inwi-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
        >
          Choisir ce forfait
        </button>
        <button
          type="button"
          onClick={() => onToggleCompare(active.id)}
          disabled={!isSelected && !canSelectMore}
          className={`flex w-full items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-semibold transition-colors ${
            isSelected
              ? 'border-inwi-600 bg-inwi-50 text-inwi-600'
              : canSelectMore
                ? 'border-ink-200 text-ink-700 hover:border-inwi-600 hover:text-inwi-600'
                : 'cursor-not-allowed border-ink-100 text-ink-300'
          }`}
        >
          {isSelected ? (
            <>
              <IconCheck className="h-3.5 w-3.5" /> Ajouté au comparateur
            </>
          ) : (
            <>
              <IconCompare className="h-3.5 w-3.5" /> Comparer
            </>
          )}
        </button>
      </div>
    </article>
  );
}
