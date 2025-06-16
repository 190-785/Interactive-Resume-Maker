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
        displayNoResumesMessage();
        return;
    }
    
    // Use the correct API endpoint for fetching user's resumes
    fetch('http://localhost:8080/api/resumes/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                // No resume exists yet
                displayNoResumesMessage();
                return null;
            }
            throw new Error(`Failed to fetch resumes: ${response.status}`);
        }
        return response.json();
    })
    .then(resume => {
        const resumeList = document.getElementById('resume-list');
        resumeList.innerHTML = '';
        
        if (!resume) {
            displayNoResumesMessage();
            return;
        }
        
        // Display the user's resume
        const resumeItem = document.createElement('div');
        resumeItem.className = 'resume-item';
        resumeItem.innerHTML = `
            <div class="resume-header">
                <h4>${resume.resumeName || 'My Interactive Resume'}</h4>
                <span class="resume-status ${resume.isPublic ? 'public' : 'private'}">${resume.isPublic ? 'Public' : 'Private'}</span>
            </div>
            <p class="resume-description">${resume.aboutMe ? resume.aboutMe.substring(0, 100) + '...' : 'No description available'}</p>
            <p class="resume-meta">Last updated: ${resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Never'}</p>
            <div class="resume-actions">
                <button class="btn btn-primary" onclick="editResume('${resume.id || ''}')">Edit in Forest</button>
                <button class="btn btn-secondary" onclick="previewResume('${resume.id || ''}')">Preview</button>
                <button class="btn btn-outline" onclick="toggleResumeVisibility('${resume.id || ''}', ${!resume.isPublic})">${resume.isPublic ? 'Make Private' : 'Make Public'}</button>
                <button class="btn btn-danger" onclick="deleteResume('${resume.id || ''}')">Delete</button>
            </div>
        `;
        resumeList.appendChild(resumeItem);
    })
    .catch(error => {
        console.error('Error fetching resumes:', error);
        displayErrorMessage('Failed to load your resumes. Please try refreshing the page.');
    });
}

function displayNoResumesMessage() {
    const resumeList = document.getElementById('resume-list');
    resumeList.innerHTML = `
        <div class="no-resumes">
            <h3>No Resume Found</h3>
            <p>You haven't created your interactive forest resume yet!</p>
            <button class="btn btn-primary" onclick="createNewResume()">Create Your First Resume</button>
        </div>
    `;
}

function displayErrorMessage(message) {
    const resumeList = document.getElementById('resume-list');
    resumeList.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button class="btn" onclick="fetchUserResumes()">Try Again</button>
        </div>
    `;
}

// Forest Drive Integration Functions
async function editMyResume() {
    console.log('editMyResume called'); // Debug log
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to edit your resume.');
        window.location.href = './Login_Page.html';
        return;
    }
    
    // Store edit mode flag for Forest Drive to detect
    localStorage.setItem('forestDriveMode', 'edit');
    
    // Automatically start server and redirect
    console.log('Calling startServerAndRedirect'); // Debug log
    await startServerAndRedirect();
}

async function createNewResume() {
    console.log('createNewResume called'); // Debug log
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to create a resume.');
        window.location.href = './Login_Page.html';
        return;
    }
    
    // Store create mode flag for Forest Drive to detect
    localStorage.setItem('forestDriveMode', 'create');
    
    // Automatically start server and redirect
    console.log('Calling startServerAndRedirect'); // Debug log
    await startServerAndRedirect();
}

async function previewMyResume() {
    console.log('previewMyResume called'); // Debug log
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to preview your resume.');
        window.location.href = './Login_Page.html';
        return;
    }
    
    // Store preview mode flag for Forest Drive to detect
    localStorage.setItem('forestDriveMode', 'preview');
    
    // Automatically start server and redirect
    console.log('Calling startServerAndRedirect'); // Debug log
    await startServerAndRedirect();
}

async function editResume(resumeId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to edit your resume.');
        window.location.href = './Login_Page.html';
        return;
    }
    
    // Store the resume ID and edit mode
    localStorage.setItem('forestDriveMode', 'edit');
    localStorage.setItem('editResumeId', resumeId);
    
    // Automatically start server and redirect
    await startServerAndRedirect();
}

function previewResume(resumeId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to preview your resume.');
        window.location.href = './Login_Page.html';
        return;
    }
    
    // Store the resume ID and preview mode
    localStorage.setItem('forestDriveMode', 'preview');
    localStorage.setItem('previewResumeId', resumeId);
    
    // Use the same server check and redirect as other functions
    startServerAndRedirect();
}

function toggleResumeVisibility(resumeId, makePublic) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to modify your resume.');
        return;
    }
    
    fetch(`http://localhost:8080/api/resumes/${resumeId}/visibility`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublic: makePublic })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update resume visibility');
        }
        return response.json();
    })
    .then(() => {
        // Refresh the resume list to show updated status
        fetchUserResumes();
        showNotification(`Resume ${makePublic ? 'made public' : 'made private'} successfully!`, 'success');
    })
    .catch(error => {
        console.error('Error updating resume visibility:', error);
        showNotification('Failed to update resume visibility. Please try again.', 'error');
    });
}

function deleteResume(resumeId) {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to delete your resume.');
        return;
    }
    
    fetch(`http://localhost:8080/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete resume');
        }
        // Refresh the resume list
        fetchUserResumes();
        showNotification('Resume deleted successfully!', 'success');
    })
    .catch(error => {
        console.error('Error deleting resume:', error);
        showNotification('Failed to delete resume. Please try again.', 'error');
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#000';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    // Append to body
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-resumes, .error-message {
        text-align: center;
        padding: 2rem;
        border: 2px dashed #ccc;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .resume-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .resume-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .resume-status {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .resume-status.public {
        background-color: #d4edda;
        color: #155724;
    }
    
    .resume-status.private {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .resume-description {
        color: #666;
        margin: 0.5rem 0;
    }
    
    .resume-meta {
        font-size: 0.9rem;
        color: #888;
        margin: 0.5rem 0;
    }
    
    .resume-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }
    
    .btn-primary {
        background-color: #007bff;
        color: white;
        border: 1px solid #007bff;
    }
    
    .btn-secondary {
        background-color: #6c757d;
        color: white;
        border: 1px solid #6c757d;
    }
    
    .btn-outline {
        background-color: transparent;
        color: #007bff;
        border: 1px solid #007bff;
    }
    
    .btn-danger {
        background-color: #dc3545;
        color: white;
        border: 1px solid #dc3545;
    }
    
    .btn:hover {
        opacity: 0.8;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

// Function to open setup guide
function openSetupGuide() {
    window.open('../Forest_Drive/setup-guide.html', '_blank');
}

// Automatic server starting and redirect function
async function startServerAndRedirect() {
    // Show loading indicator
    showLoadingIndicator();
    
    try {        // First check if server is already running
        const isRunning = await checkServerRunning();
        if (isRunning) {
            hideLoadingIndicator();
            
            // Pass login data via URL parameters to ensure cross-domain access
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            let url = 'http://localhost:3000';
            
            if (token && user) {
                const params = new URLSearchParams();
                params.append('token', token);
                params.append('user', user);
                url += '?' + params.toString();
            }
            
            window.location.href = url;
            return;
        }
        
        // Since automatic server start is limited by browser security,
        // show quick start dialog with user-friendly options
        hideLoadingIndicator();
        showQuickStartDialog();
        
    } catch (error) {
        console.error('Error checking server:', error);
        hideLoadingIndicator();
        showQuickStartDialog();
    }
}

// Check if webpack server is running
async function checkServerRunning() {
    try {
        const response = await fetch('http://localhost:3000', {
            method: 'HEAD',
            mode: 'no-cors'
        });
        return true;
    } catch (error) {
        return false;
    }
}

// Show a quick start dialog with one-click options
function showQuickStartDialog() {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10001;">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="color: #28a745; margin-bottom: 20px;">🌲 Start Your 3D Forest Resume</h3>
                <p style="margin-bottom: 20px; color: #666;">To view your interactive 3D resume, we need to start the development server. Choose your preferred method:</p>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin: 25px 0;">
                    <button id="download-btn" style="background: #28a745; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; font-size: 16px; flex: 1; max-width: 200px;">
                        📥 Download Starter
                    </button>
                    <button id="manual-btn" style="background: #007bff; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; font-size: 16px; flex: 1; max-width: 200px;">
                        📋 Manual Steps
                    </button>
                </div>
                
                <div id="instructions-area" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; display: none;">                    <strong>Manual Instructions:</strong>
                    <ol style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
                        <li>Open Command Prompt or PowerShell</li>
                        <li>Copy and paste: <code style="background: #e9ecef; padding: 2px 4px; border-radius: 3px; font-size: 11px; display: block; margin: 5px 0; word-break: break-all;">cd "F:\\Interavtive_Resume\\Interactive-Resume-Maker" && npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development --port 3000</code></li>
                        <li>Press Enter and wait for "webpack compiled successfully"</li>
                        <li>Keep the command window open</li>
                        <li>Click "Open 3D Scene" below</li>
                    </ol>
                </div>
                
                <div style="margin-top: 20px;">
                    <button id="open-scene-btn" style="background: #17a2b8; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px;">🌲 Open 3D Scene</button>
                    <button id="close-btn" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    dialog.querySelector('#download-btn').onclick = function() {
        downloadStarterFile();
        alert('Server starter downloaded! \\n\\n1. Check your Downloads folder\\n2. Run "start-forest-server.bat"\\n3. Keep the server window open\\n4. Click "Open 3D Scene" button');
    };
    
    dialog.querySelector('#manual-btn').onclick = function() {
        const instructionsArea = dialog.querySelector('#instructions-area');
        instructionsArea.style.display = instructionsArea.style.display === 'none' ? 'block' : 'none';
    };
    
    dialog.querySelector('#open-scene-btn').onclick = async function() {        const isRunning = await checkServerRunning();
        if (isRunning) {
            dialog.remove();
            
            // Pass login data via URL parameters
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            let url = 'http://localhost:3000';
            
            if (token && user) {
                const params = new URLSearchParams();
                params.append('token', token);
                params.append('user', user);
                url += '?' + params.toString();
            }
            
            window.location.href = url;
        } else {
            alert('Server is not running yet. Please start the server first using one of the methods above.');
        }
    };
    
    dialog.querySelector('#close-btn').onclick = function() {
        dialog.remove();
    };
    
    document.body.appendChild(dialog);
}

// Function to download starter file
function downloadStarterFile() {
    const batchContent = `@echo off
title Forest Drive 3D Resume Server
color 0A
echo ================================================================
echo         🌲 FOREST DRIVE 3D RESUME SERVER 🌲
echo ================================================================
echo.
echo Starting your 3D Forest Resume server...
echo Keep this window OPEN while using the application.
echo Close this window to stop the server.
echo.

cd /d "F:\\Interavtive_Resume\\Interactive-Resume-Maker"

echo 🚀 Starting development server...
echo Your 3D resume will be available at: http://localhost:3000
echo.

npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development --port 3000

echo.
echo Server stopped. Press any key to close...
pause > nul`;
    
    const blob = new Blob([batchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = 'start-forest-server.bat';
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(url);
}

// Show loading indicator
function showLoadingIndicator() {
    const overlay = document.createElement('div');
    overlay.id = 'server-loading-overlay';
    overlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <h3>🌲 Starting 3D Forest Scene</h3>
            <p id="loading-message">Initializing server...</p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #server-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        
        .loading-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 300px;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .loading-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
            margin-top: 20px;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            width: 0%;
            animation: progress 30s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        #loading-message {
            font-size: 14px;
            opacity: 0.9;
            margin: 10px 0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
}

// Update loading message
function updateLoadingMessage(message) {
    const messageEl = document.getElementById('loading-message');
    if (messageEl) {
        messageEl.textContent = message;
    }
}

// Hide loading indicator
function hideLoadingIndicator() {
    const overlay = document.getElementById('server-loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Show error dialog
function showErrorDialog(errorMessage) {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 10001;">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="color: #dc3545; margin-bottom: 20px;">⚠️ Server Start Failed</h3>
                <p style="margin-bottom: 20px; color: #666;">The automatic server start encountered an issue. This can happen due to system permissions or security settings.</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <strong>Quick Fix:</strong>
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        <li>Open Command Prompt</li>
                        <li>Navigate to: <code style="background: #e9ecef; padding: 2px 4px; border-radius: 3px;">F:\\Interavtive_Resume\\Interactive-Resume-Maker</code></li>
                        <li>Run: <code style="background: #e9ecef; padding: 2px 4px; border-radius: 3px; font-size: 12px;">npx webpack serve --config FrontEnd/Forest_Drive/webpack.config.js --mode development</code></li>
                        <li>Then click "Try Again" below</li>
                    </ol>
                </div>
                <div style="margin-top: 20px;">
                    <button onclick="startServerAndRedirect(); this.parentElement.parentElement.parentElement.remove();" style="background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px;">Try Again</button>
                    <button onclick="window.open('http://localhost:8080'); this.parentElement.parentElement.parentElement.remove();" style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px;">Open Scene</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove();" style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px;">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}
