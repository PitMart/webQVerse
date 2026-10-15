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

    // Colores del manual de marca (texturas sobre fondos oscuros), usados en computeFrame:
    //   DEEP  [18, 76, 132]   valles, cercano a #124e94
    //   BASE  [37, 92, 145]   azul medio de la textura del manual
    //   LIGHT [97, 137, 183]  #6189b7, crestas de la seda
    //   TEAL  [14, 88, 132]   reflejo verdoso de los pliegues
    //   LILAC [124, 140, 206] reflejo lavanda de las crestas

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

    // Cálculo de un fotograma. Es autocontenida (no usa variables de fuera) para
    // poder ejecutarse igual en un Web Worker, fuera del hilo principal.
    function computeFrame(data, gw, gh, t, mx, my, e) {
        const D0 = 18, D1 = 76, D2 = 132;        // DEEP
        const BD0 = 19, BD1 = 16, BD2 = 13;      // BASE - DEEP
        const T0 = 14, T1 = 88, T2 = 132;        // TEAL
        const L0 = 97, L1 = 137, L2 = 183;       // LIGHT
        const LL0 = 27, LL1 = 3, LL2 = 23;       // LILAC - LIGHT
        // Escala: varios pliegues por pantalla. En cabeceras bajas y anchas se usa
        // una referencia mínima para que los pliegues no queden demasiado apretados
        const ref = Math.max(gh, gw * 0.55);
        const s = 7.5 / ref;
        const R2 = (ref * 0.2) ** 2;      // radio de influencia del cursor
        const kr = 2.47 * s;              // número de onda de las bandas en celdas
        const useCursor = e > 0.005;
        // Respiración lenta del flujo; con el cursor dentro los pliegues se marcan más
        const amp = (1 + 0.15 * Math.sin(t * 0.37)) * (1 + 0.3 * e);
        const a1 = 0.85 * amp, a2 = 0.6 * amp, a3 = 0.4 * amp, a4 = 0.3 * amp, a5 = 0.2 * amp;
        // Fases que dependen solo del tiempo: se calculan una vez por fotograma
        const tx = t * 0.12, ty = t * 0.05;
        const f1 = t * 0.83 + 1.7, f2 = -t * 0.61 + 2.3, f3 = t * 1.27 + 3.4;
        const f4 = -t * 1.09 + 4.6, f5 = t * 0.53 + 5.1;
        const fb = -t * 0.29, fi = t * 0.4, fr = t * 6;
        let i = 0;
        for (let y = 0; y < gh; y++) {
            // Convergencia hacia el cursor: un desfase que crece con la distancia
            // curva las crestas en anillos centrados en él. El peso cae suave
            // (lorentziana), así las ondas lejanas solo se doblan un poco.
            const dy = y - my, dy2 = dy * dy;
            const py0 = y * s - ty;
            for (let x = 0; x < gw; x++) {
                // Deriva lenta de todo el campo: la seda "corre" en diagonal
                let px = x * s + tx, py = py0;

                let ph = 0;
                if (useCursor) {
                    const dx = x - mx, d2 = dx * dx + dy2;
                    const wgt = e / (1 + d2 / R2);
                    const kd = kr * Math.sqrt(d2);
                    // anillos + pulsos suaves que viajan hacia el cursor
                    ph = wgt * (1.8 * kd + 0.7 * Math.sin(1.2 * kd + fr));
                }

                // Domain warping: cada capa a su propio ritmo, así el patrón nunca se repite igual
                px += a1 * Math.sin(py * 0.9 + f1);
                py += a2 * Math.cos(px * 0.8 + f2);
                px += a3 * Math.sin(py * 1.9 + f3);
                py += a4 * Math.cos(px * 1.7 + f4);
                px += a5 * Math.sin(py * 3.1 + f5);

                // Bandas de la seda con un ligero cambio de ritmo para que no sean paralelas
                const v = 0.5 + 0.5 * Math.sin(px * 0.9 + py * 2.3 + 0.6 * Math.sin(px * 0.45 + fb) + ph);
                const v2 = v * v, v4 = v2 * v2;
                const sheen = v2 * v;                                   // brillo satinado ancho
                const edge = v4 * v4 * v4;                              // filo claro de la cresta
                const w = 1 - v, w2 = w * w;
                const sh = w2 * w2;                                     // sombra en el pliegue
                const iri = 0.5 + 0.5 * Math.sin(py * 1.4 - px * 0.6 + fi); // tono iridiscente

                const a = v * 1.4 > 1 ? 1 : v * 1.4;
                const k = sheen * 0.5 + edge * 0.45;
                const shi = sh * (0.4 + 0.4 * iri);                     // pliegue verdoso
                const li = iri * 0.5;                                   // cresta clara

                let c0 = D0 + BD0 * a, c1 = D1 + BD1 * a, c2 = D2 + BD2 * a;
                c0 += (T0 - c0) * shi; c1 += (T1 - c1) * shi; c2 += (T2 - c2) * shi;
                c0 += (L0 + LL0 * li - c0) * k; c1 += (L1 + LL1 * li - c1) * k; c2 += (L2 + LL2 * li - c2) * k;
                data[i] = c0; data[i + 1] = c1; data[i + 2] = c2; data[i + 3] = 255;
                i += 4;
            }
        }
    }

    function paint() {
        gctx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(grid, 0, 0, canvas.width, canvas.height);
    }

    // Cálculo en el hilo principal (primer fotograma, reduced-motion o sin workers)
    function render(t) {
        computeFrame(img.data, gw, gh, t, mouse.x, mouse.y, energy);
        paint();
    }

    // Web Worker: calcula los fotogramas en otro hilo para que el scroll y los
    // clics no esperen. El hilo principal solo pinta el resultado.
    let worker = null, busy = false, spare = null;
    try {
        if (window.Worker && window.Blob && window.URL) {
            const code = computeFrame.toString() + `
                onmessage = function (m) {
                    const d = m.data, data = new Uint8ClampedArray(d.buf);
                    computeFrame(data, d.gw, d.gh, d.t, d.mx, d.my, d.e);
                    postMessage({ buf: d.buf, gw: d.gw, gh: d.gh }, [d.buf]);
                };`;
            const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
            worker = new Worker(url);
            URL.revokeObjectURL(url);
            worker.onmessage = function (m) {
                busy = false;
                const d = m.data;
                if (d.gw !== gw || d.gh !== gh) return;      // respuesta de antes de un resize
                const fresh = img;
                img = new ImageData(new Uint8ClampedArray(d.buf), gw, gh);
                spare = fresh.data.buffer;                   // se reutiliza en el siguiente envío
                paint();
            };
            worker.onerror = function () { worker = null; busy = false; };
        }
    } catch (err) { worker = null; }

    function requestFrame(t) {
        if (!worker) { render(t); return; }
        if (busy) return;                                    // el anterior aún no ha llegado
        let buf = spare && spare.byteLength === gw * gh * 4 ? spare : new ArrayBuffer(gw * gh * 4);
        spare = null;
        busy = true;
        worker.postMessage({ buf, gw, gh, t, mx: mouse.x, my: mouse.y, e: energy }, [buf]);
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

        requestFrame(clock);
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
