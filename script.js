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
    // Check if this is the about page - if so, only run basic scripts
    if (document.body.classList.contains('about-page')) {
        console.log('About page detected - running basic scripts only');

        // Initialize time display for about page
        const timeElement = document.getElementById('current-time');
        const statusLight = document.getElementById('status-light');

        if (timeElement && statusLight) {
            function updateTime() {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-AU', {
                    timeZone: 'Australia/Sydney',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                });
                timeElement.textContent = timeString;

                // Update status light (green during business hours)
                const hour = now.getHours();
                const isBusinessHours = hour >= 9 && hour < 17;
                statusLight.className = isBusinessHours ? 'status-light online' : 'status-light offline';
            }

            updateTime();
            setInterval(updateTime, 1000);
        }

        return;
    }

    if (typeof THREE === 'undefined') {
        console.error('Three.js has not been loaded. See https://threejs.org');
        return;
    }

    const topNav = document.getElementById('top-nav');
    const macosDock = document.getElementById('macos-dock');
    const canvas = document.getElementById('bg');

    // --- Page Load Animation Sequence (SIMPLIFIED - NO LOADING SCREEN) ---
    const initializePageAnimations = () => {
        // Immediately show navigation and dock without loading screen

        // First: Top navigation slides down
        setTimeout(() => {
            topNav.classList.add('animate-in');
        }, 150);

        // Second: macOS Dock slides up (slightly delayed)
        setTimeout(() => {
            if (macosDock) {
                macosDock.classList.add('animate-in');
            }
        }, 300);

        // Third: Initialize the scene immediately (no loading overlay)
        setTimeout(() => {
            initializeSceneWithoutLoading();
        }, 500);
    };

    // Call the animation sequence immediately
    initializePageAnimations();

    // --- Navigation Bar Event Handling ---
    const topNavigation = document.getElementById('top-nav');
    if (topNavigation) {
        // Prevent navigation bar events from propagating to canvas
        topNavigation.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });

        topNavigation.addEventListener('mousemove', (event) => {
            event.stopPropagation();
        });

        topNavigation.addEventListener('mouseup', (event) => {
            event.stopPropagation();
        });

        topNavigation.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        // Touch events for mobile
        topNavigation.addEventListener('touchstart', (event) => {
            event.stopPropagation();
        });

        topNavigation.addEventListener('touchmove', (event) => {
            event.stopPropagation();
        });

        topNavigation.addEventListener('touchend', (event) => {
            event.stopPropagation();
        });
    }

    // --- macOS Dock Event Handling ---
    const dockIcons = document.querySelectorAll('.dock-icon');

    if (macosDock) {
        // Prevent dock events from propagating to canvas
        macosDock.addEventListener('mousedown', (event) => {
            event.stopPropagation();
        });

        macosDock.addEventListener('mousemove', (event) => {
            event.stopPropagation();
        });

        macosDock.addEventListener('mouseup', (event) => {
            event.stopPropagation();
        });

        macosDock.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        // Touch events for mobile
        macosDock.addEventListener('touchstart', (event) => {
            event.stopPropagation();
        });

        macosDock.addEventListener('touchmove', (event) => {
            event.stopPropagation();
        });

        macosDock.addEventListener('touchend', (event) => {
            event.stopPropagation();
        });

        // Dock hover magnification effect
        const dockIconsArray = Array.from(dockIcons);

        dockIconsArray.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                // Scale adjacent icons
                dockIconsArray.forEach((otherIcon, otherIndex) => {
                    const distance = Math.abs(index - otherIndex);
                    otherIcon.classList.remove('adjacent-1', 'adjacent-2');

                    if (distance === 1) {
                        otherIcon.classList.add('adjacent-1');
                    } else if (distance === 2) {
                        otherIcon.classList.add('adjacent-2');
                    }
                });
            });

            icon.addEventListener('mouseleave', () => {
                // Remove adjacent scaling after a delay
                setTimeout(() => {
                    if (!icon.matches(':hover')) {
                        dockIconsArray.forEach(otherIcon => {
                            otherIcon.classList.remove('adjacent-1', 'adjacent-2');
                        });
                    }
                }, 100);
            });

            // Click handlers for dock icons
            icon.addEventListener('click', () => {
                const app = icon.getAttribute('data-app');
                handleDockIconClick(app);
            });
        });
    }

    // Handle dock icon clicks
    function handleDockIconClick(app) {
        console.log('Dock icon clicked:', app);

        switch(app) {
            case 'xcode':
                openProjectModal('Xcode');
                break;
            case 'figma':
                openProjectModal('Figma');
                break;
            case 'spline':
                // Placeholder - could link to Spline projects
                console.log('Spline clicked - no action defined');
                break;
            case 'bamai':
                openProjectModal('Bamai');
                break;
            case 'qi':
                openProjectModal('Qi');
                break;
            case 'x6ren':
                openProjectModal('X6ren');
                break;
            case 'ruce':
                openProjectModal('Ruce');
                break;
            case 'mail':
                window.location.href = 'mailto:inthepond.etangs@outlook.com?subject=Work%20with%20me';
                break;
            case 'docker':
                // Placeholder - could link to Docker Hub
                console.log('Docker clicked - no action defined');
                break;
            case 'ollama':
                // Placeholder - could link to AI projects
                console.log('Ollama clicked - no action defined');
                break;
            case 'userbilitylab':
                // Placeholder - could link to UX research projects
                console.log('Userbility Lab clicked - no action defined');
                break;
        }
    }

    // Function to open project modal (will be connected to existing modal system)
    function openProjectModal(projectName) {
        // This will be connected to the existing modal system
        console.log('Opening project:', projectName);

        // Find the project in projectModalData
        if (typeof projectModalData !== 'undefined' && projectModalData[projectName]) {
            const modal = document.getElementById('project-modal');
            if (modal) {
                // Populate modal with project data
                document.getElementById('modal-project-title').textContent = projectName;
                document.getElementById('modal-project-logo').src = projectModalData[projectName].logo;

                // Set content based on type
                if (projectModalData[projectName].contentType === 'pdf') {
                    document.getElementById('modal-project-brief').innerHTML = `
                        <div class="pdf-viewer-container">
                            <iframe src="${projectModalData[projectName].pdfPath}"
                                    width="100%"
                                    height="800px"
                                    style="border: none; border-radius: 8px;">
                            </iframe>
                        </div>
                        ${projectModalData[projectName].brief || ''}
                    `;
                } else {
                    document.getElementById('modal-project-brief').innerHTML = projectModalData[projectName].brief || '';
                }

                document.getElementById('modal-design-philosophy').innerHTML = projectModalData[projectName].designPhilosophy || '';
                document.getElementById('modal-ux-strategy').innerHTML = projectModalData[projectName].uxStrategy || '';

                // Show modal
                modal.classList.add('active');
            }
        }
    }



    // New function to initialize scene without loading screen
    const initializeSceneWithoutLoading = () => {
        console.log('Initializing scene without loading screen...');

        // Make canvas visible immediately
        canvas.style.opacity = '1';

        // Project title initialization removed (canvas interaction removed)

        // Planes are already visible, no need for intro animation
        planes.forEach((plane) => {
            plane.material.uniforms.u_intensity.value = 1;
        });
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

            // Removed scroll flicker effect to prevent background flickering during transitions
            // The background now remains stable during scrolling and sliding animations

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

    // --- Texture Loader ---
    const textureLoader = new THREE.TextureLoader();

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
            contentType: "pdf", // Indicates this project should display a PDF
            pdfPath: "BamaiCaseStudy.pdf#toolbar=0&navpanes=0",
            // Fallback content in case PDF cannot be displayed
            brief: `
                <p><strong>Bamai</strong> is a revolutionary fitness ecosystem that transforms how people approach health and wellness through intelligent wearable technology and personalized coaching.</p>
                <p>View the complete case study in the PDF viewer above, or <a href="BamaiCaseStudy.pdf" download style="color: #00fff9; text-decoration: underline;">download the PDF</a>.</p>
            `,
            designPhilosophy: ``,
            uxStrategy: ``
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
         },
         "Portfolio": {
             logo: "img/bamai_logo.png", // Placeholder logo
             contentType: "pdf",
             pdfPath: "Portfolio-dekkoshi.pdf#toolbar=0&navpanes=0",
             brief: `
                 <p><strong>Portfolio</strong> - Dekko Shi's Design Portfolio</p>
                 <p>View the complete portfolio in the PDF viewer below, or <a href="Portfolio-dekkoshi.pdf" download style="color: #00fff9; text-decoration: underline;">download the PDF</a>.</p>
             `,
             designPhilosophy: ``,
             uxStrategy: ``
         },
         "Xcode": {
             logo: "macos_icons/xcode.png",
             contentType: "video-prototype",
             videoPath: "xcode.mp4",
             mockupPath: "iPhone-15-Pro.png",
             brief: `
                 <p><strong>Xcode Prototype</strong> - Interactive iOS App Demo</p>
                 <p>This is an interactive prototype demonstrating an iOS application running on iPhone 15 Pro.</p>
                 <p>Click the play button to start the demo. The app will request audio permissions before playing.</p>
             `,
             designPhilosophy: ``,
             uxStrategy: ``
         },
         "Figma": {
             logo: "macos_icons/figma.png",
             contentType: "static-image",
             imagePath: "figma.png",
             brief: `
                 <p><strong>Figma Design</strong> - Design System & Prototypes</p>
                 <p>View the complete design work below.</p>
             `,
             designPhilosophy: ``,
             uxStrategy: ``
         }
     };

     // ===== macOS WINDOW MANAGEMENT SYSTEM =====
     const DEBUG = false; // Set to true to enable debug logging
     if (DEBUG) console.log('🪟 DEBUG: Initializing macOS window management system...');

     const desktopArea = document.getElementById('desktop-area');
     const openWindows = new Map(); // Track open windows by project name
     let highestZIndex = 2000;
     let focusedWindow = null;

     // Window dragging state
     let isDraggingWindow = false;
     let draggedWindow = null;
     let dragOffset = { x: 0, y: 0 };

     // Create a new project window
     function createProjectWindow(projectName) {
         const projectData = projectModalData[projectName];
         if (!projectData) {
             console.error(`❌ No data found for project: ${projectName}`);
             return null;
         }

         // Get project images from projectAssets (skip for Portfolio PDF)
         const project = projectAssets.find(p => p.name === projectName);
         const projectImages = project ? project.assets.filter(asset => asset.type === 'image').map(asset => asset.src) : [];

         // Generate waterfall/masonry image gallery HTML
         const imageGalleryHTML = projectImages.length > 0 ? `
             <div class="project-image-masonry">
                 ${projectImages.map(imgSrc => `
                     <div class="masonry-item">
                         <img src="${imgSrc}" alt="${projectName} preview" loading="lazy">
                     </div>
                 `).join('')}
             </div>
         ` : '';

         // Generate PDF viewer HTML if contentType is pdf
         const pdfViewerHTML = projectData.contentType === 'pdf' ? `
             <div class="pdf-viewer-container">
                 <iframe src="${projectData.pdfPath}"
                         width="100%"
                         height="100%"
                         style="border: none; border-radius: 8px;">
                 </iframe>
             </div>
         ` : '';

        // Generate video prototype HTML if contentType is video-prototype
        const videoProtoHTML = projectData.contentType === 'video-prototype' ? `
            <div class="video-prototype-container">
                <img src="${projectData.mockupPath}" alt="iPhone Mockup" class="iphone-mockup">
                <div class="video-overlay-container">
                    <video id="prototype-video" class="prototype-video" preload="auto">
                        <source src="${projectData.videoPath}" type="video/mp4">
                    </video>
                    <div class="video-controls">
                        <button class="play-button" id="play-button">
                            <svg viewBox="0 0 24 24" fill="white" width="48" height="48">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ios-alert" id="ios-alert" style="display: none;">
                    <div class="ios-alert-content">
                        <div class="ios-alert-title">Allow this app to play audio?</div>
                        <div class="ios-alert-buttons">
                            <button class="ios-alert-button" id="dont-allow-btn">Don't Allow</button>
                            <button class="ios-alert-button primary" id="allow-btn">Allow</button>
                        </div>
                    </div>
                </div>
            </div>
        ` : '';

        // Generate static image HTML if contentType is static-image
        const staticImageHTML = projectData.contentType === 'static-image' ? `
            <div class="static-image-container">
                <img src="${projectData.imagePath}" alt="${projectName}" class="static-image" id="static-image">
                <div class="permission-warning" id="permission-warning" style="display: none;">
                    <div class="warning-content">
                        <div class="warning-icon">⚠️</div>
                        <div class="warning-text">Warning: Permission denied, please invite for an interview.</div>
                        <button class="warning-close" id="warning-close">OK</button>
                    </div>
                </div>
            </div>
        ` : '';

         // Create window container
         const windowEl = document.createElement('div');
         windowEl.className = 'project-window';
         windowEl.dataset.project = projectName;

         // Create window content with macOS native layout
         windowEl.innerHTML = `
             <div class="modal-content">
                 <!-- Resize Handles -->
                 <div class="resize-handle corner nw"></div>
                 <div class="resize-handle corner ne"></div>
                 <div class="resize-handle corner sw"></div>
                 <div class="resize-handle corner se"></div>
                 <div class="resize-handle edge n"></div>
                 <div class="resize-handle edge s"></div>
                 <div class="resize-handle edge e"></div>
                 <div class="resize-handle edge w"></div>

                 <!-- macOS Native Title Bar -->
                 <div class="macos-title-bar">
                     <div class="macos-window-controls">
                         <button class="window-control close" aria-label="Close window"></button>
                         <button class="window-control minimize" aria-label="Minimize window"></button>
                         <button class="window-control maximize" aria-label="Maximize window"></button>
                     </div>
                     <div class="window-title">${projectName}</div>
                 </div>

                 <!-- Content Area -->
                 <div class="modal-body">
                     <!-- Section 1: Image Gallery FIRST (for Qi, X6ren, Ruce) or Special Content (PDF, Video, Static Image) -->
                     ${projectData.contentType === 'pdf' ? `
                         <section class="modal-section project-pdf-section">
                             ${pdfViewerHTML}
                         </section>
                     ` : projectData.contentType === 'video-prototype' ? `
                         <section class="modal-section project-video-section">
                             ${videoProtoHTML}
                         </section>
                     ` : projectData.contentType === 'static-image' ? `
                         <section class="modal-section project-static-image-section">
                             ${staticImageHTML}
                         </section>
                     ` : imageGalleryHTML ? `
                         <section class="modal-section project-gallery-section">
                             ${imageGalleryHTML}
                         </section>
                     ` : ''}

                     <!-- Section 2: Project Introduction (shown AFTER images for Qi, X6ren, Ruce) -->
                     ${(projectData.contentType !== 'video-prototype' && projectData.contentType !== 'static-image' && projectData.brief) ? `
                         <section class="modal-section project-intro-section">
                             <div class="project-brief-content">
                                 ${projectData.brief || ''}
                             </div>
                         </section>
                     ` : ''}

                     <!-- Section 3: Detailed Text Content -->
                     ${(projectData.designPhilosophy || projectData.uxStrategy) ? `
                         <section class="modal-section project-details-section">
                             ${projectData.designPhilosophy ? `
                                 <div class="detail-content">
                                     ${projectData.designPhilosophy}
                                 </div>
                             ` : ''}
                             ${projectData.uxStrategy ? `
                                 <div class="detail-content">
                                     ${projectData.uxStrategy}
                                 </div>
                             ` : ''}
                         </section>
                     ` : ''}
                 </div>
             </div>
         `;

         return windowEl;
     }

     // Function to open/focus project window
     function openProjectModal(projectName) {
         if (DEBUG) console.log('🪟 DEBUG: Opening window for project:', projectName);

         // If window already exists, bring it to front
         if (openWindows.has(projectName)) {
             const existingWindow = openWindows.get(projectName);
             bringWindowToFront(existingWindow);
             return;
         }

         // Create new window
         const windowEl = createProjectWindow(projectName);
         if (!windowEl) return;

         // Calculate initial position (cascade from center)
         const windowCount = openWindows.size;
         const offsetX = windowCount * 30;
         const offsetY = windowCount * 30;

         // Center window in desktop area
         const desktopRect = desktopArea.getBoundingClientRect();
         const windowWidth = 800;
         const windowHeight = 600;
         const initialX = (desktopRect.width - windowWidth) / 2 + offsetX;
         const initialY = (desktopRect.height - windowHeight) / 2 + offsetY;

         windowEl.style.left = `${initialX}px`;
         windowEl.style.top = `${initialY}px`;
         windowEl.style.zIndex = ++highestZIndex;

         // Add to desktop
         desktopArea.appendChild(windowEl);
         openWindows.set(projectName, windowEl);

         // Show window with animation
         setTimeout(() => {
             windowEl.classList.add('active');
             bringWindowToFront(windowEl);
         }, 10);

         // Setup window controls
         setupWindowControls(windowEl, projectName);

         // Setup window dragging
         setupWindowDragging(windowEl);

         // Setup window resizing (only for non-video-prototype windows)
         const projectData = projectModalData[projectName];
         if (projectData && projectData.contentType !== 'video-prototype') {
             setupWindowResizing(windowEl);
         } else if (projectData && projectData.contentType === 'video-prototype') {
             // Make window non-resizable by removing resize handles
             windowEl.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
             // Set fixed size for video prototype window
             // Sized to show scaled-down iPhone mockup with proper aspect ratio
             windowEl.style.width = '450px';  // Narrower to match scaled mockup
             windowEl.style.height = '850px'; // Tall enough for iPhone aspect ratio (2:1 roughly)
         }

         // Setup video prototype controls if applicable
         if (projectData && projectData.contentType === 'video-prototype') {
             setupVideoPrototypeControls(windowEl);
         }

         // Setup static image controls if applicable
         if (projectData && projectData.contentType === 'static-image') {
             setupStaticImageControls(windowEl);
         }

         // Update dock icon active state
         updateDockIconState(projectName, true);

         if (DEBUG) console.log('✅ DEBUG: Window opened for:', projectName);
     }

     // Bring window to front
     function bringWindowToFront(windowEl) {
         // Remove focused class from all windows
         document.querySelectorAll('.project-window').forEach(w => {
             w.classList.remove('focused');
         });

         // Add focused class and update z-index
         windowEl.classList.add('focused');
         windowEl.style.zIndex = ++highestZIndex;
         focusedWindow = windowEl;
     }

     // Close project window
     function closeProjectWindow(windowEl, projectName) {
         if (DEBUG) console.log('🔒 DEBUG: Closing window for:', projectName);

         windowEl.classList.remove('active');

         setTimeout(() => {
             windowEl.remove();
             openWindows.delete(projectName);

             // Update dock icon state
             updateDockIconState(projectName, false);

             // Focus another window if available
             if (openWindows.size > 0) {
                 const lastWindow = Array.from(openWindows.values()).pop();
                 bringWindowToFront(lastWindow);
             } else {
                 focusedWindow = null;
             }
         }, 300);
     }

     // Setup window controls (traffic lights)
     function setupWindowControls(windowEl, projectName) {
         const closeBtn = windowEl.querySelector('.window-control.close');
         const minimizeBtn = windowEl.querySelector('.window-control.minimize');
         const maximizeBtn = windowEl.querySelector('.window-control.maximize');

         if (closeBtn) {
             closeBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 closeProjectWindow(windowEl, projectName);
             });
         }

         if (minimizeBtn) {
             minimizeBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 // Minimize = close for now
                 closeProjectWindow(windowEl, projectName);
             });
         }

         if (maximizeBtn) {
             maximizeBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 windowEl.classList.toggle('maximized');
             });
         }

         // Click anywhere on window to bring to front
         windowEl.addEventListener('mousedown', () => {
             if (!isDraggingWindow) {
                 bringWindowToFront(windowEl);
             }
         });
     }

     // Setup window dragging - use macOS native title bar
     function setupWindowDragging(windowEl) {
         const titleBar = windowEl.querySelector('.macos-title-bar');

         if (!titleBar) return;

         titleBar.addEventListener('mousedown', (e) => {
             // Don't drag if clicking on window controls
             if (e.target.closest('.macos-window-controls')) return;
             if (e.target.closest('.window-control')) return;

             isDraggingWindow = true;
             draggedWindow = windowEl;

             const rect = windowEl.getBoundingClientRect();

             dragOffset.x = e.clientX - rect.left;
             dragOffset.y = e.clientY - rect.top;

             windowEl.classList.add('dragging');
             bringWindowToFront(windowEl);

             e.preventDefault();
         });
     }

     // Global mouse move for window dragging
     document.addEventListener('mousemove', (e) => {
         if (!isDraggingWindow || !draggedWindow) return;

         const desktopRect = desktopArea.getBoundingClientRect();
         const windowRect = draggedWindow.getBoundingClientRect();

         let newX = e.clientX - desktopRect.left - dragOffset.x;
         let newY = e.clientY - desktopRect.top - dragOffset.y;

         // Keep window within desktop boundaries
         newX = Math.max(0, Math.min(newX, desktopRect.width - windowRect.width));
         newY = Math.max(0, Math.min(newY, desktopRect.height - windowRect.height));

         draggedWindow.style.left = `${newX}px`;
         draggedWindow.style.top = `${newY}px`;
     });

     // Global mouse up for window dragging
     document.addEventListener('mouseup', () => {
         if (isDraggingWindow && draggedWindow) {
             draggedWindow.classList.remove('dragging');
             isDraggingWindow = false;
             draggedWindow = null;
         }
         if (isResizingWindow && resizedWindow) {
             resizedWindow.classList.remove('resizing');
             isResizingWindow = false;
             resizedWindow = null;
             resizeDirection = null;
         }
     });

     // Setup window resizing
     let isResizingWindow = false;
     let resizedWindow = null;
     let resizeDirection = null;
     let resizeStartPos = { x: 0, y: 0 };
     let resizeStartSize = { width: 0, height: 0 };
     let resizeStartWindowPos = { x: 0, y: 0 };

     function setupWindowResizing(windowEl) {
         const resizeHandles = windowEl.querySelectorAll('.resize-handle');
         const modalContent = windowEl.querySelector('.modal-content');

         if (!modalContent) return;

         resizeHandles.forEach(handle => {
             handle.addEventListener('mousedown', (e) => {
                 e.stopPropagation();
                 e.preventDefault();

                 isResizingWindow = true;
                 resizedWindow = windowEl;

                 // Determine resize direction from handle classes
                 if (handle.classList.contains('nw')) resizeDirection = 'nw';
                 else if (handle.classList.contains('ne')) resizeDirection = 'ne';
                 else if (handle.classList.contains('sw')) resizeDirection = 'sw';
                 else if (handle.classList.contains('se')) resizeDirection = 'se';
                 else if (handle.classList.contains('n')) resizeDirection = 'n';
                 else if (handle.classList.contains('s')) resizeDirection = 's';
                 else if (handle.classList.contains('e')) resizeDirection = 'e';
                 else if (handle.classList.contains('w')) resizeDirection = 'w';

                 const windowRect = windowEl.getBoundingClientRect();
                 const contentRect = modalContent.getBoundingClientRect();

                 resizeStartPos.x = e.clientX;
                 resizeStartPos.y = e.clientY;
                 resizeStartSize.width = contentRect.width;
                 resizeStartSize.height = contentRect.height;
                 resizeStartWindowPos.x = windowRect.left - desktopArea.getBoundingClientRect().left;
                 resizeStartWindowPos.y = windowRect.top - desktopArea.getBoundingClientRect().top;

                 windowEl.classList.add('resizing');
                 bringWindowToFront(windowEl);
             });
         });
     }

     // Global mouse move for window resizing
     document.addEventListener('mousemove', (e) => {
         if (!isResizingWindow || !resizedWindow || !resizeDirection) return;

         const modalContent = resizedWindow.querySelector('.modal-content');
         if (!modalContent) return;

         const deltaX = e.clientX - resizeStartPos.x;
         const deltaY = e.clientY - resizeStartPos.y;

         const minWidth = 400;
         const minHeight = 300;
         const desktopRect = desktopArea.getBoundingClientRect();
         const maxWidth = desktopRect.width - 40;
         const maxHeight = desktopRect.height - 40;

         let newWidth = resizeStartSize.width;
         let newHeight = resizeStartSize.height;
         let newX = resizeStartWindowPos.x;
         let newY = resizeStartWindowPos.y;

         // Handle different resize directions
         switch(resizeDirection) {
             case 'se': // Southeast (bottom-right)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX));
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY));
                 break;
             case 'sw': // Southwest (bottom-left)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX));
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY));
                 newX = resizeStartWindowPos.x + (resizeStartSize.width - newWidth);
                 break;
             case 'ne': // Northeast (top-right)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX));
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY));
                 newY = resizeStartWindowPos.y + (resizeStartSize.height - newHeight);
                 break;
             case 'nw': // Northwest (top-left)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX));
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY));
                 newX = resizeStartWindowPos.x + (resizeStartSize.width - newWidth);
                 newY = resizeStartWindowPos.y + (resizeStartSize.height - newHeight);
                 break;
             case 'e': // East (right)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + deltaX));
                 break;
             case 'w': // West (left)
                 newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width - deltaX));
                 newX = resizeStartWindowPos.x + (resizeStartSize.width - newWidth);
                 break;
             case 's': // South (bottom)
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + deltaY));
                 break;
             case 'n': // North (top)
                 newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height - deltaY));
                 newY = resizeStartWindowPos.y + (resizeStartSize.height - newHeight);
                 break;
         }

         // Apply new dimensions and position
         modalContent.style.width = `${newWidth}px`;
         modalContent.style.height = `${newHeight}px`;
         resizedWindow.style.left = `${newX}px`;
         resizedWindow.style.top = `${newY}px`;
     });

     // Setup video prototype controls
     function setupVideoPrototypeControls(windowEl) {
         const video = windowEl.querySelector('#prototype-video');
         const playButton = windowEl.querySelector('#play-button');
         const iosAlert = windowEl.querySelector('#ios-alert');
         const allowBtn = windowEl.querySelector('#allow-btn');
         const dontAllowBtn = windowEl.querySelector('#dont-allow-btn');

         if (!video || !playButton || !iosAlert) return;

         let hasShownAlert = false;

         // Play button click handler
         playButton.addEventListener('click', () => {
             if (!hasShownAlert) {
                 // First time: Show iOS alert
                 iosAlert.style.display = 'flex';
             } else {
                 // After permission granted: Toggle play/pause
                 if (video.paused) {
                     video.play();
                 } else {
                     video.pause();
                 }
             }
         });

         // Video click handler - toggle play/pause
         video.addEventListener('click', () => {
             if (hasShownAlert) {
                 if (video.paused) {
                     video.play();
                 } else {
                     video.pause();
                 }
             }
         });

         // Allow button handler
         allowBtn.addEventListener('click', () => {
             iosAlert.style.display = 'none';
             hasShownAlert = true;
             playButton.style.display = 'none';
             video.play();
         });

         // Don't Allow button handler
         dontAllowBtn.addEventListener('click', () => {
             iosAlert.style.display = 'none';
             hasShownAlert = true;
             // Keep video paused
         });

         // Hide play button when video is playing
         video.addEventListener('play', () => {
             playButton.style.display = 'none';
         });

         // Show play button when video is paused
         video.addEventListener('pause', () => {
             playButton.style.display = 'flex';
         });

         // Show play button when video ends
         video.addEventListener('ended', () => {
             playButton.style.display = 'flex';
             video.currentTime = 0;
         });
     }

     // Setup static image controls
     function setupStaticImageControls(windowEl) {
         const staticImage = windowEl.querySelector('#static-image');
         const permissionWarning = windowEl.querySelector('#permission-warning');
         const warningClose = windowEl.querySelector('#warning-close');

         if (!staticImage || !permissionWarning) return;

         // Show warning when image is clicked
         staticImage.addEventListener('click', (e) => {
             e.preventDefault();
             permissionWarning.style.display = 'flex';
         });

         // Close warning button handler
         if (warningClose) {
             warningClose.addEventListener('click', () => {
                 permissionWarning.style.display = 'none';
             });
         }

         // Close warning when clicking outside the warning content
         permissionWarning.addEventListener('click', (e) => {
             if (e.target === permissionWarning) {
                 permissionWarning.style.display = 'none';
             }
         });
     }

     // Update dock icon active state
     function updateDockIconState(projectName, isActive) {
         const appName = projectName.toLowerCase();
         const dockIcon = document.querySelector(`.dock-icon[data-app="${appName}"]`);

         if (dockIcon) {
             if (isActive) {
                 dockIcon.classList.add('active');
             } else {
                 dockIcon.classList.remove('active');
             }
         }
     }

     // Close window on Escape key
     document.addEventListener('keydown', (event) => {
         if (event.key === 'Escape' && focusedWindow) {
             const projectName = focusedWindow.dataset.project;
             closeProjectWindow(focusedWindow, projectName);
         }
     });

     if (DEBUG) console.log('✅ DEBUG: Window management system initialized');

     // ===== PDF THUMBNAIL RENDERING =====
     async function renderPDFThumbnail() {
         const canvas = document.getElementById('pdf-thumbnail-canvas');
         if (!canvas) return;

         try {
             // Check if PDF.js is loaded
             if (typeof pdfjsLib === 'undefined') {
                 console.error('PDF.js library not loaded');
                 return;
             }

             // Set worker source
             pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

             // Load the PDF
             const loadingTask = pdfjsLib.getDocument('Portfolio-dekkoshi.pdf');
             const pdf = await loadingTask.promise;

             // Get the first page
             const page = await pdf.getPage(1);

             // Set canvas dimensions to match icon size
             const scale = 0.5; // Adjust scale for thumbnail size
             const viewport = page.getViewport({ scale: scale });

             canvas.width = 80;
             canvas.height = 100;

             const context = canvas.getContext('2d');

             // Calculate scaling to fit the canvas while maintaining aspect ratio
             const scaleX = canvas.width / viewport.width;
             const scaleY = canvas.height / viewport.height;
             const renderScale = Math.min(scaleX, scaleY);

             const scaledViewport = page.getViewport({ scale: scale * renderScale });

             // Render the page
             const renderContext = {
                 canvasContext: context,
                 viewport: scaledViewport
             };

             await page.render(renderContext).promise;
             console.log('✅ PDF thumbnail rendered successfully');
         } catch (error) {
             console.error('Error rendering PDF thumbnail:', error);
             // Fallback: draw a simple PDF icon
             const context = canvas.getContext('2d');
             canvas.width = 80;
             canvas.height = 100;

             // Draw a simple red PDF icon as fallback
             context.fillStyle = '#EF4444';
             context.fillRect(10, 5, 60, 90);
             context.fillStyle = '#FFFFFF';
             context.font = 'bold 16px Arial';
             context.textAlign = 'center';
             context.fillText('PDF', 40, 55);
         }
     }

     // Render PDF thumbnail when page loads
     renderPDFThumbnail();

     // ===== DESKTOP PDF ICON MANAGEMENT =====
     // Setup draggable PDF icons
     function setupDesktopIcon(iconId, projectName) {
         const icon = document.getElementById(iconId);
         if (!icon) return;

         let isDragging = false;
         let hasDragged = false; // Track if icon was actually dragged
         let dragOffset = { x: 0, y: 0 };
         let dragStartPos = { x: 0, y: 0 }; // Track starting position

         // Click to open PDF - only if not dragged
         icon.addEventListener('click', () => {
             if (!hasDragged) {
                 openProjectModal(projectName);
             }
             // Reset drag flag after click
             hasDragged = false;
         });

         // Drag functionality
         icon.addEventListener('mousedown', (e) => {
             isDragging = true;
             hasDragged = false; // Reset drag flag
             const rect = icon.getBoundingClientRect();
             dragOffset.x = e.clientX - rect.left;
             dragOffset.y = e.clientY - rect.top;
             dragStartPos.x = e.clientX;
             dragStartPos.y = e.clientY;
             e.preventDefault();
         });

         document.addEventListener('mousemove', (e) => {
             if (!isDragging) return;

             // Calculate drag distance from start position
             const dragDistance = Math.sqrt(
                 Math.pow(e.clientX - dragStartPos.x, 2) +
                 Math.pow(e.clientY - dragStartPos.y, 2)
             );

             // If dragged more than 5 pixels, mark as dragged
             if (dragDistance > 5) {
                 hasDragged = true;
             }

             const desktopRect = desktopArea.getBoundingClientRect();
             const iconRect = icon.getBoundingClientRect();

             let newX = e.clientX - desktopRect.left - dragOffset.x;
             let newY = e.clientY - desktopRect.top - dragOffset.y;

             // Keep icon within desktop boundaries
             newX = Math.max(0, Math.min(newX, desktopRect.width - iconRect.width));
             newY = Math.max(0, Math.min(newY, desktopRect.height - iconRect.height));

             icon.style.left = `${newX}px`;
             icon.style.top = `${newY}px`;
             icon.style.right = 'auto'; // Override initial right positioning
         });

         document.addEventListener('mouseup', () => {
             if (isDragging) {
                 isDragging = false;
                 // Don't reset hasDragged here - let click handler check it
             }
         });
     }

     // Setup both PDF icons
     setupDesktopIcon('desktop-portfolio-icon', 'Portfolio');
     setupDesktopIcon('desktop-bamai-icon', 'Bamai');

     // Global test function
     window.testWindow = function(projectName = 'Bamai') {
         if (DEBUG) console.log('🧪 DEBUG: Testing window for:', projectName);
         openProjectModal(projectName);
     };

     // Test function to check raycasting
     window.testRaycasting = function() {
         if (DEBUG) console.log('🧪 DEBUG: Testing raycasting...');
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

     if (DEBUG) console.log('🧪 DEBUG: Test functions available - run testModal() or testRaycasting() in console');

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
        if (DEBUG) console.log('🛠️ DEBUG: Setting up plane:', {
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

        if (DEBUG) console.log('✅ DEBUG: Plane created with userData:', plane.userData);

        scene.add(plane);
        planes.push(plane);

        if (DEBUG) console.log('📊 DEBUG: Total planes now:', planes.length);
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

                    video.play().catch(() => {
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

    // Canvas interaction variables removed (wheel, drag, touch)

    // Project title management removed (canvas interaction removed)

    // Project detection removed (canvas interaction removed)
    // Canvas wheel interaction removed

    // --- Mouse Drag Interaction ---
    // Canvas mouse drag interaction removed

    // --- Touch/Mobile Interaction ---
    // Canvas touch interaction removed

    // Click handling for modal opening removed
    // Canvas click interaction removed

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Canvas interaction removed - camera is now static
        // Update camera position smoothly
        camera.position.x += (cameraTarget.x - camera.position.x) * 0.06;
        camera.position.y += (cameraTarget.y - camera.position.y) * 0.06;

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
        bgMaterial.uniforms.u_scroll_velocity.value = 0; // Canvas interaction removed
        bgMaterial.uniforms.u_scroll_intensity.value = 0; // Canvas interaction removed

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


// ===== DESKTOP WIDGETS =====
// Update calendar widget
function updateCalendarWidget() {
    const now = new Date();
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = dayNames[now.getDay()];
    const date = now.getDate();

    const dayNameEl = document.getElementById('widget-day-name');
    const dateEl = document.getElementById('widget-date');

    if (dayNameEl) dayNameEl.textContent = dayName;
    if (dateEl) dateEl.textContent = date;
}

// Draw analog clock on canvas
function drawClock(canvasId, timezone) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = 35;
    const centerY = 35;
    const radius = 32;

    // Clear canvas
    ctx.clearRect(0, 0, 70, 70);

    // Get time for timezone
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * timezone));

    const hours = localTime.getHours() % 12;
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = centerX + (radius - 6) * Math.cos(angle);
        const y1 = centerY + (radius - 6) * Math.sin(angle);
        const x2 = centerX + (radius - 2) * Math.cos(angle);
        const y2 = centerY + (radius - 2) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Draw hour numbers
    ctx.fillStyle = '#333';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = centerX + (radius - 11) * Math.cos(angle);
        const y = centerY + (radius - 11) * Math.sin(angle);
        ctx.fillText(i.toString(), x, y);
    }

    // Draw hour hand
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + 14 * Math.cos(hourAngle),
        centerY + 14 * Math.sin(hourAngle)
    );
    ctx.strokeStyle = '#FF9500';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw minute hand
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + 22 * Math.cos(minuteAngle),
        centerY + 22 * Math.sin(minuteAngle)
    );
    ctx.strokeStyle = '#FF9500';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF9500';
    ctx.fill();
}

// Update all clocks
function updateClocks() {
    drawClock('clock-melbourne', 11);  // UTC+11
    drawClock('clock-tokyo', 9);       // UTC+9
    drawClock('clock-london', 0);      // UTC+0
    drawClock('clock-newyork', -5);    // UTC-5
}

// Initialize widgets
updateCalendarWidget();
updateClocks();

// Update clocks every second
setInterval(updateClocks, 1000);

// Update calendar at midnight
setInterval(updateCalendarWidget, 60000); // Check every minute