import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as C from './constants.js';
import { resumeSectionsData } from './dataManager.js'; // Get scroll positions and titles

const scrollsInScene = []; // Array to hold { mesh, position, title, uiManager }
let helvetikerFont = null; // Loaded font

export async function loadResumeFont(loadingManager) {
    const fontLoader = new FontLoader(loadingManager);
    try {
        helvetikerFont = await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json');
        console.log("Helvetiker font loaded.");
    } catch (error) {
        console.error("Failed to load Helvetiker font:", error);
        // No fallback for font currently, text on scrolls will not appear.
    }
}

export function createResumeScrolls(scene, pathCurveInstance, uiManagerInstance) {
    if (!helvetikerFont) {
        console.warn("Font not loaded. Scroll titles will not be rendered.");
    }
    if (!pathCurveInstance) {
        console.error("Path curve not available for placing scrolls.");
        return;
    }
     if (!uiManagerInstance) {
        console.error("UIManager not available for scrolls.");
        return;
    }

    // Clear existing scrolls if any
    scrollsInScene.forEach(scrollData => scene.remove(scrollData.mesh));
    scrollsInScene.length = 0;

    Object.values(resumeSectionsData).forEach(section => {
        const t = THREE.MathUtils.clamp(section.scrollPos, 0.05, 0.95); // Position along path (0 to 1)
        const pointOnPath = pathCurveInstance.getPointAt(t);
        const tangentToPath = pathCurveInstance.getTangentAt(t); // To orient scroll/card towards path

        createSingleScroll(scene, pointOnPath, tangentToPath, section.title, section.color, uiManagerInstance);
    });
}

function createSingleScroll(scene, position, direction, title, color, uiManager) {
    // Offset the scroll to the side of the path
    const sideOffsetMagnitude = C.ROAD_WIDTH / 2 + 8 + Math.random() * 10; // Randomize offset slightly
    const zOffsetMagnitude = (Math.random() - 0.5) * (C.PATH_LENGTH / 25); // Randomize Z position slightly

    const randomSide = Math.random() < 0.5 ? 1 : -1; // Place on left or right

    // Calculate perpendicular direction to the path tangent for X offset
    // Note: path tangent is in XZ plane, so cross with Y axis (0,1,0) or simply swap and negate Z
    C._v2.set(-direction.z * randomSide, 0, direction.x * randomSide).normalize().multiplyScalar(sideOffsetMagnitude);

    const scrollFinalPos = C._v1.copy(position).add(C._v2); // Add perpendicular offset
    scrollFinalPos.z += zOffsetMagnitude; // Add slight along-path offset
    scrollFinalPos.y = C.GROUND_Y; // Place scroll base on the ground

    // Scroll Mesh (Cylinder)
    const scrollGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.5, 16); // Slightly larger scroll
    const scrollMat = new THREE.MeshStandardMaterial({ color: 0xE0CBA8, roughness: 0.7, metalness: 0.1 });
    const scrollMesh = new THREE.Mesh(scrollGeo, scrollMat);
    scrollMesh.position.copy(scrollFinalPos);
    scrollMesh.position.y += 1.25; // Adjust Y so base is on ground (half height)
    scrollMesh.castShadow = true;
    scrollMesh.receiveShadow = true;
    scene.add(scrollMesh);

    // Card Mesh (Plane for Text)
    const cardGeo = new THREE.PlaneGeometry(2.4, 0.8); // Card size
    const cardMat = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.0,
        emissive: color, // Make card glow slightly with its color
        emissiveIntensity: 0.4
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(0, 1.5, 0); // Position card relative to scroll top
    scrollMesh.add(cardMesh); // Add card as child of scroll

    // Orient card to generally face the path (or camera, depending on desired effect)
    // For simplicity, make it look back towards the path point it's associated with.
    C._v3.set(position.x, scrollMesh.position.y + cardMesh.position.y, position.z);
    cardMesh.lookAt(C._v3);
    cardMesh.castShadow = true; // Small shadow, if any

    // Text on Card
    if (helvetikerFont) {
        try {
            const textGeo = new TextGeometry(title, {
                font: helvetikerFont,
                size: 0.28, // Slightly larger text
                height: 0.03, // Depth of text
                curveSegments: 4, // Simpler geometry for performance
            });
            textGeo.computeBoundingBox();
            const textCenterOffsetX = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
            const textMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
            textMesh.position.set(textCenterOffsetX, -0.12, 0.05); // Adjust text position on card
            cardMesh.add(textMesh);
        } catch(e) {
            console.error("Error creating text geometry for scroll:", title, e);
        }
    }

    scrollsInScene.push({
        mesh: scrollMesh,
        position: scrollMesh.position.clone(), // Store its world position
        title: title,
        uiManager: uiManager
    });
}

export function checkResumeScrollProximity(carObject) {
    if (!carObject || scrollsInScene.length === 0) return;

    const carPos = carObject.position;
    let closestScroll = null;
    let minDistance = C.SCROLL_PROXIMITY_THRESHOLD;

    scrollsInScene.forEach(scrollData => {
        const distanceToScroll = scrollData.position.distanceTo(carPos);
        if (distanceToScroll < minDistance) {
            minDistance = distanceToScroll;
            closestScroll = scrollData;
        }
    });

    const currentlyOpenPanel = scrollsInScene[0]?.uiManager.getOpenPanelTitle(); // Get from any scroll's UIManager

    if (closestScroll) {
        if (!scrollsInScene[0]?.uiManager.isOpen(closestScroll.title)) {
            scrollsInScene[0]?.uiManager.show(closestScroll.title);
        }
    } else {
        // If no scroll is within threshold, and a panel is open, close it.
        if (currentlyOpenPanel) {
            scrollsInScene[0]?.uiManager.hide(currentlyOpenPanel);
        }
    }
}

export function getResumeScrolls() {
    return scrollsInScene;
}