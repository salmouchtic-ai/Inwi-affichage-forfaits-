/**
 * Modèle produit basé exclusivement sur les données réelles fournies
 * (4 familles inwi : Max Réseaux Sociaux, Max Internet, Max Appels, Illimités).
 * Aucune caractéristique n'est déduite ou inventée : un champ absent de la
 * source (ex. SMS, engagement) n'existe simplement pas dans ce modèle.
 */

export type Family = 'social' | 'internet' | 'appels' | 'illimite';

export const FAMILY_LABELS: Record<Family, string> = {
  social: 'Max Réseaux Sociaux',
  internet: 'Max Internet',
  appels: 'Max Appels',
  illimite: 'Illimités',
};

/** Ordre d'affichage des familles à l'intérieur d'un même palier (ordre de la source). */
export const FAMILY_ORDER: Record<Family, number> = {
  social: 0,
  internet: 1,
  appels: 2,
  illimite: 3,
};

export interface Variant {
  id: string;
  price: number;
  family: Family;
  dataGB: number;
  /** Texte exact de l'allocation d'appels tel que fourni dans la source. */
  callsLabel: string;
  /** Nombre d'heures pour tri/score interne ; null = illimité. Jamais affiché tel quel. */
  callsHours: number | null;
  /** Avantage "après épuisement du solde appels", texte exact si présent. */
  callsBonus?: string;
  /** Avantage réseaux sociaux / WhatsApp, texte exact si présent. */
  socialBenefit?: string;
  hasInternationalCalls: boolean;
  roamingDataGB?: number;
  roamingCallsHours?: number;
  /** Avantages restants non couverts par les champs ci-dessus, texte exact. */
  otherBenefits: string[];
  /** Note de désambiguïsation pour 2 variantes de même famille au même prix (ex. "18 Go"). */
  variantNote?: string;
}

export function variantDisplayName(v: Variant): string {
  return v.variantNote ? `${FAMILY_LABELS[v.family]} (${v.variantNote})` : FAMILY_LABELS[v.family];
}

export type UsageTag = 'internet' | 'social' | 'appels' | 'international';

export const USAGE_LABELS: Record<UsageTag, string> = {
  internet: 'Internet',
  social: 'Réseaux sociaux',
  appels: 'Appels',
  international: 'International',
};

/**
 * Tags d'usage dérivés mécaniquement des caractéristiques réelles de la variante :
 * - internet : familles Max Internet et Illimités (data comme proposition de valeur centrale)
 * - social : famille Max Réseaux Sociaux (accès social illimité comme proposition centrale)
 * - appels : familles Max Appels et Illimités (volume d'appels élevé/illimité)
 * - international : appels international et/ou roaming réellement inclus
 */
export function getUsageTags(v: Variant): UsageTag[] {
  const tags: UsageTag[] = [];
  if (v.family === 'internet' || v.family === 'illimite') tags.push('internet');
  if (v.family === 'social') tags.push('social');
  if (v.family === 'appels' || v.family === 'illimite') tags.push('appels');
  if (v.hasInternationalCalls || v.roamingDataGB !== undefined || v.roamingCallsHours !== undefined) {
    tags.push('international');
  }
  return tags;
}

export type BudgetRange = 'under100' | '100to200' | '200to300' | 'over300';

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under100: 'Moins de 100 DH',
  '100to200': '100 à 200 DH',
  '200to300': '200 à 300 DH',
  over300: '300 DH et +',
};

export function matchesBudget(price: number, range: BudgetRange): boolean {
  switch (range) {
    case 'under100':
      return price < 100;
    case '100to200':
      return price >= 100 && price <= 200;
    case '200to300':
      return price > 200 && price <= 300;
    case 'over300':
      return price > 300;
  }
}

/**
 * Regroupement UX interne (non affiché comme nom commercial) utilisé uniquement
 * pour la question 3 du questionnaire ("consommation internet"). Bornes choisies
 * pour répartir équitablement les 17 valeurs de data réellement observées (2 à 150 Go).
 */
export type DataProfile = 'essential' | 'comfort' | 'intensive';

export function getDataProfile(dataGB: number): DataProfile {
  if (dataGB < 15) return 'essential';
  if (dataGB <= 40) return 'comfort';
  return 'intensive';
}
