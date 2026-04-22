// ── Imports — reuse existing shared modules ─────────────────────────────────
import { getMealByID } from "../../api/fetct_api.js";
import toggleDarkMode  from "../../app.js";

// ── Storage keys ─────────────────────────────────────────────────────────────
const SAVED_KEY  = "meals";         // array of meal IDs (set by random/search pages)
const CUSTOM_KEY = "customDishes";  // array of full custom dish objects

// ── Storage helpers ───────────────────────────────────────────────────────────
const getSavedIds    = ()  => JSON.parse(localStorage.getItem(SAVED_KEY))  || [];
const getCustomDishes = () => JSON.parse(localStorage.getItem(CUSTOM_KEY)) || [];
const saveCustomDishes = (arr) => localStorage.setItem(CUSTOM_KEY, JSON.stringify(arr));

// ── DOM refs ──────────────────────────────────────────────────────────────────
const newDishBtn     = document.getElementById("newDishBtn");
const savedGrid      = document.getElementById("savedGrid");
const customGrid     = document.getElementById("customGrid");
const savedEmpty     = document.getElementById("savedEmpty");
const customEmpty    = document.getElementById("customEmpty");
const savedCountEl   = document.getElementById("savedCount");
const customCountEl  = document.getElementById("customCount");
const toast          = document.getElementById("toast");

// Create/Edit modal
const dishModal      = document.getElementById("dishModal");
const modalTitle     = document.getElementById("modalTitle");
const modalClose     = document.getElementById("modalClose");
const modalCancel    = document.getElementById("modalCancel");
const saveDishBtn    = document.getElementById("saveDishBtn");
const editingId      = document.getElementById("editingId");
const dishName       = document.getElementById("dishName");
const dishCategory   = document.getElementById("dishCategory");
const dishArea       = document.getElementById("dishArea");
const dishImage      = document.getElementById("dishImage");
const dishIngredients = document.getElementById("dishIngredients");
const dishInstructions = document.getElementById("dishInstructions");

// Detail modal
const detailModal    = document.getElementById("detailModal");
const detailTitle    = document.getElementById("detailTitle");
const detailClose    = document.getElementById("detailClose");
const detailCloseBtn = document.getElementById("detailCloseBtn");
const detailBody     = document.getElementById("detailBody");

// Delete confirm modal
const deleteModal      = document.getElementById("deleteModal");
const deleteClose      = document.getElementById("deleteClose");
const deleteCancelBtn  = document.getElementById("deleteCancelBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");
const deleteTarget     = document.getElementById("deleteTarget");

// ── Tab switching ─────────────────────────────────────────────────────────────
document.querySelectorAll(".ktab").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".ktab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".kitchen-section").forEach(s => s.classList.add("d-none"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("d-none");
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//  CREATE / EDIT MODAL
// ══════════════════════════════════════════════════════════════════════════════
function openCreateModal() {
    editingId.value = "";
    modalTitle.textContent = "New Custom Dish";
    saveDishBtn.textContent = "Save dish";
    clearForm();
    dishModal.classList.remove("d-none");
}

function openEditModal(dish) {
    editingId.value        = dish.id;
    modalTitle.textContent = "Edit Dish";
    saveDishBtn.textContent = "Update dish";
    dishName.value         = dish.name        || "";
    dishCategory.value     = dish.category    || "";
    dishArea.value         = dish.area        || "";
    dishImage.value        = dish.image       || "";
    dishIngredients.value  = dish.ingredients || "";
    dishInstructions.value = dish.instructions|| "";
    dishModal.classList.remove("d-none");
}

function closeCreateModal() {
    dishModal.classList.add("d-none");
    clearForm();
}

function clearForm() {
    [dishName, dishArea, dishImage, dishIngredients, dishInstructions].forEach(el => el.value = "");
    dishCategory.value = "";
    editingId.value = "";
}

newDishBtn.addEventListener("click",  openCreateModal);
modalClose.addEventListener("click",  closeCreateModal);
modalCancel.addEventListener("click", closeCreateModal);
dishModal.addEventListener("click", e => { if (e.target === dishModal) closeCreateModal(); });

// ── CREATE (save new dish) ────────────────────────────────────────────────────
// ── UPDATE (edit existing) ────────────────────────────────────────────────────
saveDishBtn.addEventListener("click", () => {
    const name = dishName.value.trim();
    if (!name) { dishName.focus(); showToast("Please enter a dish name."); return; }

    const dishes = getCustomDishes();
    const id = editingId.value;

    if (id) {
        // UPDATE — find and replace
        const idx = dishes.findIndex(d => d.id === id);
        if (idx !== -1) {
            dishes[idx] = {
                ...dishes[idx],
                name,
                category:     dishCategory.value,
                area:         dishArea.value.trim(),
                image:        dishImage.value.trim(),
                ingredients:  dishIngredients.value.trim(),
                instructions: dishInstructions.value.trim(),
                updatedAt:    Date.now(),
            };
        }
        showToast("Dish updated ✓");
    } else {
        // CREATE — add new
        dishes.push({
            id:           "custom_" + Date.now(),
            name,
            category:     dishCategory.value,
            area:         dishArea.value.trim(),
            image:        dishImage.value.trim(),
            ingredients:  dishIngredients.value.trim(),
            instructions: dishInstructions.value.trim(),
            isCustom:     true,
            createdAt:    Date.now(),
        });
        showToast("Custom dish added ✓");

        // Switch to Custom tab
        document.querySelector('[data-tab="custom"]').click();
    }

    saveCustomDishes(dishes);
    closeCreateModal();
    renderCustom();
    renderCounts();
});

// ══════════════════════════════════════════════════════════════════════════════
//  DETAIL VIEW MODAL  (READ)
// ══════════════════════════════════════════════════════════════════════════════
function openDetailModal(title, bodyHTML) {
    detailTitle.textContent = title;
    detailBody.innerHTML    = bodyHTML;
    detailModal.classList.remove("d-none");
}

function closeDetailModal() { detailModal.classList.add("d-none"); }

detailClose.addEventListener("click", closeDetailModal);
detailCloseBtn.addEventListener("click", closeDetailModal);
detailModal.addEventListener("click", e => { if (e.target === detailModal) closeDetailModal(); });

// Build READ detail for a TheMealDB meal
async function showSavedDetail(mealId) {
    openDetailModal("Loading…", `<div class="mk-spinner"></div>`);
    try {
        const data = await getMealByID(mealId);
        const meal = data.meals?.[0];
        if (!meal) throw new Error("Not found");

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const mea = meal[`strMeasure${i}`];
            if (ing && ing.trim()) ingredients.push({ ing: ing.trim(), mea: (mea || "").trim() });
        }

        detailTitle.textContent = meal.strMeal;
        detailBody.innerHTML = `
            <img src="${meal.strMealThumb}" class="detail-meal-img" alt="${meal.strMeal}">
            <span class="detail-meal-badge">${meal.strArea || ""} · ${meal.strCategory || ""}</span>
            <h2 class="detail-meal-title">${meal.strMeal}</h2>
            <h3 class="detail-section-title">Ingredients</h3>
            <ul class="detail-ingredients">
                ${ingredients.map(({ing, mea}) =>
                    `<li><span class="ingredient-measure">${mea}</span><span>${ing}</span></li>`
                ).join("")}
            </ul>
            <h3 class="detail-section-title">Instructions</h3>
            <p class="detail-instructions">${meal.strInstructions || "No instructions available."}</p>
            ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" rel="noopener" class="btn-primary" style="display:inline-block;margin-top:1.25rem;font-size:0.85rem;">▶ Watch on YouTube</a>` : ""}
        `;
    } catch {
        detailBody.innerHTML = `<p style="color:var(--muted)">Could not load recipe details.</p>`;
    }
}

// Build READ detail for a custom dish
function showCustomDetail(dish) {
    const imgHTML = dish.image
        ? `<img src="${dish.image}" class="detail-meal-img" alt="${dish.name}" onerror="this.style.display='none'">`
        : `<div class="detail-meal-img-placeholder">🍽️</div>`;

    const ingLines = (dish.ingredients || "").split("\n").filter(Boolean);

    openDetailModal(dish.name, `
        ${imgHTML}
        <span class="detail-meal-badge custom-badge">Custom Recipe</span>
        ${dish.category || dish.area ? `<span class="detail-meal-badge" style="margin-left:0.4rem">${[dish.category, dish.area].filter(Boolean).join(" · ")}</span>` : ""}
        <h2 class="detail-meal-title" style="margin-top:0.75rem">${dish.name}</h2>
        ${ingLines.length ? `
        <h3 class="detail-section-title">Ingredients</h3>
        <ul class="detail-ingredients">
            ${ingLines.map(line => `<li><span>${line}</span></li>`).join("")}
        </ul>` : ""}
        ${dish.instructions ? `
        <h3 class="detail-section-title">Instructions</h3>
        <p class="detail-instructions">${dish.instructions}</p>` : ""}
    `);
}

// ══════════════════════════════════════════════════════════════════════════════
//  DELETE CONFIRM MODAL
// ══════════════════════════════════════════════════════════════════════════════
let pendingDelete = null; // { type: 'saved'|'custom', id, name }

function openDeleteModal(type, id, name) {
    pendingDelete = { type, id, name };
    deleteTarget.textContent = `"${name}"`;
    deleteModal.classList.remove("d-none");
}

function closeDeleteModal() {
    deleteModal.classList.add("d-none");
    pendingDelete = null;
}

deleteClose.addEventListener("click",    closeDeleteModal);
deleteCancelBtn.addEventListener("click", closeDeleteModal);
deleteModal.addEventListener("click", e => { if (e.target === deleteModal) closeDeleteModal(); });

deleteConfirmBtn.addEventListener("click", () => {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;

    if (type === "saved") {
        // DELETE saved meal ID
        const updated = getSavedIds().filter(sid => sid !== id);
        localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
        renderSaved();
        showToast("Removed from saved meals");
    } else {
        // DELETE custom dish
        const updated = getCustomDishes().filter(d => d.id !== id);
        saveCustomDishes(updated);
        renderCustom();
        showToast("Custom dish deleted");
    }

    renderCounts();
    closeDeleteModal();
});

// ══════════════════════════════════════════════════════════════════════════════
//  RENDER — SAVED MEALS  (READ)
// ══════════════════════════════════════════════════════════════════════════════
async function renderSaved() {
    const ids = getSavedIds();
    savedCountEl.textContent = `(${ids.length})`;

    if (ids.length === 0) {
        savedEmpty.classList.remove("d-none");
        savedGrid.innerHTML = "";
        return;
    }

    savedEmpty.classList.add("d-none");
    savedGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem 0"><div class="mk-spinner"></div></div>`;

    const meals = await Promise.all(
        ids.map(id => getMealByID(id).then(d => d.meals?.[0]).catch(() => null))
    );

    savedGrid.innerHTML = "";
    meals.filter(Boolean).forEach(meal => {
        const card = document.createElement("a");
        card.className = "recipe-card";
        card.href = "#";
        card.innerHTML = `
            <div class="card-img-wrap">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <span class="card-badge">${meal.strCategory || ""}</span>
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="card-meta-item">🌍 ${meal.strArea || "World"}</span>
                </div>
                <h3 class="card-title">${meal.strMeal}</h3>
                <p class="card-desc">${meal.strInstructions ? meal.strInstructions.substring(0,90)+"…" : ""}</p>
            </div>
            <div class="card-footer">
                <span class="card-cuisine">${meal.strArea || ""}</span>
            </div>
            <div class="mk-card-actions">
                <button class="mk-btn-view" data-id="${meal.idMeal}">View Recipe</button>
                <button class="mk-btn-remove" data-id="${meal.idMeal}" data-name="${meal.strMeal}">Remove</button>
            </div>
        `;

        card.querySelector(".mk-btn-view").addEventListener("click", e => {
            e.preventDefault(); showSavedDetail(meal.idMeal);
        });
        card.querySelector(".mk-btn-remove").addEventListener("click", e => {
            e.preventDefault(); openDeleteModal("saved", meal.idMeal, meal.strMeal);
        });
        card.addEventListener("click", e => {
            if (!e.target.closest("button")) { e.preventDefault(); showSavedDetail(meal.idMeal); }
        });

        savedGrid.appendChild(card);
    });
}

// ══════════════════════════════════════════════════════════════════════════════
//  RENDER — CUSTOM DISHES  (READ + triggers EDIT/DELETE)
// ══════════════════════════════════════════════════════════════════════════════
function renderCustom() {
    const dishes = getCustomDishes();
    customCountEl.textContent = `(${dishes.length})`;

    if (dishes.length === 0) {
        customEmpty.classList.remove("d-none");
        customGrid.innerHTML = "";
        return;
    }

    customEmpty.classList.add("d-none");
    customGrid.innerHTML = "";

    dishes.forEach(dish => {
        const card = document.createElement("a");
        card.className = "recipe-card";
        card.href = "#";

        const imgHTML = dish.image
            ? `<img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.style.display='none'">`
            : `<div style="height:100%;min-height:180px;display:flex;align-items:center;justify-content:center;font-size:3rem;background:var(--sand)">🍽️</div>`;

        card.innerHTML = `
            <div class="card-img-wrap">${imgHTML}</div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="card-meta-item custom-badge">Custom</span>
                    ${dish.area ? `<span class="card-meta-item">🌍 ${dish.area}</span>` : ""}
                </div>
                <h3 class="card-title">${dish.name}</h3>
                <p class="card-desc">${dish.instructions ? dish.instructions.substring(0,90)+"…" : "Your custom recipe."}</p>
            </div>
            <div class="card-footer">
                <span class="card-cuisine">${dish.category || "Custom"}</span>
            </div>
            <div class="mk-card-actions">
                <button class="mk-btn-view"   data-id="${dish.id}">View</button>
                <button class="mk-btn-edit"   data-id="${dish.id}">Edit</button>
                <button class="mk-btn-remove" data-id="${dish.id}" data-name="${dish.name}">Delete</button>
            </div>
        `;

        card.querySelector(".mk-btn-view").addEventListener("click", e => {
            e.preventDefault(); showCustomDetail(dish);
        });
        card.querySelector(".mk-btn-edit").addEventListener("click", e => {
            e.preventDefault(); openEditModal(dish);
        });
        card.querySelector(".mk-btn-remove").addEventListener("click", e => {
            e.preventDefault(); openDeleteModal("custom", dish.id, dish.name);
        });
        card.addEventListener("click", e => {
            if (!e.target.closest("button")) { e.preventDefault(); showCustomDetail(dish); }
        });

        customGrid.appendChild(card);
    });
}

// ── Counts helper ─────────────────────────────────────────────────────────────
function renderCounts() {
    savedCountEl.textContent  = `(${getSavedIds().length})`;
    customCountEl.textContent = `(${getCustomDishes().length})`;
}

// ── Toast notification ────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("d-none");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("d-none"), 3000);
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderSaved();
renderCustom();
toggleDarkMode();   // reuse existing app.js — no changes needed
