// ─────────────────────────────────────────────
//  Fondo del hero: textura holográfica discreta (manual de marca)
//  Seda líquida en azules de la paleta que fluye despacio y se curva
//  alrededor del cursor. Se calcula con "domain warping": se deforman
//  las coordenadas varias veces con senos y luego se pintan bandas suaves.
// ─────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const CELL = 6;          // px CSS por celda de la rejilla de cálculo
    const SPEED = 0.18;      // velocidad del flujo (baja para que no maree)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Colores del manual de marca (texturas sobre fondos oscuros)
    const DEEP  = [18, 76, 132];    // valles, cercano a #124e94
    const BASE  = [37, 92, 145];    // azul medio de la textura del manual
    const LIGHT = [97, 137, 183];   // #6189b7, crestas de la seda
    const TEAL  = [14, 88, 132];    // reflejo verdoso de los pliegues
    const LILAC = [124, 140, 206];  // reflejo lavanda de las crestas

    const grid = document.createElement('canvas');
    const gctx = grid.getContext('2d');
    let gw = 0, gh = 0, img = null;

    // Cursor: posición suavizada y fuerza que aparece/desaparece con easing
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, k: 0, tk: 0 };

    function resize() {
        const rect = hero.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        gw = Math.max(1, Math.ceil(rect.width / CELL));
        gh = Math.max(1, Math.ceil(rect.height / CELL));
        grid.width = gw; grid.height = gh;
        img = gctx.createImageData(gw, gh);
    }

        function render(t) {
        const data = img.data;
        const s = 7.5 / gh;               // escala: varios pliegues por pantalla
        const r2 = (gh * 0.2) ** 2;       // radio de influencia del cursor
        const mx = mouse.x, my = mouse.y, mk = mouse.k;
        const t1 = t * 0.9, t2 = t * 0.7, t3 = t * 0.4;
        let i = 0;
        for (let y = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++) {
                let px = x * s, py = y * s;

                // El cursor empuja la seda hacia fuera, como un dedo sobre tela
                if (mk > 0.001) {
                    const dx = x - mx, dy = y - my;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < r2 * 6) {
                        const f = mk * Math.exp(-d2 / r2) * s * 0.9;
                        px += dx * f;
                        py += dy * f;
                    }
                }

                // Domain warping con senos: pliegues orgánicos tipo mármol líquido
                px += 0.85 * Math.sin(py * 0.9 + t1 + 1.7);
                py += 0.6 * Math.cos(px * 0.8 + t2 + 2.3);
                px += 0.4 * Math.sin(py * 1.9 + t1 + 3.4);
                py += 0.3 * Math.cos(px * 1.7 + t2 + 4.6);
                px += 0.2 * Math.sin(py * 3.1 + t1 + 5.1);

                const v = 0.5 + 0.5 * Math.sin(px * 0.9 + py * 2.3);   // 0 valle, 1 cresta
                const v2 = v * v, v4 = v2 * v2;
                const sheen = v2 * v;                                   // brillo satinado ancho
                const edge = v4 * v4 * v4;                              // filo claro de la cresta
                const w = 1 - v, w2 = w * w;
                const sh = w2 * w2;                                     // sombra en el pliegue
                const iri = 0.5 + 0.5 * Math.sin(py * 1.4 - px * 0.6 + t3); // tono iridiscente

                const a = v * 1.4 > 1 ? 1 : v * 1.4;
                const k = sheen * 0.5 + edge * 0.45;
                for (let c = 0; c < 3; c++) {
                    let col = DEEP[c] + (BASE[c] - DEEP[c]) * a;
                    col += (TEAL[c] - col) * sh * (0.4 + 0.4 * iri);                               // pliegue verdoso
                    col += (LIGHT[c] + (LILAC[c] - LIGHT[c]) * iri * 0.5 - col) * k;      // cresta clara
                    data[i + c] = col;
                }
                data[i + 3] = 255;
                i += 4;
            }
        }
        gctx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(grid, 0, 0, canvas.width, canvas.height);
    }

    // El flujo es lento: 30 fps bastan y ahorran la mitad de CPU
    const FRAME_MS = 1000 / 30;
    let running = false, visible = true, last = 0;
    const start = performance.now();
    function frame(now) {
        if (!running) return;
        requestAnimationFrame(frame);
        if (now - last < FRAME_MS) return;
        last = now;
        mouse.x += (mouse.tx - mouse.x) * 0.1;
        mouse.y += (mouse.ty - mouse.y) * 0.1;
        mouse.k += (mouse.tk - mouse.k) * 0.07;
        render(((now - start) / 1000) * SPEED);
    }
    function updateRunning() {
        const should = visible && !document.hidden && !reduceMotion;
        if (should && !running) { running = true; requestAnimationFrame(frame); }
        else if (!should) running = false;
    }

    hero.addEventListener('pointermove', e => {
        const rect = hero.getBoundingClientRect();
        mouse.tx = (e.clientX - rect.left) / CELL;
        mouse.ty = (e.clientY - rect.top) / CELL;
        if (mouse.tk === 0) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        mouse.tk = 1;
    });
    hero.addEventListener('pointerleave', () => { mouse.tk = 0; });

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
