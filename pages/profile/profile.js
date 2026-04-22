const container = document.getElementById("savedMealsContainer");
const countEl = document.getElementById("savedCount");

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