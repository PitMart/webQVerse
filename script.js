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

    if (navToggle && navMenu) {

        function closeMobileMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
        }

        function updateMobileMenu() {
            if (window.innerWidth <= 768) {
                navMenu.style.display = navMenu.classList.contains('active') ? 'flex' : 'none';
            } else {
                navMenu.style.display = '';
                closeMobileMenu();
            }
        }

        navToggle.addEventListener('click', function () {
            const isOpen = !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
            updateMobileMenu();
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                    updateMobileMenu();
                }
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
                updateMobileMenu();
                navToggle.focus();
            }
        });

        window.addEventListener('resize', updateMobileMenu);
        updateMobileMenu();
    }

    // Cargar artículo dinámico
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const isArticlePage = !!document.getElementById('article-body');

    if (isArticlePage && articleId && articles[articleId]) {
        renderArticle(articleId, articles[articleId]);
    } else if (isArticlePage) {
        const bodyEl = document.getElementById('article-body');
        const titleEl = document.getElementById('article-title');

        if (titleEl) titleEl.textContent = 'Artículo no encontrado';
        document.querySelector('.article-meta')?.setAttribute('hidden', '');
        if (bodyEl) bodyEl.innerHTML = '<p>Lo sentimos, el artículo que buscas no existe o ha sido movido.</p><p><a href="index.html" class="btn btn-primary">Volver al inicio</a></p>';
    }
});

// ─────────────────────────────────────────────
//  Página de artículo
// ─────────────────────────────────────────────

// Sección de la web a la que pertenece cada colección de artículos
const ARTICLE_SECTIONS = [
    { list: typeof proyectosArticles !== 'undefined' ? proyectosArticles : {}, label: 'Proyectos', href: 'proyectos.html' },
    { list: typeof carrerasArticles !== 'undefined' ? carrerasArticles : {}, label: 'Carreras', href: 'carreras.html' },
    { list: typeof eventosArticles !== 'undefined' ? eventosArticles : {}, label: 'Eventos', href: 'eventos.html' },
    { list: typeof alumniArticles !== 'undefined' ? alumniArticles : {}, label: 'Eventos', href: 'eventos.html' },
];

function sectionOf(id) {
    return ARTICLE_SECTIONS.find(function (sec) { return Object.prototype.hasOwnProperty.call(sec.list, id); });
}

function slugify(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function renderArticle(id, article) {
    const $ = function (sel) { return document.getElementById(sel); };
    const section = sectionOf(id);

    $('article-title').textContent = article.title;
    $('article-category').textContent = article.category;
    $('article-author').textContent = article.author || 'Quantum Verse';
    $('article-date').textContent = article.date || '';
    $('breadcrumb-title').textContent = article.title;
    document.title = article.title + ' - QVerse';

    if (section) {
        const crumb = $('breadcrumb-section');
        crumb.textContent = section.label;
        crumb.href = section.href;
        const back = $('article-back');
        back.textContent = '\u2190 Volver a ' + section.label;
        back.href = section.href;
        $('article-footer').hidden = false;

        // El menú marca la sección del artículo
        document.querySelectorAll('.nav-link').forEach(function (link) {
            const active = link.getAttribute('href') === section.href;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
    }

    // Cuerpo: entradilla + contenido
    const bodyEl = $('article-body');
    bodyEl.innerHTML = (article.lead ? '<p class="article-lead">' + article.lead + '</p>' : '') + article.body;
    if (id === 'niebla') bodyEl.classList.add('article-niebla');
    if (window.instgrm) window.instgrm.Embeds.process();

    // Tiempo de lectura (unas 200 palabras por minuto)
    const words = bodyEl.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    $('article-reading').textContent = minutes + ' min de lectura';
    $('article-reading').hidden = false;
    $('article-reading-sep').hidden = false;

    buildToc(bodyEl);
    buildRelated(id, section);
}

// Índice lateral a partir de los apartados (h2) del artículo
function buildToc(bodyEl) {
    const headings = Array.from(bodyEl.querySelectorAll('h2'));
    if (headings.length < 3) return;

    const list = document.getElementById('article-toc-list');
    const links = headings.map(function (h, i) {
        if (!h.id) h.id = slugify(h.textContent) || 'apartado-' + (i + 1);
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.trim();
        li.appendChild(a);
        list.appendChild(li);
        return a;
    });

    document.getElementById('article-toc').hidden = false;
    document.getElementById('article-layout').classList.add('has-toc');

    // Resalta el apartado que se está leyendo
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const idx = headings.indexOf(entry.target);
            links.forEach(function (a, i) { a.classList.toggle('is-active', i === idx); });
        });
    }, { rootMargin: '-90px 0px -70% 0px' });
    headings.forEach(function (h) { observer.observe(h); });
}

// "Sigue leyendo": otros artículos de la misma sección
function buildRelated(id, section) {
    if (!section) return;
    // Reúne todas las colecciones de la misma sección (Eventos incluye alumni)
    const pool = {};
    ARTICLE_SECTIONS.forEach(function (sec) {
        if (sec.label === section.label) Object.assign(pool, sec.list);
    });
    const others = Object.keys(pool).filter(function (key) { return key !== id && !pool[key].oculto; }).slice(0, 3);
    if (!others.length) return;

    const grid = document.getElementById('article-related-grid');
    others.forEach(function (key) {
        const item = pool[key];
        const imgMatch = /<img[^>]+src="([^"]+)"/.exec(item.body || '');
        const media = imgMatch
            ? '<img src="' + imgMatch[1] + '" alt="" loading="lazy" />'
            : '<span class="related-placeholder" aria-hidden="true"></span>';
        const card = document.createElement('article');
        card.className = 'featured-card';
        card.innerHTML =
            '<a href="articulo.html?id=' + encodeURIComponent(key) + '" class="featured-link">' +
                '<div class="featured-media">' + media + '</div>' +
                '<div class="featured-body">' +
                    '<span class="area"></span><h3></h3>' +
                    '<span class="read-more">Leer artículo &rarr;</span>' +
                '</div>' +
            '</a>';
        card.querySelector('.area').textContent = item.category || section.label;
        card.querySelector('h3').textContent = item.title;
        // Si la miniatura no carga, se usa el fondo de marca
        const img = card.querySelector('.featured-media img');
        if (img) img.addEventListener('error', function () {
            img.replaceWith(Object.assign(document.createElement('span'), { className: 'related-placeholder' }));
        });
        grid.appendChild(card);
    });

    document.getElementById('article-related-sub').textContent = 'Más artículos de ' + section.label.toLowerCase();
    document.getElementById('article-related').hidden = false;
}

// ─────────────────────────────────────────────
//  Hero: el indicador de scroll se oculta al bajar
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    function onScroll() {
        const scrolled = window.scrollY > 40;
        indicator.classList.toggle('hidden', scrolled);
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
