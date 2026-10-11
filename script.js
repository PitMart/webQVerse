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
//  Tablón de ofertas (Carreras)
//  Calcula el estado de cada convocatoria según su plazo, ordena las
//  abiertas primero y permite filtrar por tipo. Sin JS se ve la lista
//  completa con el plazo escrito.
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const list = document.querySelector('.offers');
    if (!list) return;

    const items = Array.from(list.querySelectorAll('.offer'));
    const filters = document.querySelector('.offers-filters');
    const moreBtn = document.querySelector('.offers-more');
    const countEl = document.querySelector('.offers-count');
    const VISIBLE = 5;
    const DAY = 86400000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Orden de los estados en el tablón
    const RANK = { soon: 0, open: 1, upcoming: 2, check: 3, closed: 4 };

    items.forEach(function (item) {
        const statusEl = item.querySelector('.offer-status');
        let status = 'check', label = 'Consultar', sortKey = 0;

        if (item.dataset.deadline) {
            const end = new Date(item.dataset.deadline + 'T00:00:00');
            const days = Math.round((end - today) / DAY);
            sortKey = end.getTime();
            if (days < 0) {
                status = 'closed'; label = 'Cerrada';
                sortKey = -sortKey;               // las cerradas más recientes primero
            } else if (days <= 21) {
                status = 'soon';
                label = days === 0 ? 'Cierra hoy' : days === 1 ? 'Cierra mañana' : 'Cierra en ' + days + ' días';
            } else {
                status = 'open'; label = 'Abierta';
            }
        } else if (item.dataset.opens) {
            const start = new Date(item.dataset.opens + 'T00:00:00');
            sortKey = start.getTime();
            if (start > today) { status = 'upcoming'; label = 'Próximamente'; }
        } else if (item.dataset.status === 'open') {
            status = 'open'; label = 'Abierta';
            sortKey = Infinity;                   // abiertas sin plazo, tras las que tienen fecha
        }

        item.dataset.state = status;
        item.dataset.sort = RANK[status] * 1e15 + (isFinite(sortKey) ? sortKey / 1e3 : 9e11);
        statusEl.title = statusEl.textContent.trim();   // conserva el plazo original al pasar el ratón
        statusEl.textContent = label;
    });

    items.sort(function (a, b) { return a.dataset.sort - b.dataset.sort; });
    items.forEach(function (item) { list.appendChild(item); });

    const openCount = items.filter(function (i) { return i.dataset.state === 'open' || i.dataset.state === 'soon'; }).length;
    if (countEl) {
        countEl.textContent = openCount === 1
            ? ' · 1 convocatoria abierta ahora'
            : ' · ' + openCount + ' convocatorias abiertas ahora';
    }

    let filter = 'todas';
    let expanded = false;

    function render() {
        const matching = items.filter(function (i) { return filter === 'todas' || i.dataset.type === filter; });
        items.forEach(function (i) { i.hidden = true; });
        matching.forEach(function (i, idx) { i.hidden = !expanded && idx >= VISIBLE; });
        const hiddenCount = matching.length - VISIBLE;
        moreBtn.hidden = hiddenCount <= 0;
        moreBtn.textContent = expanded ? 'Ver menos' : 'Ver todas las convocatorias (' + matching.length + ')';
    }

    filters.hidden = false;
    filters.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;
        filter = btn.dataset.filter;
        expanded = false;
        filters.querySelectorAll('[data-filter]').forEach(function (b) {
            const active = b === btn;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', active);
        });
        render();
    });

    moreBtn.addEventListener('click', function () {
        expanded = !expanded;
        render();
    });

    render();
});
