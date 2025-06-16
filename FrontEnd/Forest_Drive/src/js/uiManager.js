import { resumeSectionsData, getSectionData, updateSectionTextContent, updateSectionMediaContent, loadUserResumeData } from './dataManager.js'; // Assuming dataManager.js exists and exports these

export class UIManager {
    constructor() {
        this.panels = {};
        this.shownPanel = null;        this.editModeSections = new Set();
        
        // Initialize login bridge for better cross-domain localStorage access
        this.loginBridge = new window.LoginBridge();
        
        // Check if user is logged in using improved detection
        this.isUserLoggedIn = this.loginBridge.isLoggedIn();
        
        // Store user data for database operations  
        this.currentUser = this.loginBridge.getUserData();
        this.resumeId = localStorage.getItem('editResumeId') || localStorage.getItem('previewResumeId');
        
        console.log('🚀 UIManager initialized with enhanced login detection');
        console.log('- User logged in:', this.isUserLoggedIn);
        console.log('- Current user:', this.currentUser);
        console.log('- Resume ID:', this.resumeId);
        
        // Show login status indicator
        this.showLoginStatus();
        
        // Load user's resume data if logged in
        if (this.isUserLoggedIn) {
            this.initializeUserData();
        }

        Object.values(resumeSectionsData).forEach(section => {
            const panelElement = document.getElementById(section.panelId);
            if (!panelElement) {
                console.warn(`UI panel not found for section: ${section.title} (ID: ${section.panelId})`);
                return;
            }
            this.panels[section.title] = panelElement;

            // Initial content population (HTML part)
            const contentDiv = panelElement.querySelector('.panel-content');
            if (contentDiv) {
                // Ensure getSectionData is available and provides htmlContent
                const sectionData = getSectionData(section.title);
                if (sectionData && sectionData.htmlContent) {
                    contentDiv.innerHTML = sectionData.htmlContent;
                } else {
                    console.warn(`HTML content not found for section: ${section.title}`);
                }
            }
            
            // Setup new edit mode button
            const editModeButton = panelElement.querySelector(`.edit-mode-btn[data-section="${section.title}"]`);
            if (editModeButton) {
                editModeButton.addEventListener('click', () => this.handleToggleEditClick(section.title));
            } else {
                console.warn(`Edit mode button not found for section: ${section.title}`);
            }

            // Setup close buttons
            const closeButton = panelElement.querySelector(`.close-panel-btn`);
            if (closeButton) {
                closeButton.addEventListener('click', () => this.hide(section.title));
            } else {
                console.warn(`Close button not found for section: ${section.title}`);
            }            // Setup text update buttons
            const updateTextButton = panelElement.querySelector(`.update-text-btn[data-section="${section.title}"]`);
            const textInput = panelElement.querySelector(`textarea[id="${section.title.toLowerCase()}-text-input"]`);
            if (updateTextButton && textInput) {
                updateTextButton.addEventListener('click', async () => {
                    const statusMessage = panelElement.querySelector(`.panel-status-message[data-section="${section.title}"]`);
                    
                    try {
                        // Show saving status
                        if (statusMessage) {
                            statusMessage.textContent = 'Saving changes...';
                            statusMessage.style.display = 'block';
                            statusMessage.style.color = '#17a2b8';
                        }
                        
                        // Save to database instead of local data
                        await this.saveToDatabase(section.title, textInput.value);
                        
                        // Update local display only after successful save
                        if (typeof updateSectionTextContent === 'function') {
                            updateSectionTextContent(section.title, textInput.value);
                            this.populatePanelContent(section.title);
                        }
                        
                        // Show success message
                        if (statusMessage) {
                            statusMessage.textContent = 'Changes saved to your resume!';
                            statusMessage.style.display = 'block';
                            statusMessage.style.color = '#28a745';
                            setTimeout(() => {
                                statusMessage.style.display = 'none';
                            }, 3000);
                        }
                    } catch (error) {
                        console.error('Error saving changes:', error);
                        
                        // Show error message
                        if (statusMessage) {
                            statusMessage.textContent = 'Failed to save changes. Please try again.';
                            statusMessage.style.display = 'block';
                            statusMessage.style.color = '#dc3545';
                            setTimeout(() => {
                                statusMessage.style.display = 'none';
                            }, 5000);
                        }
                    }
                });
            }
            
            // Initial state update for controls (edit button state, visibility of edit areas)
            this.updatePanelControlsState(section.title);
        });

        // Example of how resumeDataUpdated might be used if dataManager dispatches it
        // document.addEventListener('resumeDataUpdated', (event) => {
        //     const { sectionTitle } = event.detail;
        //     this.populatePanelContent(sectionTitle); 
        //     this.updatePanelControlsState(sectionTitle);
        // });
    }

    populatePanelContent(sectionTitle) {
        const sectionData = getSectionData(sectionTitle);
        const panel = this.panels[sectionTitle];
        if (!sectionData || !panel) return;

        const contentDiv = panel.querySelector('.panel-content');
        if (contentDiv && sectionData.htmlContent) {
            contentDiv.innerHTML = sectionData.htmlContent;
        }

        const mediaPreviewDiv = panel.querySelector(`#media-preview-${sectionTitle.toLowerCase()}`);
        if (mediaPreviewDiv) {
            mediaPreviewDiv.innerHTML = '';
            if (sectionData.media && sectionData.media.src) {
                if (sectionData.media.type === 'image') {
                    const img = document.createElement('img');
                    img.src = sectionData.media.src;
                    img.alt = sectionData.media.filename || 'Uploaded image';
                    mediaPreviewDiv.appendChild(img);
                } else if (sectionData.media.type === 'video') {
                    const video = document.createElement('video');
                    video.src = sectionData.media.src;
                    video.controls = true;
                    mediaPreviewDiv.appendChild(video);
                } else if (sectionData.media.type === 'text') {
                    const pre = document.createElement('pre');
                    pre.textContent = sectionData.media.src;
                    mediaPreviewDiv.appendChild(pre);
                } else if (sectionData.media.type === 'audio') {
                    const audio = document.createElement('audio');
                    audio.src = sectionData.media.src;
                    audio.controls = true;
                    mediaPreviewDiv.appendChild(audio);
                }
                const filenameP = document.createElement('p');
                filenameP.textContent = `File: ${sectionData.media.filename || 'N/A'}`;
                filenameP.style.fontSize = '0.8em';
                filenameP.style.marginTop = '5px';
                mediaPreviewDiv.appendChild(filenameP);
            }
        }
    }

    updatePanelControlsState(sectionTitle) {
        const panel = this.panels[sectionTitle];
        if (!panel) return;

        const sectionData = getSectionData(sectionTitle); // Needed for populating textarea
        const isLoggedIn = this.isUserLoggedIn;
        const isEditingThisSection = this.editModeSections.has(sectionTitle);

        const editModeButton = panel.querySelector(`.edit-mode-btn[data-section="${sectionTitle}"]`);
        const statusMessage = panel.querySelector(`.panel-status-message[data-section="${sectionTitle}"]`);
        const mediaUploadDiv = panel.querySelector(`.panel-media-upload[data-section="${sectionTitle}"]`);
        const dropZoneDiv = panel.querySelector(`.drop-zone[data-section="${sectionTitle}"]`);
        const textInput = panel.querySelector(`textarea[id="${sectionTitle.toLowerCase()}-text-input"]`);

        if (!editModeButton || !mediaUploadDiv || !dropZoneDiv || !textInput || !statusMessage) {
            console.warn("One or more control elements not found for section:", sectionTitle,
                {editModeButton, statusMessage, mediaUploadDiv, dropZoneDiv, textInput});
            return;
        }        
        statusMessage.style.display = 'none'; // Hide status message by default

        if (!isLoggedIn) {
            editModeButton.disabled = true;
            editModeButton.textContent = 'Edit';
            editModeButton.classList.remove('editing');
            editModeButton.title = 'Please login to enable editing.';
            mediaUploadDiv.style.display = 'none';
            dropZoneDiv.style.display = 'none';            textInput.disabled = true;
            textInput.placeholder = 'Login required to edit content';
        } else {
            editModeButton.disabled = false;
            editModeButton.title = isEditingThisSection ? 'Click to finish editing' : 'Click to edit section';

            if (isEditingThisSection) {
                editModeButton.textContent = 'Finish Editing';
                editModeButton.classList.add('editing');
                mediaUploadDiv.style.display = 'block';
                dropZoneDiv.style.display = 'block';
                textInput.disabled = false;
                textInput.placeholder = 'Enter your content here...';

                const panelContentDiv = panel.querySelector('.panel-content');
                if (panelContentDiv && document.activeElement !== textInput) {
                    // Fallback to innerText if editableText is not in sectionData
                    const editableText = sectionData.editableText !== undefined ? sectionData.editableText : panelContentDiv.innerText;
                    textInput.value = editableText;
                }
            } else {
                editModeButton.textContent = 'Edit';
                editModeButton.classList.remove('editing');
                mediaUploadDiv.style.display = 'none';
                dropZoneDiv.style.display = 'none';
                textInput.disabled = true;
                textInput.placeholder = 'Click Edit button to modify content';
            }        }
    }

    async handleToggleEditClick(sectionTitle) {
        const panel = this.panels[sectionTitle];
        if (!panel) return;

        const statusMessage = panel.querySelector(`.panel-status-message[data-section="${sectionTitle}"]`);

        if (!this.isUserLoggedIn) {
            if (statusMessage) {
                statusMessage.textContent = 'Edit is disabled since user is not logged in.';
                statusMessage.style.display = 'block';
            }
            return;
        }        if (this.editModeSections.has(sectionTitle)) {
            this.editModeSections.delete(sectionTitle);
            
            // Auto-save when finishing edit mode
            const textInput = panel.querySelector(`textarea[id="${sectionTitle.toLowerCase()}-text-input"]`);
            if (textInput && textInput.value.trim() !== '') {
                try {
                    // Show saving status
                    if (statusMessage) {
                        statusMessage.textContent = 'Auto-saving changes...';
                        statusMessage.style.display = 'block';
                        statusMessage.style.color = '#17a2b8';
                    }
                    
                    // Save to database
                    await this.saveToDatabase(sectionTitle, textInput.value);
                    
                    // Update local display after successful save
                    if (typeof updateSectionTextContent === 'function') {
                        updateSectionTextContent(sectionTitle, textInput.value);
                        this.populatePanelContent(sectionTitle);
                    }
                    
                    // Show success message
                    if (statusMessage) {
                        statusMessage.textContent = 'Changes auto-saved to your resume!';
                        statusMessage.style.display = 'block';
                        statusMessage.style.color = '#28a745';
                        setTimeout(() => {
                            statusMessage.style.display = 'none';
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error auto-saving:', error);
                    
                    // Show error message
                    if (statusMessage) {
                        statusMessage.textContent = 'Auto-save failed. Click "Update Text" to retry.';
                        statusMessage.style.display = 'block';
                        statusMessage.style.color = '#dc3545';
                        setTimeout(() => {
                            statusMessage.style.display = 'none';
                        }, 4000);
                    }
                }
            }
        } else {
            this.editModeSections.add(sectionTitle);
        }
        this.updatePanelControlsState(sectionTitle);
    }

    show(sectionTitle) {
        if (this.shownPanel && this.shownPanel !== sectionTitle) {
            this.hide(this.shownPanel);
        }
        const panel = this.panels[sectionTitle];
        if (panel && (!this.shownPanel || this.shownPanel !== sectionTitle)) {
            this.populatePanelContent(sectionTitle);
            this.updatePanelControlsState(sectionTitle);
            panel.style.display = 'block';
            this.shownPanel = sectionTitle;
        }
    }

    hide(sectionTitle) {
        const panel = this.panels[sectionTitle];
        if (panel && this.shownPanel === sectionTitle) {
            panel.style.display = 'none';
            if (this.editModeSections.has(sectionTitle)) {
                this.editModeSections.delete(sectionTitle);
                // Call updatePanelControlsState to reset button text and hide edit areas,
                // though panel is hidden, it ensures correct state if reopened quickly.
                this.updatePanelControlsState(sectionTitle);
            }
            this.shownPanel = null;
        }
    }

    isOpen(sectionTitle) {
        return this.shownPanel === sectionTitle;
    }

    getOpenPanelTitle() {
        return this.shownPanel;
    }    showLoginStatus() {
        // Show login status indicator
        const loginStatusDiv = document.getElementById('login-status');
        const loginStatusText = document.getElementById('login-status-text');
        const loginStatusDetail = document.getElementById('login-status-detail');
        
        if (loginStatusDiv && loginStatusText && loginStatusDetail) {
            if (this.isUserLoggedIn) {
                const username = this.currentUser?.username || this.currentUser?.fullName || 'User';
                loginStatusText.textContent = `✅ Logged in as ${username}`;
                loginStatusDetail.textContent = 'Edit functionality enabled';
                loginStatusDiv.style.background = 'rgba(40, 167, 69, 0.8)'; // Green
            } else {
                loginStatusText.textContent = '❌ Not Logged In';
                loginStatusDetail.textContent = 'Login from dashboard to edit';
                loginStatusDiv.style.background = 'rgba(220, 53, 69, 0.8)'; // Red
            }
            loginStatusDiv.style.display = 'block';
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                if (loginStatusDiv) {
                    loginStatusDiv.style.opacity = '0.6';
                }
            }, 8000);
        }
    }    checkUserLoginStatus() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('🔍 UIManager Login Check:');
        console.log('- Token present:', !!token);
        console.log('- User data present:', !!user);
        console.log('- Token value:', token ? token.substring(0, 20) + '...' : 'null');
        console.log('- User value:', user ? user.substring(0, 50) + '...' : 'null');
        
        // More thorough check
        if (token && user) {
            try {
                const userData = JSON.parse(user);
                console.log('- Parsed user data:', userData);
                if (userData && (userData.username || userData.email || userData.fullName)) {
                    console.log('✅ Login validation SUCCESS');
                    return true;
                }
                console.log('❌ Login validation FAILED - invalid user data structure');
            } catch (e) {
                console.warn('❌ Login validation FAILED - JSON parse error:', e);
            }
        } else {
            console.log('❌ Login validation FAILED - missing token or user data');
        }
        
        // Fallback check - just token (less secure but more compatible)
        const hasToken = !!token;
        console.log('- Fallback token check:', hasToken);
        return hasToken;
    }    getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user');
            console.log('🔍 Getting current user from localStorage...');
            console.log('- Raw user string:', userStr ? userStr.substring(0, 100) + '...' : 'null');
            
            if (userStr) {
                const userData = JSON.parse(userStr);
                console.log('- Parsed user data:', userData);
                return userData;
            }
            console.log('- No user data found in localStorage');
        } catch (e) {
            console.warn('❌ Could not parse user data:', e);
        }
        return null;
    }    // Save changes to database instead of local data
    async saveToDatabase(sectionTitle, newText) {
        if (!this.isUserLoggedIn) {
            throw new Error('User not logged in');
        }

        const token = this.loginBridge.getToken();
        const backendUrl = 'http://localhost:8080';
        
        // Prepare the data for the specific section
        const updateData = {};
        
        // Map section titles to backend fields
        const sectionMapping = {
            'About': 'aboutMe',
            'Skills': 'skills', 
            'Experience': 'experience',
            'Projects': 'projects',
            'Education': 'education',
            'Contact': 'contact'
        };
        
        const fieldName = sectionMapping[sectionTitle] || sectionTitle.toLowerCase();
        updateData[fieldName] = newText;

        const url = this.resumeId 
            ? `${backendUrl}/api/resumes/${this.resumeId}`
            : `${backendUrl}/api/resumes/me`;

        const method = this.resumeId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save to database: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Successfully saved to database:', result);
        return result;
    }    // Load user's resume data from database
    async loadFromDatabase() {
        if (!this.isUserLoggedIn) {
            return null;
        }

        const token = this.loginBridge.getToken();
        const backendUrl = 'http://localhost:8080';
        
        const url = this.resumeId 
            ? `${backendUrl}/api/resumes/${this.resumeId}`
            : `${backendUrl}/api/resumes/me`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                console.log('No resume found for user, will use default template');
                return null;
            }

            if (!response.ok) {
                throw new Error(`Failed to load from database: ${response.status}`);
            }

            const resumeData = await response.json();
            console.log('Loaded resume data from database:', resumeData);
            return resumeData;
        } catch (error) {
            console.error('Error loading resume from database:', error);
            return null;
        }
    }    async initializeUserData() {
        try {
            // Use the new loadUserResumeData function from dataManager
            const dataLoaded = await loadUserResumeData();
            
            if (dataLoaded) {
                console.log('✅ User resume data loaded from MongoDB successfully');
                // Repopulate all panels with the new data
                Object.values(resumeSectionsData).forEach(section => {
                    this.populatePanelContent(section.title);
                });
            } else {
                console.log('📄 Using default template (no user data or not logged in)');
            }
        } catch (error) {
            console.error('❌ Error loading user data:', error);
        }
    }

    populateWithUserData(resumeData) {
        // Map backend data to UI sections
        const dataMapping = {
            'About': resumeData.aboutMe,
            'Skills': resumeData.skills,
            'Experience': resumeData.experience,
            'Projects': resumeData.projects,
            'Education': resumeData.education,
            'Contact': resumeData.contact
        };

        Object.entries(dataMapping).forEach(([sectionTitle, userData]) => {
            if (userData && this.panels[sectionTitle]) {
                const panel = this.panels[sectionTitle];
                const contentDiv = panel.querySelector('.panel-content');
                
                if (contentDiv) {
                    // Update the display content with user's data
                    contentDiv.innerHTML = `<p>${userData}</p>`;
                    
                    // Also update the textarea for editing
                    const textInput = panel.querySelector(`textarea[id="${sectionTitle.toLowerCase()}-text-input"]`);
                    if (textInput) {
                        textInput.value = userData;
                    }
                }
            }
        });
    }

}

export function createControlsInterface() { // This function might not be used if controls are static HTML
    const controlsUi = document.getElementById('controls-ui');
    if (controlsUi) controlsUi.style.display = 'block';
}