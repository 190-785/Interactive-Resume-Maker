import * as THREE from 'three';
import { scene, applyTheme, directionalLight as sunLight, ambientLight, hemisphereLight } from './sceneSetup.js';
import { DAY_THEME, NIGHT_THEME, CAMERA_SETTINGS, VEHICLE_PHYSICS_CONFIG } from './constants.js';
import { getCar, carModel } from './vehicle.js';
import { updateSectionMediaContent } from './dataManager.js';

let gui;

const guiState = {
    theme: 'Day',
    sunIntensity: DAY_THEME.sunIntensity,
    ambientIntensity: DAY_THEME.ambientLightIntensity,
    cameraDistance: CAMERA_SETTINGS.distance,
    maxSpeed: VEHICLE_PHYSICS_CONFIG.maxSpeed,
};

export function initDatGUI() {
    if (typeof dat === 'undefined') {
        console.error("dat.GUI library not found.");
        return;
    }
    gui = new dat.GUI();

    const envFolder = gui.addFolder('Environment');
    envFolder.add(guiState, 'theme', ['Day', 'Night']).name('Theme').onChange(value => {
        applyTheme(value === 'Day' ? DAY_THEME : NIGHT_THEME);
        // Update linked GUI state for lights if theme changes them
        guiState.sunIntensity = (value === 'Day' ? DAY_THEME : NIGHT_THEME).sunIntensity;
        guiState.ambientIntensity = (value === 'Day' ? DAY_THEME : NIGHT_THEME).ambientLightIntensity;
        // Refresh other controllers if they exist
        gui.__controllers.forEach(controller => {
            if (controller.property === 'sunIntensity' || controller.property === 'ambientIntensity') {
                controller.updateDisplay();
            }
        });
    });
    envFolder.add(guiState, 'sunIntensity', 0, 5, 0.1).name('Sun Intensity').onChange(value => {
        if (sunLight) sunLight.intensity = value;
    });
    envFolder.add(guiState, 'ambientIntensity', 0, 3, 0.1).name('Ambient Light').onChange(value => {
        if (ambientLight) ambientLight.intensity = value;
    });
    // envFolder.open(); // Optionally open by default

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(guiState, 'cameraDistance', 5, 50, 1).name('Distance').onChange(value => {
        CAMERA_SETTINGS.distance = value; // Assuming camera updates elsewhere based on this
    });

    const vehicleFolder = gui.addFolder('Vehicle');
    vehicleFolder.add(guiState, 'maxSpeed', 5, 50, 1).name('Max Speed').onChange(value => {
        VEHICLE_PHYSICS_CONFIG.maxSpeed = value;
    });

    // You can add more controls for VEHICLE_PHYSICS_CONFIG.acceleration, etc.
}


export function setupDragAndDrop() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
        // Allow click to upload as well
        zone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = "image/*, video/*, audio/*, text/plain, .js, .html, .css, .md, .json"; // Specify acceptable file types
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    processFile(file, zone.dataset.section);
                }
            };
            input.click();
        });
    });
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('dragover');
    event.dataTransfer.dropEffect = 'copy'; // Show user it's a copy operation
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');

    const section = event.currentTarget.dataset.section;
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        processFile(file, section);
        event.dataTransfer.clearData(); // Recommended
    }
}

function processFile(file, sectionTitle) {
    const reader = new FileReader();
    const fileType = file.type;
    const fileName = file.name;

    console.log(`Processing file: ${fileName}, type: ${fileType}, for section: ${sectionTitle}`);

    if (fileType.startsWith('image/')) {
        reader.onload = (e) => updateSectionMediaContent(sectionTitle, 'image', e.target.result, fileName);
        reader.readAsDataURL(file);
    } else if (fileType.startsWith('video/')) {
        reader.onload = (e) => updateSectionMediaContent(sectionTitle, 'video', e.target.result, fileName);
        reader.readAsDataURL(file); // For preview; large videos better handled via URL
    } else if (fileType.startsWith('audio/')) {
        reader.onload = (e) => updateSectionMediaContent(sectionTitle, 'audio', e.target.result, fileName);
        reader.readAsDataURL(file);
    } else if (
        fileType.startsWith('text/') ||
        fileName.endsWith('.js') || fileName.endsWith('.json') ||
        fileName.endsWith('.html') || fileName.endsWith('.css') ||
        fileName.endsWith('.md')
    ) {
        reader.onload = (e) => updateSectionMediaContent(sectionTitle, 'text', e.target.result, fileName); // 'text' type for code/text display
        reader.readAsText(file);
    } else {
        alert(`File type ${fileType} not currently supported for preview in section ${sectionTitle}.`);
        console.warn(`Unsupported file type: ${fileType} for file ${fileName}`);
    }
}