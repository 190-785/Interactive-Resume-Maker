document.addEventListener('DOMContentLoaded', function() {
    fetchUserData();
    fetchUserResumes();

    // Attach logout handler
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear token from localStorage
            localStorage.removeItem('token');
            // Redirect to login page
            window.location.href = '/Login/Login_Page.html';
        });
    }
});

function fetchUserData() {
    fetch('/api/user/current')
        .then(response => response.json())
        .then(data => {
            document.getElementById('username').textContent = data.firstName || data.username;
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function fetchUserResumes() {
    fetch('/api/resumes')
        .then(response => response.json())
        .then(resumes => {
            const resumeList = document.getElementById('resume-list');
            resumeList.innerHTML = '';
            
            if (resumes.length === 0) {
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
