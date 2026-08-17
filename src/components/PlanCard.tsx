import type { Plan } from '../types';
import { BADGE_LABELS } from '../types';
import { IconCall, IconChat, IconCheck, IconCompare, IconData, IconGift, IconGlobe, IconShield, IconSms } from './Icons';

function BenefitIcon({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const className = 'h-4 w-4 text-inwi-600';
  if (lower.includes('appel')) return <IconCall className={className} />;
  if (lower.includes('social') || lower.includes('whatsapp')) return <IconChat className={className} />;
  if (lower.includes('international') || lower.includes('roaming') || lower.includes('pays')) {
    return <IconGlobe className={className} />;
  }
  if (lower.includes('sms')) return <IconSms className={className} />;
  if (lower.includes('go') || lower.includes('data')) return <IconData className={className} />;
  if (lower.includes('assistance') || lower.includes('priorit')) return <IconShield className={className} />;
  return <IconGift className={className} />;
}

const badgeStyles: Record<string, string> = {
  popular: 'bg-inwi-600 text-white',
  budget: 'bg-ink-100 text-ink-700',
  data: 'bg-ink-100 text-ink-700',
  travel: 'bg-ink-100 text-ink-700',
};

type PlanCardProps = {
  plan: Plan;
  isSelected: boolean;
  canSelect: boolean;
  onToggleCompare: (id: string) => void;
  onChoose: (plan: Plan) => void;
};

export function PlanCard({ plan, isSelected, canSelect, onToggleCompare, onChoose }: PlanCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_rgba(20,10,30,0.06)] ${
        isSelected ? 'border-inwi-400 ring-1 ring-inwi-400' : 'border-ink-100'
      }`}
    >
      <div className="mb-3 flex min-h-[22px] items-center justify-between">
        {plan.badge ? (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[plan.badge]}`}>
            {BADGE_LABELS[plan.badge]}
          </span>
        ) : (
          <span />
        )}
      </div>

      <h3 className="text-base font-semibold text-ink-900">{plan.name}</h3>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-ink-900">{plan.price}</span>
        <span className="text-sm font-semibold text-ink-900">DH</span>
        <span className="text-sm text-ink-500">/mois</span>
      </div>

      <p className="mt-1 text-lg font-bold text-inwi-600">{plan.dataGB} Go</p>

      <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
        {plan.benefits.slice(0, 3).map((benefit) => (
          <li key={benefit} className="flex items-center gap-2 text-sm text-ink-700">
            <BenefitIcon text={benefit} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onChoose(plan)}
          className="w-full rounded-full bg-inwi-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
        >
          Choisir ce forfait
        </button>
        <button
          type="button"
          onClick={() => onToggleCompare(plan.id)}
          disabled={!isSelected && !canSelect}
          className={`flex w-full items-center justify-center gap-1.5 rounded-full border py-2 text-sm font-semibold transition-colors ${
            isSelected
              ? 'border-inwi-600 bg-inwi-50 text-inwi-600'
              : canSelect
                ? 'border-ink-200 text-ink-700 hover:border-inwi-600 hover:text-inwi-600'
                : 'cursor-not-allowed border-ink-100 text-ink-300'
          }`}
        >
          {isSelected ? (
            <>
              <IconCheck className="h-4 w-4" /> Ajouté au comparateur
            </>
          ) : (
            <>
              <IconCompare className="h-4 w-4" /> Comparer
            </>
          )}
        </button>
      </div>
    </article>
  );
}
