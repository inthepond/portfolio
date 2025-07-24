// --- Navigation functionality ---
function initializeNavigation() {
    // Time display and status light
    function updateTimeAndStatus() {
        const now = new Date();
        
        // Convert to Australian timezone (AEST/AEDT)
        const australianTime = new Date(now.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));
        
        // Format time as HH:MM
        const timeString = australianTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        document.getElementById('current-time').textContent = timeString;
        
        // Update status light based on Australian time
        const hours = australianTime.getHours();
        const statusLight = document.getElementById('status-light');
        
        if (hours >= 9 && hours < 17) {
            // Business hours (9am-5pm) - green
            statusLight.classList.remove('evening');
        } else {
            // After hours - yellow
            statusLight.classList.add('evening');
        }
    }
    
    // Update time immediately and then every second
    updateTimeAndStatus();
    setInterval(updateTimeAndStatus, 1000);
    
    // Note: Modal functionality removed as about page is now standalone
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('Three.js has not been loaded. See https://threejs.org');
        return;
    }

    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingContent = document.querySelector('.loading-content');
    const loadingText = document.getElementById('loading-text');
    const wavePath = document.getElementById('wave-path');
    const waveFill = document.getElementById('wave-fill');
    const progressGlow = document.querySelector('.progress-glow');
    const topNav = document.getElementById('top-nav');
    const bottomCompanyBar = document.getElementById('bottom-company-bar');
    const canvas = document.getElementById('bg');

    // --- Page Load Animation Sequence ---
    const initializePageAnimations = () => {
        // Stagger the animations for a more elegant entrance

        // First: Top navigation slides down
        setTimeout(() => {
            topNav.classList.add('animate-in');
        }, 150);

        // Second: Bottom navigation slides up (slightly delayed)
        setTimeout(() => {
            bottomCompanyBar.classList.add('animate-in');
        }, 300);

        // Third: Loading overlay fades in
        setTimeout(() => {
            loadingOverlay.classList.add('animate-in');
        }, 500);

        // Fourth: Loading content slides up and fades in
        setTimeout(() => {
            loadingContent.classList.add('animate-in');
        }, 700);

        // Finally: Start loading process after all animations
        setTimeout(() => {
            startLoadingProcess();
        }, 900);
    };

    // Call the animation sequence immediately
    initializePageAnimations();

    // --- Loading Animation ---
    const languages = [
        'Hello', '你好', 'こんにちは', '안녕하세요', 'Bonjour', 'Hola',
        'Ciao', 'Hallo', 'Olá', 'Здравствуйте', 'مرحبا', 'नमस्ते'
    ];
    let langIndex = 0;
    const maxLoadingTime = 5000;
    let loadingAnimationFinished = false;
    let currentProgress = 0;
    let textChangeInterval;
    let progressInterval;

    const startLoadingProcess = () => {
        // Initialize loading text
        loadingText.textContent = languages[0];
        loadingText.setAttribute('data-text', languages[0]);

    // --- Progress Animation ---
    const updateProgress = () => {
        if (loadingAnimationFinished) return;

        // Simulate irregular progress increments
        const increment = Math.random() * 2.5 + 0.5; // Random increment between 0.5-3
        currentProgress = Math.min(currentProgress + increment, 100);

        // Calculate progress ratio (0 to 1)
        const progressRatio = currentProgress / 100;

        // Update wave path stroke-dashoffset to match progress
        const totalDashLength = 800;
        const currentDashOffset = totalDashLength * (1 - progressRatio);
        if (wavePath) {
            wavePath.style.strokeDashoffset = currentDashOffset;
        }

        // Update wave fill opacity based on progress
        if (waveFill) {
            const fillOpacity = Math.min(progressRatio * 0.4, 0.3); // Max opacity 0.3
            waveFill.style.opacity = fillOpacity;
        }

        // Update glow position to match progress
        if (progressGlow) {
            const glowPosition = progressRatio * 100; // 0% to 100%
            progressGlow.style.left = `calc(${glowPosition}% - 4px)`; // Center the glow dot
            progressGlow.style.opacity = progressRatio > 0.05 ? 1 : 0; // Show after 5% progress
        }

        // Update wave path with subtle irregular fluctuations
        const time = Date.now() * 0.002;
        const waveVariation = Math.sin(time) * 2;
        const waveVariation2 = Math.cos(time * 1.3) * 1.5;
        const waveVariation3 = Math.sin(time * 0.7) * 1;
        const newPath = `M0,${10 + waveVariation3} Q100,${5 + waveVariation2} 200,${10 - waveVariation} T400,${10 + waveVariation * 0.5}`;

        if (wavePath) {
            wavePath.setAttribute('d', newPath);
        }

        if (currentProgress >= 100) {
            setTimeout(finishLoading, 800); // Slightly longer delay to show 100%
        }
    };

        const changeTextWithGlitch = () => {
            if (loadingAnimationFinished) return;

            loadingText.classList.add('glitching');

            setTimeout(() => {
                langIndex = (langIndex + 1) % languages.length;
                const newText = languages[langIndex];
                loadingText.textContent = newText;
                loadingText.setAttribute('data-text', newText);

                // Let the glitch animation play, then remove the class
                setTimeout(() => {
                    loadingText.classList.remove('glitching');
                }, 400); // Must be same duration as animation in CSS
            }, 200);
        };

        // Start the loading animations
        textChangeInterval = setInterval(changeTextWithGlitch, 800);
        progressInterval = setInterval(updateProgress, 100); // Update progress every 100ms

        // Force finish loading after max time
        setTimeout(finishLoading, maxLoadingTime);
    };

    const finishLoading = () => {
        if (loadingAnimationFinished) return;
        loadingAnimationFinished = true;

        clearInterval(textChangeInterval);
        clearInterval(progressInterval);

        // Ensure progress reaches 100%
        currentProgress = 100;

        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);

        // Grid intro animation
        let completedAnimations = 0;
        const totalAnimations = planes.length;

        // Initialize project title immediately if no planes to animate
        if (totalAnimations === 0) {
            setTimeout(() => {
                console.log('Initializing project title after loading (no planes)...');
                const initialProjectIndex = detectCurrentProject();
                if (initialProjectIndex >= 0) {
                    projectTitleElement.textContent = projectAssets[initialProjectIndex].name;
                    currentProjectIndex = initialProjectIndex;
                    console.log('Set initial project title:', projectAssets[initialProjectIndex].name);
                }
            }, 200);
        }

        planes.forEach((plane, index) => {
            const targetScale = plane.scale.clone();
            // Set minimum scale to maintain raycasting capability
            const minScale = 0.01; // Small but non-zero scale
            plane.scale.set(minScale, minScale, minScale);
            plane.rotation.z = (Math.random() - 0.5) * Math.PI;

            let progress = { value: 0 };

            const animation = () => {
                progress.value += 0.05;
                const easeOutQuart = 1 - Math.pow(1 - progress.value, 4);

                // Scale from minScale to targetScale instead of 0 to targetScale
                plane.scale.x = minScale + (targetScale.x - minScale) * easeOutQuart;
                plane.scale.y = minScale + (targetScale.y - minScale) * easeOutQuart;
                plane.rotation.z = (1 - easeOutQuart) * plane.rotation.z;

                if (progress.value < 1) {
                    requestAnimationFrame(animation);
                } else {
                    plane.material.uniforms.u_intensity.value = 1;
                    completedAnimations++;
                    
                    // Initialize project title after all animations complete
                    if (completedAnimations === totalAnimations) {
                        setTimeout(() => {
                            console.log('Initializing project title after loading...');
                            console.log('Project title element:', projectTitleElement);
                            console.log('Project assets:', projectAssets);
                            
                            const initialProjectIndex = detectCurrentProject();
                            console.log('Initial project index:', initialProjectIndex);
                            
                            if (initialProjectIndex >= 0) {
                                projectTitleElement.textContent = projectAssets[initialProjectIndex].name;
                                currentProjectIndex = initialProjectIndex;
                                console.log('Set initial project title:', projectAssets[initialProjectIndex].name);
                            }
                        }, 200); // Small delay to ensure everything is fully loaded
                    }
                }
            };
            setTimeout(() => requestAnimationFrame(animation), index * 100);
        });
        canvas.style.opacity = '1';
    };

    // --- Shaders (Vertex shader updated for the intro animation) ---
    const planeVertexShader = `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_intensity;
        uniform vec2 u_viewport_pos; // Position relative to viewport centre
        uniform float u_glitch_intensity; // For click glitch effect
        uniform float u_hover_intensity; // For hover color effect
        varying vec2 vUv;
        varying float vFade;
        
        void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Ripple effect
            float distance = length(uv - u_mouse);
            float ripple1 = sin(distance * 15.0 - u_time * 4.0) * 0.02;
            float ripple2 = sin(distance * 25.0 - u_time * 6.0) * 0.01;
            
            float totalRipple = (ripple1 + ripple2) * u_intensity;
            pos.z += totalRipple;
            
            // Subtle 3D perspective effect - gentle edge disappearance
            float perspectiveIntensity = 0.4; // Reduced from 0.8
            float disappearanceDistance = 8.0; // Reduced from 15.0
            
            // Calculate edge proximity with smoother transitions
            float leftEdge = smoothstep(-0.6, -1.0, u_viewport_pos.x);
            float rightEdge = smoothstep(0.6, 1.0, u_viewport_pos.x);
            float topEdge = smoothstep(0.6, 1.0, u_viewport_pos.y);
            float bottomEdge = smoothstep(-0.6, -1.0, u_viewport_pos.y);
            
            // Calculate overall edge distance for combined effects
            float edgeDistance = max(max(leftEdge, rightEdge), max(topEdge, bottomEdge));
            
            // Apply subtle 3D perspective transformations
            // Left edge: gentle tumble and fall away to the left
            if (leftEdge > 0.0) {
                float rotationAngle = leftEdge * perspectiveIntensity * 0.8; // Reduced from 1.5
                float fallAngle = leftEdge * perspectiveIntensity * 0.4; // Reduced from 0.8
                
                // Rotate around Y-axis (gentle tumbling sideways)
                pos.x = pos.x * cos(rotationAngle) - pos.z * sin(rotationAngle);
                pos.z = pos.x * sin(rotationAngle) + pos.z * cos(rotationAngle);
                
                // Tilt and move away from camera
                pos.x -= leftEdge * 4.0; // Reduced from 8.0
                pos.z -= leftEdge * disappearanceDistance; // Move away from camera
                pos.y += pos.x * sin(fallAngle) * 0.15; // Reduced from 0.3
            }
            
            // Right edge: gentle tumble and fall away to the right
            if (rightEdge > 0.0) {
                float rotationAngle = rightEdge * perspectiveIntensity * 0.8; // Reduced from 1.5
                float fallAngle = rightEdge * perspectiveIntensity * 0.4; // Reduced from 0.8
                
                // Rotate around Y-axis (gentle tumbling sideways)
                pos.x = pos.x * cos(-rotationAngle) - pos.z * sin(-rotationAngle);
                pos.z = pos.x * sin(-rotationAngle) + pos.z * cos(-rotationAngle);
                
                // Tilt and move away from camera
                pos.x += rightEdge * 4.0; // Reduced from 8.0
                pos.z -= rightEdge * disappearanceDistance; // Move away from camera
                pos.y += pos.x * sin(fallAngle) * 0.15; // Reduced from 0.3
            }
            
            // Top edge: gentle tumble backward and fall away upward
            if (topEdge > 0.0) {
                float rotationAngle = topEdge * perspectiveIntensity * 0.6; // Reduced from 1.2
                float fallAngle = topEdge * perspectiveIntensity * 0.5; // Reduced from 1.0
                
                // Rotate around X-axis (gentle tumbling backward)
                pos.y = pos.y * cos(rotationAngle) - pos.z * sin(rotationAngle);
                pos.z = pos.y * sin(rotationAngle) + pos.z * cos(rotationAngle);
                
                // Move away from camera and upward
                pos.y += topEdge * 3.0; // Reduced from 6.0
                pos.z -= topEdge * disappearanceDistance; // Reduced multiplier
                pos.x += sin(u_time + topEdge * 10.0) * topEdge * 0.8; // Reduced from 2.0
            }
            
            // Bottom edge: gentle tumble forward and fall away downward
            if (bottomEdge > 0.0) {
                float rotationAngle = bottomEdge * perspectiveIntensity * 0.6; // Reduced from 1.2
                float fallAngle = bottomEdge * perspectiveIntensity * 0.5; // Reduced from 1.0
                
                // Rotate around X-axis (gentle tumbling forward)
                pos.y = pos.y * cos(-rotationAngle) - pos.z * sin(-rotationAngle);
                pos.z = pos.y * sin(-rotationAngle) + pos.z * cos(-rotationAngle);
                
                // Move away from camera and downward
                pos.y -= bottomEdge * 3.0; // Reduced from 6.0
                pos.z -= bottomEdge * disappearanceDistance; // Reduced multiplier
                pos.x += sin(u_time + bottomEdge * 10.0) * bottomEdge * 0.8; // Reduced from 2.0
            }
            
            // Add subtle corner effects for diagonal disappearance
            float cornerEffect = leftEdge * topEdge + rightEdge * topEdge + leftEdge * bottomEdge + rightEdge * bottomEdge;
            if (cornerEffect > 0.0) {
                pos.z -= cornerEffect * disappearanceDistance * 0.3; // Reduced from 0.5
                // Add gentle spinning motion for corners
                float spinAngle = cornerEffect * perspectiveIntensity * 1.0; // Reduced from 2.0
                pos.x += sin(u_time * 3.0 + spinAngle) * cornerEffect * 0.6; // Reduced from 1.5
                pos.y += cos(u_time * 2.0 + spinAngle) * cornerEffect * 0.6; // Reduced from 1.5
            }
            
            // Glitch effect on click
            if (u_glitch_intensity > 0.0) {
                float glitchTime = u_time * 10.0;
                float glitchNoise = sin(glitchTime + pos.x * 20.0) * sin(glitchTime + pos.y * 15.0);
                pos.x += glitchNoise * u_glitch_intensity * 0.5;
                pos.y += sin(glitchTime + pos.x * 10.0) * u_glitch_intensity * 0.3;
                pos.z += cos(glitchTime + pos.y * 25.0) * u_glitch_intensity * 0.2;
            }
            
            // Calculate fade factor based on distance from viewport edges
            float fadeDistance = 1.2; // Distance from edge where fade starts
            float fadeEdge = max(abs(u_viewport_pos.x), abs(u_viewport_pos.y));
            vFade = 1.0 - smoothstep(0.8, fadeDistance, fadeEdge);
            vFade = max(0.0, vFade);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const planeFragmentShader = `
        uniform sampler2D u_texture;
        uniform vec2 u_resolution; // Plane's dimensions
        uniform vec2 u_image_resolution; // Media's dimensions
        uniform float u_time;
        uniform float u_glitch_intensity; // For click glitch effect
        uniform float u_hover_intensity; // For hover color effect
        varying vec2 vUv;
        varying float vFade;

        // Random function for glitch effect
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
            // --- Aspect ratio correction (contain) ---
            vec2 plane_res = u_resolution;
            vec2 image_res = u_image_resolution;

            // Calculate the ratios of plane to image dimensions
            vec2 ratio = plane_res / image_res;

            // Use the smaller ratio to ensure the entire image fits
            float fit_ratio = min(ratio.x, ratio.y);

            // Calculate the size of the image on the plane in UV coordinates [0,1]
            vec2 final_size = (image_res * fit_ratio) / plane_res;

            // Calculate the offset to centre the image
            vec2 offset = (vec2(1.0) - final_size) / 2.0;

            // Discard fragments in the letterbox/pillarbox areas
            if (vUv.x < offset.x || vUv.x > 1.0 - offset.x ||
                vUv.y < offset.y || vUv.y > 1.0 - offset.y) {
                discard;
            }

            // Remap the UVs to sample the texture correctly
            vec2 uv = (vUv - offset) / final_size;
            
            // Apply effects based on intensity types
            vec4 texColor = texture2D(u_texture, uv);
            vec3 finalColor = texColor.rgb;
            
            // Apply full glitch effect for clicks
            if (u_glitch_intensity > 0.0) {
                float glitchTime = u_time * 8.0;
                
                // Digital noise distortion
                float noise = random(vec2(floor(uv.y * 100.0), glitchTime)) * 2.0 - 1.0;
                float glitchOffset = noise * u_glitch_intensity * 0.1;
                
                // Horizontal scan lines
                float scanLine = step(0.5, random(vec2(floor(uv.y * 50.0), glitchTime)));
                glitchOffset += scanLine * u_glitch_intensity * 0.05;
                
                // Sample texture with glitch distortion
                vec4 glitchedTexColor = texture2D(u_texture, uv + vec2(glitchOffset, 0.0));
                
                // RGB channel separation
                float r = texture2D(u_texture, uv + vec2(glitchOffset + u_glitch_intensity * 0.02, 0.0)).r;
                float g = texture2D(u_texture, uv + vec2(glitchOffset, 0.0)).g;
                float b = texture2D(u_texture, uv + vec2(glitchOffset - u_glitch_intensity * 0.02, 0.0)).b;
                
                // Combine with original color
                vec3 glitchedColor = vec3(r, g, b);
                
                // Add digital artifacts
                float artifact = step(0.95, random(vec2(uv.x * 10.0, glitchTime)));
                glitchedColor += artifact * vec3(1.0, 0.0, 1.0) * u_glitch_intensity;
                
                // Blend between original and glitched color
                finalColor = mix(texColor.rgb, glitchedColor, u_glitch_intensity);
            }
            
            // Apply subtle color separation for hover (no distortion, only color shift)
            if (u_hover_intensity > 0.0) {
                // Add a very subtle glitch distortion for hover
                float hoverGlitchTime = u_time * 4.0;
                float hoverNoise = random(vec2(floor(uv.y * 150.0), hoverGlitchTime)) * 2.0 - 1.0;
                float hoverGlitchOffset = hoverNoise * u_hover_intensity * 0.02; // Tiny offset

                // RGB channel separation with the subtle distortion
                float r = texture2D(u_texture, uv + vec2(hoverGlitchOffset + u_hover_intensity * 0.008, 0.0)).r;
                float g = texture2D(u_texture, uv + vec2(hoverGlitchOffset, 0.0)).g;
                float b = texture2D(u_texture, uv + vec2(hoverGlitchOffset - u_hover_intensity * 0.008, 0.0)).b;
                
                vec3 hoverColor = vec3(r, g, b);
                
                // Blend with existing color
                finalColor = mix(finalColor, hoverColor, u_hover_intensity * 0.8);
            }
            
            gl_FragColor = vec4(finalColor, texColor.a * vFade);
        }
    `;

    const bgFragmentShader = `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_scroll_velocity;
        uniform float u_scroll_intensity;
        
        // Random function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Hash function for better randomness
        float hash(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }
        
        // Digital glitch effect
        vec3 digitalGlitch(vec2 uv, float time, float intensity) {
            vec3 color = vec3(0.0);
            
            // Horizontal scan lines
            float scanLine = sin(uv.y * 800.0 + time * 10.0) * 0.5 + 0.5;
            
            // RGB channel separation
            vec2 offset = vec2(intensity * 0.02, 0.0);
            color.r = step(0.5, hash(uv + offset + time));
            color.g = step(0.5, hash(uv + time));
            color.b = step(0.5, hash(uv - offset + time));
            
            // Add scan line effect
            color *= scanLine * 0.8 + 0.2;
            
            // Add digital noise
            float noise = hash(uv + time * 5.0);
            color += noise * intensity * 0.3;
            
            return color;
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy;
            
            // Dark background
            vec3 backgroundColor = vec3(0.05, 0.05, 0.05);
            
            // Create dot grid with very low density
            float dotSpacing = 80.0; // Further increased spacing (was 60.0)
            vec2 gridPos = st * dotSpacing;
            vec2 gridCell = floor(gridPos);
            vec2 cellPos = fract(gridPos);
            
            // Calculate dot with very low opacity
            float dotSize = 0.06; // Even smaller dots
            float dist = length(cellPos - 0.5);
            float dot = smoothstep(dotSize, dotSize - 0.02, dist);
            
            // Random properties for each dot
            float cellRandom = hash(gridCell);
            float glitchChance = 0.001; // Further reduced to 0.1% chance
            float isGlitching = step(1.0 - glitchChance, cellRandom + sin(u_time * 0.8 + cellRandom * 100.0) * 0.5 + 0.5); // Much slower timing
            
            // Glitch timing for each dot - much slower and less frequent
            float glitchTime = u_time * 2.0 + cellRandom * 50.0; // Further reduced from 4.0
            float glitchIntensity = isGlitching * (sin(glitchTime) * 0.5 + 0.5);
            
            // Base dot color with very low opacity
            vec3 dotColor = vec3(0.2); // Further reduced opacity (was 0.4)
            
            // Apply glitch effect to dots
            if (isGlitching > 0.5 && dot > 0.1) {
                dotColor = digitalGlitch(st, glitchTime, glitchIntensity);
                // Make glitched dots barely larger
                dotSize *= 1.1; // Further reduced from 1.3
                dist = length(cellPos - 0.5);
                dot = smoothstep(dotSize, dotSize - 0.02, dist);
            }
            
            // Final color mixing with very subtle dot presence
            vec3 finalColor = mix(backgroundColor, dotColor, dot * 0.5); // Further reduced overall dot visibility
            
            // Add subtle scroll response - slight flicker during scrolling
            if (u_scroll_intensity > 0.1) {
                float scrollFlicker = sin(u_time * 15.0) * u_scroll_intensity * 0.05;
                finalColor += vec3(scrollFlicker);
            }
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 40;

    // --- Loading Manager ---
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        // Assets are loaded, now we can safely start the scene reveal.
        // The 5-second max timer will handle hiding the overlay.
    };

    // Loading timer is now handled in startLoadingProcess function

    const textureLoader = new THREE.TextureLoader(loadingManager);

    // --- Background ---
    const bgGeometry = new THREE.PlaneGeometry(1, 1); // Use a 1x1 plane and scale it
    const bgMaterial = new THREE.ShaderMaterial({
        uniforms: { 
            u_time: { value: 0 }, 
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_scroll_velocity: { value: 0.0 },
            u_scroll_intensity: { value: 0.0 }
        },
        fragmentShader: bgFragmentShader
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -50; // Position it behind the grid content
    scene.add(bgMesh);

    // Function to resize the background to fit the camera's view.
    const resizeBackground = () => {
        if (!bgMesh) return;
        const distance = camera.position.z - bgMesh.position.z;
        const vFOV = (camera.fov * Math.PI) / 180; // convert vertical fov to radians
        const height = 2 * Math.tan(vFOV / 2) * distance;
        const width = height * camera.aspect;
        bgMesh.scale.set(width, height, 1);
    };
    resizeBackground(); // Initial resize

    // --- Grid of Planes - Organized by Project Rows ---
    const projectAssets = [
        {
            name: "Bamai",
            assets: [
                { type: 'image', src: "img/bamai_logo.png" },
                { type: 'image', src: "img/bama_watch.png" },
                { type: 'image', src: "img/bamai_mobile.png" },
                { type: 'image', src: "img/bamai_billboards.png" },
                { type: 'image', src: "img/bamai_mobile_stats.png" },
                { type: 'image', src: "img/bamai_soft_disk.png" },
                { type: 'image', src: "img/bamai_sticker.png" },
                { type: 'image', src: "img/bamai_sticker_2.png" },
                { type: 'image', src: "img/bamai_oppo_watches.png" },
                { type: 'image', src: "img/bamai_progress.png" },
                { type: 'image', src: "img/bamai_mobile_white.png" }
            ]
        },
        {
            name: "Qi",
            assets: [
                { type: 'image', src: "img/qi_logo.png" },
                { type: 'image', src: "img/qi_wall_sign.png" },
                { type: 'image', src: "img/qi_hand_1.png" },
                { type: 'image', src: "img/qi_hand_2.png" },
                { type: 'image', src: "img/qi_home_1.png" },
                { type: 'image', src: "img/qi_home_2.png" },
                { type: 'image', src: "img/qi_komorebi_1.png" },
                { type: 'image', src: "img/qi_komorebi_2.png" }
            ]
        },
        {
            name: "X6ren",
            assets: [
                { type: 'image', src: "img/x6ren_logo.png" },
                { type: 'image', src: "img/x6ren_mobile.png" },
                { type: 'image', src: "img/x6ren_watch.png" }
            ]
        },
        {
            name: "Ruce",
            assets: [
                { type: 'image', src: "img/ruce_logo.png" },
                { type: 'image', src: "img/ruce_home.png" },
                { type: 'image', src: "img/ruce_hands_1.png" },
                { type: 'image', src: "img/ruce_hands_2.png" },
                { type: 'image', src: "img/ruce_widgets.png" }
            ]
        },
    ];

    // Detailed project information for modals
    const projectModalData = {
        "Bamai": {
            logo: "img/bamai_logo.png",
            brief: `
                <p><strong>Bamai</strong> is a revolutionary fitness ecosystem that transforms how people approach health and wellness through intelligent wearable technology and personalized coaching.</p>

                <h3>Design Process & Methodology</h3>
                <p>Following a <strong>Human-Centered Design (HCD)</strong> approach combined with <strong>Lean UX principles</strong>, the Bamai project employed a comprehensive design thinking methodology:</p>
                <ul>
                    <li><strong>Empathize & Research:</strong> Conducted 45+ user interviews with fitness enthusiasts, personal trainers, and health-conscious individuals. Utilized ethnographic studies in gyms and home workout environments to understand pain points and behavioral patterns.</li>
                    <li><strong>Define & Synthesize:</strong> Applied Jobs-to-be-Done (JTBD) framework to identify core user needs. Created detailed personas and journey maps highlighting emotional and functional requirements throughout the fitness experience.</li>
                    <li><strong>Ideate & Co-create:</strong> Facilitated design sprints with cross-functional teams including fitness experts, data scientists, and behavioral psychologists. Employed "How Might We" sessions to generate innovative solutions.</li>
                    <li><strong>Prototype & Test:</strong> Developed rapid prototypes using Figma and Principle, conducting weekly usability testing sessions. Implemented A/B testing for key interaction patterns and information architecture decisions.</li>
                    <li><strong>Iterate & Scale:</strong> Established continuous feedback loops with beta users, utilizing analytics and user feedback to refine the experience. Applied atomic design principles for scalable component systems.</li>
                </ul>

                <h3>Problem Statement</h3>
                <p>Traditional fitness solutions are fragmented, offering either expensive personal training or generic app-based workouts. Users struggle with motivation, proper form, and consistent progress tracking. The market lacks an integrated solution that provides professional guidance at scale while maintaining personalization.</p>
                
                <h3>Solution</h3>
                <p>Bamai bridges this gap by combining:</p>
                <ul>
                    <li><strong>Smart Wearables</strong> - Advanced sensors for real-time form correction and performance tracking</li>
                    <li><strong>AI-Powered Coaching</strong> - Personalized workout plans that adapt to user progress and preferences</li>
                    <li><strong>Community Integration</strong> - Social features that gamify fitness and build accountability</li>
                    <li><strong>Comprehensive Analytics</strong> - Detailed insights into progress, recovery, and optimal training zones</li>
                </ul>
                
                <h3>Target Audience</h3>
                <p>Health-conscious individuals aged 25-45 who value technology-driven solutions, have disposable income for premium fitness products, and seek professional guidance without the constraints of traditional gym memberships.</p>
            `,
            designPhilosophy: `
                <h3>Design Philosophy</h3>
                <p>Bamai's design philosophy centers on <em>"Effortless Excellence"</em> - creating interfaces that feel intuitive while delivering sophisticated functionality. Every interaction should feel natural and empower users to achieve their fitness goals without technical barriers.</p>
                
                <h3>Visual Identity</h3>
                <p>The brand leverages a <strong>modern, energetic aesthetic</strong> with:</p>
                <ul>
                    <li><strong>Color Palette</strong> - Vibrant blues and greens representing vitality and growth, balanced with clean whites and subtle grays</li>
                    <li><strong>Typography</strong> - Modern sans-serif fonts that convey clarity and precision</li>
                    <li><strong>Iconography</strong> - Geometric, minimalist icons that emphasize movement and progress</li>
                    <li><strong>Motion Design</strong> - Smooth, purposeful animations that mirror the fluidity of physical movement</li>
                </ul>
                
                <h3>UI Design Principles</h3>
                <p><strong>Clarity Over Complexity:</strong> Every screen serves a specific purpose with clear hierarchy and minimal cognitive load.</p>
                <p><strong>Data Visualization:</strong> Complex fitness metrics are presented through intuitive charts and progress indicators that motivate continued engagement.</p>
                <p><strong>Contextual Feedback:</strong> Real-time visual and haptic feedback ensures users understand their performance and can make immediate adjustments.</p>
                <p><strong>Accessibility First:</strong> High contrast ratios, scalable fonts, and voice commands ensure the platform is inclusive for all users.</p>
            `,
            uxStrategy: `
                <h3>User Experience Strategy</h3>
                <p>The UX strategy focuses on creating <strong>seamless user journeys</strong> that reduce friction and maximize engagement through every touchpoint of the fitness experience.</p>
                
                <h3>Onboarding Journey</h3>
                <p>New users experience a <strong>progressive disclosure</strong> approach:</p>
                <ul>
                    <li><strong>Step 1:</strong> Quick fitness assessment to understand current level and goals</li>
                    <li><strong>Step 2:</strong> Device pairing with guided setup and calibration</li>
                    <li><strong>Step 3:</strong> First workout experience with comprehensive coaching</li>
                    <li><strong>Step 4:</strong> Community integration and goal setting</li>
                </ul>
                
                <h3>Engagement Loops</h3>
                <p><strong>Daily Engagement:</strong> Morning check-ins, workout reminders, and evening progress reviews create consistent touchpoints.</p>
                <p><strong>Weekly Challenges:</strong> Gamified competitions and personal milestones maintain long-term motivation.</p>
                <p><strong>Monthly Insights:</strong> Comprehensive progress reports and goal adjustments keep users aligned with their objectives.</p>
                
                <h3>Behavioral Design</h3>
                <p>The platform incorporates proven behavioral psychology principles:</p>
                <ul>
                    <li><strong>Variable Rewards:</strong> Unexpected achievements and milestone celebrations</li>
                    <li><strong>Social Proof:</strong> Community achievements and shared progress</li>
                    <li><strong>Loss Aversion:</strong> Streak tracking and gentle reminders about maintaining progress</li>
                    <li><strong>Commitment Devices:</strong> Public goal setting and accountability partnerships</li>
                </ul>
                
                <h3>Success Metrics</h3>
                <p>UX success is measured through:</p>
                <ul>
                    <li>Monthly active users and retention rates</li>
                    <li>Workout completion rates and progression tracking</li>
                    <li>Community engagement and social sharing</li>
                    <li>User satisfaction scores and Net Promoter Score</li>
                </ul>
                         `
         },
         "Ruce": {
             logo: "img/ruce_logo.png",
             brief: `
                 <p><strong>Ruce</strong> - Your Personalized TCM Wellness Companion</p>

                 <h3>Design Process & Methodology</h3>
                 <p>Ruce's development followed a <strong>Cultural-Sensitive Design (CSD)</strong> approach integrated with <strong>Service Design principles</strong>, ensuring respectful representation of Traditional Chinese Medicine while meeting modern usability standards:</p>
                 <ul>
                     <li><strong>Cultural Research & Immersion:</strong> Collaborated with TCM practitioners and scholars for 6 months to understand authentic practices. Conducted field studies in traditional medicine clinics and modern wellness centers across different cultural contexts.</li>
                     <li><strong>Participatory Design:</strong> Engaged TCM experts, healthcare professionals, and diverse user groups in co-design workshops. Applied cultural probes to understand daily wellness routines and health tracking behaviors across Eastern and Western users.</li>
                     <li><strong>Systems Thinking Approach:</strong> Mapped the entire wellness ecosystem including Bamai integration, healthcare providers, and family support systems. Created service blueprints to identify touchpoints and potential cultural friction points.</li>
                     <li><strong>Inclusive Design Framework:</strong> Implemented accessibility guidelines for diverse age groups and cultural backgrounds. Conducted usability testing with multilingual users to ensure cross-cultural comprehension.</li>
                     <li><strong>Ethical Design Validation:</strong> Established advisory board with medical professionals and cultural experts to validate health recommendations and cultural sensitivity throughout the design process.</li>
                 </ul>

                 <p>Ruce is a smart health app that integrates Traditional Chinese Medicine (TCM) constitution and pulse analysis to create personalized bowel movement and hydration plans, while also tracking emotional and menstrual cycles. By connecting with our other app, Bamai (a simulated TCM pulse-taking app), Ruce gains a more accurate understanding of your body's condition, providing tailored wellness recommendations.</p>
                 
                 <h3>Key Features</h3>
                 <ul>
                     <li><strong>Personalized Bowel Movement Plan:</strong> Based on your constitution and pulse characteristics, Ruce intelligently recommends the most suitable timing and frequency for bowel movements, helping you develop healthy habits.</li>
                     <li><strong>Smart Hydration Reminders:</strong> Utilizing your body data, Ruce creates a personalized hydration plan and reminds you to drink water at optimal times.</li>
                     <li><strong>Mood Swing Cycle Tracking:</strong> Record and analyze your mood fluctuations, helping you understand your emotional cycles and better manage emotional changes.</li>
                     <li><strong>Menstrual Cycle Tracking:</strong> Accurately track and predict your menstrual cycle, providing period health advice and thoughtful reminders.</li>
                     <li><strong>Bamai Integration:</strong> Seamlessly connects with Bamai to obtain more comprehensive pulse information, enhancing the accuracy of health recommendations.</li>
                 </ul>
             `,
             designPhilosophy: `
                 <h3>Design Philosophy</h3>
                 <p>Ruce's design philosophy embraces <em>"Harmonious Wellness"</em>, drawing inspiration from traditional Chinese medicine principles while creating a modern, intuitive interface that respects both Eastern wisdom and Western usability standards.</p>
                 
                 <h3>Visual Identity</h3>
                 <p>The brand leverages a <strong>calm, nurturing aesthetic</strong> that reflects TCM's holistic approach:</p>
                 <ul>
                     <li><strong>Color Palette:</strong> Warm earth tones (brown, beige) representing grounding and stability, complemented by sage green (health and nature) and soft gold accents (wisdom and balance)</li>
                     <li><strong>Typography:</strong> Elegant serif fonts for headings that convey wisdom and tradition, paired with clean sans-serif for body text ensuring readability</li>
                     <li><strong>Iconography:</strong> Minimalist icons inspired by Chinese medicine symbols, featuring circular motifs representing wholeness and cyclical nature</li>
                     <li><strong>Motion Design:</strong> Gentle, flowing animations that mirror the concept of qi (vital energy) flow through the body</li>
                 </ul>
                 
                 <h3>UI Design Principles</h3>
                 <p><strong>Holistic Harmony:</strong> All interface elements work together to create a sense of balance and well-being, avoiding overwhelming users with too much information at once.</p>
                 <p><strong>Cultural Sensitivity:</strong> Respectful integration of TCM concepts with modern UI patterns, ensuring accessibility for both Eastern and Western users.</p>
                 <p><strong>Privacy First:</strong> Sensitive health data is presented with appropriate visual treatments that ensure privacy while maintaining functionality.</p>
                 <p><strong>Progressive Disclosure:</strong> Complex TCM concepts are introduced gradually, allowing users to deepen their understanding over time.</p>
             `,
             uxStrategy: `
                 <h3>User Experience Strategy</h3>
                 <p>The UX strategy focuses on creating <strong>intuitive wellness journeys</strong> that seamlessly blend traditional Chinese medicine wisdom with modern health tracking capabilities.</p>
                 
                 <h3>Onboarding Journey</h3>
                 <p>New users experience a <strong>culturally-aware introduction</strong>:</p>
                 <ul>
                     <li><strong>Step 1:</strong> TCM constitution assessment through guided questionnaire</li>
                     <li><strong>Step 2:</strong> Bamai integration setup for pulse analysis data</li>
                     <li><strong>Step 3:</strong> Personalized wellness plan creation based on individual constitution</li>
                     <li><strong>Step 4:</strong> Gentle introduction to daily tracking features</li>
                 </ul>
                 
                 <h3>Engagement Loops</h3>
                 <p><strong>Daily Rhythm:</strong> Morning constitution check-ins, timely hydration reminders, and evening wellness reflections create natural engagement touchpoints.</p>
                 <p><strong>Cyclical Insights:</strong> Weekly pattern analysis and monthly constitutional adjustments based on tracked data and seasonal changes.</p>
                 <p><strong>Community Support:</strong> Optional sharing of wellness journeys with like-minded individuals while maintaining privacy.</p>
                 
                 <h3>Behavioral Design</h3>
                 <p>The platform incorporates TCM-inspired behavioral principles:</p>
                 <ul>
                     <li><strong>Natural Rhythms:</strong> Recommendations aligned with circadian rhythms and seasonal changes</li>
                     <li><strong>Gradual Improvement:</strong> Small, sustainable changes rather than drastic lifestyle modifications</li>
                     <li><strong>Mind-Body Connection:</strong> Tracking emotional states alongside physical symptoms for holistic wellness</li>
                     <li><strong>Personalized Adaptation:</strong> Continuous learning from user feedback and physiological responses</li>
                 </ul>
                 
                 <h3>Success Metrics</h3>
                 <p>UX success is measured through:</p>
                 <ul>
                     <li>Daily engagement with wellness tracking features</li>
                     <li>Improvement in reported wellness scores over time</li>
                     <li>Successful integration with Bamai pulse data</li>
                     <li>User satisfaction with personalized recommendations</li>
                     <li>Long-term retention and habit formation</li>
                 </ul>
             `
         },
         "X6ren": {
             logo: "img/x6ren_logo.png",
             brief: `
                 <p><strong>X6ren</strong> - Ancient Wisdom Decision-Making Tool</p>

                 <h3>Design Process & Methodology</h3>
                 <p>X6ren's development employed a <strong>Research-Through-Design (RTD)</strong> methodology combined with <strong>Speculative Design principles</strong>, bridging historical scholarship with contemporary interaction design:</p>
                 <ul>
                     <li><strong>Historical Research & Analysis:</strong> Conducted extensive literature review of Tang and Song dynasty texts, collaborating with historians and sinologists to ensure mathematical accuracy. Analyzed original manuscripts and contemporary interpretations of Xiao Liu Ren systems.</li>
                     <li><strong>Cognitive Design Research:</strong> Studied decision-making psychology and cognitive biases to understand how ancient frameworks could complement modern thinking patterns. Conducted behavioral experiments to validate the effectiveness of systematic decision tools.</li>
                     <li><strong>Cross-Cultural Design Translation:</strong> Applied cultural translation methodologies to make ancient concepts accessible to contemporary global audiences. Developed bilingual design systems that maintain cultural authenticity while ensuring universal usability.</li>
                     <li><strong>Speculative Prototyping:</strong> Created multiple interaction paradigms exploring how ancient wisdom could be meaningfully integrated into digital experiences. Tested various metaphors and mental models through rapid prototyping and user feedback sessions.</li>
                     <li><strong>Ethical Technology Framework:</strong> Established clear boundaries between cultural appreciation and appropriation. Implemented transparency features to educate users about the historical context and limitations of the digital interpretation.</li>
                 </ul>

                 <p>Experience the ancient wisdom of X6ren, a Chinese decision-making system from the Tang and Song dynasties reimagined for modern life. This mathematical framework offers fresh perspectives on your everyday choices.</p>
                 
                 <h3>Key Features</h3>
                 <ul>
                     <li><strong>Systematic Decision Framework:</strong> Based on temporal-spatial mathematical models with consistent results</li>
                     <li><strong>Perspective Shifting:</strong> Helps break through mental blocks and fixed thinking patterns</li>
                     <li><strong>Elegant Modern Design:</strong> Clean and intuitive user interface</li>
                     <li><strong>Apple Watch Integration:</strong> Quick decision guidance on your wrist</li>
                     <li><strong>Detailed Analysis:</strong> Multi-faceted interpretations for each result</li>
                     <li><strong>Bilingual Support:</strong> Full Chinese and English experience</li>
                 </ul>
                 
                 <h3>Perfect for</h3>
                 <ul>
                     <li>Professionals facing difficult choices</li>
                     <li>Decision-makers seeking fresh perspectives</li>
                     <li>Explorers of ancient wisdom systems</li>
                     <li>Efficiency enthusiasts looking for thinking tools</li>
                     <li>Cross-cultural exchange enthusiasts</li>
                 </ul>
                 
                 <h3>Important Note</h3>
                 <p>X6ren is not fortune-telling or divination, but a systematic thinking tool. It presents a mathematical decision-making model in a modern format, creating a unique decision-making experience.</p>
                 
                 <p>This app provides only a basic experience of the Xiao Liu Ren system and is not a complete explanation of its rich cultural context and complex mathematical model. Users genuinely interested in this cultural tradition are encouraged to research related classical texts and academic materials for a more comprehensive understanding.</p>
             `,
             designPhilosophy: `
                 <h3>Design Philosophy</h3>
                 <p>X6ren's design philosophy centers on <em>"Timeless Wisdom in Modern Form"</em>, bridging the gap between ancient Chinese wisdom and contemporary digital design principles.</p>
                 
                 <h3>Visual Identity</h3>
                 <p>The brand leverages a <strong>sophisticated, scholarly aesthetic</strong> that honors traditional Chinese culture:</p>
                 <ul>
                     <li><strong>Color Palette:</strong> Deep indigo and gold representing wisdom and nobility, complemented by warm grays and subtle red accents for auspicious energy</li>
                     <li><strong>Typography:</strong> Traditional Chinese calligraphy-inspired headings paired with clean, modern sans-serif for optimal readability across languages</li>
                     <li><strong>Iconography:</strong> Geometric symbols derived from ancient Chinese divination systems, featuring hexagonal patterns and flowing lines</li>
                     <li><strong>Motion Design:</strong> Subtle animations inspired by the flow of time and cosmic energy, with gentle transitions that reflect contemplative decision-making</li>
                 </ul>
                 
                 <h3>UI Design Principles</h3>
                 <p><strong>Cultural Authenticity:</strong> Respectful representation of traditional Chinese concepts without appropriation, maintaining scholarly accuracy.</p>
                 <p><strong>Cognitive Clarity:</strong> Complex ancient systems are presented through clear, modern interfaces that don't oversimplify the underlying mathematics.</p>
                 <p><strong>Cross-Cultural Accessibility:</strong> Bilingual interface design that works equally well for Chinese and English speakers.</p>
                 <p><strong>Contemplative Space:</strong> Interface provides moments for reflection, encouraging thoughtful consideration rather than impulsive decision-making.</p>
             `,
             uxStrategy: `
                 <h3>User Experience Strategy</h3>
                 <p>The UX strategy focuses on creating <strong>meaningful decision-making journeys</strong> that honor the depth of traditional Chinese wisdom while providing practical value for modern users.</p>
                 
                 <h3>Onboarding Journey</h3>
                 <p>New users experience a <strong>culturally-rich introduction</strong>:</p>
                 <ul>
                     <li><strong>Step 1:</strong> Historical context introduction to Xiao Liu Ren system</li>
                     <li><strong>Step 2:</strong> Interactive tutorial on the mathematical framework</li>
                     <li><strong>Step 3:</strong> Practice session with sample decisions</li>
                     <li><strong>Step 4:</strong> Personalization of interface language and cultural preferences</li>
                 </ul>
                 
                 <h3>Decision-Making Flow</h3>
                 <p><strong>Question Framing:</strong> Guided question formulation helps users articulate their decisions clearly and appropriately.</p>
                 <p><strong>Contextual Input:</strong> Time, location, and situational factors are incorporated into the analysis framework.</p>
                 <p><strong>Result Interpretation:</strong> Multi-layered explanations provide both immediate guidance and deeper cultural context.</p>
                 
                 <h3>Engagement Strategy</h3>
                 <p>The platform incorporates principles of contemplative technology:</p>
                 <ul>
                     <li><strong>Spaced Usage:</strong> Encouraging thoughtful, spaced usage rather than addictive frequent checking</li>
                     <li><strong>Reflection Journaling:</strong> Optional tracking of decision outcomes and personal insights</li>
                     <li><strong>Cultural Learning:</strong> Gradual introduction to deeper concepts for users interested in learning more</li>
                     <li><strong>Community Wisdom:</strong> Optional sharing of decision-making insights while maintaining privacy</li>
                 </ul>
                 
                 <h3>Success Metrics</h3>
                 <p>UX success is measured through:</p>
                 <ul>
                     <li>Decision quality improvement as reported by users</li>
                     <li>Increased comfort with unfamiliar decision-making frameworks</li>
                     <li>Cross-cultural appreciation and understanding</li>
                     <li>Long-term user retention indicating genuine value</li>
                     <li>Positive feedback on cultural sensitivity and accuracy</li>
                 </ul>
             `
         },
         "Qi": {
             logo: "img/qi_logo.png",
             brief: `
                 <p><strong>Qi (Aurae)</strong> - Color-Based Social Entertainment App</p>

                 <h3>Design Process & Methodology</h3>
                 <p>Qi's development followed a <strong>Social Innovation Design</strong> approach integrated with <strong>Behavioral Design principles</strong>, focusing on creating authentic human connections through alternative social paradigms:</p>
                 <ul>
                     <li><strong>Social Anthropology Research:</strong> Conducted ethnographic studies on modern social interaction patterns, analyzing the psychological impact of image-based social media. Researched color psychology across cultures and its influence on human connection and emotional expression.</li>
                     <li><strong>Participatory Co-Design:</strong> Facilitated community workshops with diverse age groups and cultural backgrounds to understand authentic connection needs. Applied design fiction techniques to envision alternative social networking paradigms beyond traditional photo-sharing models.</li>
                     <li><strong>Behavioral Psychology Integration:</strong> Collaborated with social psychologists to design interaction patterns that promote meaningful connections. Implemented time-boxing and scarcity principles to encourage quality over quantity in social interactions.</li>
                     <li><strong>Philosophy-Informed Design:</strong> Worked with Daoist scholars to respectfully integrate philosophical concepts into digital experiences. Created contemplative interaction patterns that encourage mindful social engagement rather than addictive usage patterns.</li>
                     <li><strong>Community-Centered Validation:</strong> Established ongoing feedback loops with beta communities to refine matching algorithms and social features. Applied social network analysis to understand connection quality and community health metrics.</li>
                 </ul>

                 <h3>Executive Summary</h3>
                 <p>Qi (Aurae) is an innovative social entertainment application designed to foster unique connections based on individual "auras" represented by colors, and shared through personal artefacts rather than traditional self-photos. The app aims to create a more meaningful and less superficial networking environment, integrating elements of Daoism for daily guidance and facilitating community engagement through timed chats and regular Q&A challenges.</p>
                 
                 <h3>Vision & Mission</h3>
                 <p><strong>Vision:</strong> To redefine social networking by emphasizing authentic connections through shared interests, personal expressions via artefacts, and intuitive "aura" matching, guided by ancient wisdom.</p>
                 <p><strong>Mission:</strong> To provide a platform where individuals can connect, learn, and grow by discovering like-minded people based on their self-defined aura colors and the stories told by their everyday objects, fostering a supportive and engaging community.</p>
                 
                 <h3>Target Audience</h3>
                 <ul>
                     <li>Individuals aged 18-35 seeking alternative, more meaningful social connections beyond traditional dating or broad social media platforms</li>
                     <li>Users interested in self-expression through unique personal items and creative storytelling</li>
                     <li>Those open to philosophical guidance and community-based learning</li>
                     <li>People looking for quick, low-pressure ways to initiate conversations and discover shared interests</li>
                 </ul>
                 
                 <h3>Key Features</h3>
                 <p><strong>Aura Definition (Color-Based Profile):</strong> Users select a primary color that represents their "aura" or current state/personality, with intuitive color picker interface and matching algorithm based on color compatibility.</p>
                 <p><strong>Artefact-Oriented Profiles:</strong> Instead of personal photos, users upload images of everyday objects/artefacts that hold personal significance, creating curated galleries that offer deeper insights into their lives and interests.</p>
                 <p><strong>Matched-Up Chat (2-Minute Limit):</strong> Short, focused conversations with mutual matching system and option to extend chats beyond 2 minutes with mutual agreement.</p>
                 <p><strong>Daoism Integration:</strong> Daily "Qi Insight" notifications with Daoist quotes and principles for mindful living and well-being guidance.</p>
                 <p><strong>Online Q&A Challenge:</strong> Recurring timed challenges every three days with leaderboards, challenge rooms, and post-event connection opportunities.</p>
             `,
             designPhilosophy: `
                 <h3>Design Philosophy</h3>
                 <p>Qi's design philosophy centers on <em>"Authentic Connections Through Color and Story"</em>, creating an interface that celebrates individual expression while fostering genuine human connections through shared experiences and meaningful objects.</p>
                 
                 <h3>Visual Identity</h3>
                 <p>The brand leverages a <strong>vibrant, inclusive aesthetic</strong> that celebrates diversity and personal expression:</p>
                 <ul>
                     <li><strong>Color Palette:</strong> Dynamic color system that adapts to user's aura selections, with base neutrals (warm grays, soft whites) and accent colors that shift based on community activity</li>
                     <li><strong>Typography:</strong> Modern, friendly sans-serif fonts that convey openness and accessibility, with subtle variations for different cultural contexts</li>
                     <li><strong>Iconography:</strong> Organic, flowing icons inspired by natural elements and energy flows, featuring circular motifs representing wholeness and connection</li>
                     <li><strong>Motion Design:</strong> Gentle, breathing animations that mirror the concept of life energy (qi), with color transitions that reflect aura interactions</li>
                 </ul>
                 
                 <h3>UI Design Principles</h3>
                 <p><strong>Color-First Design:</strong> Interface elements respond to and celebrate user's chosen aura colors, creating personalized visual experiences.</p>
                 <p><strong>Object-Centered Storytelling:</strong> Visual hierarchy emphasizes artefact imagery and associated stories over traditional profile elements.</p>
                 <p><strong>Mindful Interaction:</strong> Timed interactions and contemplative spaces encourage thoughtful engagement over rapid consumption.</p>
                 <p><strong>Cultural Sensitivity:</strong> Respectful integration of Daoist concepts with universal accessibility, avoiding appropriation while honoring wisdom traditions.</p>
             `,
             uxStrategy: `
                 <h3>User Experience Strategy</h3>
                 <p>The UX strategy focuses on creating <strong>meaningful social discoveries</strong> that prioritize authentic connections over superficial interactions through color psychology and personal storytelling.</p>
                 
                 <h3>Onboarding Journey</h3>
                 <p>New users experience a <strong>color-guided introduction</strong>:</p>
                 <ul>
                     <li><strong>Step 1:</strong> Aura color selection with guided meditation and color psychology insights</li>
                     <li><strong>Step 2:</strong> Artefact collection - users upload 3-5 meaningful objects with personal stories</li>
                     <li><strong>Step 3:</strong> Matching preferences setup based on color compatibility and interest alignment</li>
                     <li><strong>Step 4:</strong> First guided chat experience with ice-breaker prompts</li>
                 </ul>
                 
                 <h3>Engagement Loops</h3>
                 <p><strong>Daily Rhythms:</strong> Morning aura check-ins, midday Qi insights, and evening reflection prompts create natural engagement touchpoints.</p>
                 <p><strong>Social Discovery:</strong> Algorithm surfaces compatible auras and intriguing artefacts, encouraging exploration of diverse perspectives.</p>
                 <p><strong>Community Events:</strong> Tri-weekly Q&A challenges create shared experiences and conversation starters.</p>
                 
                 <h3>Behavioral Design</h3>
                 <p>The platform incorporates principles of mindful social interaction:</p>
                 <ul>
                     <li><strong>Intentional Connections:</strong> Limited daily matches encourage quality over quantity in social interactions</li>
                     <li><strong>Temporal Boundaries:</strong> Timed chats create urgency while preventing overwhelming commitment</li>
                     <li><strong>Story-Driven Engagement:</strong> Artefact-based profiles encourage deeper, more meaningful conversations</li>
                     <li><strong>Philosophical Grounding:</strong> Daily Daoist insights provide contemplative framework for social interactions</li>
                 </ul>
                 
                 <h3>Success Metrics</h3>
                 <p>UX success is measured through:</p>
                 <ul>
                     <li>Quality of connections formed (measured through extended conversations and mutual connections)</li>
                     <li>Diversity of social interactions across different aura types</li>
                     <li>Engagement with philosophical content and personal growth features</li>
                     <li>Community participation in Q&A challenges and events</li>
                     <li>User retention and satisfaction with authentic connection quality</li>
                 </ul>
             `
         }
     };

     // Modal functionality with comprehensive debugging
     console.log('🔍 DEBUG: Initializing modal functionality...');
     
     const modal = document.getElementById('project-modal');
     const modalOverlay = document.querySelector('.modal-overlay');
     const modalClose = document.querySelector('.modal-close');
     const modalProjectTitle = document.getElementById('modal-project-title');
     const modalProjectLogo = document.getElementById('modal-project-logo');
     const modalProjectBrief = document.getElementById('modal-project-brief');
     const modalDesignPhilosophy = document.getElementById('modal-design-philosophy');
     const modalUxStrategy = document.getElementById('modal-ux-strategy');

     // Debug: Check if modal elements exist
     console.log('🔍 DEBUG: Modal elements found:', {
         modal: !!modal,
         modalOverlay: !!modalOverlay,
         modalClose: !!modalClose,
         modalProjectTitle: !!modalProjectTitle,
         modalProjectLogo: !!modalProjectLogo,
         modalProjectBrief: !!modalProjectBrief,
         modalDesignPhilosophy: !!modalDesignPhilosophy,
         modalUxStrategy: !!modalUxStrategy
     });

     // Global scroll prevention functions
     const preventScroll = (event) => {
         // Only prevent scroll if the target is not within the modal content
         if (!event.target.closest('.modal-content')) {
             event.preventDefault();
         }
     };

     // Function to open modal with project data
     function openProjectModal(projectName) {
         console.log('🚀 DEBUG: Opening modal for project:', projectName);
         console.log('🔍 DEBUG: Modal element exists:', !!modal);
         console.log('🔍 DEBUG: Project modal data:', projectModalData[projectName]);
         
         const projectData = projectModalData[projectName];
         if (!projectData) {
             console.error(`❌ No modal data found for project: ${projectName}`);
             return;
         }

         if (!modal) {
             console.error('❌ Modal element not found!');
             return;
         }

         // Populate modal content
         console.log('📝 DEBUG: Populating modal content...');
         modalProjectTitle.textContent = projectName;
         modalProjectLogo.src = projectData.logo;
         modalProjectLogo.alt = `${projectName} Logo`;
         modalProjectBrief.innerHTML = projectData.brief;
         modalDesignPhilosophy.innerHTML = projectData.designPhilosophy;
         modalUxStrategy.innerHTML = projectData.uxStrategy;

         // Reset modal scroll position to top
        const modalBody = document.querySelector('.modal-body');
        const modalContent = document.querySelector('.modal-content');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        if (modalContent) {
            modalContent.scrollTop = 0;
        }

        // Show modal
         console.log('👁️ DEBUG: Showing modal...');
         modal.classList.add('active');
         document.body.style.overflow = 'hidden'; // Prevent background scrolling

         // Add global scroll prevention
         document.addEventListener('wheel', preventScroll, { passive: false });
         document.addEventListener('touchmove', preventScroll, { passive: false });

         console.log('✅ DEBUG: Modal should now be visible');
     }

     // Function to close modal
     function closeProjectModal() {
         console.log('🔒 DEBUG: Closing modal...');
         if (modal) {
             modal.classList.remove('active');
             document.body.style.overflow = ''; // Restore background scrolling
             
             // Remove global scroll prevention
             document.removeEventListener('wheel', preventScroll, { passive: false });
             document.removeEventListener('touchmove', preventScroll, { passive: false });
         }
     }

     // Event listeners for modal - with error checking
     if (modalClose) {
         modalClose.addEventListener('click', (event) => {
             event.stopPropagation();
             closeProjectModal();
         });
         console.log('✅ DEBUG: Modal close button event listener added');
     } else {
         console.error('❌ DEBUG: Modal close button not found');
     }

     if (modalOverlay) {
         modalOverlay.addEventListener('click', closeProjectModal);
         console.log('✅ DEBUG: Modal overlay event listener added');
     } else {
         console.error('❌ DEBUG: Modal overlay not found');
     }

     // Allow scrolling only within modal body and content
     const modalBody = document.querySelector('.modal-body');
     const modalContent = document.querySelector('.modal-content');
     
     if (modalBody) {
         modalBody.addEventListener('wheel', (event) => {
             event.stopPropagation();
             // Allow scrolling within modal body
             const { scrollTop, scrollHeight, clientHeight } = modalBody;
             const isScrollingUp = event.deltaY < 0;
             const isScrollingDown = event.deltaY > 0;
             
             // Prevent default only if we're at the scroll boundaries
             if ((isScrollingUp && scrollTop === 0) || 
                 (isScrollingDown && scrollTop + clientHeight >= scrollHeight)) {
                 event.preventDefault();
             }
         });
         
         modalBody.addEventListener('touchmove', (event) => {
             event.stopPropagation();
         });
         
         console.log('✅ DEBUG: Modal body scroll event listeners added');
     }
     
     if (modalContent) {
         modalContent.addEventListener('wheel', (event) => {
             event.stopPropagation();
         });
         
         modalContent.addEventListener('touchmove', (event) => {
             event.stopPropagation();
         });
         
         console.log('✅ DEBUG: Modal content scroll event listeners added');
     }

     // Close modal on escape key
     document.addEventListener('keydown', (event) => {
         if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
             closeProjectModal();
         }
     });
     
     console.log('✅ DEBUG: Modal functionality initialization complete');

     // Global test function for manual testing
     window.testModal = function() {
         console.log('🧪 DEBUG: Testing modal manually...');
         openProjectModal('Bamai');
     };
     
     // Test function to check raycasting
     window.testRaycasting = function() {
         console.log('🧪 DEBUG: Testing raycasting...');
         console.log('Camera position:', { x: camera.position.x, y: camera.position.y, z: camera.position.z });
         console.log('Total planes:', planes.length);
         
         // Test intersection from camera center
         const centerMouse = new THREE.Vector2(0, 0);
         raycaster.setFromCamera(centerMouse, camera);
         const centerIntersects = raycaster.intersectObjects(planes);
         console.log('Center raycaster intersects:', centerIntersects.length);
         
         // Test intersection with all objects in scene
         const allIntersects = raycaster.intersectObjects(scene.children, true);
         console.log('All scene intersects:', allIntersects.length);
         
         if (planes.length > 0) {
             console.log('First plane details:', {
                 position: planes[0].position,
                 scale: planes[0].scale,
                 visible: planes[0].visible,
                 userData: planes[0].userData
             });
         }
         
         // Test if scale is zero (the original problem)
         const zeroScalePlanes = planes.filter(plane => 
             plane.scale.x === 0 || plane.scale.y === 0 || plane.scale.z === 0
         );
         console.log('⚠️ Planes with zero scale (should be 0):', zeroScalePlanes.length);
     };
     
     console.log('🧪 DEBUG: Test functions available - run testModal() or testRaycasting() in console');

     const gridConfig = {
        maxCols: 8, // Maximum columns per row
        rows: projectAssets.length,
        spacingX: 25, spacingY: 35,
        planeWidth: 20, planeHeight: 30
    };

    // Set initial camera Y position to show Bamai (first project) on load
    // Calculate Bamai's Y position (index 0)
    const totalHeight = (gridConfig.rows - 1) * gridConfig.spacingY;
    const bamaiY = totalHeight / 2 - (0 * gridConfig.spacingY); // Bamai is at index 0
    camera.position.y = bamaiY;

    const planes = [];

    const setupPlane = (texture, position, projectName, assetIndex) => {
        console.log('🛠️ DEBUG: Setting up plane:', {
            projectName: projectName,
            assetIndex: assetIndex,
            position: position,
            textureImage: texture.image
        });
        
        const media = texture.image;
        const mediaWidth = media.videoWidth || media.width;
        const mediaHeight = media.videoHeight || media.height;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_texture: { value: texture },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_intensity: { value: 0 },
                u_resolution: { value: new THREE.Vector2(gridConfig.planeWidth, gridConfig.planeHeight) },
                u_image_resolution: { value: new THREE.Vector2(mediaWidth, mediaHeight) },
                u_viewport_pos: { value: new THREE.Vector2(0, 0) },
                u_glitch_intensity: { value: 0 },
                u_hover_intensity: { value: 0 }
            },
            vertexShader: planeVertexShader,
            fragmentShader: planeFragmentShader,
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(gridConfig.planeWidth, gridConfig.planeHeight, 64, 64);
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(position);

        // Store original position for viewport calculations and project info
        plane.userData.originalPosition = position.clone();
        plane.userData.projectName = projectName;
        plane.userData.assetIndex = assetIndex;

        console.log('✅ DEBUG: Plane created with userData:', plane.userData);

        scene.add(plane);
        planes.push(plane);
        
        console.log('📊 DEBUG: Total planes now:', planes.length);
    };

    // Create planes organized by project rows
    projectAssets.forEach((project, rowIndex) => {
        const numAssets = project.assets.length;
        const actualCols = Math.min(numAssets, gridConfig.maxCols);
        
        // Calculate starting X position to center the row
        const rowWidth = (actualCols - 1) * gridConfig.spacingX;
        const startX = -rowWidth / 2;
        
        // Calculate Y position for this row (center vertically)
        const totalHeight = (gridConfig.rows - 1) * gridConfig.spacingY;
        const rowY = totalHeight / 2 - (rowIndex * gridConfig.spacingY);
        
        project.assets.forEach((asset, assetIndex) => {
            if (assetIndex < gridConfig.maxCols) { // Only show up to maxCols per row
                const position = new THREE.Vector3(
                    startX + (assetIndex * gridConfig.spacingX),
                    rowY,
                    0
                );

                if (asset.type === 'image') {
                    textureLoader.load(asset.src, (texture) => {
                        setupPlane(texture, position, project.name, assetIndex);
                    });
                } else if (asset.type === 'video') {
                    const video = document.createElement('video');
                    video.src = asset.src;
                    video.crossOrigin = 'anonymous';
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.autoplay = true; // Attempt to autoplay

                    const texture = new THREE.VideoTexture(video);
                    setupPlane(texture, position, project.name, assetIndex);

                    video.play().catch(e => {
                        console.log(`User interaction needed to play: ${asset.src}`);
                        // Video will start on first click/interaction if autoplay fails
                        const playHandler = () => {
                            video.play();
                            window.removeEventListener('click', playHandler);
                            window.removeEventListener('touchstart', playHandler);
                        }
                        window.addEventListener('click', playHandler);
                        window.addEventListener('touchstart', playHandler);
                    });
                }
            }
        });
    });

    // --- Interaction & Animation ---
    const cameraTarget = new THREE.Vector2();

    // Set initial camera target to show Bamai (first project) on load
    // Use the same Y position as the camera
    cameraTarget.y = camera.position.y;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHoveredPlane = null;
    const clock = new THREE.Clock();
    const clickedPlanes = new Map(); // Track clicked planes and their animation progress
    const hoveredPlanes = new Map(); // Track hovered planes for glitch effect

    // Scroll tracking for background animation
    let scrollVelocity = 0;
    let scrollIntensity = 0;
    let lastScrollTime = 0;
    let lastCameraPosition = { x: 0, y: 0 };

    // Drag interaction variables
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragCameraStart = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };
    let lastDragTime = 0;
    let dragMomentum = { x: 0, y: 0 };

    // Touch interaction variables
    let isTouching = false;
    let touchStart = { x: 0, y: 0 };
    let touchCameraStart = { x: 0, y: 0 };
    let touchVelocity = { x: 0, y: 0 };
    let lastTouchTime = 0;
    let touchMomentum = { x: 0, y: 0 };
    let lastTouchPosition = { x: 0, y: 0 };
    
    // Project title management
    let currentProjectIndex = -1;
    let isAnimating = false;
    const projectTitleElement = document.getElementById('project-title');
    
    // Note: Project detection now uses actual plane positions to handle infinite scrolling
    
    function updateProjectTitle(newProjectIndex, direction = 'up') {
        if (newProjectIndex === currentProjectIndex || isAnimating) return;
        
        console.log('Updating project title:', newProjectIndex, projectAssets[newProjectIndex]?.name, 'direction:', direction);
        
        isAnimating = true;
        const newTitle = newProjectIndex >= 0 ? projectAssets[newProjectIndex].name : '';
        
        if (currentProjectIndex >= 0) {
            // Exit animation for current title
            projectTitleElement.classList.add(`slide-${direction}-exit`);
            projectTitleElement.classList.add(`slide-${direction}-exit-active`);
            
            setTimeout(() => {
                projectTitleElement.textContent = newTitle;
                projectTitleElement.classList.remove(`slide-${direction}-exit`, `slide-${direction}-exit-active`);
                
                if (newTitle) {
                    // Enter animation for new title
                    projectTitleElement.classList.add(`slide-${direction}-enter`);
                    
                    requestAnimationFrame(() => {
                        projectTitleElement.classList.add(`slide-${direction}-enter-active`);
                        
                        setTimeout(() => {
                            projectTitleElement.classList.remove(`slide-${direction}-enter`, `slide-${direction}-enter-active`);
                            isAnimating = false;
                        }, 400);
                    });
                } else {
                    isAnimating = false;
                }
            }, 400);
        } else if (newTitle) {
            // First time showing a title
            projectTitleElement.textContent = newTitle;
            projectTitleElement.classList.add(`slide-${direction}-enter`);
            
            requestAnimationFrame(() => {
                projectTitleElement.classList.add(`slide-${direction}-enter-active`);
                
                setTimeout(() => {
                    projectTitleElement.classList.remove(`slide-${direction}-enter`, `slide-${direction}-enter-active`);
                    isAnimating = false;
                }, 400);
            });
        }
        
        currentProjectIndex = newProjectIndex;
    }
    
    function detectCurrentProject() {
        const cameraY = camera.position.y;
        let closestProjectIndex = -1;
        let minDistance = Infinity;
        
        // Group planes by project and find the closest row for each project
        const projectRows = new Map();
        
        planes.forEach(plane => {
            const projectName = plane.userData.projectName;
            const projectIndex = projectAssets.findIndex(p => p.name === projectName);
            
            if (projectIndex >= 0) {
                if (!projectRows.has(projectIndex)) {
                    projectRows.set(projectIndex, []);
                }
                projectRows.get(projectIndex).push(plane.position.y);
            }
        });
        
        // Find the average Y position for each project row (to handle multiple planes per row)
        projectRows.forEach((yPositions, projectIndex) => {
            const avgY = yPositions.reduce((sum, y) => sum + y, 0) / yPositions.length;
            const distance = Math.abs(cameraY - avgY);
            const threshold = gridConfig.spacingY / 2;
            
            if (distance < threshold && distance < minDistance) {
                minDistance = distance;
                closestProjectIndex = projectIndex;
            }
        });
        
        // If no project is close enough, find the closest one anyway
        if (closestProjectIndex === -1) {
            projectRows.forEach((yPositions, projectIndex) => {
                const avgY = yPositions.reduce((sum, y) => sum + y, 0) / yPositions.length;
                const distance = Math.abs(cameraY - avgY);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestProjectIndex = projectIndex;
                }
            });
        }
        
        console.log('Camera Y:', cameraY, 'Detected project index:', closestProjectIndex, 'min distance:', minDistance);
        return closestProjectIndex;
    }
    
    // Project title will be initialized after loading completes
    
    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        const oldCameraTargetY = cameraTarget.y;
        
        cameraTarget.x += event.deltaX * 0.03;
        cameraTarget.y -= event.deltaY * 0.03;
        
        // Calculate scroll velocity for background animation
        const currentTime = performance.now();
        const deltaTime = currentTime - lastScrollTime;
        const scrollDistance = Math.sqrt(event.deltaX * event.deltaX + event.deltaY * event.deltaY);
        
        if (deltaTime > 0) {
            scrollVelocity = scrollDistance / deltaTime;
            scrollIntensity = Math.min(scrollVelocity * 0.05, 1.0); // Reduced multiplier and cap
        }
        
        lastScrollTime = currentTime;
        
        // Detect scroll direction for title animation
        const scrollDirection = cameraTarget.y > oldCameraTargetY ? 'down' : 'up';
        
        // Detect current project after a small delay to allow smooth scrolling
        setTimeout(() => {
            const newProjectIndex = detectCurrentProject();
            if (newProjectIndex !== currentProjectIndex) {
                updateProjectTitle(newProjectIndex, scrollDirection);
            }
        }, 50);
    }, { passive: false });

    // --- Mouse Drag Interaction ---
    window.addEventListener('mousedown', (event) => {
        // Check if modal is active
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('active')) return;

        // Only handle left mouse button
        if (event.button !== 0) return;

        isDragging = true;
        dragStart.x = event.clientX;
        dragStart.y = event.clientY;
        dragCameraStart.x = cameraTarget.x;
        dragCameraStart.y = cameraTarget.y;
        lastDragTime = performance.now();

        // Prevent text selection during drag
        event.preventDefault();
    });

    window.addEventListener('mousemove', (event) => {
        // Update mouse position for raycasting
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (isDragging) {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastDragTime;

            // Calculate drag distance
            const deltaX = event.clientX - dragStart.x;
            const deltaY = event.clientY - dragStart.y;

            // Convert to camera movement (inverted for natural feel)
            const dragSensitivity = 0.03; // Much slower drag sensitivity
            cameraTarget.x = dragCameraStart.x - deltaX * dragSensitivity;
            cameraTarget.y = dragCameraStart.y + deltaY * dragSensitivity;

            // Calculate drag velocity for momentum (much reduced)
            if (deltaTime > 0) {
                dragVelocity.x = -deltaX * dragSensitivity / deltaTime * 200; // Reduced from 1000
                dragVelocity.y = deltaY * dragSensitivity / deltaTime * 200;
            }

            lastDragTime = currentTime;

            // Update scroll intensity for background animation
            const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            scrollIntensity = Math.min(dragDistance * 0.01, 1.0);

            // Update project title during drag
            setTimeout(() => {
                const newProjectIndex = detectCurrentProject();
                if (newProjectIndex !== currentProjectIndex) {
                    const direction = deltaY > 0 ? 'down' : 'up';
                    updateProjectTitle(newProjectIndex, direction);
                }
            }, 50);
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (isDragging) {
            isDragging = false;

            // Apply very minimal momentum for smooth deceleration
            dragMomentum.x = dragVelocity.x * 0.005; // Much smaller momentum
            dragMomentum.y = dragVelocity.y * 0.005;
        }
    });

    // Handle mouse leave to stop dragging
    window.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragMomentum.x = dragVelocity.x * 0.005; // Much smaller momentum
            dragMomentum.y = dragVelocity.y * 0.005;
        }
    });

    // --- Touch/Mobile Interaction ---
    window.addEventListener('touchstart', (event) => {
        // Check if modal is active
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('active')) return;

        // Only handle single touch
        if (event.touches.length !== 1) return;

        const touch = event.touches[0];
        isTouching = true;
        touchStart.x = touch.clientX;
        touchStart.y = touch.clientY;
        touchCameraStart.x = cameraTarget.x;
        touchCameraStart.y = cameraTarget.y;
        lastTouchTime = performance.now();
        lastTouchPosition.x = touch.clientX;
        lastTouchPosition.y = touch.clientY;

        // Prevent default to avoid scrolling
        event.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        if (!isTouching || event.touches.length !== 1) return;

        const touch = event.touches[0];
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTouchTime;

        // Calculate touch movement
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;

        // Convert to camera movement (inverted for natural feel)
        const touchSensitivity = 0.04; // Reduced touch sensitivity to match drag
        cameraTarget.x = touchCameraStart.x - deltaX * touchSensitivity;
        cameraTarget.y = touchCameraStart.y + deltaY * touchSensitivity;

        // Calculate touch velocity for momentum (reduced)
        if (deltaTime > 0) {
            const instantDeltaX = touch.clientX - lastTouchPosition.x;
            const instantDeltaY = touch.clientY - lastTouchPosition.y;
            touchVelocity.x = -instantDeltaX * touchSensitivity / deltaTime * 300; // Reduced from 1000
            touchVelocity.y = instantDeltaY * touchSensitivity / deltaTime * 300;
        }

        lastTouchTime = currentTime;
        lastTouchPosition.x = touch.clientX;
        lastTouchPosition.y = touch.clientY;

        // Update scroll intensity for background animation
        const touchDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        scrollIntensity = Math.min(touchDistance * 0.015, 1.0);

        // Update project title during touch
        setTimeout(() => {
            const newProjectIndex = detectCurrentProject();
            if (newProjectIndex !== currentProjectIndex) {
                const direction = deltaY > 0 ? 'down' : 'up';
                updateProjectTitle(newProjectIndex, direction);
            }
        }, 50);

        // Prevent default to avoid scrolling
        event.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', (event) => {
        if (isTouching) {
            isTouching = false;

            // Apply minimal momentum for smooth deceleration
            touchMomentum.x = touchVelocity.x * 0.008; // Much smaller momentum
            touchMomentum.y = touchVelocity.y * 0.008;
        }
    });

    // Handle touch cancel
    window.addEventListener('touchcancel', () => {
        if (isTouching) {
            isTouching = false;
            touchMomentum.x = touchVelocity.x * 0.008; // Much smaller momentum
            touchMomentum.y = touchVelocity.y * 0.008;
        }
    });

    // Touch tap handling for modal opening
    let touchStartPosition = { x: 0, y: 0 };
    let touchStartTime = 0;

    window.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            touchStartPosition.x = touch.clientX;
            touchStartPosition.y = touch.clientY;
            touchStartTime = performance.now();
        }
    });

    window.addEventListener('touchend', (event) => {
        // Check if modal is active
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('active')) return;

        // Only handle single touch tap
        if (event.changedTouches.length !== 1) return;

        const touch = event.changedTouches[0];
        const tapDistance = Math.sqrt(
            Math.pow(touch.clientX - touchStartPosition.x, 2) +
            Math.pow(touch.clientY - touchStartPosition.y, 2)
        );
        const tapDuration = performance.now() - touchStartTime;

        // Check if this was a tap (moved less than 10 pixels and took less than 300ms)
        if (tapDistance < 10 && tapDuration < 300) {
            console.log('📱 DEBUG: Touch tap detected');

            // Convert touch position to normalized coordinates
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

            // Perform raycasting to detect plane intersection
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planes);

            if (intersects.length > 0) {
                const clickedPlane = intersects[0].object;
                const projectName = clickedPlane.userData.projectName;

                console.log('📱 DEBUG: Touch tap on plane:', projectName);

                // Open project modal
                if (projectName && projectModalData[projectName]) {
                    openProjectModal(projectName);

                    // Add glitch effect for visual feedback
                    clickedPlanes.set(clickedPlane, {
                        startTime: clock.getElapsedTime(),
                        duration: 1.5,
                        intensity: 1.0
                    });
                }
            }
        }
    });

    // Click handling for modal opening - with comprehensive debugging
    let clickStartPosition = { x: 0, y: 0 };
    let clickStartTime = 0;

    // Track click start position to distinguish from drag
    window.addEventListener('mousedown', (event) => {
        clickStartPosition.x = event.clientX;
        clickStartPosition.y = event.clientY;
        clickStartTime = performance.now();
    });

    window.addEventListener('click', (event) => {
        // Check if modal is currently active - if so, don't process canvas clicks
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('active')) {
            console.log('🚫 DEBUG: Modal is active, ignoring canvas click');
            return;
        }

        // Check if this was a drag operation (moved more than 5 pixels or took longer than 300ms)
        const clickDistance = Math.sqrt(
            Math.pow(event.clientX - clickStartPosition.x, 2) +
            Math.pow(event.clientY - clickStartPosition.y, 2)
        );
        const clickDuration = performance.now() - clickStartTime;

        if (clickDistance > 5 || clickDuration > 300) {
            console.log('🚫 DEBUG: Ignoring click - was a drag operation');
            return;
        }

        console.log('🖱️ DEBUG: Click event triggered', {
            clientX: event.clientX,
            clientY: event.clientY,
            target: event.target.tagName
        });

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        console.log('🎯 DEBUG: Mouse coordinates:', { x: mouse.x, y: mouse.y });
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);
        
                 console.log('📐 DEBUG: Raycaster results:', {
             intersectsLength: intersects.length,
             planesLength: planes.length,
             cameraPosition: { x: camera.position.x, y: camera.position.y, z: camera.position.z }
         });
         
         // Debug: Log scale issues (only if raycasting fails)
         if (intersects.length === 0 && planes.length > 0) {
             const zeroScalePlanes = planes.filter(plane => 
                 plane.scale.x === 0 || plane.scale.y === 0 || plane.scale.z === 0
             );
             if (zeroScalePlanes.length > 0) {
                 console.log('⚠️ DEBUG: Found planes with zero scale:', zeroScalePlanes.length);
             }
             
             // Show first plane for debugging
             console.log('🔍 DEBUG: First plane:', {
                 position: { x: planes[0].position.x, y: planes[0].position.y, z: planes[0].position.z },
                 scale: { x: planes[0].scale.x, y: planes[0].scale.y, z: planes[0].scale.z },
                 projectName: planes[0].userData.projectName
             });
         }
        
        if (intersects.length > 0) {
            const clickedPlane = intersects[0].object;
            const projectName = clickedPlane.userData.projectName;
            
            console.log('🎯 DEBUG: Plane clicked!', {
                projectName: projectName,
                planePosition: clickedPlane.position,
                userData: clickedPlane.userData
            });
            
            // Test modal opening with simple alert first
            console.log('🚀 DEBUG: Attempting to open modal...');
            
            // Open project modal
            if (projectName && projectModalData[projectName]) {
                console.log('✅ DEBUG: Project data found, opening modal...');
                openProjectModal(projectName);
            } else {
                console.error('❌ DEBUG: No project data found for:', projectName);
                console.log('🔍 DEBUG: Available projects:', Object.keys(projectModalData));
            }
            
            // Also apply glitch effect for visual feedback
            clickedPlanes.set(clickedPlane, {
                startTime: clock.getElapsedTime(),
                duration: 1.5, // 1.5 seconds of glitch effect
                intensity: 1.0
            });
        } else {
            console.log('❌ DEBUG: No planes intersected');
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Apply drag momentum (very minimal)
        if (!isDragging && (Math.abs(dragMomentum.x) > 0.001 || Math.abs(dragMomentum.y) > 0.001)) {
            cameraTarget.x += dragMomentum.x;
            cameraTarget.y += dragMomentum.y;
            dragMomentum.x *= 0.85; // Faster decay for quicker stop
            dragMomentum.y *= 0.85;
        }

        // Apply touch momentum (very minimal)
        if (!isTouching && (Math.abs(touchMomentum.x) > 0.001 || Math.abs(touchMomentum.y) > 0.001)) {
            cameraTarget.x += touchMomentum.x;
            cameraTarget.y += touchMomentum.y;
            touchMomentum.x *= 0.80; // Faster decay for quicker stop
            touchMomentum.y *= 0.80;
        }

        // Update camera position and track movement for scroll intensity
        const oldCameraX = camera.position.x;
        const oldCameraY = camera.position.y;

        camera.position.x += (cameraTarget.x - camera.position.x) * 0.06;
        camera.position.y += (cameraTarget.y - camera.position.y) * 0.06;
        
        // Calculate additional scroll intensity from camera movement
        const cameraMovement = Math.sqrt(
            Math.pow(camera.position.x - oldCameraX, 2) + 
            Math.pow(camera.position.y - oldCameraY, 2)
        );
        
        // Add camera movement to scroll intensity - more subtle
        scrollIntensity += cameraMovement * 1.0; // Reduced from 2.0
        scrollIntensity = Math.min(scrollIntensity, 1.0); // Cap at 1.0
        
        // Apply smoother decay to scroll intensity over time
        scrollIntensity *= 0.95; // Smoother decay (was 0.92)
        scrollVelocity *= 0.96;
        
        // Update project title based on camera position
        if (Math.abs(camera.position.y - oldCameraY) > 0.1) {
            const newProjectIndex = detectCurrentProject();
            if (newProjectIndex !== currentProjectIndex) {
                const direction = camera.position.y > oldCameraY ? 'down' : 'up';
                updateProjectTitle(newProjectIndex, direction);
            }
        }

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planes);
        
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const object = intersection.object;
            if (object.material.uniforms) {
                object.material.uniforms.u_mouse.value = intersection.uv;
                object.material.uniforms.u_intensity.value = 1.0;
                if (currentHoveredPlane !== object) {
                    if (currentHoveredPlane) {
                        currentHoveredPlane.material.uniforms.u_intensity.value = 0;
                        // Remove previous plane from hover glitch effect
                        hoveredPlanes.delete(currentHoveredPlane);
                    }
                    currentHoveredPlane = object;
                    
                    // Add new plane to hover glitch effect with subtle intensity
                    hoveredPlanes.set(object, {
                        startTime: elapsedTime,
                        intensity: 0.8 // More visible than before, but still subtle compared to click (1.0)
                    });
                }
            }
            // Change cursor to pointer when hovering over an image
            canvas.style.cursor = 'pointer';
        } else if (currentHoveredPlane) {
            currentHoveredPlane.material.uniforms.u_intensity.value = 0;
            // Remove from hover glitch effect
            hoveredPlanes.delete(currentHoveredPlane);
            currentHoveredPlane = null;
            // Reset cursor to default when not hovering over an image
            canvas.style.cursor = 'default';
        }

        // Update time uniforms for all materials
        bgMaterial.uniforms.u_time.value = elapsedTime;
        bgMaterial.uniforms.u_scroll_velocity.value = scrollVelocity;
        bgMaterial.uniforms.u_scroll_intensity.value = scrollIntensity;
        
        planes.forEach(plane => {
            if (plane.material.uniforms) {
                plane.material.uniforms.u_time.value = elapsedTime;
                
                // Calculate viewport position for periphery skew effect
                const screenPos = plane.position.clone();
                screenPos.project(camera);
                
                // Normalize to [-1, 1] range
                const viewportPos = new THREE.Vector2(screenPos.x, screenPos.y);
                plane.material.uniforms.u_viewport_pos.value = viewportPos;
                
                // Handle glitch effect for clicked and hovered planes
                let totalGlitchIntensity = 0;
                let totalHoverIntensity = 0;
                
                // Handle click glitch effect
                if (clickedPlanes.has(plane)) {
                    const glitchData = clickedPlanes.get(plane);
                    const elapsed = elapsedTime - glitchData.startTime;
                    const progress = elapsed / glitchData.duration;
                    
                    if (progress >= 1.0) {
                        // Animation finished
                        clickedPlanes.delete(plane);
                    } else {
                        // Animate glitch intensity with multiple peaks for dramatic effect
                        const intensity = Math.sin(progress * Math.PI * 3) * 
                                        Math.exp(-progress * 2) * 
                                        glitchData.intensity;
                        totalGlitchIntensity += Math.max(0, intensity);
                    }
                }
                
                // Handle hover color effect (separate from glitch effect)
                if (hoveredPlanes.has(plane)) {
                    const hoverData = hoveredPlanes.get(plane);
                    const elapsed = elapsedTime - hoverData.startTime;
                    
                    // Subtle pulsing effect for hover
                    const hoverIntensity = Math.sin(elapsed * 4) * 0.5 + 0.5; // Oscillate between 0 and 1
                    totalHoverIntensity = hoverIntensity * hoverData.intensity;
                }
                
                // Set final intensities
                plane.material.uniforms.u_glitch_intensity.value = Math.min(totalGlitchIntensity, 1.0);
                plane.material.uniforms.u_hover_intensity.value = Math.min(totalHoverIntensity, 1.0);
            }
        });

        // --- Infinite Scroll (simplified) ---
        const worldWidth = gridConfig.maxCols * gridConfig.spacingX;
        const worldHeight = gridConfig.rows * gridConfig.spacingY;

        planes.forEach(plane => {
            if (plane.position.x - camera.position.x < -worldWidth / 2) plane.position.x += worldWidth;
            if (plane.position.x - camera.position.x > worldWidth / 2) plane.position.x -= worldWidth;
            if (plane.position.y - camera.position.y < -worldHeight / 2) plane.position.y += worldHeight;
            if (plane.position.y - camera.position.y > worldHeight / 2) plane.position.y -= worldHeight;
        });

        // Make background follow camera to prevent seeing edges when scrolling
        if (bgMesh) {
            bgMesh.position.x = camera.position.x;
            bgMesh.position.y = camera.position.y;
        }

        renderer.render(scene, camera);
    }
    animate();

    // --- Resize Handling ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        bgMaterial.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        resizeBackground(); // Resize background on window resize
    });
});

// --- Company Scrolling Bar Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const companyScrollTrack = document.getElementById('company-scroll-track');

    if (companyScrollTrack) {
        // Clone the company items to create seamless infinite scroll
        const originalItems = companyScrollTrack.innerHTML;

        // Duplicate the items enough times to ensure the bar is always full
        // We need at least 2 full sets for seamless looping, but 4 sets ensures coverage for all screen sizes
        companyScrollTrack.innerHTML = originalItems + originalItems + originalItems + originalItems;

        // Pause animation on hover
        companyScrollTrack.addEventListener('mouseenter', () => {
            companyScrollTrack.style.animationPlayState = 'paused';
        });

        companyScrollTrack.addEventListener('mouseleave', () => {
            companyScrollTrack.style.animationPlayState = 'running';
        });
    }
});