import { getRandomMeal } from "../../api/fetct_api.js";

const container = document.getElementById('mealContainer')
const randomBtn = document.getElementById('randomBtn')

const getIngredients = (meal) => {
    const list = []

  
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim() !== "") list.push(ing);
    }

    return list;
}


// Meal Rendering
const displayMeal = (meal) => {
    const ingredients = getIngredients(meal)

    container.innerHTML = `
        <div class="col-12">
        <div class="featured-card">

            <div class="img-wrapper">
                <img src="${meal.strMealThumb}" alt="" class="meal-img">
            </div>

            <div class="meal-content">

                <div>
                    <small class="text-muted">${meal.strCategory} • ${meal.strArea}</small>
                    <h2 class="fw-bold mt-2">${meal.strMeal}</h2>
                </div>

                <div class="mt-2">
                    <span class="tag">${meal.strCategory}</span>
                    <span class="tag">${meal.strArea}</span>
                </div>

                <h6 class="mt-3">Ingredient</h6>
                <div class="ingredients">
                    ${ingredients.map(i => `<span class="tag">${i}</span>`).join("")}
                </div>

                <h6 class="mt-3">Instructions</h6>
                <p class="text-muted" style="max-height: 150PX; overflow: auto;">
                    ${meal.strInstructions}
                </p>
            </div>
            
            <div class="actions">
                <button class="btn btn-outline-secondary" id="saveBtn">Save</button>
                <button class="btn btn-gradient" id="againBtn">Try Another</button>
            </div>
        </div>
    </div>
    `;

    document.getElementById("againBtn").addEventListener("click", loadMeal)
    document.getElementById("saveBtn").addEventListener("click", () => {saveMeal(meal.idMeal)})

    
}

const loadMeal = async () => {
    try {
        const data = await getRandomMeal()
        displayMeal(data.meals[0])
    } catch {
        container.innerHTML = `<p class="text-danger">Failed to load meal</p>`
    }
}

const saveMeal = (id) => {
    let saved = JSON.parse(localStorage.getItem("meals")) || []

    if (!saved.includes(id)) {
        saved.push(id)
        localStorage.setItem("meals", JSON.stringify(saved))
        alert("Saved!")
    }
}

randomBtn.addEventListener("click", loadMeal)

loadMeal()