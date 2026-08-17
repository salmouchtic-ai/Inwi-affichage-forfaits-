import type { Variant } from '../types';

/** Résumé des avantages international/roaming réellement inclus, texte construit
 * uniquement à partir de champs structurés issus de la source (aucune valeur inventée). */
export function internationalSummary(v: Variant): string[] {
  const parts: string[] = [];
  if (v.hasInternationalCalls) parts.push('Appels inclus vers l’international Zone 1');
  if (v.roamingDataGB !== undefined) parts.push(`${v.roamingDataGB} Go de roaming internet Zone 1`);
  if (v.roamingCallsHours !== undefined) parts.push(`${v.roamingCallsHours}h de roaming appels`);
  return parts;
}

/** Avantages secondaires condensés pour l'affichage carte, dans un ordre de pertinence fixe. */
export function compactBenefits(v: Variant, max = 2): string[] {
  const items: string[] = [];
  if (v.socialBenefit) items.push(v.socialBenefit);
  if (v.callsBonus) items.push(v.callsBonus);
  items.push(...internationalSummary(v));
  items.push(...v.otherBenefits);
  return items.slice(0, max);
}

/** Valeur interne uniquement (jamais affichée) pour trier/scorer les appels illimités comme "au-dessus" de tout volume fini. */
export const UNLIMITED_CALLS_SORT_VALUE = 999;

export function callsSortValue(v: Variant): number {
  return v.callsHours ?? UNLIMITED_CALLS_SORT_VALUE;
}
