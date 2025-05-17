import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as C from './constants.js';
import { displayGlobalError, hideGlobalError } from './utils.js';
import { initScene, initCamera, initRenderer, initLights, initControls, onWindowResize as sceneOnWindowResize, camera as mainCamera, renderer as mainRenderer, controls as mainControls, scene as mainScene, applyTheme } from './sceneSetup.js';
import { UIManager, createControlsInterface } from './uiManager.js';
import { createGround, createRoad, createPathSpline, placeTreesAlongPath, pathCurve as mainPathCurve } from './environment.js';
import { loadResumeFont, createResumeScrolls, checkResumeScrollProximity } from './resumeContent.js';
import { setupVehicleControlsListeners, processVehicleControls, updateVehiclePosition, setCarModel, getCar, getCarVelocity } from './vehicle.js';
import { initDatGUI, setupDragAndDrop } from './userInteraction.js';

let 성공적으로초기화됨 = false; // window.initialized
let loadingManager;
let timeoutHandle;
let uiManagerInstance;
let assets; // To store loaded assets

const clock = new THREE.Clock();

// --- Loading Screen ---
const loadingContainer = document.getElementById('loading-screen');
const loadingProgressElement = document.getElementById('loading-progress');

function showLoadingError(message) {
    clearTimeout(timeoutHandle); // Clear loading timeout
    displayGlobalError(message);
    if (loadingContainer) loadingContainer.style.display = 'none'; // Hide loading screen
}

async function loadAllAssets() {
    loadingManager = new THREE.LoadingManager(
        // All critical assets loaded successfully
        () => {
            console.log('All critical assets loaded via LoadingManager!');
            clearTimeout(timeoutHandle);
            if (!성공적으로초기화됨) {
                성공적으로초기화됨 = true;
                if (loadingContainer) loadingContainer.style.opacity = '0';
                setTimeout(() => {
                    if (loadingContainer) loadingContainer.style.display = 'none';
                    hideGlobalError(); // Hide any previous transient errors if loading succeeded
                    initializeExperience(); // Proceed to initialize the rest of the experience
                }, 1000); // Wait for fade out
            }
        },
        // Progress
        (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            if (loadingProgressElement) loadingProgressElement.style.width = `${progress}%`;
            // console.log(`Loading: ${url} (${itemsLoaded}/${itemsTotal})`);
        },
        // Error during loading via manager
        (url) => {
            console.error(`Error loading asset via manager: ${url}`);
            showLoadingError(`Failed to load critical asset: ${url}. Please try refreshing.`);
            // No throw here, error is displayed, experience won't start.
        }
    );

    timeoutHandle = setTimeout(() => {
        if (!성공적으로초기화됨) {
            console.error('Loading timeout. Check network tab for stalled resources.');
            showLoadingError('Loading assets took too long. Please check your connection and try refreshing.');
        }
    }, C.LOAD_TIMEOUT);

    const appTextureLoader = new THREE.TextureLoader(loadingManager);
    const objLoader = new OBJLoader(loadingManager);
    const mtlLoader = new MTLLoader(loadingManager);

    // Start font loading (part of critical assets)
    await loadResumeFont(loadingManager); // Font for scrolls

    try {
        // Load car (OBJ/MTL)
        const carMtl = await mtlLoader.loadAsync('assets/car/Humvee.mtl');
        carMtl.preload();
        objLoader.setMaterials(carMtl);
        const loadedCarModel = await objLoader.loadAsync('assets/car/Humvee.obj');

        // Load tree (OBJ/MTL)
        const treeMtl = await mtlLoader.loadAsync('assets/low_poly_tree/Lowpoly_tree_sample.mtl');
        treeMtl.preload();
        objLoader.setMaterials(treeMtl); // Reset materials for the next OBJ load
        const loadedTreeModel = await objLoader.loadAsync('assets/low_poly_tree/Lowpoly_tree_sample.obj');

        return {
            textureLoader: appTextureLoader, // Pass this for other texture loads if needed
            carModel: loadedCarModel,
            treeModel: loadedTreeModel
        };
    } catch (error) {
        console.error('Error in loadAllAssets promise chain:', error);
        showLoadingError(`Asset loading failed: ${error.message}. Try refreshing.`);
        throw error; // Propagate to stop further execution if a core asset fails catastrophically
    }
}


function setupCar(loadedCarModel) {
    loadedCarModel.scale.set(0.02, 0.02, 0.02); // Apply scale

    // Position car at the start of the path
    if (mainPathCurve) {
        const startPoint = mainPathCurve.getPointAt(0);
        const lookAtPoint = mainPathCurve.getPointAt(0.005); // Look slightly ahead
        loadedCarModel.position.set(startPoint.x, C.PATH_ELEMENT_Y, startPoint.z);
        loadedCarModel.lookAt(lookAtPoint.x, C.PATH_ELEMENT_Y, lookAtPoint.z);
    } else {
        loadedCarModel.position.set(0, C.PATH_ELEMENT_Y, -C.PATH_LENGTH / 2 + 20); // Fallback position
    }

    // Set shadows for all car meshes
    loadedCarModel.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true; // Car parts can cast shadows on other car parts

            // --- TRANSPARENCY DEBUG (from original) ---
            // if (child.material && !Array.isArray(child.material)) {
            //     const mat = child.material;
            //     mat.transparent = true;
            //     mat.opacity = 0.8; // Adjust opacity
            //     mat.needsUpdate = true;
            // } else if (Array.isArray(child.material)) {
            //     child.material.forEach(mat => {
            //         mat.transparent = true;
            //         mat.opacity = 0.8;
            //         mat.needsUpdate = true;
            //     });
            // }
        }
    });
    mainScene.add(loadedCarModel);
    setCarModel(loadedCarModel); // Register with vehicle module
}


async function initializeExperience() {
    try {
        // Basic scene components
        initScene(); // Creates mainScene
        initCamera(); // Creates mainCamera
        initRenderer(); // Creates mainRenderer
        initLights(); // Adds lights to mainScene
        initControls(mainCamera, mainRenderer.domElement); // Creates mainControls

        // Create path spline first as other elements might depend on it
        createPathSpline();

        // Load assets (ground textures will use the textureLoader from assets)
        // Assets are now loaded by loadAllAssets and passed to initializeExperience indirectly via `assets`
        createGround(mainScene, assets.textureLoader);
        createRoad(mainScene);

        // Setup car model (already loaded)
        setupCar(assets.carModel);

        // Place trees (tree model already loaded)
        const sceneTrees = placeTreesAlongPath(mainScene, assets.treeModel);

        // UI and Content
        uiManagerInstance = new UIManager(); // Manages HTML panels
        createResumeScrolls(mainScene, mainPathCurve, uiManagerInstance); // Creates 3D scrolls
        createControlsInterface(); // Basic WASD instructions UI

        // Vehicle systems
        setupVehicleControlsListeners();

        // Interactive elements
        initDatGUI(); // dat.GUI for real-time adjustments
        setupDragAndDrop(); // For resume content upload

        // Event Listeners
        window.addEventListener('resize', sceneOnWindowResize);
        window.addEventListener('error', (event) => {
            const error = event.error || event.message;
            console.error('Global error event:', error);
            displayGlobalError('Runtime Error: ' + (error.message || error));
        });
        window.addEventListener('unhandledrejection', (event) => {
            const reason = event.reason;
            console.error('Unhandled promise rejection:', reason);
            let msg = 'Async Error: An unknown error occurred.';
            if (reason instanceof Error) msg = `Async Error: ${reason.message}`;
            else if (typeof reason === 'string') msg = `Async Error: ${reason}`;
            displayGlobalError(msg);
        });


        // Set initial camera position based on car
        const car = getCar();
        if (car) {
            const initialOffset = C._v1.set(0, C.CAMERA_SETTINGS.height, -C.CAMERA_SETTINGS.distance);
            initialOffset.applyQuaternion(car.quaternion); // Align with car's initial rotation
            mainCamera.position.addVectors(car.position, initialOffset);
            mainControls.target.copy(car.position);
            mainControls.target.y += 1.8; // Look slightly above car center
            mainControls.update();
        }

        // Start animation loop
        animate();
        console.log("Interactive Resume Initialized Successfully!");

    } catch (error) {
        console.error('Error during initializeExperience:', error);
        showLoadingError('Initialization Error: ' + (error.message || "Unknown error during setup."));
    }
}

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), C.MAX_DELTA); // Cap delta to prevent large jumps

    const car = getCar(); // Get current car model instance
    const sceneTrees = []; // TODO: Get current trees from environment module if they can change

    if (car) {
        processVehicleControls(delta); // Update steering, velocity based on input
        updateVehiclePosition(delta, sceneTrees); // Update car's 3D position and handle collisions

        // Camera follow logic
        const offset = C._v2.set(0, C.CAMERA_SETTINGS.height, -C.CAMERA_SETTINGS.distance);
        offset.applyQuaternion(car.quaternion); // Apply car's rotation to camera offset
        const desiredCameraPosition = C._v3.addVectors(car.position, offset);

        // Smoothly interpolate camera position
        mainCamera.position.lerp(desiredCameraPosition, C.CAMERA_SETTINGS.smoothing);

        // Update OrbitControls target to follow the car
        mainControls.target.lerp(car.position, C.CAMERA_SETTINGS.smoothing);
        mainControls.target.y = car.position.y + 1.8; // Look slightly above car center
    }

    mainControls.update(); // Must be called if enableDamping or autoRotate is set

    // Check for resume scroll proximity to show/hide panels
    if (uiManagerInstance && car) {
        checkResumeScrollProximity(car);
    }

    mainRenderer.render(mainScene, mainCamera);
}

// --- Global Error Handling (fallback if specific handlers fail) ---
// This is a very basic fallback. More robust error UI would be better.
// The `displayGlobalError` function in utils.js is now the primary way to show errors.

// Start the loading process
loadAllAssets()
    .then(loadedAssets => {
        assets = loadedAssets; // Store for use in initializeExperience
        // The loadingManager's `onLoad` will call initializeExperience
    })
    .catch(error => {
        // This catch is for errors *within* loadAllAssets promises themselves,
        // not individual asset load failures handled by loadingManager's onError.
        console.error("Catastrophic asset loading failure:", error);
        showLoadingError("A core part of asset loading failed. Cannot start. " + error.message);
    });