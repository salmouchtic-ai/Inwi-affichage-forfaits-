import { useMemo, useState } from 'react';
import type { Variant } from '../types';
import { variantDisplayName } from '../types';
import { compactBenefits } from '../lib/variantDisplay';
import type { Answers, QBudget, QData, QUsage } from '../lib/recommendation';
import { buildJustification, computeRecommendation, explainDelta } from '../lib/recommendation';
import { IconArrowRight, IconCheck, IconClose } from './Icons';

type QuestionnaireProps = {
  onClose: () => void;
  onChoose: (variant: Variant) => void;
};

const BUDGET_QUESTIONS: { value: QBudget; label: string }[] = [
  { value: 'under100', label: 'Moins de 100 DH' },
  { value: '100to200', label: '100–200 DH' },
  { value: '200to300', label: '200–300 DH' },
  { value: 'any', label: 'Peu importe' },
];

const USAGE_QUESTIONS: { value: QUsage; label: string }[] = [
  { value: 'social', label: 'Réseaux sociaux' },
  { value: 'streaming', label: 'Vidéos & streaming' },
  { value: 'calls', label: 'Appels' },
  { value: 'mixed', label: 'Un peu de tout' },
];

const DATA_QUESTIONS: { value: QData; label: string }[] = [
  { value: 'light', label: 'Légère' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'intensive', label: 'Intensive' },
];

function OptionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-ink-200 px-4 py-3.5 text-left text-sm font-medium text-ink-900 transition-colors hover:border-inwi-600 hover:bg-inwi-50/50 hover:text-inwi-700"
    >
      {label}
      <IconArrowRight className="h-4 w-4 text-ink-300" />
    </button>
  );
}

function AlternativeCard({
  eyebrow,
  variant,
  deltaText,
  onChoose,
}: {
  eyebrow: string;
  variant: Variant;
  deltaText: string;
  onChoose: (v: Variant) => void;
}) {
  return (
    <div className="rounded-xl border border-ink-100 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{eyebrow}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">
            {variant.price} DH — {variantDisplayName(variant)}
          </p>
          <p className="text-xs text-ink-500">
            {variant.dataGB} Go · {variant.callsLabel}
          </p>
          {deltaText && <p className="mt-0.5 text-xs font-medium text-inwi-600">{deltaText}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChoose(variant)}
          className="shrink-0 rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-900 transition-colors hover:border-inwi-600 hover:text-inwi-600"
        >
          Choisir
        </button>
      </div>
    </div>
  );
}

export function Questionnaire({ onClose, onChoose }: QuestionnaireProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [showAlternatives, setShowAlternatives] = useState(false);

  const result = useMemo(() => (step === 'result' ? computeRecommendation(answers) : null), [step, answers]);

  function restart() {
    setAnswers({});
    setStep(1);
    setShowAlternatives(false);
  }

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          {step !== 1 && step !== 'result' ? (
            <button type="button" onClick={goBack} className="text-sm font-medium text-ink-500 hover:text-ink-900">
              Précédent
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {step !== 'result' && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-500">{step} / 3</p>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">Quel est votre budget mensuel ?</h2>
              <div className="space-y-2">
                {BUDGET_QUESTIONS.map((q) => (
                  <OptionButton
                    key={q.value}
                    label={q.label}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, budget: q.value }));
                      setStep(2);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">Vous utilisez surtout votre téléphone pour…</h2>
              <div className="space-y-2">
                {USAGE_QUESTIONS.map((q) => (
                  <OptionButton
                    key={q.value}
                    label={q.label}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, usage: q.value }));
                      setStep(3);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">Votre consommation internet est plutôt…</h2>
              <div className="space-y-2">
                {DATA_QUESTIONS.map((q) => (
                  <OptionButton
                    key={q.value}
                    label={q.label}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, data: q.value }));
                      setStep('result');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 'result' && result && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-inwi-600">Notre recommandation</p>
              <h2 className="mb-4 text-lg font-bold text-ink-900">
                {result.top.price} DH/mois — {variantDisplayName(result.top)}
              </h2>

              <div className="rounded-2xl border border-inwi-400 bg-inwi-50/40 p-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-ink-900">{result.top.price}</span>
                  <span className="text-sm font-semibold text-ink-900">DH</span>
                  <span className="text-sm text-ink-500">/mois</span>
                </div>
                <p className="mt-1 text-lg font-bold text-inwi-600">{result.top.dataGB} Go</p>
                <p className="text-sm font-medium text-ink-700">{result.top.callsLabel}</p>

                <ul className="mt-3 space-y-1.5">
                  {compactBenefits(result.top, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink-700">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-inwi-600" />
                      {b}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-sm leading-relaxed text-ink-500">{buildJustification(result.top, result.usage)}</p>

                <button
                  type="button"
                  onClick={() => onChoose(result.top)}
                  className="mt-4 w-full rounded-full bg-inwi-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
                >
                  Choisir ce forfait
                </button>
              </div>

              {(result.sameTierAlt || result.upgradeAlt) && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAlternatives((v) => !v)}
                    className="text-sm font-semibold text-inwi-600 hover:text-inwi-700"
                  >
                    {showAlternatives
                      ? 'Masquer les alternatives'
                      : `Voir ${[result.sameTierAlt, result.upgradeAlt].filter(Boolean).length} alternative${
                          [result.sameTierAlt, result.upgradeAlt].filter(Boolean).length > 1 ? 's' : ''
                        }`}
                  </button>
                  <button type="button" onClick={restart} className="text-sm font-medium text-ink-500 hover:text-ink-900">
                    Recommencer
                  </button>
                </div>
              )}
              {!result.sameTierAlt && !result.upgradeAlt && (
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={restart} className="text-sm font-medium text-ink-500 hover:text-ink-900">
                    Recommencer
                  </button>
                </div>
              )}

              {showAlternatives && (
                <div className="mt-3 space-y-2">
                  {result.sameTierAlt && (
                    <AlternativeCard
                      eyebrow="Même budget"
                      variant={result.sameTierAlt}
                      deltaText={explainDelta(result.top, result.sameTierAlt)}
                      onChoose={onChoose}
                    />
                  )}
                  {result.upgradeAlt && (
                    <AlternativeCard
                      eyebrow={`Pour ${result.upgradeAlt.price - result.top.price} DH de plus`}
                      variant={result.upgradeAlt}
                      deltaText={explainDelta(result.top, result.upgradeAlt)}
                      onChoose={onChoose}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
