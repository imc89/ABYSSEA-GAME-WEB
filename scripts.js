/* ==============================================
   ABYSSEA — scripts.js
   Módulos: Burbujas · Parallax · Navbar · Reveal
             Depth Meter · Gallery Lightbox
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. FETCH VERSIONS
       ========================================== */
    function updateDownloadButtons() {
        console.log('Iniciando fetch de versiones...');
        fetch('versions.json')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar versions.json (Error ' + response.status + ')');
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                const winBtn = document.getElementById('download-windows');
                const macBtn = document.getElementById('download-macos');

                if (winBtn && data.windows) {
                    winBtn.href = data.windows.url;
                    const v = winBtn.querySelector('.v-tag');
                    const s = winBtn.querySelector('.s-tag');
                    if (v) v.textContent = data.windows.version;
                    if (s) s.textContent = data.windows.size;
                }
                if (macBtn && data.macos) {
                    macBtn.href = data.macos.url;
                    const v = macBtn.querySelector('.v-tag');
                    const s = macBtn.querySelector('.s-tag');
                    if (v) v.textContent = data.macos.version;
                    if (s) s.textContent = data.macos.size;
                }
            })
            .catch(err => {
                console.error('Error en updateDownloadButtons:', err);
            });
    }
    updateDownloadButtons();

    /* ==========================================
       2. CANVAS DE BURBUJAS ASCENDENTES
       ========================================== */
    (function initBubbles() {
        const canvas = document.getElementById('bubbles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, bubbles = [];

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const NUM_BUBBLES = 60;

        function createBubble() {
            return {
                x: Math.random() * W,
                y: H + Math.random() * H,
                r: 1.5 + Math.random() * 5,
                speed: 0.3 + Math.random() * 0.7,
                drift: (Math.random() - 0.5) * 0.4,
                alpha: 0.08 + Math.random() * 0.18,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.01 + Math.random() * 0.02
            };
        }

        for (let i = 0; i < NUM_BUBBLES; i++) {
            const b = createBubble();
            b.y = Math.random() * H;
            bubbles.push(b);
        }

        function drawBubble(b) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(56,189,248,${b.alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,230,255,${b.alpha * 0.8})`;
            ctx.fill();
        }

        function animate() {
            ctx.clearRect(0, 0, W, H);
            bubbles.forEach((b, i) => {
                b.wobble += b.wobbleSpeed;
                b.x += b.drift + Math.sin(b.wobble) * 0.4;
                b.y -= b.speed;
                drawBubble(b);
                if (b.y + b.r < 0) {
                    bubbles[i] = createBubble();
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    })();


    /* ==========================================
       3. PARALLAX — Hero + Stats banner
       ========================================== */
    const heroParallax = document.getElementById('hero-parallax');
    const parallaxBgLayer = document.getElementById('parallax-bg-layer');

    function onScroll() {
        const sy = window.scrollY;

        if (heroParallax) {
            heroParallax.style.transform = `translateY(${sy * 0.35}px)`;
        }

        if (parallaxBgLayer) {
            const banner = parallaxBgLayer.closest('.parallax-banner');
            if (banner) {
                const bannerTop = banner.getBoundingClientRect().top + sy;
                const offset = (sy - bannerTop) * 0.25;
                parallaxBgLayer.style.transform = `translateY(${offset}px)`;
            }
        }

        handleNavbar(sy);
        revealElements();
        animateDepthMeter(sy);
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    /* ==========================================
       4. NAVBAR — scroll effect + hamburger
       ========================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function handleNavbar(sy) {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', sy > 60);
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.remove('open'));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* ==========================================
       5. SCROLL REVEAL
       ========================================== */
    function revealElements() {
        const items = document.querySelectorAll('.reveal:not(.active)');
        const wh = window.innerHeight;
        items.forEach(el => {
            if (el.getBoundingClientRect().top < wh - 100) {
                el.classList.add('active');
            }
        });
    }
    revealElements();


    /* ==========================================
       6. DEPTH METER — anima al hacer scroll
       ========================================== */
    const depthFill = document.getElementById('depth-fill');
    let depthAnimated = false;

    function animateDepthMeter(sy) {
        if (depthAnimated || !depthFill) return;
        const el = depthFill.closest('.depth-meter');
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) {
            depthFill.style.height = '100%';
            depthAnimated = true;
        }
    }


    /* ==========================================
       7. GALLERY — lightbox
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxBg = document.getElementById('lightbox-bg');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, caption) {
        if (!lightbox) return;
        lightboxImg.src = src;
        lightboxCap.textContent = caption;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption');
            if (img) {
                openLightbox(img.src, caption ? caption.textContent : '');
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    onScroll();

    /* ==========================================
       8. PROTECCIÓN DE CONTENIDO
       ========================================== */
    document.addEventListener('contextmenu', e => e.preventDefault());
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
