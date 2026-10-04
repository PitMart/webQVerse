// ─────────────────────────────────────────────
//  Fondo del hero: interferencia de doble rendija
//  Dos fuentes puntuales emiten ondas circulares; la segunda sigue al cursor.
//  ψ = cos(k·r1 − ωt)/√r1' + cos(k·r2 − ωt)/√r2'   →   I = ψ²
// ─────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const CELL = 6;            // px CSS por celda de la rejilla de cálculo
    const WAVELENGTH = 80;     // longitud de onda en px CSS (franjas anchas y tranquilas)
    const OMEGA = 0.8;         // frecuencia angular (rad/s), lenta para no marear
    const K = (2 * Math.PI * CELL) / WAVELENGTH;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Colores tomados de la paleta CSS
    const css = getComputedStyle(document.documentElement);
    const hex = (v, fb) => {
        const m = (css.getPropertyValue(v).trim() || fb).match(/\w\w/g);
        return m.map(h => parseInt(h, 16));
    };
    const BG = [0, 20, 40];
    const MID = hex('--primary-color', '#003366');
    const PEAK = hex('--accent-color', '#00bcd4');

    // Rejilla de baja resolución que se escala al canvas visible
    const grid = document.createElement('canvas');
    const gctx = grid.getContext('2d');
    let gw = 0, gh = 0, img = null;

    const s1 = { x: 0, y: 0 };
    const s2 = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let pointerInside = false;

    function restPositions() {
        const d = Math.max(gh * 0.16, 6);
        s1.x = gw * 0.12; s1.y = gh / 2 - d / 2;
        return { x: gw * 0.12, y: gh / 2 + d / 2 };
    }

    function resize() {
        const rect = hero.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        gw = Math.max(1, Math.ceil(rect.width / CELL));
        gh = Math.max(1, Math.ceil(rect.height / CELL));
        grid.width = gw; grid.height = gh;
        img = gctx.createImageData(gw, gh);
        const rest = restPositions();
        if (!pointerInside) { target.x = rest.x; target.y = rest.y; }
        s2.x = target.x; s2.y = target.y;
    }

    function render(t) {
        const data = img.data;
        const wt = OMEGA * t;
        const soft = gh * 0.25;  // atenuación suave para que las franjas lleguen lejos
        let i = 0;
        for (let y = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++) {
                const r1 = Math.hypot(x - s1.x, y - s1.y);
                const r2 = Math.hypot(x - s2.x, y - s2.y);
                const psi = Math.cos(K * r1 - wt) / Math.sqrt(1 + r1 / soft)
                          + Math.cos(K * r2 - wt) / Math.sqrt(1 + r2 / soft);
                const v = Math.min(1, (psi * psi) / 4);
                // fondo → azul primario → acento (contenido para no restar legibilidad)
                const a = Math.min(1, v * 1.4) * 0.75, b = Math.max(0, v - 0.6) * 0.6;
                data[i]     = BG[0] + (MID[0] - BG[0]) * a + (PEAK[0] - MID[0]) * b;
                data[i + 1] = BG[1] + (MID[1] - BG[1]) * a + (PEAK[1] - MID[1]) * b;
                data[i + 2] = BG[2] + (MID[2] - BG[2]) * a + (PEAK[2] - MID[2]) * b;
                data[i + 3] = 255;
                i += 4;
            }
        }
        gctx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(grid, 0, 0, canvas.width, canvas.height);
    }

    let running = false, visible = true, start = performance.now();
    function frame(now) {
        if (!running) return;
        s2.x += (target.x - s2.x) * 0.03;
        s2.y += (target.y - s2.y) * 0.03;
        render((now - start) / 1000);
        requestAnimationFrame(frame);
    }
    function updateRunning() {
        const should = visible && !document.hidden && !reduceMotion;
        if (should && !running) { running = true; requestAnimationFrame(frame); }
        else if (!should) running = false;
    }

    hero.addEventListener('pointermove', e => {
        const rect = hero.getBoundingClientRect();
        pointerInside = true;
        target.x = (e.clientX - rect.left) / CELL;
        target.y = (e.clientY - rect.top) / CELL;
        if (reduceMotion) { s2.x = target.x; s2.y = target.y; render(0); }
    });
    hero.addEventListener('pointerleave', () => {
        pointerInside = false;
        const rest = restPositions();
        target.x = rest.x; target.y = rest.y;
        if (reduceMotion) { s2.x = rest.x; s2.y = rest.y; render(0); }
    });

    window.addEventListener('resize', () => { resize(); if (!running) render(0); });
    document.addEventListener('visibilitychange', updateRunning);
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            updateRunning();
        }).observe(hero);
    }

    resize();
    render(0);
    updateRunning();
})();
