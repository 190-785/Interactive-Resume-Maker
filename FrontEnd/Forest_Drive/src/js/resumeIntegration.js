// resumeIntegration.js - Enhanced integration for Dashboard <-> Forest Drive

// Wait for the main document and 3D scene to be ready
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const backendUrl = 'http://localhost:8080';

    // --- State Variables ---
    let isLoggedIn = false;
    let currentResumeData = null;
    let isEditModeEnabled = false;
    let forestDriveMode = 'demo'; // 'edit', 'create', 'preview', or 'demo'

    // Check mode from localStorage (set by dashboard)
    const modeFromStorage = localStorage.getItem('forestDriveMode');
    if (modeFromStorage) {
        forestDriveMode = modeFromStorage;
        localStorage.removeItem('forestDriveMode'); // Clean up
    }

    // --- Authentication Check ---
    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (token) {
            isLoggedIn = true;
            console.log(`Forest Drive initialized in ${forestDriveMode} mode for authenticated user`);
        } else {
            isLoggedIn = false;
            forestDriveMode = 'demo';
            console.log('Forest Drive initialized in demo mode (no authentication)');
        }
        return isLoggedIn;
    }

    // --- API Functions ---
    async function fetchUserResume() {
        if (!isLoggedIn) {
            throw new Error('User not authenticated');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/resumes/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            // No resume exists yet
            return null;
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch resume: ${response.status}`);
        }

        return await response.json();
    }

    async function saveUserResume(resumeData) {
        if (!isLoggedIn) {
            throw new Error('User not authenticated');
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/resumes/me`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumeData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save resume: ${response.status}`);
        }

        return await response.json();
    }

    async function loadDefaultTemplate() {
        try {
            const response = await fetch(`${backendUrl}/api/resumes/default-template`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Could not load default template from backend, using local template');
        }

        // Fallback to local default template
        return {
            resumeName: "My Interactive Resume",
            aboutMe: "Welcome to my interactive forest resume! Click on the trees and objects to learn more about me.",
            skills: {
                technical: ["JavaScript", "HTML/CSS", "React", "Node.js"],
                soft: ["Communication", "Problem Solving", "Team Work", "Leadership"]
            },
            experience: [
                {
                    company: "Tech Company",
                    position: "Software Developer",
                    duration: "2022 - Present",
                    description: "Developing web applications and interactive experiences."
                }
            ],
            projects: [
                {
                    name: "Interactive Resume",
                    description: "A 3D forest-themed resume built with Three.js",
                    technologies: ["Three.js", "JavaScript", "HTML/CSS"]
                }
            ],
            education: [
                {
                    institution: "University",
                    degree: "Computer Science",
                    year: "2021",
                    description: "Studied software engineering and web development."
                }
            ],
            mediaUrls: {},
            isPublic: false
        };
    }

    // --- UI Creation Functions ---
    function createForestDriveUI() {
        // Create control panel container
        const controlPanel = document.createElement('div');
        controlPanel.id = 'forest-drive-controls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            min-width: 200px;
        `;

        // Create title
        const title = document.createElement('h3');
        title.textContent = getModeTitle();
        title.style.margin = '0 0 10px 0';
        controlPanel.appendChild(title);

        // Create buttons based on mode
        if (isLoggedIn) {
            if (forestDriveMode === 'edit' || forestDriveMode === 'create') {
                // Save button
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save Resume';
                saveButton.style.cssText = 'margin: 5px; padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;';
                saveButton.onclick = handleSaveResume;
                controlPanel.appendChild(saveButton);

                // Enable edit mode
                isEditModeEnabled = true;
            }

            // Back to Dashboard button
            const dashboardButton = document.createElement('button');
            dashboardButton.textContent = 'Back to Dashboard';
            dashboardButton.style.cssText = 'margin: 5px; padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';            dashboardButton.onclick = () => {
                window.location.href = 'http://localhost:5500/Login/dashboard.html';
            };
            controlPanel.appendChild(dashboardButton);

            // Logout button
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.style.cssText = 'margin: 5px; padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;';
            logoutButton.onclick = handleLogout;
            controlPanel.appendChild(logoutButton);
        } else {
            // Login button for demo mode
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Login to Edit';
            loginButton.style.cssText = 'margin: 5px; padding: 8px 15px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer;';
            loginButton.onclick = () => {
                window.location.href = '../../Login/Login_Page.html';
            };
            controlPanel.appendChild(loginButton);
        }

        document.body.appendChild(controlPanel);
    }

    function getModeTitle() {
        switch (forestDriveMode) {
            case 'edit':
                return '✏️ Editing Resume';
            case 'create':
                return '🆕 Creating Resume';
            case 'preview':
                return '👀 Previewing Resume';
            default:
                return '🌲 Forest Resume Demo';
        }
    }

    // --- Event Handlers ---
    async function handleSaveResume() {
        try {
            showSaveStatus('Saving resume...', true);
            
            // Collect data from the 3D scene panels
            const resumeData = collectResumeDataFromPanels();
            
            // Save to backend
            const savedResume = await saveUserResume(resumeData);
            currentResumeData = savedResume;
            
            showSaveStatus('Resume saved successfully!', true);
            
            // Optionally redirect back to dashboard after a short delay
            setTimeout(() => {                if (confirm('Resume saved! Would you like to return to the dashboard?')) {
                    window.location.href = 'http://localhost:5500/Login/dashboard.html';
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error saving resume:', error);
            showSaveStatus('Failed to save resume. Please try again.', false);
        }
    }

    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../../Login/Login_Page.html';
        }
    }

    // --- Data Collection Functions ---
    function collectResumeDataFromPanels() {
        // This function should collect data from your 3D scene panels
        // Adapt this to match your actual panel structure
        const resumeData = {
            id: currentResumeData?.id || null,
            resumeName: currentResumeData?.resumeName || "My Interactive Resume",
            aboutMe: getTextFromPanel('about-panel') || "",
            skills: collectSkillsData(),
            experience: collectExperienceData(),
            projects: collectProjectsData(),
            education: collectEducationData(),
            mediaUrls: currentResumeData?.mediaUrls || {},
            isPublic: currentResumeData?.isPublic || false
        };

        return resumeData;
    }

    function getTextFromPanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const textarea = panel.querySelector('textarea');
            const input = panel.querySelector('input[type="text"]');
            if (textarea) return textarea.value;
            if (input) return input.value;
        }
        return "";
    }

    function collectSkillsData() {
        // Implement based on your skills panel structure
        return currentResumeData?.skills || {};
    }

    function collectExperienceData() {
        // Implement based on your experience panel structure
        return currentResumeData?.experience || [];
    }

    function collectProjectsData() {
        // Implement based on your projects panel structure
        return currentResumeData?.projects || [];
    }

    function collectEducationData() {
        // Implement based on your education panel structure
        return currentResumeData?.education || [];
    }

    // --- Data Population Functions ---
    function populateAllPanels(resumeData) {
        if (!resumeData) return;

        currentResumeData = resumeData;

        // Populate each panel with the resume data
        populatePanel('about-panel', resumeData.aboutMe);
        // Add more population functions based on your panel structure
        
        console.log('Resume data populated into panels:', resumeData);
    }

    function populatePanel(panelId, data) {
        const panel = document.getElementById(panelId);
        if (panel && data) {
            const textarea = panel.querySelector('textarea');
            const input = panel.querySelector('input[type="text"]');
            if (textarea) textarea.value = data;
            if (input) input.value = data;
        }
    }

    // --- Status Display Functions ---
    function showSaveStatus(message, success = true) {
        // Create or update status display
        let statusDisplay = document.getElementById('save-status-display');
        if (!statusDisplay) {
            statusDisplay = document.createElement('div');
            statusDisplay.id = 'save-status-display';
            statusDisplay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                border-radius: 10px;
                color: white;
                font-weight: bold;
                z-index: 2000;
                text-align: center;
                min-width: 200px;
            `;
            document.body.appendChild(statusDisplay);
        }

        statusDisplay.textContent = message;
        statusDisplay.style.backgroundColor = success ? '#28a745' : '#dc3545';
        statusDisplay.style.display = 'block';

        setTimeout(() => {
            statusDisplay.style.display = 'none';
        }, 3000);
    }

    // --- Initialization Function ---
    async function initializeForestDrive() {
        try {
            console.log('Initializing Forest Drive...');
            
            checkAuthentication();
            createForestDriveUI();

            if (isLoggedIn) {
                console.log(`Loading in ${forestDriveMode} mode...`);
                
                try {
                    const resumeData = await fetchUserResume();
                    
                    if (resumeData) {
                        // User has existing resume data
                        populateAllPanels(resumeData);
                        console.log('Loaded existing resume data');
                    } else if (forestDriveMode === 'create' || forestDriveMode === 'edit') {
                        // Load default template for new resume
                        const defaultData = await loadDefaultTemplate();
                        populateAllPanels(defaultData);
                        console.log('Loaded default template for new resume');
                    }
                } catch (error) {
                    console.error('Error loading resume data:', error);
                    showSaveStatus('Failed to load resume data', false);
                    
                    // Fall back to default template
                    const defaultData = await loadDefaultTemplate();
                    populateAllPanels(defaultData);
                }
            } else {
                // Demo mode - load default template
                const defaultData = await loadDefaultTemplate();
                populateAllPanels(defaultData);
                console.log('Loaded demo template');
            }

            console.log('Forest Drive initialization complete');
            
        } catch (error) {
            console.error('Failed to initialize Forest Drive:', error);
            showSaveStatus('Failed to initialize Forest Drive', false);
        }
    }

    // --- Start Initialization ---
    // Give the 3D scene a moment to initialize before we start
    setTimeout(initializeForestDrive, 1000);
});
