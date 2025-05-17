document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/user/current')
        .then(res => res.json())
        .then(data => {
            const name = data.firstName ? `${data.firstName} ${data.lastName || ''}` : data.username;
            document.getElementById('full-name').textContent = name;
            document.getElementById('email').textContent = data.email;
            document.getElementById('joined-date').textContent = new Date(data.joinedAt).toLocaleDateString();
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('emailField').value = data.email;
            document.getElementById('bio').value = data.bio || '';

            const avatarEl = document.getElementById('profile-avatar');
            const initialsEl = document.getElementById('avatar-initials');
            if (data.avatarUrl) {
                avatarEl.innerHTML = `<img src="${data.avatarUrl}" alt="Avatar">`;
            } else {
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                initialsEl.textContent = initials;
            }
        })
        .catch(err => console.error(err));
});

function saveProfile(event) {
    event.preventDefault();
    const payload = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('emailField').value,
        bio: document.getElementById('bio').value
    };
    fetch('/api/user/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) alert('Profile updated successfully!');
        else throw new Error('Update failed');
    })
    .catch(err => alert(err.message));
}

function changePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }
    fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
    })
    .then(res => {
        if (res.ok) alert('Password updated successfully!');
        else throw new Error('Password update failed');
    })
    .catch(err => alert(err.message));
}
