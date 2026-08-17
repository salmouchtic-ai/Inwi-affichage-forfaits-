import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Filters } from './components/Filters';
import type { FiltersState } from './components/Filters';
import { PlanGrid } from './components/PlanGrid';
import { CompareBar } from './components/CompareBar';
import { CompareModal } from './components/CompareModal';
import { Questionnaire } from './components/Questionnaire';
import { Toast } from './components/Toast';
import { PLANS } from './data/plans';
import type { Plan } from './types';
import { matchesBudget } from './types';

const MAX_COMPARE = 3;

function App() {
  const [filters, setFilters] = useState<FiltersState>({ budget: null, usage: null, dataProfile: null });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [isQuestionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPlans = useMemo(() => {
    return PLANS.filter((plan) => {
      if (filters.budget && !matchesBudget(plan.price, filters.budget)) return false;
      if (filters.usage && !plan.usageTags.includes(filters.usage)) return false;
      if (filters.dataProfile && plan.dataProfile !== filters.dataProfile) return false;
      return true;
    });
  }, [filters]);

  const comparePlans = useMemo(
    () => compareIds.map((id) => PLANS.find((p) => p.id === id)).filter((p): p is Plan => Boolean(p)),
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

  function handleChoose(plan: Plan) {
    showToast(`${plan.name} sélectionné — ${plan.price} DH/mois`);
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
        <Filters value={filters} onChange={setFilters} resultCount={filteredPlans.length} />
        <PlanGrid
          plans={filteredPlans}
          selectedIds={compareIds}
          maxSelection={MAX_COMPARE}
          onToggleCompare={toggleCompare}
          onChoose={handleChoose}
        />
      </main>

      <CompareBar plans={comparePlans} onOpenCompare={() => setCompareOpen(true)} onRemove={removeFromCompare} />

      {isCompareOpen && comparePlans.length > 0 && (
        <CompareModal
          plans={comparePlans}
          onClose={() => setCompareOpen(false)}
          onRemove={removeFromCompare}
          onChoose={handleChoose}
        />
      )}

      {isQuestionnaireOpen && (
        <Questionnaire onClose={() => setQuestionnaireOpen(false)} onChoose={handleChoose} />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
