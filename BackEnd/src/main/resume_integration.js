// forest_resume/js/resume_integration.js

// Wait for the main document and potentially the 3D scene to be somewhat ready
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const backendUrl = 'http://localhost:8080'; // Your Spring Boot backend URL

    // --- State Variables ---
    let isLoggedIn = false;
    let currentResumeData = null; // Holds the complete resume object from backend
    let isEditModeEnabled = false; // Tracks if editing is currently allowed

    // --- UI Elements (from your forest_resume/index.html) ---
    // Loading/Error/Status messages
    const globalLoadingIndicator = document.getElementById('loading-screen'); // Use your existing loading screen
    const globalErrorMessage = document.getElementById('error-message'); // Use your existing error display
    const saveStatusDisplay = document.createElement('div'); // We'll create and append this
    saveStatusDisplay.id = 'save-status-display';
    saveStatusDisplay.className = 'save-status'; // Add CSS for this
    document.body.appendChild(saveStatusDisplay); // Append to body or a specific UI container

    // Panels (assuming these exist in your forest_resume/index.html)
    const aboutPanel = document.getElementById('about-panel');
    const skillsPanel = document.getElementById('skills-panel');
    const experiencePanel = document.getElementById('experience-panel');
    const projectsPanel = document.getElementById('projects-panel');
    const educationPanel = document.getElementById('education-panel');

    // Buttons (we will create these dynamically or assume they are added to forest_resume/index.html)
    let saveResumeButton;
    let logoutButton;
    let loginButton; // To show if not logged in

    // --- Helper Functions ---

    function showGlobalLoading(show, message = "Loading...") {
        if (globalLoadingIndicator) {
            globalLoadingIndicator.style.display = show ? 'flex' : 'none';
            if (show) {
                const loadingText = globalLoadingIndicator.querySelector('#loading-text');
                if (loadingText) loadingText.textContent = message;
            }
        }
    }

    function showGlobalError(message) {
        if (globalErrorMessage) {
            globalErrorMessage.textContent = message;
            globalErrorMessage.style.display = 'block';
            setTimeout(() => { globalErrorMessage.style.display = 'none'; }, 5000);
        }
        showGlobalLoading(false);
    }

    function showSaveStatus(message, success = true) {
        saveStatusDisplay.textContent = message;
        saveStatusDisplay.className = success ? 'save-status success' : 'save-status error';
        saveStatusDisplay.style.display = 'block';
        setTimeout(() => { saveStatusDisplay.style.display = 'none'; }, 3000);
    }

    async function fetchData(endpoint, options = {}, requiresAuth = true) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token = localStorage.getItem('jwtToken');

        if (requiresAuth && token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else if (requiresAuth && !token) {
            console.warn("Auth required but no token for:", endpoint);
            // This will likely result in a 401/403 from the backend, which we'll handle
        }

        try {
            const response = await fetch(`${backendUrl}${endpoint}`, { ...options, headers });
            return response;
        } catch (error) {
            console.error('Network or fetch error:', error);
            showGlobalError('Network error. Could not connect to the server.');
            throw error; // Re-throw for specific handling if needed
        }
    }

    // --- Data Population Functions for Panels ---

    function populateAboutPanel(data) {
        if (!aboutPanel) return;
        const contentDiv = aboutPanel.querySelector('.panel-content');
        const textInput = aboutPanel.querySelector('#about-text-input');
        if (contentDiv) {
            // Assuming 'aboutMeText' is a field in your Resume model
            contentDiv.innerHTML = `<p>${data.aboutMeText || "About section is empty."}</p>`;
        }
        if (textInput) textInput.value = data.aboutMeText || "";
        // Media preview for about section (if you implement media uploads)
        // const mediaPreview = aboutPanel.querySelector('#media-preview-about');
    }

    function populateSkillsPanel(data) {
        if (!skillsPanel) return;
        const contentDiv = skillsPanel.querySelector('.panel-content');
        const textInput = skillsPanel.querySelector('#skills-text-input');

        if (contentDiv) {
            let html = '';
            // Assuming 'skillsOverviewText' for paragraph form and 'skills' (list) for keywords
            if (data.skillsOverviewText) {
                html += `<p>${data.skillsOverviewText.replace(/\n/g, '<br>')}</p><hr class="my-2">`;
            }
            if (data.skills && data.skills.length > 0) {
                html += '<h3>Key Skills:</h3><ul class="list-disc list-inside">';
                data.skills.forEach(skill => { html += `<li>${skill}</li>`; });
                html += '</ul>';
            } else if (!data.skillsOverviewText) {
                html = "<p>Skills section is empty.</p>";
            }
            contentDiv.innerHTML = html;
        }
        if (textInput) textInput.value = data.skillsOverviewText || ""; // Or decide how to map this
        // Media preview for skills
    }

    function populateExperiencePanel(data) {
        if (!experiencePanel) return;
        const contentDiv = experiencePanel.querySelector('.panel-content');
        const textInput = experiencePanel.querySelector('#experience-text-input'); // This might need to be per-entry

        if (contentDiv) {
            contentDiv.innerHTML = ''; // Clear previous
            if (data.experience && data.experience.length > 0) {
                data.experience.forEach((exp, index) => {
                    let responsibilitiesHtml = '';
                    if (exp.responsibilities && exp.responsibilities.length > 0) {
                        responsibilitiesHtml = `<ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>`;
                    }
                    contentDiv.innerHTML += `
                        <div class="experience-entry mb-3" data-index="${index}">
                            <h3>${exp.jobTitle || 'Job Title'} - ${exp.company || 'Company'}</h3>
                            <p class="text-sm">${exp.dates || 'Dates'}</p>
                            ${responsibilitiesHtml}
                            ${exp.customText ? `<p class="custom-text-display mt-1 italic text-gray-600">${exp.customText.replace(/\n/g, '<br>')}</p>` : ''}
                            </div>`;
                });
            } else {
                contentDiv.innerHTML = "<p>No experience entries yet.</p>";
            }
        }
        // For a general text input for the whole experience section (if that's the design)
        // if (textInput && data.someGeneralExperienceText) textInput.value = data.someGeneralExperienceText;
    }
    // Repeat populateProjectPanel and populateEducationPanel similarly to populateExperiencePanel,
    // mapping fields from data.projects and data.education to their respective panel structures.

    function populateProjectsPanel(data) {
        if (!projectsPanel) return;
        const contentDiv = projectsPanel.querySelector('.panel-content');
        if (contentDiv) {
            contentDiv.innerHTML = ''; // Clear previous
            if (data.projects && data.projects.length > 0) {
                data.projects.forEach((proj, index) => {
                    contentDiv.innerHTML += `
                        <div class="project-entry mb-3" data-index="${index}">
                            <h3>${proj.projectName || 'Project Name'}</h3>
                            <p>${proj.description || 'Description'}</p>
                            ${proj.technologiesUsed ? `<p class="text-sm">Tech: ${proj.technologiesUsed}</p>` : ''}
                            ${proj.customText ? `<p class="custom-text-display mt-1 italic text-gray-600">${proj.customText.replace(/\n/g, '<br>')}</p>` : ''}
                        </div>`;
                });
            } else {
                contentDiv.innerHTML = "<p>No project entries yet.</p>";
            }
        }
    }

    function populateEducationPanel(data) {
        if (!educationPanel) return;
        const contentDiv = educationPanel.querySelector('.panel-content');
        if (contentDiv) {
            contentDiv.innerHTML = ''; // Clear previous
            if (data.education && data.education.length > 0) {
                data.education.forEach((edu, index) => {
                    contentDiv.innerHTML += `
                        <div class="education-entry mb-3" data-index="${index}">
                            <h3>${edu.degree || 'Degree'}</h3>
                            <p>${edu.institution || 'Institution'} | ${edu.dates || 'Dates'}</p>
                            ${edu.details ? `<p class="text-sm">${edu.details}</p>` : ''}
                            ${edu.customText ? `<p class="custom-text-display mt-1 italic text-gray-600">${edu.customText.replace(/\n/g, '<br>')}</p>` : ''}
                        </div>`;
                });
            } else {
                contentDiv.innerHTML = "<p>No education entries yet.</p>";
            }
        }
    }


    function populateAllPanels(data) {
        currentResumeData = data; // Store the fetched data globally
        if (!data) {
            showGlobalError("No resume data to display.");
            return;
        }
        populateAboutPanel(data);
        populateSkillsPanel(data);
        populateExperiencePanel(data);
        populateProjectsPanel(data);
        populateEducationPanel(data);
        // Any other general UI updates based on data
        showGlobalLoading(false); // Hide loading screen after data is populated
    }

    // --- Edit Mode and Saving ---
    function toggleEditMode(enable) {
        isEditModeEnabled = enable;
        document.querySelectorAll('.panel-media-upload').forEach(el => {
            el.style.display = enable ? 'block' : 'none';
        });
        // You might want to make panel-content divs contentEditable or provide more specific input fields
        // For now, we rely on the textareas in panel-media-upload
        if (saveResumeButton) saveResumeButton.style.display = enable ? 'inline-block' : 'none';

        // If not logged in (demo mode for Yash Agarwal's resume), explicitly say no changes allowed.
        if (!isLoggedIn && !enable) { // This means we are showing default and editing is off
             // You can add a message to each panel or a global one
        }
    }

    function gatherDataFromPanels() {
        // Create a deep copy to avoid modifying currentResumeData directly until save is successful
        const updatedData = JSON.parse(JSON.stringify(currentResumeData || Resume.createDefaultTemplate())); // Start with current or default as base

        // About Panel
        const aboutTextArea = aboutPanel?.querySelector('#about-text-input');
        if (aboutTextArea) updatedData.aboutMeText = aboutTextArea.value;

        // Skills Panel
        const skillsTextArea = skillsPanel?.querySelector('#skills-text-input');
        if (skillsTextArea) updatedData.skillsOverviewText = skillsTextArea.value;
        // For keyword skills, you'd need a different input mechanism (e.g., tag input)

        // Experience Panel - This is more complex if you have multiple entries
        // For simplicity, if #experience-text-input is for general text:
        const expGeneralTextArea = experiencePanel?.querySelector('#experience-text-input');
        if (expGeneralTextArea && updatedData.experience && updatedData.experience.length > 0) {
             // This assumes the textarea updates the *first* experience item's customText.
             // You'll need a more robust way to map textareas to specific entries if you have multiple.
            updatedData.experience[0].customText = expGeneralTextArea.value;
        } else if (expGeneralTextArea && (!updatedData.experience || updatedData.experience.length === 0)) {
            // If no experience entries exist, but there's a general textarea,
            // you might want to create a new entry or handle it differently.
            // For now, let's assume it updates a placeholder customText for the first entry.
            // This part needs careful design based on how you want editing to work for lists.
            // A better approach for lists: have a textarea PER entry.
        }
        // Similarly for Projects and Education, map the textareas to the `customText` field of the respective entries.
        // Example for Projects (assuming first project's customText):
        const projGeneralTextArea = projectsPanel?.querySelector('#projects-text-input');
        if (projGeneralTextArea && updatedData.projects && updatedData.projects.length > 0) {
            updatedData.projects[0].customText = projGeneralTextArea.value;
        }
        // Example for Education (assuming first education's customText):
        const eduGeneralTextArea = educationPanel?.querySelector('#education-text-input');
        if (eduGeneralTextArea && updatedData.education && updatedData.education.length > 0) {
            updatedData.education[0].customText = eduGeneralTextArea.value;
        }


        // TODO: Handle media uploads if you implement them. Store URLs in mediaUrl fields.
        return updatedData;
    }

    async function handleSaveResume() {
        if (!isLoggedIn) {
            showGlobalError("You must be logged in to save changes.");
            return;
        }
        showSaveStatus("Saving resume...", false);
        const dataToSave = gatherDataFromPanels();

        try {
            const response = await fetchData('/api/resumes/me', {
                method: 'POST',
                body: JSON.stringify(dataToSave)
            }, true);

            if (response.ok) {
                currentResumeData = await response.json(); // Update with saved data (e.g., new IDs)
                populateAllPanels(currentResumeData); // Re-populate to reflect saved state
                showSaveStatus("Resume saved successfully!", true);
            } else {
                const errorResult = await response.json();
                showGlobalError(`Save failed: ${errorResult.message || response.statusText}`);
                showSaveStatus("Save failed.", false);
            }
        } catch (error) {
            showGlobalError("Error saving resume. Check console.");
            showSaveStatus("Save failed.", false);
        }
    }

    // --- Authentication and Initialization ---
    function handleLogout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        isLoggedIn = false;
        currentResumeData = null;
        // Redirect to login page or reload to show default
        window.location.href = '../../auth/index.html'; // Adjust path if needed
    }

    function createAuthButtons() {
        const controlsContainer = document.getElementById('controls-ui') || document.body; // Or another suitable container

        // Clear existing auth buttons if any (e.g., on re-init)
        if (loginButton && loginButton.parentElement) loginButton.remove();
        if (saveResumeButton && saveResumeButton.parentElement) saveResumeButton.remove();
        if (logoutButton && logoutButton.parentElement) logoutButton.remove();


        if (isLoggedIn) {
            if (!saveResumeButton) {
                saveResumeButton = document.createElement('button');
                saveResumeButton.id = 'save-resume-btn';
                saveResumeButton.textContent = 'Save My Resume';
                saveResumeButton.className = 'auth-button save-button'; // Add CSS
                saveResumeButton.addEventListener('click', handleSaveResume);
            }
            controlsContainer.appendChild(saveResumeButton);
            saveResumeButton.style.display = 'inline-block';


            if (!logoutButton) {
                logoutButton = document.createElement('button');
                logoutButton.id = 'logout-btn';
                logoutButton.textContent = 'Logout';
                logoutButton.className = 'auth-button logout-button'; // Add CSS
                logoutButton.addEventListener('click', handleLogout);
            }
            controlsContainer.appendChild(logoutButton);
            logoutButton.style.display = 'inline-block';

            if (loginButton) loginButton.style.display = 'none';

        } else { // Not logged in
            if (!loginButton) {
                loginButton = document.createElement('button');
                loginButton.id = 'login-btn';
                loginButton.textContent = 'Login to Edit';
                loginButton.className = 'auth-button login-button'; // Add CSS
                loginButton.addEventListener('click', () => {
                    window.location.href = '../../auth/index.html'; // Adjust path
                });
            }
            controlsContainer.appendChild(loginButton);
            loginButton.style.display = 'inline-block';

            if (saveResumeButton) saveResumeButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
        }
    }


    async function initializeResume() {
        showGlobalLoading(true, "Loading resume data...");
        const token = localStorage.getItem('jwtToken');

        if (token) {
            isLoggedIn = true;
            try {
                const response = await fetchData('/api/resumes/me', {}, true);
                if (response.ok) {
                    const userData = await response.json();
                    populateAllPanels(userData);
                    toggleEditMode(true); // User is logged in, has data, enable editing
                } else if (response.status === 404) { // User logged in, but no resume yet
                    // Fetch default Yash Agarwal resume to use as a template
                    const defaultResponse = await fetchData('/api/resumes/default-template', {}, false);
                    if (defaultResponse.ok) {
                        const defaultData = await defaultResponse.json();
                        // Critical: Nullify ID and UserID so it's saved as a new doc for this user
                        defaultData.id = null;
                        defaultData.userId = null;
                        populateAllPanels(defaultData);
                        toggleEditMode(true); // Enable editing for their new resume
                        showSaveStatus("Welcome! Fill in your details and save.", false);
                    } else {
                        throw new Error(`Failed to load default template: ${defaultResponse.statusText}`);
                    }
                } else if (response.status === 401 || response.status === 403) {
                    // Token invalid or expired
                    console.warn("Token invalid/expired. Logging out.");
                    handleLogout(); // This will redirect, so further execution might stop
                    return; // Important to prevent further processing if redirecting
                }
                else {
                    throw new Error(`Failed to load user resume: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error fetching user resume:", error);
                showGlobalError("Could not load your resume. Displaying default.");
                // Fallback to default if user-specific fetch fails critically after login
                isLoggedIn = false; // Treat as not logged in for data display
                await loadDefaultResumeForDemo();
            }
        } else { // Not logged in
            isLoggedIn = false;
            await loadDefaultResumeForDemo();
        }
        createAuthButtons(); // Create or update visibility of auth buttons
        showGlobalLoading(false);
    }

    async function loadDefaultResumeForDemo() {
        isLoggedIn = false; // Ensure this is set
        try {
            const response = await fetchData('/api/resumes/default-template', {}, false);
            if (response.ok) {
                const defaultData = await response.json();
                populateAllPanels(defaultData);
                toggleEditMode(false); // Demo mode, no editing
            } else {
                throw new Error(`Failed to load default resume: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error fetching default resume:", error);
            showGlobalError("Could not load default resume. Please try again later.");
            // Display some minimal content or a clearer error on the page itself
        }
    }

    // --- Event Listeners for Panel Text Updates (if using the textareas in each panel) ---
    document.querySelectorAll('.update-text-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!isEditModeEnabled) return;
            const section = event.target.dataset.section;
            const panel = document.getElementById(`${section.toLowerCase()}-panel`);
            const textarea = panel?.querySelector(`#${section.toLowerCase()}-text-input`);
            const contentDiv = panel?.querySelector('.panel-content');

            if (textarea && contentDiv) {
                const newText = textarea.value;
                // This is a simplified update. You'll need to map this newText
                // to the correct field in `currentResumeData` before calling gatherDataFromPanels
                // or directly update the display and then `gatherDataFromPanels` will pick it up.
                // For example, for 'About' section:
                if (section === "About") {
                    contentDiv.innerHTML = `<p>${newText.replace(/\n/g, '<br>')}</p>`;
                    if(currentResumeData) currentResumeData.aboutMeText = newText;
                }
                // Add similar logic for other sections, or make gatherDataFromPanels more robust
                // to read directly from these textareas.
                console.log(`Text updated for ${section}. Remember to save overall changes.`);
            }
        });
    });


    // --- Initialize ---
    initializeResume();

});
