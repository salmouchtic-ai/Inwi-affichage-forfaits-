import type { Variant } from '../types';

/**
 * Base produit reconstruite exclusivement à partir des données fournies et
 * validées le 17/08/2026 (16 offres/variantes, 9 paliers tarifaires,
 * 4 familles : Max Réseaux Sociaux, Max Internet, Max Appels, Illimités).
 *
 * Aucune caractéristique n'est inventée. Un champ absent de la source
 * (SMS, engagement/durée d'engagement) n'apparaît pas dans ce modèle plutôt
 * que d'être complété par une valeur par défaut.
 *
 * L'ordre des entrées suit celui de la source (par famille, puis par prix
 * croissant) : c'est aussi l'ordre par défaut d'affichage des variantes à
 * l'intérieur d'un même palier.
 */
export const VARIANTS: Variant[] = [
  // ---- MAX RÉSEAUX SOCIAUX ----
  {
    id: 'social-49',
    price: 49,
    family: 'social',
    dataGB: 2,
    callsLabel: '1h national',
    callsHours: 1,
    callsBonus: 'Appels illimités vers les numéros Inwi après épuisement du solde appels',
    socialBenefit:
      'Réseaux sociaux illimités après épuisement du solde internet : Facebook, Messenger, Instagram, WhatsApp, Snapchat et X',
    hasInternationalCalls: false,
    otherBenefits: [],
  },
  {
    id: 'social-99',
    price: 99,
    family: 'social',
    dataGB: 15,
    callsLabel: '2h national',
    callsHours: 2,
    callsBonus: 'Appels illimités vers les numéros Inwi après épuisement du solde appels',
    socialBenefit: 'Réseaux sociaux illimités après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
  },

  // ---- MAX INTERNET ----
  {
    id: 'internet-49',
    price: 49,
    family: 'internet',
    dataGB: 11,
    callsLabel: '1h national',
    callsHours: 1,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
  },
  {
    id: 'internet-99-a',
    price: 99,
    family: 'internet',
    dataGB: 18,
    callsLabel: '5h national',
    callsHours: 5,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
    variantNote: '18 Go',
  },
  {
    id: 'internet-99-b',
    price: 99,
    family: 'internet',
    dataGB: 30,
    callsLabel: '1h national',
    callsHours: 1,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
    variantNote: '30 Go',
  },
  {
    id: 'internet-119',
    price: 119,
    family: 'internet',
    dataGB: 35,
    callsLabel: '2h national et international',
    callsHours: 2,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: true,
    otherBenefits: ['Compatible 4G/5G'],
  },
  {
    id: 'internet-149',
    price: 149,
    family: 'internet',
    dataGB: 40,
    callsLabel: '4h national',
    callsHours: 4,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
  },
  {
    id: 'internet-199',
    price: 199,
    family: 'internet',
    dataGB: 55,
    callsLabel: '5h national',
    callsHours: 5,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    roamingDataGB: 1,
    otherBenefits: [],
  },

  // ---- MAX APPELS ----
  {
    id: 'appels-49',
    price: 49,
    family: 'appels',
    dataGB: 2,
    callsLabel: '4h national',
    callsHours: 4,
    callsBonus: 'Appels illimités vers les numéros Inwi après épuisement du solde appels',
    hasInternationalCalls: false,
    otherBenefits: [],
  },
  {
    id: 'appels-99',
    price: 99,
    family: 'appels',
    dataGB: 12,
    callsLabel: '12h national',
    callsHours: 12,
    callsBonus: 'Appels illimités vers les numéros Inwi après épuisement du solde appels',
    hasInternationalCalls: false,
    otherBenefits: [],
  },
  {
    id: 'appels-149',
    price: 149,
    family: 'appels',
    dataGB: 18,
    callsLabel: '18h',
    callsHours: 18,
    callsBonus: 'Appels illimités vers les numéros Inwi après épuisement du solde appels',
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: [],
  },

  // ---- ILLIMITÉS ----
  {
    id: 'illimite-199',
    price: 199,
    family: 'illimite',
    dataGB: 35,
    callsLabel: 'Illimités national',
    callsHours: null,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    otherBenefits: ['50 DH offerts'],
  },
  {
    id: 'illimite-249',
    price: 249,
    family: 'illimite',
    dataGB: 60,
    callsLabel: 'Illimités national',
    callsHours: null,
    socialBenefit: 'WhatsApp illimité après épuisement du solde internet',
    hasInternationalCalls: false,
    roamingDataGB: 2,
    otherBenefits: ['6 mois de streaming TOD offerts'],
  },
  {
    id: 'illimite-349',
    price: 349,
    family: 'illimite',
    dataGB: 75,
    callsLabel: 'Illimités national et international Zone 1',
    callsHours: null,
    hasInternationalCalls: true,
    roamingDataGB: 2,
    roamingCallsHours: 1,
    otherBenefits: ['6 mois de streaming TOD offerts'],
  },
  {
    id: 'illimite-549',
    price: 549,
    family: 'illimite',
    dataGB: 125,
    callsLabel: 'Illimités national et international Zone 1',
    callsHours: null,
    hasInternationalCalls: true,
    roamingDataGB: 3,
    roamingCallsHours: 2,
    otherBenefits: ['6 mois de streaming TOD offerts'],
  },
  {
    id: 'illimite-649',
    price: 649,
    family: 'illimite',
    dataGB: 150,
    callsLabel: 'Illimités national et international Zone 1',
    callsHours: null,
    hasInternationalCalls: true,
    roamingDataGB: 6,
    roamingCallsHours: 3,
    otherBenefits: ['6 mois de streaming TOD offerts'],
  },
];

/** Regroupe une liste de variantes par palier de prix, en conservant l'ordre source. */
export function groupVariantsByTier(variants: Variant[]): { price: number; variants: Variant[] }[] {
  const sorted = [...variants].sort((a, b) => a.price - b.price); // tri stable : conserve l'ordre par famille
  const map = new Map<number, Variant[]>();
  for (const v of sorted) {
    if (!map.has(v.price)) map.set(v.price, []);
    map.get(v.price)!.push(v);
  }
  return Array.from(map.entries()).map(([price, vs]) => ({ price, variants: vs }));
}
