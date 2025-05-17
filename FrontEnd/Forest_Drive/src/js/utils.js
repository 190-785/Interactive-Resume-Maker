import * as THREE from 'three';

// Fallback Textures (if needed, or simplify if all textures are guaranteed)
const fallbackTexturesCache = {};
export function createFallbackTexture(color, resolution = 64) {
    if (fallbackTexturesCache[color]) {
        return fallbackTexturesCache[color];
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = resolution;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, resolution, resolution);
    // Simple noise for non-uniformity
    if (color !== '#FFFFFF' && color !== '#0000FF') { // Example condition
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        for (let i = 0; i < resolution * 2; i++) {
            const x = Math.random() * resolution;
            const y = Math.random() * resolution;
            const size = 1 + Math.random() * 1;
            ctx.fillRect(x, y, size, size);
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    fallbackTexturesCache[color] = texture;
    return texture;
}

export const FALLBACK_TEXTURES = {
    color: createFallbackTexture('#0088FF'), // Bright blue for missing color
    normal: createFallbackTexture('#8080FF'), // Standard normal map color
    roughness: createFallbackTexture('#888888'), // Mid-gray for roughness
    ao: createFallbackTexture('#BBBBBB'), // Light gray for AO
    opacity: createFallbackTexture('#FFFFFF') // Fully opaque
};

export function loadTextureWithFallback(textureLoader, path, fallbackType = 'color', repeat = 1) {
    const fallbackTexture = FALLBACK_TEXTURES[fallbackType];
    const texture = textureLoader.load(path,
        () => { /* console.log('Texture loaded:', path) */ },
        undefined, // onProgress not typically used for single texture
        (err) => {
            console.error(`Error loading texture: ${path}. Applying fallback.`, err);
            // Attempt to directly use the fallback's image if the texture object was created
            if (texture && fallbackTexture && fallbackTexture.image) {
                texture.image = fallbackTexture.image;
                texture.needsUpdate = true;
            }
        }
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    return texture;
}

// General error display
export function displayGlobalError(message) {
    const errorMsgElement = document.getElementById('error-message');
    if (errorMsgElement) {
        errorMsgElement.textContent = message;
        errorMsgElement.style.display = 'block';
        // Hide loading screen if it's still visible
        const loadingContainer = document.getElementById('loading-screen');
        if (loadingContainer) loadingContainer.style.display = 'none';
    }
    console.error("Global Error:", message);
}

export function hideGlobalError() {
    const errorMsgElement = document.getElementById('error-message');
    if (errorMsgElement) {
        errorMsgElement.style.display = 'none';
    }
}