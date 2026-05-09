/* =============================================================================
   ABYSSEA — scripts.js
   -----------------------------------------------------------------------------
   ES: Lógica principal: Burbujas · Parallax · Navbar · Reveal · Lightbox · Versiones
   EN: Main logic: Bubbles · Parallax · Navbar · Reveal · Lightbox · Versions
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       0. UTILIDADES GLOBALES (GLOBAL UTILITIES)
       ========================================================================= */

    /**
     * ES: Detecta si el usuario está en un dispositivo móvil.
     * EN: Detects if the user is on a mobile device.
     */
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    };

    /**
     * ES: Muestra modal de incompatibilidad.
     * EN: Shows incompatibility modal.
     */
    const showCompatibilityModal = () => {
        const texts = ABYSSEA_LOCALES[currentLang];
        let modal = document.getElementById('compatibility-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'compatibility-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content" style="text-align: center; border-color: var(--border-color); background: var(--bg-dark);">
                    <button class="modal-close">&times;</button>
                    <div style="margin-bottom: 1.5rem; color: var(--text-color); opacity: 0.8;">
                        <i data-lucide="smartphone-off" style="width: 48px; height: 48px;"></i>
                    </div>
                    <h2 class="font-glech modal-title" style="color: var(--text-color);" data-i18n="modal_comp_title"></h2>
                    <p style="margin-bottom: 2rem; line-height: 1.6; color: var(--text-muted);" data-i18n="modal_comp_desc"></p>
                    <button class="nav-cta-btn modal-close-btn" style="width: 100%; border: none; font-size: 1rem; cursor: pointer;" data-i18n="modal_comp_btn"></button>
                </div>
            `;
            document.body.appendChild(modal);

            const close = () => modal.classList.remove('open');
            modal.querySelector('.modal-close').addEventListener('click', close);
            modal.querySelector('.modal-close-btn').addEventListener('click', close);
            modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        }
        updateUILanguage();
        modal.classList.add('open');
    };

    /* =========================================================================
       1. GESTIÓN DE IDIOMAS (I18N SYSTEM)
       ========================================================================= */
    // ES: Estado del idioma actual (Prioridad: LocalStorage > Browser > Default ES)
    // EN: Current language state (Priority: LocalStorage > Browser > Default ES)
    let currentLang = localStorage.getItem('abyssea_lang');
    if (!currentLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        currentLang = browserLang.startsWith('es') ? 'es' : 'en';
    }

    /**
     * ES: Actualiza todos los elementos con el atributo data-i18n.
     * EN: Updates all elements with the data-i18n attribute.
     */
    function updateUILanguage() {
        if (typeof ABYSSEA_LOCALES === 'undefined') return;
        const texts = ABYSSEA_LOCALES[currentLang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (texts[key]) {
                el.innerHTML = texts[key];
            }
        });
        
        // ES: Procesar iconos de Lucide / EN: Process Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // ES: Actualizar estado visual de los botones / EN: Update buttons visual state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            btn.classList.toggle('active', btnLang === currentLang);
        });

        // ES: Actualizar idioma de la página (SEO) / EN: Update page lang (SEO)
        document.documentElement.lang = currentLang;

        // ES: Guardar preferencia / EN: Save preference
        localStorage.setItem('abyssea_lang', currentLang);

        // ES: Refrescar botones de descarga en Home / EN: Refresh home download buttons
        if (typeof initializeVersionManagement === 'function') {
            initializeVersionManagement();
        }
    }

    // ES: Definición de funciones de idioma / EN: Language functions definition
    window.setLanguage = (lang) => {
        if (currentLang === lang) return;
        currentLang = lang;
        updateUILanguage();

        document.body.style.opacity = '0.5';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    };

    function initializeVersionManagement() {
        if (typeof ABYSSEA_VERSIONS !== 'undefined') {
            const versions = ABYSSEA_VERSIONS;

            // ES: Referencias a botones de descarga en la Home
            // EN: References to download buttons on the Home page
            const winHomeBtn = document.getElementById('download-windows');
            const macHomeBtn = document.getElementById('download-macos');

            // --- 1.1 Actualizar botones en Home (Update Home Buttons) ---
            const updateHomeButton = (btn, platformId) => {
                if (!btn) return;

                const texts = ABYSSEA_LOCALES[currentLang];
                const isLatest = !!versions.latest;
                const releaseData = isLatest ? versions.latest : versions.beta;
                const dataKey = platformId === 'win' ? 'windows' : 'macos';

                if (releaseData && releaseData[dataKey]) {
                    const platformData = releaseData[dataKey];
                    const versionTag = btn.querySelector('.v-tag');
                    const sizeTag = btn.querySelector('.s-tag');
                    const titleTag = btn.querySelector('.download-title');
                    const detailsContainer = btn.querySelector('.download-details');

                    if (versionTag) versionTag.textContent = releaseData.version;
                    if (sizeTag) sizeTag.textContent = platformData.size;
                    if (titleTag) titleTag.textContent = texts[`dl_title_${platformId}`];

                    if (!isLatest && releaseData === versions.beta && detailsContainer) {
                        if (!btn.querySelector('.badge-beta-home')) {
                            const badge = document.createElement('span');
                            badge.className = 'badge-beta badge-beta-home';
                            badge.style.marginLeft = '10px';
                            badge.style.fontSize = '0.6rem';
                            badge.textContent = 'BETA';
                            detailsContainer.appendChild(badge);
                        }
                    }
                }
            };

            // ES: Actualizar botones Home / EN: Update Home buttons
            updateHomeButton(winHomeBtn, 'win');
            updateHomeButton(macHomeBtn, 'mac');

            // --- 1.2 Renderizar páginas de versiones (Render Version Pages) ---
            const renderVersionPageContent = (platformKey) => {
                const container = document.getElementById(`${platformKey}-version-list`);
                if (!container) return;

                const texts = ABYSSEA_LOCALES[currentLang];
                const platform = platformKey === 'win' ? 'windows' : 'macos';
                const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

                let dynamicHtml = '';

                // ES: Helper para renderizar un item / EN: Helper to render an item
                const getItemHtml = (data, typeClass, badgeText, badgeClass) => {
                    const pData = data[platform];
                    const downloadUrl = pData.url.startsWith('http') ? pData.url : pathPrefix + pData.url;
                    const changesAttr = data.changes ? data.changes.replace(/"/g, '&quot;') : '';

                    const btnText = typeClass === 'old' && pData.url === '#' ? texts.ver_btn_archive : (typeClass === 'beta' ? texts.ver_btn_beta : texts.ver_btn_dl);

                    return `
                        <div class="version-item ${typeClass}" data-version="${data.version}" data-changes="${changesAttr}">
                            <div class="v-main-info">
                                <span class="v-num">${data.version}</span>
                                <span class="${badgeClass}">${badgeText}</span>
                            </div>
                            <span class="v-date">${texts.ver_pub_date} ${data.date}</span>
                            <span class="v-size">${pData.size}</span>
                            <div class="v-actions">
                                <button class="v-updates-btn" title="${texts.ver_btn_updates}">
                                    <i data-lucide="notebook-pen" style="width: 18px; height: 18px;"></i>
                                    ${texts.ver_btn_updates}
                                </button>
                                <a href="${downloadUrl}" class="v-dl-btn ${typeClass}" style="${pData.url === '#' ? 'pointer-events: none; opacity: 0.5;' : ''}">
                                    ${btnText}
                                </a>
                            </div>
                        </div>
                    `;
                };

                // ES: SECCIÓN ESTABLE
                if (versions.latest) {
                    dynamicHtml += `
                        <h3 class="font-glech" style="margin-top: 2rem; color: var(--accent); font-size: 1.5rem;">${texts.ver_sec_stable}</h3>
                        ${getItemHtml(versions.latest, '', 'LATEST', 'badge-latest')}
                    `;
                }

                // ES: SECCIÓN BETA
                if (versions.beta) {
                    dynamicHtml += `
                        <h3 class="font-glech section-sub" style="margin-top: 3rem; color: #facc15; font-size: 1.5rem;">${texts.ver_sec_beta}</h3>
                        ${getItemHtml(versions.beta, 'beta', 'BETA', 'badge-beta')}
                    `;
                }

                // ES: SECCIÓN ARCHIVO
                if (versions.archive && versions.archive.length > 0) {
                    dynamicHtml += `<h3 class="font-glech" style="margin-top: 3rem; color: var(--muted); font-size: 1.2rem;">${texts.ver_sec_archive}</h3>`;
                    dynamicHtml += versions.archive.map(item => getItemHtml(item, 'old', 'OLD VERSION', 'badge-old')).join('');
                }

                container.innerHTML = dynamicHtml;
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // ES: Añadir eventos de click
                container.querySelectorAll('.v-updates-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const item = btn.closest('.version-item');
                        const versionTag = item.getAttribute('data-version');
                        const changesText = item.getAttribute('data-changes');
                        showUpdatesModal(versionTag, changesText);
                    });
                });

                container.querySelectorAll('.v-dl-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (isMobileDevice()) {
                            e.preventDefault();
                            showCompatibilityModal();
                        }
                    });
                });
            };

            /**
             * ES: Muestra la modal con los cambios de la versión.
             * EN: Shows the modal with the version changes.
             */
            function showUpdatesModal(version, changesString) {
                let modal = document.getElementById('updates-modal');

                // ES: Crear modal si no existe / EN: Create modal if it doesn't exist
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'updates-modal';
                    modal.className = 'modal-overlay';
                    modal.innerHTML = `
                        <div class="modal-content">
                            <button class="modal-close">&times;</button>
                            <h2 class="font-glech modal-title">UPDATES <span class="accent" id="modal-v-num"></span></h2>
                            <ul class="modal-changes-list" id="modal-changes-list"></ul>
                        </div>
                    `;
                    document.body.appendChild(modal);

                    modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
                    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
                }

                const list = modal.querySelector('#modal-changes-list');
                const vNum = modal.querySelector('#modal-v-num');

                vNum.textContent = version.toUpperCase();

                // ES: Procesar cambios (separados por guiones)
                // EN: Process changes (separated by dashes)
                const changesArray = changesString.split('-').map(s => s.trim()).filter(s => s.length > 0);
                list.innerHTML = changesArray.map(change => `<li>${change}</li>`).join('');

                modal.classList.add('open');
                document.body.style.overflow = 'hidden'; // ES: Bloquear scroll / EN: Lock scroll
            }

            renderVersionPageContent('win');
            renderVersionPageContent('mac');
        } else {
            console.error('ABYSSEA_VERSIONS no está definido. Revisa versions-data.js');
        }
    }
    initializeVersionManagement();
    updateUILanguage();

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
        anchor.addEventListener('click', function (e) {
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
        const revealItems = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        revealItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            // ES: Si el elemento está visible en la ventana (con un margen de 100px por debajo y sin desaparecer por arriba)
            // EN: If the element is visible in the viewport (with 100px margin at bottom and not fully gone at top)
            if (rect.top < windowHeight - 100 && rect.bottom > 0) {
                item.classList.add('active');
            } else {
                // ES: Al salir de la vista, le quitamos la clase para que se vuelva a animar al volver
                // EN: Remove the class when out of view so it animates again when returning
                item.classList.remove('active');
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
