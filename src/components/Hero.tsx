type HeroProps = {
  onOpenQuestionnaire: () => void;
  onSeeAllPlans: () => void;
};

export function Hero({ onOpenQuestionnaire, onSeeAllPlans }: HeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          Trouvez le forfait qui vous correspond
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500 sm:text-lg">
          Comparez nos forfaits ou laissez-nous vous aider à trouver celui qui correspond le mieux à vos usages.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSeeAllPlans}
            className="rounded-full bg-inwi-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-inwi-700"
          >
            Voir tous les forfaits
          </button>
          <button
            type="button"
            onClick={onOpenQuestionnaire}
            className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-inwi-600 hover:text-inwi-600"
          >
            Aidez-moi à choisir
          </button>
        </div>
      </div>
    </section>
  );
}
