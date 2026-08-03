/* inwi Panorama — logique du prototype (vanilla JS, sans dépendances) */

(function () {
  "use strict";

  const state = {
    selectedIds: new Set(),
    budgetFilter: "tous",
    mode: "global",
  };

  const CATEGORY_ORDER = ["social", "internet", "appels", "illimite"];

  /* ---------------------------------------------------------
     Helpers
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const byId = (id) => PLANS.find((p) => p.id === id);

  function planCardHTML(plan) {
    const cat = CATEGORIES[plan.category];
    const selected = state.selectedIds.has(plan.id);
    return `
      <div class="plan-card${selected ? " selected" : ""}" style="--cat-color:${cat.color}" data-id="${plan.id}">
        <div class="plan-card-top">
          <span class="plan-name">${plan.name}</span>
          <span class="plan-cat-badge" style="--cat-color:${cat.color}">${cat.icon} ${cat.label}</span>
        </div>
        <div class="plan-price">${plan.price} <span>DH / mois</span></div>
        <div class="plan-meta">
          <div class="row">🌐 <span>${plan.internetLabel}</span></div>
          <div class="row">📞 <span>${plan.callsLabel}</span></div>
        </div>
        <div class="plan-benefit">${plan.benefitIcon} ${plan.mainBenefit}</div>
        <div class="plan-card-actions">
          <button class="btn-details" data-id="${plan.id}">Voir les détails</button>
          <label class="compare-check">
            <input type="checkbox" data-id="${plan.id}" ${selected ? "checked" : ""} ${!selected && state.selectedIds.size >= 3 ? "disabled" : ""} />
            Comparer
          </label>
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     SECTION 1 — carrousel "affichage actuel"
  --------------------------------------------------------- */
  function renderOldCarousel() {
    const carousel = $("#oldCarousel");
    carousel.innerHTML = PLANS.map(
      (p) => `
      <div class="old-card">
        <div class="old-name">${p.name}</div>
        <div class="old-price">${p.price} <span>DH/mois</span></div>
        <ul>
          <li>🌐 ${p.internetLabel}</li>
          <li>📞 ${p.callsLabel}</li>
        </ul>
        <span class="old-benefit">${p.mainBenefit}</span>
      </div>`
    ).join("");

    const totalPages = Math.ceil(PLANS.length / 3);
    const dotsWrap = $("#carouselDots");
    dotsWrap.innerHTML = Array.from({ length: totalPages })
      .map((_, i) => `<span class="dot${i === 0 ? " active" : ""}"></span>`)
      .join("");

    const updateDots = () => {
      const step = carousel.clientWidth;
      const idx = Math.min(totalPages - 1, Math.round(carousel.scrollLeft / step));
      $$(".dot", dotsWrap).forEach((d, i) => d.classList.toggle("active", i === idx));
    };

    let ticking = false;
    carousel.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDots();
          ticking = false;
        });
        ticking = true;
      }
    });

    $("#oldPrev").addEventListener("click", () => {
      carousel.scrollBy({ left: -carousel.clientWidth, behavior: "smooth" });
    });
    $("#oldNext").addEventListener("click", () => {
      carousel.scrollBy({ left: carousel.clientWidth, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     VUE GLOBALE
  --------------------------------------------------------- */
  function renderGlobalView() {
    const wrap = $("#view-global");
    wrap.innerHTML = CATEGORY_ORDER.map((catKey) => {
      const cat = CATEGORIES[catKey];
      const plans = PLANS.filter((p) => p.category === catKey);
      return `
        <div class="category-group">
          <div class="category-group-header">
            <span class="category-dot" style="background:${cat.color}"></span>
            <h3>${cat.icon} ${cat.label}</h3>
            <span class="category-count">${plans.length} forfait${plans.length > 1 ? "s" : ""}</span>
          </div>
          <div class="cards-grid">
            ${plans.map(planCardHTML).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  /* ---------------------------------------------------------
     VUE PAR BUDGET
  --------------------------------------------------------- */
  function matchesBudget(plan, filter) {
    switch (filter) {
      case "49":
        return plan.price === 49;
      case "moins100":
        return plan.price < 100;
      case "100-200":
        return plan.price >= 100 && plan.price <= 200;
      case "plus200":
        return plan.price > 200;
      default:
        return true;
    }
  }

  function renderBudgetView() {
    const grid = $("#budgetGrid");
    const plans = PLANS.filter((p) => matchesBudget(p, state.budgetFilter));
    grid.innerHTML =
      plans.length > 0
        ? plans.map(planCardHTML).join("")
        : `<p class="section-sub">Aucun forfait dans cette tranche de budget.</p>`;
  }

  $("#budgetFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip", $("#budgetFilters")).forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    state.budgetFilter = chip.dataset.budget;
    renderBudgetView();
  });

  /* ---------------------------------------------------------
     VUE COMPARER
  --------------------------------------------------------- */
  function renderCompareView() {
    const grid = $("#compareGrid");
    grid.innerHTML = PLANS.map(planCardHTML).join("");
  }

  /* ---------------------------------------------------------
     Sélection / barre de comparaison
  --------------------------------------------------------- */
  function refreshAllCardGrids() {
    renderGlobalView();
    renderBudgetView();
    renderCompareView();
  }

  function updateCompareBar() {
    const n = state.selectedIds.size;
    const bar = $("#compareBar");
    bar.classList.toggle("show", n > 0);
    $("#compareBarText").textContent =
      n === 0 ? "" : `${n} forfait${n > 1 ? "s" : ""} sélectionné${n > 1 ? "s" : ""} — Comparer`;
  }

  function toggleSelect(id, checked) {
    if (checked) {
      if (state.selectedIds.size >= 3) return;
      state.selectedIds.add(id);
    } else {
      state.selectedIds.delete(id);
    }
    refreshAllCardGrids();
    updateCompareBar();
  }

  document.addEventListener("change", (e) => {
    if (e.target.matches(".compare-check input")) {
      toggleSelect(Number(e.target.dataset.id), e.target.checked);
    }
  });

  document.addEventListener("click", (e) => {
    const detailsBtn = e.target.closest(".btn-details");
    if (detailsBtn) {
      openDetail(Number(detailsBtn.dataset.id));
    }
  });

  /* ---------------------------------------------------------
     Sélecteur de mode
  --------------------------------------------------------- */
  $$(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".mode-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      state.mode = btn.dataset.mode;
      $$(".view").forEach((v) => v.classList.remove("active"));
      $(`#view-${state.mode}`).classList.add("active");
    });
  });

  /* ---------------------------------------------------------
     Panneau latéral — détails d'un forfait
  --------------------------------------------------------- */
  function boolCell(label, value) {
    return `<tr><td>${label}</td><td>${value ? "✓ Oui" : "✕ Non"}</td></tr>`;
  }

  function openDetail(id) {
    const plan = byId(id);
    if (!plan) return;
    const cat = CATEGORIES[plan.category];

    $("#detailContent").innerHTML = `
      <div class="detail-header">
        <span class="plan-cat-badge" style="--cat-color:${cat.color}">${cat.icon} ${cat.label}</span>
        <div class="detail-name">${plan.name}</div>
        <div class="detail-price">${plan.price} <span>DH / mois</span></div>
      </div>
      <div class="detail-benefit">${plan.benefitIcon} ${plan.mainBenefit}</div>
      <table class="detail-table">
        <tr><td>Internet</td><td>${plan.internetLabel}</td></tr>
        <tr><td>Appels</td><td>${plan.callsLabel}</td></tr>
        <tr><td>SMS</td><td>${plan.smsLabel}</td></tr>
        <tr><td>Appels illimités</td><td>${plan.callsUnlimited}</td></tr>
        ${boolCell("Réseaux sociaux illimités", plan.socialUnlimited)}
        <tr><td>Roaming</td><td>${plan.roaming}</td></tr>
        ${boolCell("5G", plan.fiveG)}
      </table>
      <div class="detail-extra-title">Services inclus</div>
      <ul class="detail-extra-list">
        ${plan.extraServices.map((s) => `<li>${s}</li>`).join("")}
      </ul>
      <button class="detail-cta" type="button">Choisir ce forfait</button>
    `;

    $("#detailPanel").classList.add("open");
    $("#detailPanel").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("show");
  }

  function closeDetail() {
    $("#detailPanel").classList.remove("open");
    $("#detailPanel").setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("show");
  }

  $("#closeDetailBtn").addEventListener("click", closeDetail);
  $("#overlay").addEventListener("click", closeDetail);

  /* ---------------------------------------------------------
     Modale de comparaison
  --------------------------------------------------------- */
  function compareCell(value) {
    if (typeof value === "boolean") {
      return `<td class="${value ? "yes" : "no"}">${value ? "✓ Oui" : "✕ Non"}</td>`;
    }
    return `<td>${value}</td>`;
  }

  const COMPARE_ROWS = [
    { label: "Prix", get: (p) => `${p.price} DH/mois` },
    { label: "Internet", get: (p) => p.internetLabel },
    { label: "Appels", get: (p) => p.callsLabel },
    { label: "Réseaux sociaux illimités", get: (p) => p.socialUnlimited },
    { label: "Appels illimités", get: (p) => (p.callsUnlimited === "Non" ? false : p.callsUnlimited) },
    { label: "Roaming", get: (p) => (p.roaming === "Non inclus" ? false : p.roaming) },
    { label: "5G", get: (p) => p.fiveG },
    { label: "Services supplémentaires", get: (p) => p.extraServices.join(", ") },
  ];

  function openCompareModal() {
    const plans = Array.from(state.selectedIds).map(byId).filter(Boolean);
    if (plans.length === 0) return;

    const table = $("#compareTable");
    table.innerHTML = `
      <thead>
        <tr>
          <th></th>
          ${plans.map((p) => `<th>${p.name}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${COMPARE_ROWS.map(
          (row) => `
          <tr>
            <td>${row.label}</td>
            ${plans.map((p) => compareCell(row.get(p))).join("")}
          </tr>`
        ).join("")}
      </tbody>
    `;

    $("#compareModal").classList.add("open");
    $("#compareModal").setAttribute("aria-hidden", "false");
  }

  function closeCompareModal() {
    $("#compareModal").classList.remove("open");
    $("#compareModal").setAttribute("aria-hidden", "true");
  }

  $("#compareBarBtn").addEventListener("click", openCompareModal);
  $("#closeCompareBtn").addEventListener("click", closeCompareModal);
  $("#compareModal").addEventListener("click", (e) => {
    if (e.target.id === "compareModal") closeCompareModal();
  });

  /* ---------------------------------------------------------
     Carte interactive des forfaits
  --------------------------------------------------------- */
  const MAP = { left: 56, right: 24, top: 24, bottom: 54, width: 640, height: 420 };

  function mapScaleX(price) {
    const w = MAP.width - MAP.left - MAP.right;
    return MAP.left + ((price - 49) / (349 - 49)) * w;
  }

  function mapScaleY(internetGo) {
    const h = MAP.height - MAP.top - MAP.bottom;
    const sMin = Math.sqrt(1);
    const sMax = Math.sqrt(130);
    const s = Math.sqrt(Math.max(internetGo, 1));
    return MAP.top + h - ((s - sMin) / (sMax - sMin)) * h;
  }

  function mapScaleR(callHours) {
    const rMin = 7;
    const rMax = 24;
    return rMin + Math.sqrt(callHours / 80) * (rMax - rMin);
  }

  function renderMap() {
    const svg = $("#mapSvg");
    const w = MAP.width;
    const h = MAP.height;

    const priceTicks = [49, 100, 150, 200, 250, 300, 349];
    const internetTicks = [2, 10, 30, 80, 130];

    let axes = `
      <line x1="${MAP.left}" y1="${h - MAP.bottom}" x2="${w - MAP.right}" y2="${h - MAP.bottom}" stroke="#E9E1F5" stroke-width="1.5"/>
      <line x1="${MAP.left}" y1="${MAP.top}" x2="${MAP.left}" y2="${h - MAP.bottom}" stroke="#E9E1F5" stroke-width="1.5"/>
      <text x="${(w) / 2}" y="${h - 12}" text-anchor="middle" font-size="12" fill="#6B6478">Prix mensuel (DH)</text>
      <text x="16" y="${MAP.top + 10}" text-anchor="start" font-size="12" fill="#6B6478" transform="rotate(-90 16 ${(h)/2})" >Volume internet</text>
    `;

    priceTicks.forEach((price) => {
      const x = mapScaleX(price);
      axes += `<line x1="${x}" y1="${h - MAP.bottom}" x2="${x}" y2="${h - MAP.bottom + 5}" stroke="#C6C0D3"/>`;
      axes += `<text x="${x}" y="${h - MAP.bottom + 18}" text-anchor="middle" font-size="10" fill="#6B6478">${price}</text>`;
    });

    internetTicks.forEach((go) => {
      const y = mapScaleY(go);
      axes += `<line x1="${MAP.left - 5}" y1="${y}" x2="${MAP.left}" y2="${y}" stroke="#C6C0D3"/>`;
      axes += `<text x="${MAP.left - 10}" y="${y + 3}" text-anchor="end" font-size="10" fill="#6B6478">${go >= 130 ? "∞" : go + " Go"}</text>`;
    });

    const points = PLANS.map((p) => {
      const cat = CATEGORIES[p.category];
      const cx = mapScaleX(p.price);
      const cy = mapScaleY(p.internetGo);
      const r = mapScaleR(p.callHours);
      return `
        <g class="map-point" data-id="${p.id}">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${cat.color}" fill-opacity="0.78" stroke="#fff" stroke-width="2"></circle>
          <text x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="10">${p.benefitIcon}</text>
        </g>
      `;
    }).join("");

    svg.innerHTML = axes + points;

    const legend = $("#mapLegendCats");
    legend.innerHTML = CATEGORY_ORDER.map(
      (k) => `<span class="item"><span class="swatch" style="background:${CATEGORIES[k].color}"></span>${CATEGORIES[k].icon} ${CATEGORIES[k].label}</span>`
    ).join("");
  }

  $("#mapSvg").addEventListener("click", (e) => {
    const pt = e.target.closest(".map-point");
    if (!pt) return;
    openDetail(Number(pt.dataset.id));
  });

  function openMapModal() {
    renderMap();
    $("#mapModal").classList.add("open");
    $("#mapModal").setAttribute("aria-hidden", "false");
  }

  function closeMapModal() {
    $("#mapModal").classList.remove("open");
    $("#mapModal").setAttribute("aria-hidden", "true");
  }

  $("#openMapBtn").addEventListener("click", openMapModal);
  $("#closeMapBtn").addEventListener("click", closeMapModal);
  $("#mapModal").addEventListener("click", (e) => {
    if (e.target.id === "mapModal") closeMapModal();
  });

  /* ---------------------------------------------------------
     Fermeture globale via ESC
  --------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeDetail();
    closeCompareModal();
    closeMapModal();
  });

  /* ---------------------------------------------------------
     Initialisation
  --------------------------------------------------------- */
  renderOldCarousel();
  renderGlobalView();
  renderBudgetView();
  renderCompareView();
  updateCompareBar();
})();
