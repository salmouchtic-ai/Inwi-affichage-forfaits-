import type { BudgetRange, DataProfile, Variant } from '../types';
import { FAMILY_LABELS, getDataProfile, matchesBudget } from '../types';
import { VARIANTS } from '../data/plans';
import { callsSortValue } from './variantDisplay';

export type QBudget = 'under100' | '100to200' | '200to300' | 'any';
export type QUsage = 'social' | 'streaming' | 'calls' | 'mixed';
export type QData = 'light' | 'medium' | 'intensive';

export type Answers = {
  budget?: QBudget;
  usage?: QUsage;
  data?: QData;
};

function mapBudget(value?: QBudget): BudgetRange | null {
  if (!value || value === 'any') return null;
  return value;
}

function mapDataLevel(value?: QData): DataProfile {
  switch (value) {
    case 'light':
      return 'essential';
    case 'intensive':
      return 'intensive';
    default:
      return 'comfort';
  }
}

/**
 * Score une variante pour un usage donné, à l'intérieur d'un pool de candidats.
 * Les valeurs data/appels sont normalisées par rapport au maximum du pool pour
 * que "mixed" pondère réellement les deux dimensions au lieu de suivre
 * mécaniquement celle qui a la plus grande amplitude numérique (Go vs heures).
 * Corrige le biais identifié : un usage "appels" doit toujours privilégier la
 * variante offrant le plus d'heures (ou l'illimité) dans le budget donné.
 */
function scoreVariant(pool: Variant[], v: Variant, usage: QUsage, dataLevel: QData): number {
  const maxData = Math.max(...pool.map((p) => p.dataGB));
  const maxCalls = Math.max(...pool.map((p) => callsSortValue(p)));
  const dataNorm = maxData > 0 ? v.dataGB / maxData : 0;
  const callsNorm = maxCalls > 0 ? callsSortValue(v) / maxCalls : 0;
  const profileMatches = getDataProfile(v.dataGB) === mapDataLevel(dataLevel);

  // Pour un usage à axe unique (appels / social / streaming), la question 2
  // domine : elle exprime un besoin fort et sans ambiguïté. La question 3
  // (consommation) n'agit alors que comme un petit départage.
  //
  // Pour "un peu de tout", il n'y a par définition pas d'axe dominant : c'est
  // la question 3 qui doit porter l'essentiel du choix, faute de quoi le
  // score (data + appels) pousse mécaniquement vers l'offre la plus généreuse
  // dès que le budget est libre, même pour une consommation déclarée légère.
  switch (usage) {
    case 'calls':
      return callsNorm * 100 + (profileMatches ? 10 : 0);
    case 'social':
      return (v.family === 'social' ? 1000 : 0) + dataNorm * 10 + (profileMatches ? 5 : 0);
    case 'streaming':
      return dataNorm * 100 + (profileMatches ? 10 : 0);
    case 'mixed':
    default:
      return (profileMatches ? 60 : 0) + (dataNorm + callsNorm) * 10;
  }
}

function bestOf(pool: Variant[], usage: QUsage, dataLevel: QData): Variant {
  return [...pool]
    .sort((a, b) => scoreVariant(pool, b, usage, dataLevel) - scoreVariant(pool, a, usage, dataLevel) || a.price - b.price)
    [0];
}

/** Explique la différence entre deux variantes à partir de leurs champs réels uniquement. */
export function explainDelta(base: Variant, alt: Variant): string {
  const parts: string[] = [];

  if (alt.dataGB > base.dataGB) parts.push(`+${alt.dataGB - base.dataGB} Go`);
  else if (alt.dataGB < base.dataGB) parts.push(`-${base.dataGB - alt.dataGB} Go`);

  const baseCalls = base.callsHours;
  const altCalls = alt.callsHours;
  if (baseCalls !== null && altCalls === null) parts.push('appels illimités');
  else if (baseCalls === null && altCalls !== null) parts.push(`${altCalls}h d’appels au lieu d’illimité`);
  else if (baseCalls !== null && altCalls !== null && altCalls > baseCalls) parts.push(`+${altCalls - baseCalls}h d’appels`);
  else if (baseCalls !== null && altCalls !== null && altCalls < baseCalls) parts.push(`-${baseCalls - altCalls}h d’appels`);

  if (!base.socialBenefit && alt.socialBenefit) parts.push('réseaux sociaux/WhatsApp inclus');
  if (!base.hasInternationalCalls && alt.hasInternationalCalls) parts.push('appels international inclus');
  if (base.roamingDataGB === undefined && alt.roamingDataGB !== undefined) parts.push('roaming data inclus');

  return parts.length ? `→ ${parts.join(', ')}` : '';
}

export function buildJustification(v: Variant, usage: QUsage): string {
  switch (usage) {
    case 'calls':
      return v.callsHours === null
        ? 'Vous privilégiez les appels : cette offre inclut des appels illimités, la meilleure option pour la voix à ce budget.'
        : `Vous privilégiez les appels : ${FAMILY_LABELS[v.family]} offre le plus d’heures disponibles à ce prix (${v.callsLabel}).`;
    case 'social':
      if (v.family === 'social') {
        return 'Vous privilégiez les réseaux sociaux : cette variante donne un accès illimité aux réseaux sociaux à ce prix.';
      }
      // Aucune offre Max Réseaux Sociaux dans ce budget : on reste honnête sur ce qui est réellement inclus.
      return v.socialBenefit
        ? `Vous privilégiez les réseaux sociaux, mais aucune offre Max Réseaux Sociaux n’est disponible à ce budget. Cette variante inclut au moins : ${v.socialBenefit}.`
        : `Vous privilégiez les réseaux sociaux, mais aucune offre Max Réseaux Sociaux n’est disponible à ce budget. Cette variante offre le plus de data (${v.dataGB} Go) pour compenser.`;
    case 'streaming':
      return `Vous privilégiez internet : cette variante offre le plus de data disponible à ce prix (${v.dataGB} Go).`;
    case 'mixed':
    default:
      return `Un bon équilibre entre data et appels pour un usage varié : ${v.dataGB} Go et ${v.callsLabel.toLowerCase()}.`;
  }
}

export type Recommendation = {
  top: Variant;
  sameTierAlt: Variant | null;
  upgradeAlt: Variant | null;
  usage: QUsage;
};

export function computeRecommendation(answers: Answers): Recommendation {
  const budgetRange = mapBudget(answers.budget);
  const usage: QUsage = answers.usage ?? 'mixed';
  const dataLevel: QData = answers.data ?? 'medium';

  const pool = budgetRange ? VARIANTS.filter((v) => matchesBudget(v.price, budgetRange)) : VARIANTS.slice();

  const top = bestOf(pool, usage, dataLevel);

  const sameTierPool = pool.filter((v) => v.price === top.price && v.id !== top.id);
  const sameTierAlt = sameTierPool.length ? bestOf(sameTierPool, usage, dataLevel) : null;

  const higherPrices = Array.from(new Set(VARIANTS.filter((v) => v.price > top.price).map((v) => v.price))).sort(
    (a, b) => a - b,
  );
  let upgradeAlt: Variant | null = null;
  if (higherPrices.length > 0) {
    const nextTierPool = VARIANTS.filter((v) => v.price === higherPrices[0]);
    upgradeAlt = bestOf(nextTierPool, usage, dataLevel);
  }

  return { top, sameTierAlt, upgradeAlt, usage };
}
