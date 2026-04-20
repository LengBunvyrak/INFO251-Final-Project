const BASE_URL = "www.themealdb.com/api/json/v1"

async function fetchData(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`)
    const data = await res.json()

    return data
}

export function getMealByFirstLetter(letter) {
    return fetchData(`/search.php?f=${letter}`)
}

export function getMealByID(id) {
    return fetchData(`/lookup.php?i=${id}`)
}

export function getRandomMeal() {
    return fetchData(`/random.php`)
}

export function getCategories() {
    return fetchData(`/categories.php`)
}

export function getCategoriesList() {
    return fetchData(`/list.php?c=list`)
}

export function getAreaList() {
    return fetchData(`/list.php?a=list`)
}

export function getIngredientList() {
    return fetchData(`/list.php?i=list`)
}

export function filterByIngredient(ingredient) {
    return fetchData(`/filter.php?c=${ingredient}`)
}

export function filterByCategory(category) {
    return fetchData(`/filter.php?c=${category}`)
}

export function filterByArea(area) {
    return fetchData(`/filter.php?c=${area}`)
}