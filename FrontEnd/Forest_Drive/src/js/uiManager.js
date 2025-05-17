import { resumeSectionsData, getSectionData, updateSectionTextContent, updateSectionMediaContent } from './dataManager.js'; // Assuming dataManager.js exists and exports these

export class UIManager {
    constructor() {
        this.panels = {};
        this.shownPanel = null;
        this.editModeSections = new Set();
        this.isUserLoggedIn = false; // SET TO true TO TEST LOGGED-IN STATE

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
            }

            // Setup text update buttons (actual update functionality is still commented out as per original)
            const updateTextButton = panelElement.querySelector(`.update-text-btn[data-section="${section.title}"]`);
            const textInput = panelElement.querySelector(`textarea[id="${section.title.toLowerCase()}-text-input"]`);
            if (updateTextButton && textInput) {
                // updateTextButton.addEventListener('click', () => {
                //     if (typeof updateSectionTextContent === 'function') {
                //         updateSectionTextContent(section.title, textInput.value);
                //         this.populatePanelContent(section.title); // Refresh content after saving
                //     } else {
                //        console.warn('updateSectionTextContent function not available.');
                //     }
                // });
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
            dropZoneDiv.style.display = 'none';
        } else {
            editModeButton.disabled = false;
            editModeButton.title = isEditingThisSection ? 'Click to finish editing' : 'Click to edit section';

            if (isEditingThisSection) {
                editModeButton.textContent = 'Finish Editing';
                editModeButton.classList.add('editing');
                mediaUploadDiv.style.display = 'block';
                dropZoneDiv.style.display = 'block';

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
            }
        }
    }

    handleToggleEditClick(sectionTitle) {
        const panel = this.panels[sectionTitle];
        if (!panel) return;

        const statusMessage = panel.querySelector(`.panel-status-message[data-section="${sectionTitle}"]`);

        if (!this.isUserLoggedIn) {
            if (statusMessage) {
                statusMessage.textContent = 'Edit is disabled since user is not logged in.';
                statusMessage.style.display = 'block';
            }
            return;
        }

        if (this.editModeSections.has(sectionTitle)) {
            this.editModeSections.delete(sectionTitle);
            // const textInput = panel.querySelector(`textarea[id="${sectionTitle.toLowerCase()}-text-input"]`);
            // if (typeof updateSectionTextContent === 'function') {
            //     updateSectionTextContent(sectionTitle, textInput.value);
            //     this.populatePanelContent(sectionTitle);
            // }
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
    }
}

export function createControlsInterface() { // This function might not be used if controls are static HTML
    const controlsUi = document.getElementById('controls-ui');
    if (controlsUi) controlsUi.style.display = 'block';
}