import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as C from './constants.js'; // C for constants

export let scene, camera, renderer, controls, ambientLight, directionalLight, hemisphereLight, fog;

export function initScene() {
    scene = new THREE.Scene();
    applyTheme(C.DAY_THEME); // Start with day theme
    return scene;
}

export function initCamera() {
    camera = new THREE.PerspectiveCamera(
        C.CAMERA_SETTINGS.defaultFOV,
        window.innerWidth / window.innerHeight,
        0.1,
        C.PATH_LENGTH * 2.5 // Ensure far plane covers the extended path
    );
    camera.position.set(0, C.CAMERA_SETTINGS.height, -C.CAMERA_SETTINGS.distance); // Initial fallback position
    return camera;
}

export function initRenderer() {
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false // If true, CSS background can show through; often false for full scenes
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);
    } catch (e) {
        console.error('WebGL initialization failed:', e);
        throw e; // Rethrow to be caught by main init
    }
    return renderer;
}

export function initLights() {
    ambientLight = new THREE.AmbientLight(C.DAY_THEME.ambientLightColor, C.DAY_THEME.ambientLightIntensity);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(C.DAY_THEME.sunColor, C.DAY_THEME.sunIntensity);
    directionalLight.position.set(C.PATH_LENGTH / 15, C.PATH_LENGTH / 3, C.PATH_LENGTH / 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 20;
    directionalLight.shadow.camera.far = C.PATH_LENGTH * 1.2;
    const shadowCamSize = C.PATH_LENGTH / 1.8;
    directionalLight.shadow.camera.left = -shadowCamSize;
    directionalLight.shadow.camera.right = shadowCamSize;
    directionalLight.shadow.camera.top = shadowCamSize;
    directionalLight.shadow.camera.bottom = -shadowCamSize;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);
    // const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera); // For debugging shadow camera
    // scene.add(shadowHelper);

    hemisphereLight = new THREE.HemisphereLight(
        C.DAY_THEME.hemiLightSkyColor,
        C.DAY_THEME.hemiLightGroundColor,
        C.DAY_THEME.hemiLightIntensity
    );
    scene.add(hemisphereLight);
}

export function initControls(cameraInstance, domElement) {
    controls = new OrbitControls(cameraInstance, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.screenSpacePanning = false;
    controls.minDistance = 8;
    controls.maxDistance = C.PATH_LENGTH / 2.0; // Adjusted max distance
    // controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from going below ground
    controls.target.set(0, 1.8, 0); // Initial reasonable target
    controls.update();
    return controls;
}

export function applyTheme(theme) {
    if (!scene) return;
    scene.background = new THREE.Color(theme.backgroundColor);

    if (!scene.fog) {
        scene.fog = new THREE.Fog(theme.fogColor, C.PATH_LENGTH * C.FOG_SETTINGS.nearFactor, C.PATH_LENGTH * C.FOG_SETTINGS.farFactor);
    } else {
        scene.fog.color.set(theme.fogColor);
        scene.fog.near = C.PATH_LENGTH * C.FOG_SETTINGS.nearFactor;
        scene.fog.far = C.PATH_LENGTH * C.FOG_SETTINGS.farFactor;
    }

    if (ambientLight) {
        ambientLight.color.set(theme.ambientLightColor);
        ambientLight.intensity = theme.ambientLightIntensity;
    }
    if (directionalLight) {
        directionalLight.color.set(theme.sunColor);
        directionalLight.intensity = theme.sunIntensity;
    }
    if (hemisphereLight) {
        hemisphereLight.color.set(theme.hemiLightSkyColor);
        hemisphereLight.groundColor.set(theme.hemiLightGroundColor);
        hemisphereLight.intensity = theme.hemiLightIntensity;
    }
}

export function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}