import { getRandomMeal } from "../../api/fetct_api.js";

const container = document.getElementById("mealContainer");
const randomBtn = document.getElementById("randomBtn");

// --- rendering -------------------------------------------------------------

const displayMeal = (meal) => {
  // Build ingredient list inline
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push({ ingredient: ing.trim(), measure: (measure || "").trim() });
    }
  }

  // Build tag pills inline
  const tags = (meal.strTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tagPills = [meal.strArea, meal.strCategory, ...tags]
    .filter(Boolean)
    .slice(0, 5);

  const sourceUrl = meal.strSource || meal.strYoutube || "";

  // Check saved state inline
  const savedIds = JSON.parse(localStorage.getItem("meals")) || [];
  const alreadySaved = savedIds.includes(meal.idMeal);

    container.innerHTML = `
  <section class="hero-card">
    <div class="row g-0 align-items-stretch">

      <!-- Image -->
      <div class="col-12 col-md-6">
        <img 
          class="hero-img img-fluid w-100 h-100 rounded-start"
          style="object-fit: cover; max-height: 500px;"
          alt="${meal.strMeal}" 
          src="${meal.strMealThumb}" 
        />
      </div>

      <!-- Content -->
      <div class="col-12 col-md-6">
        <div class="hero-body h-100 d-flex flex-column p-3 p-md-4">

          <p class="eyebrow mb-2 text-muted">
            ${meal.strCategory || "Dish"} · ${meal.strArea || "World"}
          </p>

          <h2 class="hero-title mb-3">${meal.strMeal}</h2>

          <!-- Tags -->
          <div class="hero-tags d-flex flex-wrap gap-2 mb-3">
            ${tagPills
              .map(
                (t, i) =>
                  `<span class="border border-dark rounded p-1 tag-pill${i === 0 ? " tag-gold" : ""}">${t}</span>`
              )
              .join("")}
          </div>

          <!-- Ingredients -->
          <h6 class="form-label-dark mb-2">Ingredients</h6>
          <div class="ingredient-list d-flex flex-wrap gap-2 mb-3">
            ${ingredients
              .map(
                ({ ingredient, measure }) =>
                  `<span class="ingredient-chip border border-dark rounded"><strong>${measure}</strong> ${ingredient}</span>`
              )
              .join("")}
          </div>

          <!-- Instructions -->
          <h6 class="form-label-dark mb-2">Preparation</h6>
          <p class="hero-instructions text-muted overflow-auto mb-3" style="max-height: 180px;">
            ${meal.strInstructions || ""}
          </p>

          <!-- Actions -->
          <div class="d-flex gap-2 mt-auto flex-wrap align-items-center">
            <button id="btn-save" class="btn ${alreadySaved ? "btn-outline-secondary" : "btn-secondary"}">
              <i class="bi ${alreadySaved ? "bi-bookmark-check-fill" : "bi-bookmark-heart"} me-1"></i>
              ${alreadySaved ? "Saved" : "Save to my kitchen"}
            </button>

            <button id="btn-reroll" class="btn btn-outline-secondary">
              <i class="bi bi-shuffle me-1"></i> Try another
            </button>

            ${
              sourceUrl
                ? `<a href="${sourceUrl}" target="_blank" rel="noopener" class="btn btn-ghost ms-md-auto btn-outline-secondary">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Source
                  </a>`
                : ""
            }
          </div>

        </div>
      </div>

    </div>
  </section>
  `;

  document.getElementById("btn-reroll").addEventListener("click", loadMeal);
  document.getElementById("btn-save").addEventListener("click", () => {
    saveMeal(meal.idMeal);
    displayMeal(meal);
  });
};

// --- data ------------------------------------------------------------------

const loadMeal = async () => {
  container.innerHTML = `
    <section class="hero-card">
      <div class="hero-body text-center py-5">
        <div class="spinner-gold mb-3"></div>
        <p class="text-secondary-soft m-0">Summoning a dish…</p>
      </div>
    </section>
  `;
  try {
    const data = await getRandomMeal();
    displayMeal(data.meals[0]);
  } catch {
    container.innerHTML = `<p class="text-danger">Failed to load meal</p>`;
  }
};

const saveMeal = (id) => {
  const saved = JSON.parse(localStorage.getItem("meals")) || [];
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem("meals", JSON.stringify(saved));
  }
};

randomBtn.addEventListener("click", loadMeal);

loadMeal();