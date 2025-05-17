import * as THREE from 'three';

export const PATH_LENGTH = 800;
export const ROAD_WIDTH = 14;
export const TREE_SPACING_MODULO = 70;
export const SCROLL_PROXIMITY_THRESHOLD = 12;
export const CAR_COLLISION_RADIUS = 1.8;
export const TREE_COLLISION_RADIUS = 1.2;

export const LOAD_TIMEOUT = 60000;
export const MAX_DELTA = 0.05; // Max time step for physics stability

export const GROUND_Y = 0;
export const ROAD_Y = 0.01;
export const PATH_ELEMENT_Y = 0.02; // For car and path curve points

// For internal calculations, not meant to be changed dynamically by GUI easily
export const _v1 = new THREE.Vector3();
export const _v2 = new THREE.Vector3();
export const _v3 = new THREE.Vector3();
export const _q = new THREE.Quaternion();
export const _m = new THREE.Matrix4();
export const Y_AXIS = new THREE.Vector3(0, 1, 0);

export const CAMERA_SETTINGS = {
    distance: 30,
    height: 10,
    smoothing: 0.04,
    defaultFOV: 50,
};

export const VEHICLE_PHYSICS_CONFIG = {
    maxSpeed: 25, // m/s
    acceleration: 35, // m/s^2
    brakeForce: 75, // m/s^2 (applied opposite to velocity)
    steeringSpeed: 1.5, // radians/sec
    steeringReturn: 3.0, // speed of steering returning to center
    maxSteering: Math.PI / 4.2, // Max steering angle in radians
    wheelBase: 2.8, // meters
    friction: 10, // A general friction coefficient
};

export const DAY_THEME = {
    backgroundColor: 0x87CEEB, // Sky blue
    fogColor: 0x87CEEB,
    ambientLightColor: 0xffffff,
    ambientLightIntensity: 2.0,
    sunColor: 0xffffff,
    sunIntensity: 2.5,
    hemiLightSkyColor: 0xbde0ff,
    hemiLightGroundColor: 0x706555,
    hemiLightIntensity: 1.0,
};

export const NIGHT_THEME = {
    backgroundColor: 0x0a0a1a, // Dark blue/purple
    fogColor: 0x0a0a1a,
    ambientLightColor: 0x404060,
    ambientLightIntensity: 0.8,
    sunColor: 0x7070aa, // Moon light
    sunIntensity: 0.6, // Dimmer moon
    hemiLightSkyColor: 0x303050,
    hemiLightGroundColor: 0x101020,
    hemiLightIntensity: 0.5,
};

export const FOG_SETTINGS = {
    nearFactor: 1/3, // Multiplied by PATH_LENGTH
    farFactor: 1.5   // Multiplied by PATH_LENGTH
};