import * as THREE from 'three';

let camera, scene, renderer;
let mesh;
let glitchActive = false;
let glitchEndTime = 0;
let nextGlitchTime = 0;
const glitchDuration = 180; // ms
const glitchIntervalMin = 1800; // ms
const glitchIntervalMax = 3500; // ms
let originalColor = null;

// --- Palette Cube --- //
let paletteCubes = []; // To store individual cube data (scene, camera, renderer, mesh, color)

function initThreeJS() {
    const canvasContainer = document.getElementById('hero-3d-canvas');
    if (!canvasContainer) {
        console.error('Hero 3D canvas container not found!');
        // Optionally show the placeholder as fallback
        const placeholder = document.querySelector('.hero-visual-placeholder');
        if(placeholder) placeholder.style.opacity = '1';
        return;
    }

    // Camera
    camera = new THREE.PerspectiveCamera(70, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.01, 10);
    camera.position.z = 1;

    // Scene
    scene = new THREE.Scene();

    // Geometry & Material
    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4); // Slightly larger cube
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for the cube

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setAnimationLoop(animate);
    canvasContainer.appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    onWindowResize(); // Initial call to set size
}

function onWindowResize() {
    const canvasContainer = document.getElementById('hero-3d-canvas');
    if (!canvasContainer || !renderer || !camera) return;

    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}

function triggerGlitch(time) {
    glitchActive = true;
    glitchEndTime = time + glitchDuration;
    // Save original color
    if (mesh && mesh.material) {
        if (!originalColor) originalColor = mesh.material.color.clone();
    }
}

function scheduleNextGlitch(time) {
    nextGlitchTime = time + glitchIntervalMin + Math.random() * (glitchIntervalMax - glitchIntervalMin);
}

function animate(time) {
    if (!nextGlitchTime) scheduleNextGlitch(time);
    if (mesh) {
        if (glitchActive) {
            // Glitch: jitter rotation, scale, and color
            mesh.rotation.x += (Math.random() - 0.5) * 0.2;
            mesh.rotation.y += (Math.random() - 0.5) * 0.2;
            mesh.scale.x = 1 + (Math.random() - 0.5) * 0.6;
            mesh.scale.y = 1 + (Math.random() - 0.5) * 0.6;
            mesh.scale.z = 1 + (Math.random() - 0.5) * 0.6;
            // Flash color (randomly between red and white)
            if (mesh.material && mesh.material.color) {
                if (Math.random() > 0.5) {
                    mesh.material.color.set(0xffffff);
                } else {
                    mesh.material.color.set(0xff0000);
                }
            }
            if (time > glitchEndTime) {
                glitchActive = false;
                // Restore original state
                mesh.scale.set(1, 1, 1);
                if (mesh.material && originalColor) {
                    mesh.material.color.copy(originalColor);
                }
                scheduleNextGlitch(time);
            }
        } else {
            // Normal rotation
            mesh.rotation.x = time / 3000;
            mesh.rotation.y = time / 2000;
            // Check if it's time to glitch
            if (time > nextGlitchTime) {
                triggerGlitch(time);
            }
        }
    }
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function initPaletteCube(containerId, hexColor) {
    const canvasContainer = document.getElementById(containerId);
    if (!canvasContainer) {
        console.error(`Palette cube container not found: ${containerId}`);
        return;
    }

    const cubeData = {};

    // Camera
    cubeData.camera = new THREE.PerspectiveCamera(60, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.01, 10);
    cubeData.camera.position.z = 0.8; // Closer for smaller cube

    // Scene
    cubeData.scene = new THREE.Scene();

    // Geometry & Material
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // Smaller cube
    cubeData.originalColor = new THREE.Color(hexColor);
    const material = new THREE.MeshBasicMaterial({ color: cubeData.originalColor });

    cubeData.mesh = new THREE.Mesh(geometry, material);
    cubeData.scene.add(cubeData.mesh);

    // Renderer
    cubeData.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    cubeData.renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    // Note: We will call a shared animatePaletteCubes function, so no setAnimationLoop here per cube.
    canvasContainer.appendChild(cubeData.renderer.domElement);

    cubeData.glitchActive = false;
    cubeData.glitchEndTime = 0;
    cubeData.nextGlitchTime = 0;
    cubeData.containerId = containerId; // Store for resize handling

    // Add to our list
    paletteCubes.push(cubeData);

    // Initial resize call for this cube
    onPaletteCubeResize(cubeData);
}

function onPaletteCubeResize(cubeData) {
    const canvasContainer = document.getElementById(cubeData.containerId);
    if (!canvasContainer || !cubeData.renderer || !cubeData.camera) return;

    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;

    if (newWidth === 0 || newHeight === 0) return; // Skip if not visible

    cubeData.camera.aspect = newWidth / newHeight;
    cubeData.camera.updateProjectionMatrix();
    cubeData.renderer.setSize(newWidth, newHeight);
}

function animatePaletteCubes(time) {
    paletteCubes.forEach(cubeData => {
        if (!cubeData.mesh) return;

        if (!cubeData.nextGlitchTime) cubeData.nextGlitchTime = time + glitchIntervalMin + Math.random() * (glitchIntervalMax - glitchIntervalMin);

        if (cubeData.glitchActive) {
            cubeData.mesh.rotation.x += (Math.random() - 0.5) * 0.15;
            cubeData.mesh.rotation.y += (Math.random() - 0.5) * 0.15;
            cubeData.mesh.scale.x = 1 + (Math.random() - 0.5) * 0.4;
            cubeData.mesh.scale.y = 1 + (Math.random() - 0.5) * 0.4;
            cubeData.mesh.scale.z = 1 + (Math.random() - 0.5) * 0.4;
            if (cubeData.mesh.material && cubeData.mesh.material.color) {
                if (Math.random() > 0.6) {
                    cubeData.mesh.material.color.set(0xffffff); // Glitch to white
                } else {
                    cubeData.mesh.material.color.copy(cubeData.originalColor);
                }
            }
            if (time > cubeData.glitchEndTime) {
                cubeData.glitchActive = false;
                cubeData.mesh.scale.set(1, 1, 1);
                if (cubeData.mesh.material) {
                    cubeData.mesh.material.color.copy(cubeData.originalColor);
                }
                cubeData.nextGlitchTime = time + glitchIntervalMin + Math.random() * (glitchIntervalMax - glitchIntervalMin);
            }
        } else {
            cubeData.mesh.rotation.x = time / 3500;
            cubeData.mesh.rotation.y = time / 2500;
            if (time > cubeData.nextGlitchTime) {
                cubeData.glitchActive = true;
                cubeData.glitchEndTime = time + glitchDuration * 0.8; // Shorter glitch for palette
            }
        }
        if (cubeData.renderer && cubeData.scene && cubeData.camera) {
            cubeData.renderer.render(cubeData.scene, cubeData.camera);
        }
    });
}

// Modify the main animation loop to also call animatePaletteCubes
function combinedAnimate(time) {
    // Hero animation
    if (!nextGlitchTime) scheduleNextGlitch(time);
    if (mesh) {
        if (glitchActive) {
            mesh.rotation.x += (Math.random() - 0.5) * 0.2;
            mesh.rotation.y += (Math.random() - 0.5) * 0.2;
            mesh.scale.x = 1 + (Math.random() - 0.5) * 0.6;
            mesh.scale.y = 1 + (Math.random() - 0.5) * 0.6;
            mesh.scale.z = 1 + (Math.random() - 0.5) * 0.6;
            if (mesh.material && mesh.material.color) {
                if (Math.random() > 0.5) {
                    mesh.material.color.set(0xffffff);
                } else {
                    mesh.material.color.set(0xff0000);
                }
            }
            if (time > glitchEndTime) {
                glitchActive = false;
                mesh.scale.set(1, 1, 1);
                if (mesh.material && originalColor) {
                    mesh.material.color.copy(originalColor);
                }
                scheduleNextGlitch(time);
            }
        } else {
            mesh.rotation.x = time / 3000;
            mesh.rotation.y = time / 2000;
            if (time > nextGlitchTime) {
                triggerGlitch(time);
            }
        }
    }
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }

    // Palette cube animations
    animatePaletteCubes(time);
}

function initAllCanvases() {
    initThreeJS(); // Hero canvas

    // Bamai Palette Cubes
    const bamaiColors = [
        { id: 'bamai-color-cube-1', color: 0xEEEFEE },
        { id: 'bamai-color-cube-2', color: 0x656565 },
        { id: 'bamai-color-cube-3', color: 0xD4D4D4 },
        { id: 'bamai-color-cube-4', color: 0x404040 }
    ];

    bamaiColors.forEach(item => {
        // Check if the container exists before initializing
        if (document.getElementById(item.id)) {
            initPaletteCube(item.id, item.color);
        }
    });
    
    // Replace the hero renderer's animation loop with the combined one
    if (renderer) { // Check if hero renderer was initialized
        renderer.setAnimationLoop(combinedAnimate);
    }
}

// Resize listener for palette cubes
window.addEventListener('resize', () => {
    paletteCubes.forEach(onPaletteCubeResize);
});

// Initialize Three.js scene on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded. Halting 3D initialization.');
        const placeholder = document.querySelector('.hero-visual-placeholder');
        if(placeholder && document.getElementById('hero-3d-canvas')) placeholder.style.opacity = '1';
        return; 
    }

    // --- Hero 3D Cube --- 
    let heroCamera, heroScene, heroRenderer, heroMesh;
    let heroGlitchActive = false, heroGlitchEndTime = 0, heroNextGlitchTime = 0;
    const heroGlitchDuration = 180, heroGlitchIntervalMin = 1800, heroGlitchIntervalMax = 3500;
    let heroOriginalColor = new THREE.Color(0xff0000);

    function initHeroThreeJS() {
        const canvasContainer = document.getElementById('hero-3d-canvas');
        if (!canvasContainer || canvasContainer.classList.contains('three-hero-initialized')) {
            if(!canvasContainer && document.querySelector('.hero-visual-placeholder')) document.querySelector('.hero-visual-placeholder').style.opacity = '1';
            return canvasContainer && canvasContainer.classList.contains('three-hero-initialized');
        }
        heroCamera = new THREE.PerspectiveCamera(70, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.01, 10);
        heroCamera.position.z = 1;
        heroScene = new THREE.Scene();
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const material = new THREE.MeshBasicMaterial({ color: heroOriginalColor });
        heroMesh = new THREE.Mesh(geometry, material);
        heroScene.add(heroMesh);
        heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        heroRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        canvasContainer.innerHTML = ''; 
        canvasContainer.appendChild(heroRenderer.domElement);
        canvasContainer.classList.add('three-hero-initialized');
        return true; 
    }

    function onHeroWindowResize() {
        const canvasContainer = document.getElementById('hero-3d-canvas');
        if (!canvasContainer || !heroRenderer || !heroCamera || !heroMesh) return;
        if (canvasContainer.clientWidth === 0 || canvasContainer.clientHeight === 0) return;
        heroCamera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    }

    function triggerHeroGlitch(time) { heroGlitchActive = true; heroGlitchEndTime = time + heroGlitchDuration; }
    function scheduleHeroNextGlitch(time) { heroNextGlitchTime = time + heroGlitchIntervalMin + Math.random() * (heroGlitchIntervalMax - heroGlitchIntervalMin); }

    function animateHeroCube(time) {
        if (!heroMesh) return;
        if (!heroNextGlitchTime && time !== undefined) scheduleHeroNextGlitch(time);
        else if (!heroNextGlitchTime) scheduleHeroNextGlitch(0); 
        if (heroGlitchActive) {
            heroMesh.rotation.x += (Math.random() - 0.5) * 0.2;
            heroMesh.rotation.y += (Math.random() - 0.5) * 0.2;
            heroMesh.scale.set(1 + (Math.random() - 0.5) * 0.6, 1 + (Math.random() - 0.5) * 0.6, 1 + (Math.random() - 0.5) * 0.6);
            if (heroMesh.material.color) heroMesh.material.color.set(Math.random() > 0.5 ? 0xffffff : heroOriginalColor);
            if (time > heroGlitchEndTime) {
                heroGlitchActive = false; heroMesh.scale.set(1, 1, 1);
                if (heroMesh.material.color) heroMesh.material.color.copy(heroOriginalColor);
                scheduleHeroNextGlitch(time);
            }
        } else {
            if (time !== undefined) { heroMesh.rotation.x = time / 3000; heroMesh.rotation.y = time / 2000; }
            if (time > heroNextGlitchTime) triggerHeroGlitch(time);
        }
        if (heroRenderer && heroScene && heroCamera) heroRenderer.render(heroScene, heroCamera);
    }

    // --- Palette Cubes (Full Implementation for Part 2) --- //
    let paletteCubesData = [];
    const paletteGlitchDuration = 120; // Slightly shorter glitch for palette cubes
    const paletteGlitchIntervalMin = 2200;
    const paletteGlitchIntervalMax = 4500;
    let paletteResizeObserver;

    function initPaletteCube(containerId, hexColor) {
        const container = document.getElementById(containerId);
        if (!container || container.classList.contains('three-palette-initialized')) return;
        if (container.clientWidth === 0 || container.clientHeight === 0) {
            // console.warn(`Palette container ${containerId} not visible for init.`);
            return; // Don't initialize if not visible
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 3.5; // Adjusted for smaller cubes
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        container.classList.add('three-palette-initialized');

        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2); // Adjusted size
        const originalColor = new THREE.Color(hexColor);
        const material = new THREE.MeshStandardMaterial({
            color: originalColor,
            metalness: 0.4, // Slightly more metallic for definition
            roughness: 0.55 // Bit less rough
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(2, 5, 3);
        scene.add(directionalLight);
        
        const cubeData = {
            container, scene, camera, renderer, mesh, originalColor,
            glitchActive: false, glitchEndTime: 0, nextGlitchTime: 0,
            isVisible: true // Initial assumption
        };
        paletteCubesData.push(cubeData);
        if (paletteResizeObserver) paletteResizeObserver.observe(container);
        else onPaletteCubeResize(cubeData); // Fallback if no observer
    }

    function onPaletteCubeResize(cubeData) {
        if (!cubeData.container || !cubeData.renderer || !cubeData.camera) return;
        const newWidth = cubeData.container.clientWidth;
        const newHeight = cubeData.container.clientHeight;
        if (newWidth === 0 || newHeight === 0) {
            cubeData.isVisible = false;
            return;
        }
        cubeData.isVisible = true;
        cubeData.camera.aspect = newWidth / newHeight;
        cubeData.camera.updateProjectionMatrix();
        cubeData.renderer.setSize(newWidth, newHeight);
    }

    if (typeof ResizeObserver !== 'undefined') {
        paletteResizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const cubeData = paletteCubesData.find(c => c.container === entry.target);
                if (cubeData) onPaletteCubeResize(cubeData);
            }
        });
    }

    function animatePaletteCubes(time) {
        paletteCubesData.forEach(cubeData => {
            if (!cubeData.mesh || !cubeData.isVisible) return;
            if (!cubeData.nextGlitchTime && time !== undefined) cubeData.nextGlitchTime = time + paletteGlitchIntervalMin + Math.random() * (paletteGlitchIntervalMax - paletteGlitchIntervalMin);
            else if (!cubeData.nextGlitchTime) cubeData.nextGlitchTime = paletteGlitchIntervalMin + Math.random() * (paletteGlitchIntervalMax - paletteGlitchIntervalMin);

            if (cubeData.glitchActive) {
                cubeData.mesh.rotation.x += (Math.random() - 0.5) * 0.2;
                cubeData.mesh.rotation.y += (Math.random() - 0.5) * 0.2;
                cubeData.mesh.scale.set(1 + (Math.random() - 0.5) * 0.4, 1 + (Math.random() - 0.5) * 0.4, 1 + (Math.random() - 0.5) * 0.4);
                if (cubeData.mesh.material.color) cubeData.mesh.material.color.set(Math.random() > 0.55 ? 0xffffff : cubeData.originalColor);
                if (time > cubeData.glitchEndTime) {
                    cubeData.glitchActive = false; cubeData.mesh.scale.set(1, 1, 1);
                    if (cubeData.mesh.material.color) cubeData.mesh.material.color.copy(cubeData.originalColor);
                    cubeData.nextGlitchTime = time + paletteGlitchIntervalMin + Math.random() * (paletteGlitchIntervalMax - paletteGlitchIntervalMin);
                }
            } else {
                if (time !== undefined) {
                    cubeData.mesh.rotation.x += (cubeData.originalColor.g * 0.0005 + 0.0015); // Slower, color-influenced rotation
                    cubeData.mesh.rotation.y += (cubeData.originalColor.b * 0.0005 + 0.0015);
                }
                if (time > cubeData.nextGlitchTime) {
                    cubeData.glitchActive = true; cubeData.glitchEndTime = time + paletteGlitchDuration;
                }
            }
            if (cubeData.renderer) cubeData.renderer.render(cubeData.scene, cubeData.camera);
        });
    }

    // --- Combined Animation Loop & Initialization --- 
    function combinedAnimate(time) {
        requestAnimationFrame(combinedAnimate);
        animateHeroCube(time);
        animatePaletteCubes(time); 
    }
    
    function initAllCanvases() {
        const heroInitialized = initHeroThreeJS();
        const bamaiColorDefs = [
            { id: 'bamai-color-cube-1', color: 0xEEEFEE }, { id: 'bamai-color-cube-2', color: 0x656565 },
            { id: 'bamai-color-cube-3', color: 0xD4D4D4 }, { id: 'bamai-color-cube-4', color: 0x404040 }
        ];
        bamaiColorDefs.forEach(def => { if (document.getElementById(def.id)) initPaletteCube(def.id, def.color); });
        
        window.addEventListener('resize', () => {
            onHeroWindowResize();
            if (!paletteResizeObserver) paletteCubesData.forEach(onPaletteCubeResize); // Fallback if no ResizeObserver
        });
        onHeroWindowResize();
        paletteCubesData.forEach(cube => onPaletteCubeResize(cube)); // Initial resize for all palette cubes

        if (heroInitialized || paletteCubesData.length > 0) { // Start loop if any canvas is up
            requestAnimationFrame(combinedAnimate);
        } 
    }

    initAllCanvases(); 

    // --- Chat Animation & Other DOM Logic (remains the same) --- 
    const bamaiChatSection = document.getElementById('bamai-chat');
    const chatMessage1Element = document.getElementById('chat-message-1');
    const chatMessage2Element = document.getElementById('chat-message-2');
    const message1Text = "Hey, I saw your app went viral over the world. Congrats man!";
    const message2Text = "Ok, nice try.";
    let chatAnimationPlayed = false;

    function typeMessage(element, text, typingSpeed = 50, callback) {
        let index = 0;
        if (!element) {
            if (callback) callback();
            return;
        }
        element.innerHTML = '';
        element.classList.add('typing');
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            } else {
                element.classList.remove('typing');
                if (callback) callback();
            }
        }
        type();
    }

    function spawnQuestionMarksEffect() {
        if (!bamaiChatSection) return;
        const duration = 5000, spawnInterval = 200, fadeOutTime = 1000;
        let effectStartTime = Date.now();
        function spawnSingleMark() {
            if (Date.now() - effectStartTime > duration) return;
            const qMark = document.createElement('span');
            qMark.classList.add('floating-question-mark');
            qMark.textContent = '?';
            const chatContainer = bamaiChatSection.querySelector('.chat-simulation-container');
            const chatRect = chatContainer ? chatContainer.getBoundingClientRect() : null;
            const sectionRect = bamaiChatSection.getBoundingClientRect();
            let randomX, randomY, attempts = 0;
            do {
                randomX = Math.random() * (sectionRect.width - 30) + 15;
                randomY = Math.random() * (sectionRect.height - 40) + 20;
                attempts++;
                if (!chatRect) break; 
            } while (
                attempts < 20 &&
                (randomX > (chatRect.left - sectionRect.left) && 
                 randomX < (chatRect.right - sectionRect.left) &&
                 randomY > (chatRect.top - sectionRect.top) && 
                 randomY < (chatRect.bottom - sectionRect.top))
            );
            qMark.style.left = `${randomX}px`;
            qMark.style.top = `${randomY}px`;
            bamaiChatSection.appendChild(qMark);
            requestAnimationFrame(() => {
                qMark.style.opacity = '0.7';
                qMark.style.transform = `translateY(-20px) scale(${1 + Math.random() * 0.5}) rotate(${(Math.random() -0.5) * 30}deg)`;
            });
            setTimeout(() => {
                qMark.style.opacity = '0';
                qMark.style.transform = `translateY(-40px) scale(0.5) rotate(${(Math.random() -0.5) * 60}deg)`;
                setTimeout(() => { if (qMark.parentNode) qMark.parentNode.removeChild(qMark); }, fadeOutTime);
            }, fadeOutTime + Math.random() * 500);
            setTimeout(spawnSingleMark, spawnInterval);
        }
        spawnSingleMark();
    }

    const chatObserverOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const chatAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chatAnimationPlayed) {
                typeMessage(chatMessage1Element, message1Text, 50, () => {
                    setTimeout(() => {
                        typeMessage(chatMessage2Element, message2Text, 50, () => {
                            setTimeout(spawnQuestionMarksEffect, 500);
                        });
                    }, 700);
                });
                chatAnimationPlayed = true;
            }
        });
    }, chatObserverOptions);

    if (bamaiChatSection && chatMessage1Element && chatMessage2Element) {
        chatAnimationObserver.observe(bamaiChatSection);
    }
}); 