const BASE_URL = "www.themealdb.com/api/json/v1"

export const searchMeals = async (query) => {
    const res = await fetch(`${BASE_URL}/search.php?s=${query}`)
    return res.json()
}

export const getMealByID = async (id) => {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
    return res.json()
}

export const getRandomMeal = async () => {
    const res = await fetch(`${BASE_URL}/random.php`)
    return res.json()
}

export const filterCategory = async (query) => {
    const res = await fetch(`${BASE_URL}/filter.php?c=${query}`)
}