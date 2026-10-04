// ─────────────────────────────────────────────
//  Unión de todos los artículos por categoría
// ─────────────────────────────────────────────
const articles = {
    ...(typeof proyectosArticles !== 'undefined' ? proyectosArticles : {}),
    ...(typeof carrerasArticles !== 'undefined' ? carrerasArticles : {}),
    ...(typeof alumniArticles !== 'undefined' ? alumniArticles : {}),
    ...(typeof eventosArticles !== 'undefined' ? eventosArticles : {}),
};

// ─────────────────────────────────────────────
//  Navegación y lógica principal
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateMobileMenu() {
        if (window.innerWidth <= 768) {
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
            } else {
                navMenu.style.display = 'none';
            }
        } else {
            navMenu.style.display = '';
        }
    }

    // Toggle Mobile Menu
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            updateMobileMenu();
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                updateMobileMenu();
            }
        });
    });

    window.addEventListener('resize', updateMobileMenu);
    updateMobileMenu();

    // Cargar artículo dinámico
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (articleId && articles[articleId]) {
        const article = articles[articleId];

        // Elementos del DOM
        const titleEl = document.getElementById('article-title');
        const categoryEl = document.getElementById('article-category');
        const authorEl = document.getElementById('article-author');
        const dateEl = document.getElementById('article-date');
        const bodyEl = document.getElementById('article-body');
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        const breadcrumbSection = document.getElementById('breadcrumb-section');

        // Actualizar contenido
        if (titleEl) titleEl.textContent = article.title;
        if (categoryEl) categoryEl.textContent = article.category;
        if (authorEl) authorEl.textContent = article.author;
        if (dateEl) dateEl.textContent = article.date;
        if (breadcrumbTitle) breadcrumbTitle.textContent = article.title;
        if (breadcrumbSection) breadcrumbSection.textContent = article.category;

        let contentHtml = '';
        if (article.lead) {
            contentHtml += `<p class="lead" style="font-size: 1.4rem; margin-bottom: 20px;">${article.lead}</p>`;
        }
        contentHtml += article.body;

        if (bodyEl) {
            bodyEl.innerHTML = contentHtml;
            bodyEl.style.textAlign = 'justify';

            if (articleId === 'niebla') {
                bodyEl.classList.add('article-niebla');
            }

            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        }

        document.title = `${article.title} - QVerse`;

    } else if (window.location.pathname.includes('articulo.html')) {
        const bodyEl = document.getElementById('article-body');
        const titleEl = document.getElementById('article-title');

        if (titleEl) titleEl.textContent = 'Artículo no encontrado';
        if (bodyEl) bodyEl.innerHTML = '<p>Lo sentimos, el artículo que buscas no existe o ha sido movido.</p><a href="index.html" class="btn btn-primary" style="margin-top:20px; display:inline-block;">Volver al inicio</a>';
    }
});

// ─────────────────────────────────────────────
//  Hero: el título colapsa al observarlo (scroll)
//  y el indicador de scroll se oculta al bajar
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const title = document.querySelector('.quantum-title');
    const indicator = document.querySelector('.scroll-indicator');
    if (!title && !indicator) return;

    function onScroll() {
        const scrolled = window.scrollY > 40;
        if (title) title.classList.toggle('collapsed', scrolled);
        if (indicator) indicator.classList.toggle('hidden', scrolled);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});

// ─────────────────────────────────────────────
//  Contadores animados (Quiénes somos)
//  El HTML ya trae el número final: sin JS se ve igual.
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.counter[data-target]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

    function animate(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();

        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(function (el) {
        el.textContent = '0';
        observer.observe(el);
    });
});

// ─────────────────────────────────────────────
//  Tablón de Ofertas
// ─────────────────────────────────────────────
function toggleTablon() {
    const extra = document.getElementById('extra-items');
    const btn = document.getElementById('btn-tablon');

    if (extra.style.display === "none") {
        extra.style.display = "block";
        btn.innerText = "Ver menos";
    } else {
        extra.style.display = "none";
        btn.innerText = "Ver tablón completo";
    }
}
