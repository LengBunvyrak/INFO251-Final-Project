// window.onload = () => {
//   const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

//   async function showMeals() {
//     const res = await fetch(`${BASE_URL}/search.php?s=chicken`);
//     const data = await res.json();

//     const meals = (data.meals || []).filter((meal) => meal.strArea !== "Thai");

//     displayMeal(meals);
//   }

//   showMeals();
// };

// const displayMeal = (meals) => {
//   const productsDiv = document.getElementById("products");

//   productsDiv.innerHTML = " ";
//   meals.forEach(
//     (meal) =>
//       (productsDiv.innerHTML += ` 

// <div class="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs p-4">
//     <a href="#">
//         <img class="rounded-base mb-2" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
//     </a>
//     <a href="#">
//         <h2 class="logo mt-7 mb-2 text-2xl font-semibold tracking-tight text-heading text-purple-100 ">${meal.strMeal}</h2>
//         <h6 class="mt-2 mb-2  tracking-tight text-heading text-purple-100">${meal.strCategory}, ${meal.strArea}</h6>
//         </a>
//         <p class="mb-6 text-body"> ${meal.strInstructions.substring(0, 80)}...</p>
//    <button onclick="getMealDetail('${meal.idMeal}')" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300">
//       Read more
//     </button>
// </div>
// `),
//   );
// };

// async function searchMeals(query) {
//   if (!query || query.trim() === "") {
//     return [];
//   }

//   const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

//   const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
//   const data = await res.json();

//   const meals = (data.meals || []).filter((meal) => meal.strArea !== "Thai");
//   return meals;
// }

// async function handleSearch(query) {
//   const meals = await searchMeals(query);
//   displayMeal(meals);
// }

// let timeout;

// const input = document.getElementById("simple-search");
// input.addEventListener("input", () => {
//   clearTimeout(timeout);

//   timeout = setTimeout(() => {
//     const query = input.value;

//     handleSearch(query);
//   }, 200);
// });

// input.addEventListener("keypress", (event) => {
//   if (event.key === "Enter") {
//     const query = input.value;
//     handleSearch(query);
//   }
// });

// async function getMealDetail(id) {
//   const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
//   const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
//   const data = await res.json();
//   const meal = data.meals[0];

//   displayRecipeDetails(meal);
// }

// function displayRecipeDetails(meal) {
//   document.getElementById("products").style.display = "none";
//   const container = document.querySelector(".recipes");

//   container.innerHTML = `
//     <div class="max-w-3xl mx-auto p-6 border rounded shadow">
      
//       <h3 class="hero-title text-3xl font-bold mb-4 p-2">
//         ${meal.strMeal}
//       </h3>

//       <img 
//         src="${meal.strMealThumb}" 
//         class="w-full rounded mb-4"
//       />

//       <h2 class="text-xl font-semibold mt-4 mb-2 p-2">Instructions</h2>
//       <p class="text-body mb-4 p-2">
//         ${meal.strInstructions}
//       </p>

//       <h2 class="text-xl font-semibold mt-4 mb-2 p-2">Ingredients</h2>
//       <ul class="list-disc pl-5">
//         ${getIngredients(meal)}
//       </ul>

//       <button 
//         onclick="goBack()" 
//         class="mt-6 px-4 py-2 bg-black text-white rounded p-2 m-2"
//       >
//         Back
//       </button>

//     </div>
//   `;
// }

// function getIngredients(meal) {
//   let ingredients = "";
//   for (let i = 1; i <= 20; i++) {
//     const ingredient = meal[`strIngredient${i}`];
//     const measure = meal[`strMeasure${i}`];
//     if (ingredient && ingredient.trim() !== "") {
//       ingredients += `<li>${measure} ${ingredient}</li>`;
//     }
//   }
//   return ingredients;
// }

// function goBack() {
//   document.getElementById("products").style.display = "block";
//   document.querySelector(".recipes").innerHTML = "";
// }

// // Expose functions to global scope for onclick handlers
// window.getMealDetail = getMealDetail;
// window.goBack = goBack;
