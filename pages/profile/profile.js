// Profile Page JavaScript

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    
    if (theme === 'dark') {
        html.removeAttribute('data-theme');
        themeToggle.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
});

// Sticky Header Shrink Effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
    
    lastScroll = currentScroll;
});

// Profile Data (In a real app, this would come from a backend/database)
let profileData = {
    name: 'Chef John Doe',
    email: 'john.doe@aupp.edu.kh',
    bio: 'Food enthusiast | Recipe explorer | Kitchen experimenter',
    avatar: 'https://via.placeholder.com/150',
    savedMeals: [],
    favorites: [],
    stats: {
        savedCount: 0,
        recipesTriedCount: 87,
        memberSince: 6
    }
};

// Load profile data from localStorage if available
const savedProfile = localStorage.getItem('profileData');
if (savedProfile) {
    profileData = JSON.parse(savedProfile);
    updateProfileDisplay();
}

// Load saved meals from localStorage
const savedMeals = localStorage.getItem('savedMeals');
if (savedMeals) {
    profileData.savedMeals = JSON.parse(savedMeals);
    updateStats();
}

// Load favorites from localStorage
const favorites = localStorage.getItem('favoriteMeals');
if (favorites) {
    profileData.favorites = JSON.parse(favorites);
}

// Update Profile Display
function updateProfileDisplay() {
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileBio').textContent = profileData.bio;
    document.getElementById('profileAvatar').src = profileData.avatar;
    document.getElementById('fullName').value = profileData.name;
    document.getElementById('email').value = profileData.email;
    document.getElementById('bio').value = profileData.bio;
    document.getElementById('modalName').value = profileData.name;
    document.getElementById('modalBio').value = profileData.bio;
}

// Update Stats
function updateStats() {
    profileData.stats.savedCount = profileData.savedMeals.length;
    document.getElementById('savedMealsCount').textContent = profileData.stats.savedCount;
    document.getElementById('recipesTriedCount').textContent = profileData.stats.recipesTriedCount;
    document.getElementById('memberSinceCount').textContent = profileData.stats.memberSince;
}

// Edit Profile Button - Open Modal
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));

editProfileBtn.addEventListener('click', () => {
    editProfileModal.show();
});

// Save Profile Changes (Modal)
const saveProfileBtn = document.getElementById('saveProfileBtn');
saveProfileBtn.addEventListener('click', () => {
    profileData.name = document.getElementById('modalName').value;
    profileData.bio = document.getElementById('modalBio').value;
    
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Update display
    updateProfileDisplay();
    
    // Close modal
    editProfileModal.hide();
    
    // Show success message
    showToast('Profile updated successfully!');
});

// Save Profile Form (Settings Tab)
const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    profileData.name = document.getElementById('fullName').value;
    profileData.email = document.getElementById('email').value;
    profileData.bio = document.getElementById('bio').value;
    
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Update display
    updateProfileDisplay();
    
    // Show success message
    showToast('Settings saved successfully!');
});

// Avatar Upload Simulation
const editAvatarBtn = document.getElementById('editAvatarBtn');
editAvatarBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileData.avatar = event.target.result;
                document.getElementById('profileAvatar').src = event.target.result;
                localStorage.setItem('profileData', JSON.stringify(profileData));
                showToast('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
});

// Display Saved Meals
function displaySavedMeals() {
    const container = document.getElementById('savedMealsContainer');
    
    if (profileData.savedMeals.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-bookmark display-1 text-muted"></i>
                <p class="text-muted mt-3">No saved meals yet. Start exploring and save your favorites!</p>
                <a href="random.html" class="btn btn-gradient gradient text-white mt-2">Discover Meals</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    profileData.savedMeals.forEach(meal => {
        const mealCard = createMealCard(meal);
        container.appendChild(mealCard);
    });
}

// Display Favorite Meals
function displayFavoriteMeals() {
    const container = document.getElementById('favoritesContainer');
    
    if (profileData.favorites.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-heart display-1 text-muted"></i>
                <p class="text-muted mt-3">No favorite meals yet. Heart the meals you love!</p>
                <a href="random.html" class="btn btn-gradient gradient text-white mt-2">Search Meals</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    profileData.favorites.forEach(meal => {
        const mealCard = createMealCard(meal);
        container.appendChild(mealCard);
    });
}

// Create Meal Card Element
function createMealCard(meal) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6';
    
    col.innerHTML = `
        <div class="card meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-card-body">
                <h5 class="meal-card-title">${meal.strMeal}</h5>
                <span class="meal-card-category">${meal.strCategory}</span>
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${meal.idMeal}">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add remove functionality
    const removeBtn = col.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
        removeMeal(meal.idMeal);
    });
    
    return col;
}

// Remove Meal
function removeMeal(mealId) {
    // Determine which tab we're on
    const activeTab = document.querySelector('.nav-link.active').id;
    
    if (activeTab === 'saved-tab') {
        profileData.savedMeals = profileData.savedMeals.filter(meal => meal.idMeal !== mealId);
        localStorage.setItem('savedMeals', JSON.stringify(profileData.savedMeals));
        displaySavedMeals();
    } else if (activeTab === 'favorites-tab') {
        profileData.favorites = profileData.favorites.filter(meal => meal.idMeal !== mealId);
        localStorage.setItem('favoriteMeals', JSON.stringify(profileData.favorites));
        displayFavoriteMeals();
    }
    
    updateStats();
    showToast('Meal removed successfully!');
}

// Tab switching events
document.getElementById('saved-tab').addEventListener('shown.bs.tab', () => {
    displaySavedMeals();
});

document.getElementById('favorites-tab').addEventListener('shown.bs.tab', () => {
    displayFavoriteMeals();
});

// Delete Account Button
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
deleteAccountBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
        const doubleConfirm = confirm('This will permanently delete all your data. Are you absolutely sure?');
        
        if (doubleConfirm) {
            // Clear all user data
            localStorage.removeItem('profileData');
            localStorage.removeItem('savedMeals');
            localStorage.removeItem('favoriteMeals');
            
            alert('Your account has been deleted. You will be redirected to the home page.');
            window.location.href = 'index.html';
        }
    }
});

// Toast Notification Function
function showToast(message) {
    // Create toast element
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    
    toastContainer.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProfileDisplay();
    updateStats();
    displaySavedMeals();
});