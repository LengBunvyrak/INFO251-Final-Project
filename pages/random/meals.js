
const getSavedMeals = () => {
  return JSON.parse(localStorage.getItem("meals")) || [];
};

const saveMealsToStorage = (meals) => {
  localStorage.setItem("meals", JSON.stringify(meals));
};

const toggleSaveMeal = (id) => {
  let meals = getSavedMeals();

  if (meals.includes(id)) {
    meals = meals.filter(m => m !== id);
  } else {
    meals.push(id);
  }

  saveMealsToStorage(meals);
};


const removeMeal = (id) => {
  let meals = getSavedMeals();
  meals = meals.filter(m => m !== id);
  saveMealsToStorage(meals);

  // re-render profile page if function exists
  if (typeof loadSavedMeals === "function") {
    loadSavedMeals();
  }
};


const loadSavedMeals = async () => {
  const container = document.querySelector(".recipe-grid");
  const statCount = document.querySelector(".profile-stat-num");

  if (!container) return; // prevent running on random.html

  const savedMealIds = getSavedMeals();

  container.innerHTML = "";

  for (let id of savedMealIds) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await res.json();
      const meal = data.meals[0];

      const card = `
        <div class="recipe-card">
          <div class="card-img-wrap">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <span class="card-badge">Saved</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${meal.strMeal}</h3>
            <p class="card-desc">${meal.strCategory} • ${meal.strArea}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-danger btn-ghost remove-btn" onclick="removeMeal('${meal.idMeal}')">Remove</button>
          </div>
        </div>
      `;

      container.innerHTML += card;

    } catch (err) {
      console.error("Error loading meal:", err);
    }
  }

  // update saved count
  if (statCount) {
    statCount.textContent = savedMealIds.length;
  }
};

