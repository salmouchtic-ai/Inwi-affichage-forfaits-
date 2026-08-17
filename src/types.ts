export type Badge = 'popular' | 'budget' | 'data' | 'travel';

export type UsageTag = 'internet' | 'social' | 'calls' | 'international';

export type DataProfile = 'essential' | 'comfort' | 'intensive';

export interface Plan {
  id: string;
  name: string;
  price: number;
  dataGB: number;
  calls: string;
  sms: string;
  social: string;
  international: string;
  commitment: string;
  badge?: Badge;
  usageTags: UsageTag[];
  dataProfile: DataProfile;
  benefits: string[];
}

export const BADGE_LABELS: Record<Badge, string> = {
  popular: 'Le plus choisi',
  budget: 'Petit budget',
  data: 'Max data',
  travel: 'Pour voyager',
};

export type BudgetRange = 'under100' | '100to200' | '200to300' | 'over300';

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under100: 'Moins de 100 DH',
  '100to200': '100 à 200 DH',
  '200to300': '200 à 300 DH',
  over300: '300 DH et +',
};

export const USAGE_LABELS: Record<UsageTag, string> = {
  internet: 'Internet',
  social: 'Réseaux sociaux',
  calls: 'Appels',
  international: 'International',
};

export const DATA_PROFILE_LABELS: Record<DataProfile, string> = {
  essential: 'Essentielle',
  comfort: 'Confort',
  intensive: 'Intensive',
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
