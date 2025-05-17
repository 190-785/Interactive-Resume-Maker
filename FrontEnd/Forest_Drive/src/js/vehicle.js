import * as THREE from 'three';
import * as C from './constants.js';
import { pathCurve } from './environment.js'; // If needed for initial placement/orientation

export let carModel = null;
const keysPressed = {};
let carVelocity = 0;
let carSteeringAngle = 0;
let carEngineForce = 0; // For debug or advanced physics, not directly used in simple model

export function setupVehicleControlsListeners() {
    window.addEventListener('keydown', e => keysPressed[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => delete keysPressed[e.key.toLowerCase()]);
}

export function processVehicleControls(delta) {
    const physics = C.VEHICLE_PHYSICS_CONFIG;
    let steerInput = 0;
    if (keysPressed['a'] || keysPressed['arrowleft']) steerInput = 1;
    if (keysPressed['d'] || keysPressed['arrowright']) steerInput = -1;

    if (steerInput !== 0) {
        carSteeringAngle = THREE.MathUtils.clamp(
            carSteeringAngle + steerInput * physics.steeringSpeed * delta,
            -physics.maxSteering, physics.maxSteering
        );
    } else {
        // Dampen steering back to center
        if (Math.abs(carSteeringAngle) > 0.001) {
             carSteeringAngle = THREE.MathUtils.damp(carSteeringAngle, 0, physics.steeringReturn, delta);
        } else {
            carSteeringAngle = 0;
        }
    }

    carEngineForce = 0; // Reset engine force each frame
    if (keysPressed['w'] || keysPressed['arrowup']) {
        carEngineForce = physics.acceleration;
    }
    if (keysPressed['s'] || keysPressed['arrowdown']) {
        // Braking should oppose current motion or allow reversing
        if (carVelocity > 0.1) { // Braking
            carEngineForce = -physics.brakeForce;
        } else if (carVelocity < -0.1) { // Accelerating in reverse (conceptually)
             carEngineForce = -physics.acceleration / 1.5; // Slower reverse acceleration
        } else { // Apply reverse from standstill or slow forward
            carEngineForce = -physics.acceleration / 1.5;
        }
    }

    // Apply engine force to velocity
    let accelerationThisFrame = carEngineForce; // Simplified: force is directly acceleration for this step
    carVelocity += accelerationThisFrame * delta;

    // Apply friction/drag
    // More realistic friction would be `F_friction = -coeff_friction * N_force`, and drag `F_drag = -0.5 * rho * v^2 * C_d * A`
    // Simplified friction:
    if (carEngineForce === 0) { // Only apply friction if not accelerating/braking hard
        const frictionForce = -carVelocity * physics.friction * 0.1; // Simplified coefficient
        carVelocity += frictionForce * delta;
    }

    // Clamp velocity to max speed (both forward and reverse)
    const maxReverseSpeed = -physics.maxSpeed / 2; // Example: reverse is half max forward speed
    carVelocity = THREE.MathUtils.clamp(carVelocity, maxReverseSpeed, physics.maxSpeed);

    // Snap to stop if velocity is very low and no input
    if (Math.abs(carVelocity) < 0.01 && carEngineForce === 0) {
        carVelocity = 0;
    }
}


export function updateVehiclePosition(delta, sceneTrees) {
    if (!carModel) return;
    const physics = C.VEHICLE_PHYSICS_CONFIG;

    // Store previous position for collision rollback
    const prevPosition = C._v2.copy(carModel.position);
    const prevRotationY = carModel.rotation.y;


    // Update rotation based on steering and velocity
    if (Math.abs(carSteeringAngle) > 0.001 && Math.abs(carVelocity) > 0.01) {
        // Ackermann steering geometry approximation
        const turnRadius = physics.wheelBase / Math.tan(carSteeringAngle); // Use tan for more accuracy
        const angularVelocity = carVelocity / turnRadius;
        carModel.rotation.y += angularVelocity * delta;
    }

    // Update position based on velocity and orientation
    // Get forward vector from car's quaternion
    C._v1.set(0, 0, 1).applyQuaternion(carModel.quaternion).multiplyScalar(carVelocity * delta);
    carModel.position.add(C._v1);

    // Keep car on the defined path element Y plane
    carModel.position.y = C.PATH_ELEMENT_Y;

    // --- Collision Detection with Trees ---
    if (sceneTrees && sceneTrees.length > 0 && carModel.userData.radius) {
        for (const tree of sceneTrees) {
            if (tree.userData.radius) { // Ensure tree has a radius defined
                const distance = carModel.position.distanceTo(tree.position);
                const combinedRadii = carModel.userData.radius + tree.userData.radius;

                if (distance < combinedRadii) {
                    // Collision detected!
                    carVelocity = 0; // Stop the car
                    carEngineForce = 0; // Prevent further acceleration input this frame

                    // Simple push-back resolution:
                    const pushBackDirection = C._v3.subVectors(carModel.position, tree.position).normalize();
                    const overlap = combinedRadii - distance;
                    carModel.position.add(pushBackDirection.multiplyScalar(overlap + 0.05)); // Push out slightly more to avoid re-collision

                    // Ensure Y position is maintained after push-back
                    carModel.position.y = C.PATH_ELEMENT_Y;
                    // console.log("Collision with tree!");
                    break; // Stop checking after one collision
                }
            }
        }
    }

     // --- Boundary checks (simple XZ plane boundaries for demo) ---
    const boundary = C.PATH_LENGTH * 1.4; // How far off the 'map' can the car go
    if (Math.abs(carModel.position.x) > boundary || Math.abs(carModel.position.z) > boundary) {
        // carModel.position.copy(prevPosition); // Revert to previous position
        // carModel.rotation.y = prevRotationY;
        // More gentle reset: place back near center or start of path
        carModel.position.set(0, C.PATH_ELEMENT_Y, -C.PATH_LENGTH / 2 + 50); // Near start
        carModel.lookAt(0, C.PATH_ELEMENT_Y, 0);
        carVelocity = 0;
        carSteeringAngle = 0;
        console.log("Car went off boundaries, reset.");
    }

}

export function setCarModel(loadedCar) {
    carModel = loadedCar;
    if (carModel) {
        // Initial car setup (position, rotation) should be handled in main.js or asset loader
        // Ensure it has a collision radius
        carModel.userData.radius = C.CAR_COLLISION_RADIUS;
    }
}

export function getCar() {
    return carModel;
}

export function getCarVelocity() {
    return carVelocity;
}