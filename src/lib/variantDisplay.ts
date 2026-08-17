import type { UsageTag, Variant } from '../types';

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

/** Valeur courte pour la grille d'arbitrage (pas de texte complet, juste l'ordre de grandeur). */
export function callsShortValue(v: Variant): string {
  return v.callsHours === null ? 'Illimité' : `${v.callsHours}h`;
}

/**
 * Variante à sélectionner par défaut dans un palier, compte tenu du filtre
 * d'usage actif. Sans filtre (ou pour un usage qui ne laisse jamais
 * d'ambiguïté dans ce catalogue), on garde l'ordre de la source. Avec un
 * filtre "Internet"/"Appels" qui matche plusieurs variantes du même palier,
 * on met en avant celle qui maximise réellement cet axe.
 */
export function pickDefaultVariant(variants: Variant[], usage: UsageTag | null): Variant {
  if (usage === 'internet') {
    return variants.reduce((best, v) => (v.dataGB > best.dataGB ? v : best), variants[0]);
  }
  if (usage === 'appels') {
    return variants.reduce((best, v) => (callsSortValue(v) > callsSortValue(best) ? v : best), variants[0]);
  }
  return variants[0];
}
