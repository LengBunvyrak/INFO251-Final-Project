const container = document.getElementById("savedMealsContainer");
const countEl = document.getElementById("savedCount");

const loadSavedMeals = async () => {
    if (!container || !countEl) return;

    const savedIds = JSON.parse(localStorage.getItem("meals")) || [];

    // Update count
    countEl.textContent = savedIds.length;

    container.innerHTML = "";

    for (let id of savedIds) {
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
                        <button class="btn btn-sm btn-danger remove-btn" data-id="${meal.idMeal}">
                            Remove
                        </button>
                    </div>
                </div>
            `;

            container.innerHTML += card;

        } catch (err) {
            console.error("Error loading meal:", err);
        }
    }

    container.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
        toggleSaveMeal(id);
        loadSavedMeals();
    });
    // // Attach remove handlers
    // document.querySelectorAll(".remove-btn").forEach(btn => {
    //     btn.addEventListener("click", (e) => {
    //         const id = e.currentTarget.getAttribute("data-id");
    //         toggleSaveMeal(id);
    //         loadSavedMeals();
    //     });
    // });
};

/* Toggle save button (UI only) */
function toggleSave(btn) {
    const path = btn.querySelector('path');
    if (btn.dataset.saved) {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        delete btn.dataset.saved;
        btn.style.background = '';
        btn.style.borderColor = '';
    } else {
        path.setAttribute('fill', '#C8412A');
        path.setAttribute('stroke', '#C8412A');
        btn.dataset.saved = '1';
        btn.style.background = 'var(--accent-light)';
        btn.style.borderColor = 'var(--accent)';
    }
}

/* Toggle edit profile form */
function toggleEditForm() {
    const editSection = document.getElementById('editFormSection');
    if (editSection.style.display === 'none') {
        editSection.style.display = 'block';
        editSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        editSection.style.display = 'none';
    }
}

/* Save profile */
function saveProfile() {
    const nameInput = document.getElementById('nameInput');
    const bioInput = document.getElementById('bioInput');

    const newName = nameInput.value.trim();
    const newBio = bioInput.value.trim();

    if (!newName) {
        alert('Please enter a name');
        return;
    }

    document.querySelector('.profile-info h1').textContent = newName;
    document.querySelector('.profile-bio').textContent = newBio;

    const avatar = document.querySelector('.profile-avatar');
    const initials = newName.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    avatar.textContent = initials;

    alert('Profile updated successfully!');
    toggleEditForm();
}

/* Dietary tags */
document.addEventListener('DOMContentLoaded', function () {

    // Existing dietary toggle
    document.querySelectorAll('.dietary-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });

    loadSavedMeals();
});