// ─────────────────────────────────────────────────────────────
//  QVERSE · interacciones al hacer scroll
//  Capa de diseño: no cambia el contenido ni las secciones. Si el
//  navegador pide "reducir movimiento" solo se aplican los cambios
//  estáticos (tipografía de marca, barra de navegación).
// ─────────────────────────────────────────────────────────────
(function () {
    'use strict';

    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    if (!reduce) root.classList.add('qv-js');

    // ── 1. Títulos de marca: palabra clave en Poppins, resto en Playfair ──
    var TITLE_SEL = '.section-header h2, .section-title h2, .about-text h2, ' +
        '.join-content h2, .recruitment-intro h2, .page-header h1';

    function splitTitle(h) {
        if (h.dataset.qvTitle) return;
        var text = h.textContent.trim();
        if (!text || text === 'Cargando artículo…') return;
        var words = text.split(/\s+/);
        h.dataset.qvTitle = '1';
        var keyCount = words.length > 6 ? 2 : 1;
        var secWords = words.slice(0, words.length - keyCount);
        var keyWords = words.slice(words.length - keyCount);
        h.setAttribute('aria-label', text);
        h.textContent = '';
        if (secWords.length) {
            var sec = document.createElement('span');
            sec.className = 't-sec';
            sec.setAttribute('aria-hidden', 'true');
            sec.textContent = secWords.join(' ') + ' ';
            h.appendChild(sec);
        }
        var key = document.createElement('span');
        key.className = 't-key';
        key.setAttribute('aria-hidden', 'true');
        key.textContent = keyWords.join(' ');
        h.appendChild(key);
    }

    function splitTitles() {
        $$(TITLE_SEL).forEach(function (h) {
            // El título del artículo se rellena por JS: se trata cuando llega
            if (h.id === 'article-title') return;
            splitTitle(h);
        });
    }

    // ── 2. Barra de progreso, navbar y volver arriba ──
    var bar = document.createElement('div');
    bar.className = 'qv-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var topBtn = document.createElement('button');
    topBtn.type = 'button';
    topBtn.className = 'qv-top';
    topBtn.setAttribute('aria-label', 'Volver arriba');
    topBtn.innerHTML = '&uarr;';
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(topBtn);

    var navbar = $('.navbar');
    var navMenu = $('.nav-menu');
    if (navbar && navMenu && 'MutationObserver' in window) {
        new MutationObserver(function () {
            navbar.classList.toggle('menu-open', navMenu.classList.contains('active'));
        }).observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    }

    // ── 3. Scroll: variables CSS para progreso y parallax ──
    var hero = $('.hero-section');
    var parallax = $$('.hero-section, .page-header, .about-section, .bg-light, footer');
    var visible = new Set();
    var ticking = false;

    if ('IntersectionObserver' in window) {
        var vis = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
            });
            requestTick();
        }, { rootMargin: '20% 0px' });
        parallax.forEach(function (el) { vis.observe(el); });
    } else {
        parallax.forEach(function (el) { visible.add(el); });
    }

    var timelines = $$('.tl-list');
    var dotsDirty = true;
    var wordBlocks = [];

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        var y = window.scrollY || window.pageYOffset;
        var max = document.documentElement.scrollHeight - vh;

        bar.style.setProperty('--progress', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
        if (navbar) navbar.classList.toggle('is-scrolled', y > 24);
        topBtn.classList.toggle('is-visible', y > vh * 0.8);

        if (reduce) return;

        if (hero) {
            var hp = clamp(y / (hero.offsetHeight * 0.85), 0, 1);
            hero.style.setProperty('--hp', hp.toFixed(4));
        }

        visible.forEach(function (el) {
            var r = el.getBoundingClientRect();
            var sp = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
            el.style.setProperty('--sp', clamp(sp, -1, 1).toFixed(4));
        });

        timelines.forEach(function (list) {
            var r = list.getBoundingClientRect();
            var p = clamp((vh * 0.7 - r.top) / r.height, 0, 1);
            list.style.setProperty('--lp', p.toFixed(4));
            list.classList.add('is-live');

            // Un punto se rellena cuando el final de la línea pasa por su centro.
            // La posición del punto dentro de su evento solo cambia al redimensionar:
            // se guarda para no pedir estilos calculados en cada fotograma.
            var fillEnd = r.top + p * r.height;
            if (!list._dots || dotsDirty) {
                list._dots = $$('.tl-item', list).map(function (item) {
                    var dot = window.getComputedStyle(item, '::before');
                    return { el: item, offset: parseFloat(dot.top) + parseFloat(dot.height) / 2 };
                });
            }
            list._dots.forEach(function (d) {
                d.el.classList.toggle('is-passed', fillEnd >= d.el.getBoundingClientRect().top + d.offset);
            });
        });

        dotsDirty = false;

        wordBlocks.forEach(function (block) {
            var r = block.el.getBoundingClientRect();
            // Empieza a iluminarse en cuanto el párrafo asoma por abajo y se lee
            // entero cuando llega más o menos a la mitad de la pantalla
            var p = clamp((vh * 0.95 - r.top) / (vh * 0.33 + r.height * 0.35), 0, 1);
            var lit = Math.round(p * block.words.length);
            if (lit === block.lit) return;
            block.words.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
            block.lit = lit;
        });
    }

    function requestTick() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', function () { dotsDirty = true; requestTick(); });

    // ── 4. Aparición progresiva ──
    var REVEAL_SEL = [
        '.section-header', '.section-title', '.about-text > *', '.stat',
        '.featured-card', '.events-empty', '.partners-title', '.marquee',
        '.card', '.team-member', '.tl-item', '.tl-year', '.offers-intro',
        '.offers-filters', '.offer', '.join-banner', '.collab-logos-wrapper',
        '.list-item', '.position-item', '.recruitment-intro', '.event-item'
    ].join(',');

    var revealIO = null;
    if (!reduce && 'IntersectionObserver' in window) {
        revealIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                revealIO.unobserve(el);
                el.classList.add('is-in');
                // Al terminar, el elemento recupera sus transiciones normales (hover)
                window.setTimeout(function () { el.classList.remove('qv-reveal'); }, 1500);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }

    function scanReveal() {
        if (!revealIO) return;
        $$(REVEAL_SEL).forEach(function (el) {
            if (el.dataset.qv) return;
            // No anima lo que está dentro de un contenedor ya animado
            if (el.parentElement && el.parentElement.closest('.qv-reveal')) return;
            el.dataset.qv = '1';
            var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) {
                return c.matches(REVEAL_SEL);
            }) : [el];
            el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
            el.classList.add('qv-reveal');
            revealIO.observe(el);
        });
    }

    // ── 5. Texto que se ilumina con el scroll (Quiénes somos) ──
    function buildWordBlocks() {
        if (reduce) return;
        $$('.about-text p').forEach(function (p) {
            if (p.dataset.qvWords) return;
            p.dataset.qvWords = '1';
            var text = p.textContent;
            p.setAttribute('aria-label', text.replace(/\s+/g, ' ').trim());
            p.classList.add('qv-words');
            p.textContent = '';
            var words = [];
            text.split(/(\s+)/).forEach(function (chunk) {
                if (!chunk) return;
                if (/^\s+$/.test(chunk)) { p.appendChild(document.createTextNode(' ')); return; }
                var w = document.createElement('span');
                w.className = 'w';
                w.setAttribute('aria-hidden', 'true');
                w.textContent = chunk;
                p.appendChild(w);
                words.push(w);
            });
            wordBlocks.push({ el: p, words: words, lit: -1 });
        });
    }

    // ── 6. Reflejo que sigue al cursor en las tarjetas ──
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('pointermove', function (e) {
            var card = e.target.closest && e.target.closest('.featured-card, .card, .team-member, .stat, .tl-card, .offer-link');
            if (!card) return;
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }

    // ── 7. Puntos laterales de sección (solo en la home) ──
    function buildDots() {
        if (reduce || !hero) return;
        var defs = [
            ['hero', 'Inicio'], ['quienes-somos', 'Quiénes somos'],
            ['proyectos-destacados', 'Proyectos'], ['eventos', 'Eventos'], ['contacto', 'Contacto']
        ];
        var items = defs.map(function (d) { return { el: document.getElementById(d[0]), label: d[1], id: d[0] }; })
            .filter(function (d) { return d.el; });
        if (items.length < 3) return;

        var nav = document.createElement('nav');
        nav.className = 'qv-dots on-dark';
        nav.setAttribute('aria-label', 'Secciones de la página');
        var links = items.map(function (it) {
            var a = document.createElement('a');
            a.href = '#' + it.id;
            a.setAttribute('aria-label', it.label);
            var s = document.createElement('span');
            s.textContent = it.label;
            a.appendChild(s);
            nav.appendChild(a);
            return a;
        });
        document.body.appendChild(nav);

        function spy() {
            var mid = window.innerHeight * 0.45;
            var current = 0;
            items.forEach(function (it, i) {
                if (it.el.getBoundingClientRect().top <= mid) current = i;
            });
            links.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
            // Sobre hero y pie (fondos oscuros) los puntos son claros
            nav.classList.toggle('on-dark', items[current].id === 'hero' || items[current].id === 'contacto');
        }
        // Una vez por fotograma como mucho, aunque lleguen varios eventos de scroll
        var spyQueued = false;
        window.addEventListener('scroll', function () {
            if (spyQueued) return;
            spyQueued = true;
            window.requestAnimationFrame(function () { spyQueued = false; spy(); });
        }, { passive: true });
        spy();
    }

    // ── Menú: marca la página actual (en cada HTML venía "Home" activo) ──
    function markCurrentPage() {
        var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        var isArticle = file === 'articulo.html';
        $$('.nav-link').forEach(function (a) {
            var href = (a.getAttribute('href') || '').toLowerCase();
            if (href.charAt(0) === '#') return;
            var on = !isArticle && href === file;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
    }

    // ── Arranque ──
    function init() {
        markCurrentPage();
        splitTitles();
        buildWordBlocks();
        scanReveal();
        buildDots();
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Contenido que se genera por JS (artículo, tablón, relacionados)
    if ('MutationObserver' in window) {
        var pending = null;
        new MutationObserver(function () {
            if (pending) return;
            pending = window.setTimeout(function () {
                pending = null;
                scanReveal();
                requestTick();
            }, 120);
        }).observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', requestTick);
})();
