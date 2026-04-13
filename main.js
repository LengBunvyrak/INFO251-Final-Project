
window.onload = () => {
    const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

    async function showMeals() {
        const res = await fetch(`${BASE_URL}/search.php?s=chicken`);
        const data = await res.json();

        data.meals.forEach(meal => {
            console.log(meal.strMeal);
        });
    }

    showMeals();
}