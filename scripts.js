/* =============================================================================
   ABYSSEA — scripts.js
   -----------------------------------------------------------------------------
   ES: Lógica principal: Burbujas · Parallax · Navbar · Reveal · Lightbox · Versiones
   EN: Main logic: Bubbles · Parallax · Navbar · Reveal · Lightbox · Versions
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. GESTIÓN DE VERSIONES (DYNAMIC VERSIONS)
       ========================================================================= */
    function initializeVersionManagement() {
        /**
         * ES: Verifica si el objeto global ABYSSEA_VERSIONS (de versions-data.js) existe.
         * EN: Checks if the global ABYSSEA_VERSIONS object (from versions-data.js) exists.
         */
        if (typeof ABYSSEA_VERSIONS !== 'undefined') {
            const versionsData = ABYSSEA_VERSIONS;
            
            // ES: Referencias a botones de descarga en la Home
            // EN: References to download buttons on the Home page
            const winHomeBtn = document.getElementById('download-windows');
            const macHomeBtn = document.getElementById('download-macos');

            // --- 1.1 Actualizar botones en Home (Update Home Buttons) ---
            if (winHomeBtn && versionsData.windows && versionsData.windows.latest) {
                const versionTag = winHomeBtn.querySelector('.v-tag');
                const sizeTag = winHomeBtn.querySelector('.s-tag');
                if (versionTag) versionTag.textContent = versionsData.windows.latest.version;
                if (sizeTag) sizeTag.textContent = versionsData.windows.latest.size;
            }
            if (macHomeBtn && versionsData.macos && versionsData.macos.latest) {
                const versionTag = macHomeBtn.querySelector('.v-tag');
                const sizeTag = macHomeBtn.querySelector('.s-tag');
                if (versionTag) versionTag.textContent = versionsData.macos.latest.version;
                if (sizeTag) sizeTag.textContent = versionsData.macos.latest.size;
            }

            // --- 1.2 Renderizar páginas de versiones (Render Version Pages) ---
            /**
             * ES: Dibuja dinámicamente todo el contenido de las páginas win_version / mac_version.
             * EN: Dynamically draws all content for the win_version / mac_version pages.
             * @param {string} platform - 'win' o 'mac'
             */
            const renderVersionPageContent = (platform) => {
                const container = document.getElementById(`${platform}-version-list`);
                if (!container) return;

                const platformData = versionsData[platform === 'win' ? 'windows' : 'macos'];
                if (!platformData) return;

                // ES: Detectar si estamos en la subcarpeta / EN: Detect if we are in the subfolder
                const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

                let dynamicHtml = '';

                // ES: SECCIÓN ESTABLE (Stable Section)
                if (platformData.latest) {
                    const downloadUrl = platformData.latest.url.startsWith('http') ? platformData.latest.url : pathPrefix + platformData.latest.url;
                    dynamicHtml += `
                        <h3 class="font-glech" style="margin-top: 2rem; color: var(--accent); font-size: 1.5rem;">Versión Estable</h3>
                        <div class="version-item">
                            <div>
                                <span class="v-num">${platformData.latest.version}</span>
                                <span class="badge-latest">LATEST</span>
                            </div>
                            <span class="v-date">Publicado el ${platformData.latest.date}</span>
                            <span class="v-size">${platformData.latest.size}</span>
                            <a href="${downloadUrl}" class="v-dl-btn">DESCARGAR</a>
                        </div>
                    `;
                }

                // ES: SECCIÓN BETA (Beta Section)
                if (platformData.beta) {
                    const downloadUrl = platformData.beta.url.startsWith('http') ? platformData.beta.url : pathPrefix + platformData.beta.url;
                    dynamicHtml += `
                        <h3 class="font-glech section-sub" style="margin-top: 3rem; color: #facc15; font-size: 1.5rem;">Versiones Beta</h3>
                        <div class="version-item beta">
                            <div>
                                <span class="v-num">${platformData.beta.version}</span>
                                <span class="badge-beta">BETA</span>
                            </div>
                            <span class="v-date">Publicado el ${platformData.beta.date}</span>
                            <span class="v-size">${platformData.beta.size}</span>
                            <a href="${downloadUrl}" class="v-dl-btn beta">PROBAR BETA</a>
                        </div>
                    `;
                }

                // ES: SECCIÓN ARCHIVO (Archive Section)
                if (platformData.archive && platformData.archive.length > 0) {
                    dynamicHtml += `<h3 class="font-glech" style="margin-top: 3rem; color: var(--muted); font-size: 1.2rem;">Archivo</h3>`;
                    dynamicHtml += platformData.archive.map(item => {
                        const downloadUrl = (item.url === '#' || item.url.startsWith('http')) ? item.url : pathPrefix + item.url;
                        return `
                            <div class="version-item" style="opacity: 0.7; margin-bottom: 1rem;">
                                <div>
                                    <span class="v-num">${item.version}</span>
                                    <span class="badge-old">OLD VERSION</span>
                                </div>
                                <span class="v-date">Publicado el ${item.date}</span>
                                <span class="v-size">${item.size}</span>
                                <a href="${downloadUrl}" class="v-dl-btn" style="opacity: 0.5; ${item.url === '#' ? 'pointer-events: none;' : ''}">
                                    ${item.url === '#' ? 'ARCHIVO' : 'DESCARGAR'}
                                </a>
                            </div>
                        `;
                    }).join('');
                }

                container.innerHTML = dynamicHtml;
            };

            renderVersionPageContent('win');
            renderVersionPageContent('mac');
        } else {
            console.error('ABYSSEA_VERSIONS no está definido. Revisa versions-data.js');
        }
    }
    initializeVersionManagement();

    /* =========================================================================
       2. CANVAS DE BURBUJAS (BUBBLES EFFECT)
       ========================================================================= */
    (function initBubbles() {
        const canvas = document.getElementById('bubbles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, bubblesList = [];

        function handleResize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        handleResize();
        window.addEventListener('resize', handleResize);

        const MAX_BUBBLES = 60;

        /**
         * ES: Crea una burbuja con propiedades aleatorias.
         * EN: Creates a bubble with random properties.
         */
        function createNewBubble() {
            return {
                x: Math.random() * width,
                y: height + Math.random() * height,
                radius: 1.5 + Math.random() * 5,
                verticalSpeed: 0.3 + Math.random() * 0.7,
                drift: (Math.random() - 0.5) * 0.4,
                alpha: 0.08 + Math.random() * 0.18,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.01 + Math.random() * 0.02
            };
        }

        // ES: Inicializar lista de burbujas / EN: Initialize bubbles list
        for (let i = 0; i < MAX_BUBBLES; i++) {
            const b = createNewBubble();
            b.y = Math.random() * height; // ES: Distribuir inicialmente / EN: Distribute initially
            bubblesList.push(b);
        }

        function drawBubble(b) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56,189,248,${b.alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            
            // ES: Reflejo luminoso / EN: Light highlight
            ctx.beginPath();
            ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,230,255,${b.alpha * 0.8})`;
            ctx.fill();
        }

        function animateBubbles() {
            ctx.clearRect(0, 0, width, height);
            bubblesList.forEach((b, index) => {
                b.wobble += b.wobbleSpeed;
                b.x += b.drift + Math.sin(b.wobble) * 0.4;
                b.y -= b.verticalSpeed;
                drawBubble(b);
                
                // ES: Reposicionar si sale de la pantalla / EN: Reposition if off screen
                if (b.y + b.radius < 0) {
                    bubblesList[index] = createNewBubble();
                }
            });
            requestAnimationFrame(animateBubbles);
        }
        animateBubbles();
    })();


    /* =========================================================================
       3. SISTEMA DE SCROLL (PARALLAX & REVEAL)
       ========================================================================= */
    const heroParallaxLayer = document.getElementById('hero-parallax');
    const statsBannerParallax = document.getElementById('parallax-bg-layer');

    function onPageScroll() {
        const scrollY = window.scrollY;

        // ES: Parallax suave para el Hero / EN: Smooth Parallax for the Hero
        if (heroParallaxLayer) {
            heroParallaxLayer.style.transform = `translateY(${scrollY * 0.35}px)`;
        }

        // ES: Parallax para el banner de estadísticas / EN: Parallax for the stats banner
        if (statsBannerParallax) {
            const banner = statsBannerParallax.closest('.parallax-banner');
            if (banner) {
                const bannerTop = banner.getBoundingClientRect().top + scrollY;
                const offset = (scrollY - bannerTop) * 0.25;
                statsBannerParallax.style.transform = `translateY(${offset}px)`;
            }
        }

        updateNavbarState(scrollY);
        handleScrollReveal();
        updateDepthMeter(scrollY);
    }

    window.addEventListener('scroll', onPageScroll, { passive: true });


    /* =========================================================================
       4. NAVBAR (NAVIGATION)
       ========================================================================= */
    const mainNavbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu');

    /**
     * ES: Cambia el estilo del navbar según la posición del scroll.
     * EN: Changes navbar style based on scroll position.
     */
    function updateNavbarState(scrollY) {
        if (!mainNavbar) return;
        mainNavbar.classList.toggle('scrolled', scrollY > 60);
    }

    // ES: Menú móvil (Mobile Menu)
    if (hamburgerBtn && mobileMenuOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.toggle('open');
        });
        mobileMenuOverlay.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => mobileMenuOverlay.classList.remove('open'));
        });
    }

    // ES: Navegación interna suave / EN: Smooth internal navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* =========================================================================
       5. REVELACIÓN DE ELEMENTOS (SCROLL REVEAL)
       ========================================================================= */
    function handleScrollReveal() {
        const revealItems = document.querySelectorAll('.reveal:not(.active)');
        const windowHeight = window.innerHeight;
        revealItems.forEach(item => {
            if (item.getBoundingClientRect().top < windowHeight - 100) {
                item.classList.add('active');
            }
        });
    }
    handleScrollReveal(); // ES: Ejecutar una vez al cargar / EN: Run once on load


    /* =========================================================================
       6. MEDIDOR DE PROFUNDIDAD (DEPTH METER)
       ========================================================================= */
    const depthMeterFill = document.getElementById('depth-fill');
    let isDepthAnimated = false;

    function updateDepthMeter(scrollY) {
        if (isDepthAnimated || !depthMeterFill) return;
        const meterContainer = depthMeterFill.closest('.depth-meter');
        if (!meterContainer) return;
        
        const containerPosition = meterContainer.getBoundingClientRect().top;
        if (containerPosition < window.innerHeight - 80) {
            depthMeterFill.style.height = '100%';
            isDepthAnimated = true;
        }
    }


    /* =========================================================================
       7. GALERÍA (LIGHTBOX)
       ========================================================================= */
    const lightboxModal = document.getElementById('lightbox');
    const lightboxOverlay = document.getElementById('lightbox-bg');
    const lightboxImage = document.getElementById('lightbox-img');
    const lightboxText = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close');

    function openFullImage(src, captionText) {
        if (!lightboxModal) return;
        lightboxImage.src = src;
        lightboxText.textContent = captionText;
        lightboxModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // ES: Bloquear scroll / EN: Lock scroll
    }

    function closeFullImage() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('open');
        document.body.style.overflow = ''; // ES: Restaurar scroll / EN: Restore scroll
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgEl = item.querySelector('img');
            const captionEl = item.querySelector('.gallery-caption');
            if (imgEl) {
                openFullImage(imgEl.src, captionEl ? captionEl.textContent : '');
            }
        });
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeFullImage);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeFullImage);
    
    // ES: Atajos de teclado / EN: Keyboard shortcuts
    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape') closeFullImage(); 
    });

    // ES: Inicialización de estado inicial / EN: Initial state initialization
    onPageScroll();

    /* =========================================================================
       8. PROTECCIÓN DE CONTENIDO (SECURITY)
       ========================================================================= */
    // ES: Bloquear clic derecho / EN: Disable right click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // ES: Bloquear teclas de desarrollador (F12, Inspeccionar, etc)
    // EN: Disable developer shortcuts (F12, Inspect, etc)
    document.addEventListener('keydown', e => {
        if (
            (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'u' || e.key === 'i' || e.key === 'j') ||
            (e.key === 'F12')
        ) {
            e.preventDefault();
            return false;
        }
    });
});
