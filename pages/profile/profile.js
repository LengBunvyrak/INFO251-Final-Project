/* Toggle save button */
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

/* Save profile - updates name, avatar, and bio */
function saveProfile() {
    // Get values from form using IDs
    const nameInput = document.getElementById('nameInput');
    const bioInput = document.getElementById('bioInput');
    
    const newName = nameInput.value.trim();
    const newBio = bioInput.value.trim();
    
    // Validate inputs
    if (!newName) {
        alert('Please enter a name');
        return;
    }
    
    // Update profile name
    const profileName = document.querySelector('.profile-info h1');
    profileName.textContent = newName;
    
    // Update bio
    const profileBio = document.querySelector('.profile-bio');
    profileBio.textContent = newBio;
    
    // Update avatar initials
    const avatar = document.querySelector('.profile-avatar');
    const initials = newName.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    avatar.textContent = initials;
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Close edit form
    toggleEditForm();
}

/* Dietary tag toggles */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dietary-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
});