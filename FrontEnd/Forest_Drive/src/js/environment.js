import * as THREE from 'three';
import * as C from './constants.js';
import { loadTextureWithFallback } from './utils.js';

export let pathCurve;
export let groundPlane;
export let treeModelInstance; // Store the loaded tree model once
const treesInScene = []; // To keep track of added trees for potential removal/update

export function createGround(scene, textureLoader) {
    const groundRepeat = C.PATH_LENGTH / 8;
    const colorTex = loadTextureWithFallback(textureLoader, 'textures/Grass001_1K-JPG_Color.jpg', 'color', groundRepeat);
    const normalTex = loadTextureWithFallback(textureLoader, 'textures/Grass001_1K-JPG_NormalGL.jpg', 'normal', groundRepeat);
    const roughnessTex = loadTextureWithFallback(textureLoader, 'textures/Grass001_1K-JPG_Roughness.jpg', 'roughness', groundRepeat);
    const aoTex = loadTextureWithFallback(textureLoader, 'textures/Grass001_1K-JPG_AmbientOcclusion.jpg', 'ao', groundRepeat);

    const groundGeo = new THREE.PlaneGeometry(C.PATH_LENGTH * 3, C.PATH_LENGTH * 3);
    const groundMat = new THREE.MeshStandardMaterial({
        // color: 0x228B22, // Base color if texture fails or for tinting
        map: colorTex,
        normalMap: normalTex,
        roughnessMap: roughnessTex,
        aoMap: aoTex,
        // side: THREE.DoubleSide // If needed, but usually not for ground
    });
    groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.position.y = C.GROUND_Y;
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);
    return groundPlane;
}

export function createRoad(scene) {
    // The road plane (visual only, car drives on PATH_ELEMENT_Y)
    // Segments are useful if you ever want to deform it with the curve, but for a straight path, less critical.
    const roadGeometry = new THREE.PlaneGeometry(C.ROAD_WIDTH, C.PATH_LENGTH * 1.05, Math.max(1, C.ROAD_WIDTH / 2), Math.max(20, C.PATH_LENGTH / 15));
    const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        roughness: 0.9,
        metalness: 0.05,
        // wireframe: true // For debugging segments
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = C.ROAD_Y; // Slightly above ground
    // road.position.z = 0; // Assuming path is centered along Z
    road.receiveShadow = true;
    scene.add(road);
    return road;
}


export function createPathSpline() {
    const points = [];
    // A simple straight path along Z for this example
    // More complex paths could be defined here (e.g., with gentle curves)
    for (let i = 0; i <= C.PATH_LENGTH; i += 20) { // Fewer points for a CatmullRomCurve3 are often fine
        // Example of a very gentle curve:
        // const xOffset = Math.sin( (i / PATH_LENGTH) * Math.PI ) * 50; // Gentle S-curve
        // points.push(new THREE.Vector3(xOffset, PATH_ELEMENT_Y, -PATH_LENGTH / 2 + i));
        points.push(new THREE.Vector3(0, C.PATH_ELEMENT_Y, -C.PATH_LENGTH / 2 + i));
    }

    if (points.length < 2) { // Ensure at least two points for CatmullRomCurve3
        points.push(new THREE.Vector3(0, C.PATH_ELEMENT_Y, -C.PATH_LENGTH / 2));
        points.push(new THREE.Vector3(0, C.PATH_ELEMENT_Y, C.PATH_LENGTH / 2));
    }
    pathCurve = new THREE.CatmullRomCurve3(points);
    // pathCurve.curveType = 'catmullrom'; // default
    // pathCurve.tension = 0.5; // if you want to adjust smoothness

    // Optional: Visualize the path for debugging
    // const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(PATH_LENGTH / 10));
    // const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    // scene.add(pathLine); // Needs 'scene' to be passed in or accessible globally

    return pathCurve;
}


export function placeTreesAlongPath(scene, loadedTreeModel) {
    if (!pathCurve) {
        console.error("Path curve not initialized before placing trees.");
        return [];
    }
    if (!loadedTreeModel) {
        console.error("Tree model not loaded before placing trees.");
        return [];
    }
    treeModelInstance = loadedTreeModel; // Store for potential future use (e.g. dynamic changes)

    // Clear existing trees if any (e.g., if re-placing)
    treesInScene.forEach(tree => scene.remove(tree));
    treesInScene.length = 0;

    const numTreeChecks = Math.floor(C.PATH_LENGTH / 8); // Check every 8 units

    for (let i = 0; i < numTreeChecks; i++) {
        // More randomness in tree group placement
        if (i % Math.floor(C.TREE_SPACING_MODULO / 8) === Math.floor(Math.random() * (C.TREE_SPACING_MODULO / 30))) { // increased randomness divisor
            const t = i / numTreeChecks; // Normalized position along path (0 to 1)

            // Avoid placing trees too close to the start/end of the path
            if (t > 0.98 || t < 0.02) continue;

            const pointOnPath = pathCurve.getPointAt(t);
            // const tangent = pathCurve.getTangentAt(t); // For orienting trees relative to path normal if needed

            const baseScale = 0.9 + Math.random() * 0.8;
            const randomXOffset = (C.ROAD_WIDTH / 2) + 12 + Math.random() * 35; // Distance from path center
            const randomZShift = (Math.random() - 0.5) * (C.PATH_LENGTH / 18); // Shift along the path direction

            // Place tree on the left side
            const leftTree = treeModelInstance.clone();
            // To place perpendicular to path:
            // const normalOffsetLeft = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(randomXOffset);
            // leftTree.position.copy(pointOnPath).add(normalOffsetLeft);
            leftTree.position.set(pointOnPath.x - randomXOffset, C.PATH_ELEMENT_Y, pointOnPath.z + randomZShift);
            leftTree.rotation.y = Math.random() * Math.PI * 2;
            leftTree.scale.set(baseScale, baseScale + Math.random() * 0.6, baseScale);
            leftTree.userData.radius = C.TREE_COLLISION_RADIUS * baseScale; // For collision
            leftTree.traverse(child => { if (child.isMesh) child.castShadow = true; });
            scene.add(leftTree);
            treesInScene.push(leftTree);

            // Place tree on the right side
            const rightTree = treeModelInstance.clone();
            // const normalOffsetRight = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize().multiplyScalar(randomXOffset);
            // rightTree.position.copy(pointOnPath).add(normalOffsetRight);
            rightTree.position.set(pointOnPath.x + randomXOffset, C.PATH_ELEMENT_Y, pointOnPath.z - randomZShift + (Math.random() - 0.5) * 10); // Add more variation
            rightTree.rotation.y = Math.random() * Math.PI * 2;
            rightTree.scale.set(baseScale * 0.9, (baseScale + Math.random() * 0.5) * 0.9, baseScale * 0.9); // Slightly different scale
            rightTree.userData.radius = C.TREE_COLLISION_RADIUS * baseScale * 0.9;
            rightTree.traverse(child => { if (child.isMesh) child.castShadow = true; });
            scene.add(rightTree);
            treesInScene.push(rightTree);
        }
    }
    return treesInScene; // Return the array of tree meshes
}