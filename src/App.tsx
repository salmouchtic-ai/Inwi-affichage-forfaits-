import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Filters } from './components/Filters';
import type { FiltersState } from './components/Filters';
import { TierList } from './components/TierList';
import { CompareBar } from './components/CompareBar';
import { CompareModal } from './components/CompareModal';
import { Questionnaire } from './components/Questionnaire';
import { Toast } from './components/Toast';
import { VARIANTS, groupVariantsByTier } from './data/plans';
import type { Variant } from './types';
import { getUsageTags, matchesBudget, variantDisplayName } from './types';

const MAX_COMPARE = 3;

function App() {
  const [filters, setFilters] = useState<FiltersState>({ budget: null, usage: null });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [isQuestionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredVariants = useMemo(() => {
    return VARIANTS.filter((variant) => {
      if (filters.budget && !matchesBudget(variant.price, filters.budget)) return false;
      if (filters.usage && !getUsageTags(variant).includes(filters.usage)) return false;
      return true;
    });
  }, [filters]);

  const tierCount = useMemo(() => groupVariantsByTier(filteredVariants).length, [filteredVariants]);

  const compareVariants = useMemo(
    () => compareIds.map((id) => VARIANTS.find((v) => v.id === id)).filter((v): v is Variant => Boolean(v)),
    [compareIds],
  );

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((c) => c !== id);
      if (current.length >= MAX_COMPARE) return current;
      return [...current, id];
    });
  }

  function removeFromCompare(id: string) {
    setCompareIds((current) => current.filter((c) => c !== id));
  }

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  }

  function handleChoose(variant: Variant) {
    showToast(`${variantDisplayName(variant)} sélectionné — ${variant.price} DH/mois`);
    setCompareOpen(false);
    setQuestionnaireOpen(false);
  }

  function scrollToPlans() {
    document.getElementById('forfaits')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />
      <main>
        <Hero onOpenQuestionnaire={() => setQuestionnaireOpen(true)} onSeeAllPlans={scrollToPlans} />
        <Filters value={filters} onChange={setFilters} variantCount={filteredVariants.length} tierCount={tierCount} />
        <TierList
          variants={filteredVariants}
          selectedIds={compareIds}
          maxSelection={MAX_COMPARE}
          onToggleCompare={toggleCompare}
          onChoose={handleChoose}
          usageFilter={filters.usage}
        />
      </main>

      <CompareBar variants={compareVariants} onOpenCompare={() => setCompareOpen(true)} onRemove={removeFromCompare} />

      {isCompareOpen && compareVariants.length > 0 && (
        <CompareModal
          variants={compareVariants}
          onClose={() => setCompareOpen(false)}
          onRemove={removeFromCompare}
          onChoose={handleChoose}
        />
      )}

      {isQuestionnaireOpen && <Questionnaire onClose={() => setQuestionnaireOpen(false)} onChoose={handleChoose} />}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
