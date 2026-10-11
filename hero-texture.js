// ─────────────────────────────────────────────
//  Fondo del hero: textura holográfica discreta (manual de marca)
//  Seda líquida en azules de la paleta que fluye sola; cerca del cursor
//  las ondas se curvan y convergen en él. Se calcula con "domain warping":
//  se deforman las coordenadas varias veces con senos y luego se pintan
//  bandas suaves.
// ─────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const CELL = 6;          // px CSS por celda de la rejilla de cálculo
    const SPEED = 0.3;       // velocidad base del flujo (lenta para que no maree)
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

    // Cursor: posición suavizada y energía (0 fuera, 1 dentro, con transición suave)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
    let energy = 0;

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
        const R2 = (gh * 0.2) ** 2;       // radio de influencia del cursor
        const kr = 2.47 * s;              // número de onda de las bandas en celdas
        const mx = mouse.x, my = mouse.y, e = energy;
        // Respiración lenta del flujo; con el cursor dentro los pliegues se marcan más
        const amp = (1 + 0.15 * Math.sin(t * 0.37)) * (1 + 0.3 * e);
        const a1 = 0.85 * amp, a2 = 0.6 * amp, a3 = 0.4 * amp, a4 = 0.3 * amp, a5 = 0.2 * amp;
        let i = 0;
        for (let y = 0; y < gh; y++) {
            // Convergencia hacia el cursor: un desfase que crece con la distancia
            // curva las crestas en anillos centrados en él. El peso cae suave
            // (lorentziana), así las ondas lejanas solo se doblan un poco.
            const dy = y - my, dy2 = dy * dy;
            for (let x = 0; x < gw; x++) {
                // Deriva lenta de todo el campo: la seda "corre" en diagonal
                let px = x * s + t * 0.12, py = y * s - t * 0.05;

                let ph = 0;
                if (e > 0.005) {
                    const dx = x - mx, d2 = dx * dx + dy2;
                    const wgt = e / (1 + d2 / R2);
                    const kd = kr * Math.sqrt(d2);
                    // anillos + pulsos suaves que viajan hacia el cursor
                    ph = wgt * (1.8 * kd + 0.7 * Math.sin(1.2 * kd + t * 6));
                }

                // Domain warping: cada capa a su propio ritmo, así el patrón nunca se repite igual
                px += a1 * Math.sin(py * 0.9 + t * 0.83 + 1.7);
                py += a2 * Math.cos(px * 0.8 - t * 0.61 + 2.3);
                px += a3 * Math.sin(py * 1.9 + t * 1.27 + 3.4);
                py += a4 * Math.cos(px * 1.7 - t * 1.09 + 4.6);
                px += a5 * Math.sin(py * 3.1 + t * 0.53 + 5.1);

                // Bandas de la seda con un ligero cambio de ritmo para que no sean paralelas
                const v = 0.5 + 0.5 * Math.sin(px * 0.9 + py * 2.3 + 0.6 * Math.sin(px * 0.45 - t * 0.29) + ph);
                const v2 = v * v, v4 = v2 * v2;
                const sheen = v2 * v;                                   // brillo satinado ancho
                const edge = v4 * v4 * v4;                              // filo claro de la cresta
                const w = 1 - v, w2 = w * w;
                const sh = w2 * w2;                                     // sombra en el pliegue
                const iri = 0.5 + 0.5 * Math.sin(py * 1.4 - px * 0.6 + t * 0.4); // tono iridiscente

                const a = v * 1.4 > 1 ? 1 : v * 1.4;
                const k = sheen * 0.5 + edge * 0.45;
                for (let c = 0; c < 3; c++) {
                    let col = DEEP[c] + (BASE[c] - DEEP[c]) * a;
                    col += (TEAL[c] - col) * sh * (0.4 + 0.4 * iri);                   // pliegue verdoso
                    col += (LIGHT[c] + (LILAC[c] - LIGHT[c]) * iri * 0.5 - col) * k;  // cresta clara
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
    let running = false, visible = true, last = 0, clock = 0;
    function frame(now) {
        if (!running) return;
        requestAnimationFrame(frame);
        if (now - last < FRAME_MS) return;
        const dt = Math.min(now - last, 100) / 1000;
        last = now;

        // Con el cursor dentro el flujo gana energía poco a poco (más rápido y marcado)
        energy += ((mouse.inside ? 1 : 0) - energy) * 0.03;
        clock += dt * SPEED * (1 + 0.9 * energy);

        // Posición suavizada: los anillos siguen al cursor con algo de inercia
        mouse.x += (mouse.tx - mouse.x) * 0.12;
        mouse.y += (mouse.ty - mouse.y) * 0.12;

        render(clock);
    }
    function updateRunning() {
        const should = visible && !document.hidden && !reduceMotion;
        if (should && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
        else if (!should) running = false;
    }

    hero.addEventListener('pointermove', e => {
        const rect = hero.getBoundingClientRect();
        mouse.tx = (e.clientX - rect.left) / CELL;
        mouse.ty = (e.clientY - rect.top) / CELL;
        if (!mouse.inside) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        mouse.inside = true;
    });
    hero.addEventListener('pointerleave', () => { mouse.inside = false; });

    window.addEventListener('resize', () => { resize(); if (!running) render(clock); });
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
