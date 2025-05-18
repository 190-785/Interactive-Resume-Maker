document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
        // Redirect to login if not logged in
        window.location.href = './Login_Page.html';
        return;
    }
    
    displayUserData();
    fetchUserResumes();

    // Attach logout handler
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = './Login_Page.html';
        });
    }
});

function displayUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            // Update username in the welcome message
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = userData.fullName || userData.username;
            }
            
            // Update avatar
            const avatarEl = document.getElementById('user-avatar');
            const initialsEl = document.getElementById('avatar-initials');
            
            if (avatarEl) {
                if (userData.avatarUrl) {
                    avatarEl.innerHTML = `<img src="${userData.avatarUrl}" alt="Avatar">`;
                } else if (initialsEl) {
                    const name = userData.fullName || userData.username;
                    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                    initialsEl.textContent = initials;
                }
            }
        }
    } catch (error) {
        console.error('Error displaying user data:', error);
    }
}

function fetchUserResumes() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('No authentication token found');
        return;
    }
      fetch('/api/resumes', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch resumes');
        }
        return response.json();
    })
    .then(resumes => {
        const resumeList = document.getElementById('resume-list');
        resumeList.innerHTML = '';
        
        if (!resumes || resumes.length === 0) {
            resumeList.innerHTML = '<p>You haven\'t created any resumes yet. Get started by creating one!</p>';
            return;
        }
            
            resumes.forEach(resume => {
                const resumeItem = document.createElement('div');
                resumeItem.className = 'resume-item';
                resumeItem.innerHTML = `
                    <h4>${resume.title || 'Untitled Resume'}</h4>
                    <p>Last updated: ${new Date(resume.lastModified).toLocaleDateString()}</p>
                    <div class="resume-actions">
                        <button class="btn" onclick="window.location.href='/resume/edit/${resume.id}'">Edit</button>
                        <button class="btn btn-secondary" onclick="window.location.href='/resume/view/${resume.id}'">View</button>
                        <button class="btn btn-secondary" onclick="deleteResume('${resume.id}')">Delete</button>
                    </div>
                `;
                resumeList.appendChild(resumeItem);
            });
        })
        .catch(error => console.error('Error fetching resumes:', error));
}

function deleteResume(resumeId) {
    if (confirm('Are you sure you want to delete this resume?')) {
        fetch(`/api/resumes/${resumeId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchUserResumes(); // Refresh the list
            } else {
                throw new Error('Failed to delete resume');
            }
        })
        .catch(error => console.error('Error deleting resume:', error));
    }
}
