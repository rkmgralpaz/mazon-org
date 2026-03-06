/**
 * app.js – Postcards Wall
 * ============================================================
 * Modules:
 *   initIntro()    – intro screen with zoom-in transition
 *   initWall()     – render postcards in scattered grid layout
 *   initPanZoom()  – mouse drag (pan) + wheel (zoom) via rAF
 *   initSlider()   – fullscreen modal with roulette physics slider
 *   openSlide(i)   – open slider at index i
 *   stepCard(dir)  – physics-based roulette navigation
 *   notifyParent() – postMessage to WordPress parent
 *   init()         – bootstrap: read ?slide=, skip intro if set
 * ============================================================
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN – Editar estos valores según necesidad
   ─────────────────────────────────────────────────────────
   Todas las constantes ajustables están centralizadas aquí.
   No modificar lógica interna para cambiar comportamiento.
   ══════════════════════════════════════════════════════════ */

// ==========================
// WALL — ZOOM
// ==========================
var ZOOM_STEP = 0.3;            // Incremento por click de zoom (0.3 = 30%)
var MAX_SCALE = 2.0;            // Zoom máximo permitido en el muro.
// Valores recomendados: 1.5 (conservador), 2.0, 2.5, 3.0 (muy cercano)

// ==========================
// WALL — DISTRIBUCIÓN FRONT/BACK
// ==========================
var FRONTS_PER_BLOCK = 4;       // Cantidad de cards mostrando FRONT por cada bloque
var BLOCK_SIZE = 24;            // Tamaño del bloque de distribución

// ==========================
// WALL — CARGA PROGRESIVA (LQIP)
// ==========================
var LQIP_STAGGER_PER_ROW = 40;  // ms de delay por fila para carga progresiva
var LQIP_JITTER_MAX = 100;      // ms de jitter aleatorio adicional

// ==========================
// SLIDER — ROULETTE PHYSICS
// ==========================
var FRICTION = 0.92;                // per-frame friction (lower = stops sooner)
var SNAP_VEL_THRESHOLD = 0.005;     // velocity below this triggers snap
var SNAP_LERP = 0.06;              // lerp factor for smooth snap (lower = slower, gentler)
var SNAP_SETTLE = 0.001;           // position threshold to consider settled
var RUBBER_BAND = 0.2;              // edge resistance factor
var DRAG_PIXELS_PER_CARD = 500;     // pixels of drag = 1 card
var VELOCITY_SAMPLE_MS = 100;       // window for velocity sampling
var WHEEL_SENSITIVITY = 0.001;      // wheel delta → velocity
var MAX_VELOCITY = 0.4;             // max cards/frame velocity cap
var FLIP_DURATION = 600;            // ms for flip animation

// ==========================
// SLIDER — ARROWS / BUTTONS
// ==========================
var ARROW_REPEAT_INITIAL = 220;     // ms before first repeat when holding
var ARROW_REPEAT_MIN = 70;          // ms minimum repeat interval
var ARROW_REPEAT_ACCEL = 0.8;       // multiply interval each repeat

// ==========================
// SLIDER — ROULETTE LAYOUT
// ==========================
var CARD_SPACING_VW = 52.3;         // vw between card centers (matches v1 CSS translateX)
var SIDE_SCALE = 0.595;             // scale of adjacent cards (matches v1 CSS)
var SIDE_TILT = 2;                  // degrees of rotation for side cards
var MAX_VISIBLE_CARDS = 1;          // only prev+next visible
var POOL_SIZE = 5;                  // DOM card elements in the pool

// ==========================
// SLIDER — APERTURA (FLY-IN)
// ==========================
var FLY_IN_FLIP_DELAY = 800;   // ms que la carta central espera antes de hacer flip al abrir
// (solo aplica a cartas que vienen en FRONT desde el muro)
var LATERAL_APPEAR_DELAY = 100; // ms después de que aterriza la central → prev/next deslizan hacia adentro

// ==========================
// SLIDER — CIERRE (FLY-BACK)
// ==========================
var CLOSE_ANIMATION = 'fly-back'; // 'fly-back' | 'none'

/* ------------------------------------------------------------------
   FRONT IMAGES
   Randomly assigned to postcards. May repeat.
------------------------------------------------------------------ */
var FRONTS = [
    'postcards/Front/front-01.webp',
    'postcards/Front/front-02.webp',
    'postcards/Front/front-03.webp',
    'postcards/Front/front-04.webp',
    'postcards/Front/front-05.webp',
    'postcards/Front/front-english.webp',
    'postcards/Front/front-hebrew.webp',
    'postcards/Front/front-outline.webp',
    'postcards/Front/front-pride-1.webp',
    'postcards/Front/front-pride-2.webp',
    'postcards/Front/front-spanish.webp',
    'postcards/Front/front-trans-1.webp',
    'postcards/Front/front-trans-2.webp',
];

var FRONT_THUMBS = FRONTS.map(function (f) {
    var parts = f.split('/');
    return parts[0] + '/' + parts[1] + '/thumbs/' + parts[2];
});

var FRONT_LQIPS = FRONTS.map(function (f) {
    var parts = f.split('/');
    return parts[0] + '/' + parts[1] + '/lqip/' + parts[2];
});

/* ------------------------------------------------------------------
   POSTCARD DATA
------------------------------------------------------------------ */
var POSTCARDS = (function () {
    var list = [];
    for (var i = 1; i <= 29; i++) {
        var n = String(i).padStart(3, '0');
        var frontIdx = Math.floor(Math.random() * FRONTS.length);
        list.push({
            slug: 'postcard-' + n,
            file: 'postcards/Selects/postcard-' + n + '.webp',
            thumbFile: 'postcards/Selects/thumbs/postcard-' + n + '.webp',
            lqipFile: 'postcards/Selects/lqip/postcard-' + n + '.webp',
            frontFile: FRONTS[frontIdx],
            frontThumb: FRONT_THUMBS[frontIdx],
            frontLqip: FRONT_LQIPS[frontIdx],
            face: 'back',
        });
    }
    return list;
})();

/* ------------------------------------------------------------------
   FRONT/BACK DISTRIBUTION
   For every block of BLOCK_SIZE cards, pick FRONTS_PER_BLOCK
   random positions to show as front. Uses Fisher-Yates shuffle.
------------------------------------------------------------------ */
(function distributeFronts() {
    for (var b = 0; b < POSTCARDS.length; b += BLOCK_SIZE) {
        var blockLen = Math.min(BLOCK_SIZE, POSTCARDS.length - b);
        var indices = [];
        for (var j = 0; j < blockLen; j++) indices.push(j);
        for (var k = indices.length - 1; k > 0; k--) {
            var r = Math.floor(Math.random() * (k + 1));
            var tmp = indices[k]; indices[k] = indices[r]; indices[r] = tmp;
        }
        for (var f = 0; f < Math.min(FRONTS_PER_BLOCK, blockLen); f++) {
            POSTCARDS[b + indices[f]].face = 'front';
        }
    }
})();

/* ------------------------------------------------------------------
   LAYOUT CONFIG
------------------------------------------------------------------ */
var LAYOUT = {
    cols: 8,
    cardWidth: 233,
    cardHeight: 154,
    colGap: 74,
    rowGap: 54,
    jitterX: 30,
    jitterY: 20,
    rotationMax: 3.5,
    padding: 50,
};

/* ------------------------------------------------------------------
   STATE
------------------------------------------------------------------ */
var state = {
    currentSlide: -1,
    isInIframe: window.self !== window.top,
};

/* ------------------------------------------------------------------
   DOM REFERENCES
------------------------------------------------------------------ */
var dom = {
    wallContainer: document.getElementById('wall-container'),
    wallCanvas: document.getElementById('wall-canvas'),
    sliderModal: document.getElementById('slider-modal'),
    sliderNav: document.getElementById('slider-nav'),
    sliderClose: document.getElementById('slider-close'),
    sliderPrev: document.getElementById('slider-prev'),
    sliderNext: document.getElementById('slider-next'),
    sliderCurrent: document.getElementById('slider-current'),
    sliderTotal: document.getElementById('slider-total'),
    sliderTrack: document.getElementById('slider-track'),
    sliderLive: document.getElementById('slider-live'),
    zoomIn: document.getElementById('zoom-in-btn'),
    zoomOut: document.getElementById('zoom-out-btn'),
};

/* Intro removed — lives in WordPress (page-postcards-intro.php) */

function revealWall(animateIn) {
    dom.wallContainer.classList.add('is-visible');
    if (typeof animateIn === 'function') {
        animateIn();
    }
}

/* ================================================================
   MODULE: WALL
   ================================================================ */
function initWall() {
    var cols = LAYOUT.cols;
    var cardW = LAYOUT.cardWidth;
    var cardH = LAYOUT.cardHeight;
    var colGap = LAYOUT.colGap;
    var rowGap = LAYOUT.rowGap;
    var jX = LAYOUT.jitterX;
    var jY = LAYOUT.jitterY;
    var rotMax = LAYOUT.rotationMax;
    var pad = LAYOUT.padding;

    var rows = Math.ceil(POSTCARDS.length / cols);
    var canvasW = cols * (cardW + colGap) - colGap + pad * 2;
    var canvasH = rows * (cardH + rowGap) - rowGap + pad * 2;

    dom.wallCanvas.style.width = canvasW + 'px';
    dom.wallCanvas.style.height = canvasH + 'px';

    var seed = 42;
    function rand(min, max) {
        seed = (seed * 9301 + 49297) % 233280;
        return min + (seed / 233280) * (max - min);
    }

    POSTCARDS.forEach(function (card, index) {
        var col = index % cols;
        var row = Math.floor(index / cols);

        var baseX = pad + col * (cardW + colGap);
        var baseY = pad + row * (cardH + rowGap);

        var jitterX = rand(-jX, jX);
        var jitterY = rand(-jY, jY);
        var rotation = rand(-rotMax, rotMax);

        var isFront = card.face === 'front';

        var el = document.createElement('div');
        el.className = 'postcard-item';
        el.dataset.index = index;
        el.dataset.face = card.face;
        el.style.left = (baseX + jitterX) + 'px';
        el.style.top = (baseY + jitterY) + 'px';
        el.style.width = cardW + 'px';
        el.style.height = cardH + 'px';
        /* Rotation via CSS custom property — CSS :hover rule reads --hover-rotation.
         * No inline style.transform so the CSS hover rule can override cleanly. */
        el.style.setProperty('--rotation', rotation + 'deg');
        /* Pre-compute hover rotation: independent random value in same range */
        el.style.setProperty('--hover-rotation', rand(-rotMax, rotMax) + 'deg');

        /* Accessibility: keyboard-navigable, labeled with postcard message */
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        var altKey = 'postcard-' + String(index + 1).padStart(3, '0') + '.webp';
        el.setAttribute('aria-label', POSTCARD_ALTS[altKey] || 'Postcard ' + (index + 1));
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var idx = parseInt(this.dataset.index, 10);
                openSlide(idx, this);
            }
        });

        var flipper = document.createElement('div');
        flipper.className = 'postcard-flipper';

        // Front face
        var frontFace = document.createElement('div');
        frontFace.className = 'postcard-face postcard-face--front';
        var frontImg = document.createElement('img');
        frontImg.src = card.frontLqip;
        frontImg.dataset.thumb = card.frontThumb;
        frontImg.alt = (POSTCARD_ALTS['postcard-' + String(index + 1).padStart(3, '0') + '.webp'] || 'Postcard ' + (index + 1)) + ' (front)';
        frontImg.loading = 'lazy';
        frontImg.className = 'is-lqip';
        frontFace.appendChild(frontImg);

        // Back face
        var backFace = document.createElement('div');
        backFace.className = 'postcard-face postcard-face--back';
        var backImg = document.createElement('img');
        backImg.src = card.lqipFile;
        backImg.dataset.thumb = card.thumbFile;
        backImg.alt = POSTCARD_ALTS['postcard-' + String(index + 1).padStart(3, '0') + '.webp'] || 'Postcard ' + (index + 1);
        backImg.loading = 'lazy';
        backImg.className = 'is-lqip';
        backFace.appendChild(backImg);

        flipper.appendChild(frontFace);
        flipper.appendChild(backFace);
        el.appendChild(flipper);
        dom.wallCanvas.appendChild(el);

        // Progressive loading with stagger
        var delay = row * LQIP_STAGGER_PER_ROW + Math.random() * LQIP_JITTER_MAX;
        loadThumbWithDelay(backImg, delay);
        if (isFront) {
            loadThumbWithDelay(frontImg, delay);
        }
    });

    dom.sliderTotal.textContent = POSTCARDS.length;
}

function loadThumbWithDelay(imgEl, delay) {
    setTimeout(function () {
        var thumbSrc = imgEl.dataset.thumb;
        if (!thumbSrc) return;
        var loader = new Image();
        loader.onload = function () {
            imgEl.src = thumbSrc;
            imgEl.getBoundingClientRect();
            imgEl.classList.remove('is-lqip');
        };
        loader.src = thumbSrc;
    }, delay);
}

/* ================================================================
   MODULE: PAN & ZOOM
   ================================================================ */
function initPanZoom() {
    var LERP_BASE = 0.08;
    var LERP_ENTER = 0.03;
    var TARGET_MS = 1000 / 60;
    var lastFrameTime = 0;

    var SETTLE_THRESHOLD = 0.05;
    var isAnimating = false;

    var canvasW = parseFloat(dom.wallCanvas.style.width) || 2000;
    var canvasH = parseFloat(dom.wallCanvas.style.height) || 2000;

    var headerH = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')
    ) || 0;
    var vpW = dom.wallContainer.offsetWidth;
    var vpH = dom.wallContainer.offsetHeight - headerH;

    var containerRect = dom.wallContainer.getBoundingClientRect();
    window.addEventListener('resize', function () {
        containerRect = dom.wallContainer.getBoundingClientRect();
        vpW = dom.wallContainer.offsetWidth;
        vpH = dom.wallContainer.offsetHeight - headerH;
        MIN_SCALE = Math.max(vpW / canvasW, vpH / canvasH);
        var clamped = clampPan(targetX, targetY, targetScale);
        targetX = clamped.x;
        targetY = clamped.y;
        scheduleFrame();
    });

    var MIN_SCALE = Math.max(vpW / canvasW, vpH / canvasH);

    function clampPan(x, y, s) {
        var minX = Math.min(0, vpW - canvasW * s);
        var maxX = Math.max(0, vpW - canvasW * s);
        var minY = Math.min(0, vpH - canvasH * s);
        var maxY = Math.max(0, vpH - canvasH * s);
        return {
            x: Math.min(maxX, Math.max(minX, x)),
            y: Math.min(maxY, Math.max(minY, y)),
        };
    }

    function commitTransform() {
        dom.wallCanvas.style.transform =
            'translate3d(' + panX + 'px,' + panY + 'px,0) scale(' + scale + ')';
    }

    var targetWidth = 5 * LAYOUT.cardWidth + 4 * LAYOUT.colGap;
    var targetHeight = 4 * LAYOUT.cardHeight + 3 * LAYOUT.rowGap;
    var scaleX = vpW / targetWidth;
    var scaleY = vpH / targetHeight;
    var initialScale = Math.min(scaleX, scaleY);
    initialScale = Math.max(initialScale, MIN_SCALE);

    var initialX = (vpW - canvasW * initialScale) / 2;
    var initialY = (vpH - canvasH * initialScale) / 2;
    var startPos = clampPan(initialX, initialY, initialScale);

    var panX = startPos.x, panY = startPos.y, scale = initialScale;
    var targetX = startPos.x, targetY = startPos.y, targetScale = initialScale;

    var isDragging = false;
    var dragStartX = 0, dragStartY = 0;
    var dragOriginX = 0, dragOriginY = 0;

    dom.wallCanvas.style.transformOrigin = '0 0';

    function animateIn() {
        var farScale = MIN_SCALE;
        var farX = (vpW - canvasW * farScale) / 2;
        var farY = (vpH - canvasH * farScale) / 2;
        var farPos = clampPan(farX, farY, farScale);

        panX = farPos.x;
        panY = farPos.y;
        scale = farScale;

        targetX = startPos.x;
        targetY = startPos.y;
        targetScale = initialScale;
        entranceActive = true;
        scheduleFrame();
    }

    commitTransform();

    var entranceActive = false;

    function scheduleFrame() {
        if (!isAnimating) {
            isAnimating = true;
            lastFrameTime = performance.now();
            requestAnimationFrame(applyTransform);
        }
    }

    function applyTransform(timestamp) {
        var now = timestamp || performance.now();
        var dt = Math.min(now - lastFrameTime, 64);
        lastFrameTime = now;

        var base = entranceActive ? LERP_ENTER : LERP_BASE;
        var lerpFactor = 1 - Math.pow(1 - base, dt / TARGET_MS);

        var dX = targetX - panX;
        var dY = targetY - panY;
        var dS = targetScale - scale;

        if (Math.abs(dX) < SETTLE_THRESHOLD &&
            Math.abs(dY) < SETTLE_THRESHOLD &&
            Math.abs(dS) < SETTLE_THRESHOLD * 0.001) {
            panX = targetX; panY = targetY; scale = targetScale;
            commitTransform();
            isAnimating = false;
            entranceActive = false;
            return;
        }

        panX += dX * lerpFactor;
        panY += dY * lerpFactor;
        scale += dS * lerpFactor;
        commitTransform();
        requestAnimationFrame(applyTransform);
    }

    /* ---- Zoom button helpers ---- */
    function zoomByStep(direction) {
        entranceActive = false;
        momentumActive = false;
        var centerX = vpW / 2;
        var centerY = vpH / 2;
        var newScale;
        if (direction > 0) {
            newScale = Math.min(MAX_SCALE, targetScale * (1 + ZOOM_STEP));
        } else {
            newScale = Math.max(MIN_SCALE, targetScale / (1 + ZOOM_STEP));
        }
        var scaleRatio = newScale / targetScale;
        var newX = centerX - scaleRatio * (centerX - targetX);
        var newY = centerY - scaleRatio * (centerY - targetY);
        var clamped = clampPan(newX, newY, newScale);
        targetX = clamped.x;
        targetY = clamped.y;
        targetScale = newScale;
        scheduleFrame();
    }

    if (dom.zoomIn) dom.zoomIn.addEventListener('click', function () { zoomByStep(1); });
    if (dom.zoomOut) dom.zoomOut.addEventListener('click', function () { zoomByStep(-1); });

    /* ---- Drag (pan) ---- */
    var DRAG_THRESHOLD = 5;
    var MOMENTUM_DECAY = 0.92;
    var MOMENTUM_MIN = 0.3;
    var VEL_WINDOW_MS = 100;

    var pointerMoved = false;
    var pendingClickTarget = null;
    var velX = 0, velY = 0;
    var velSamples = [];
    var momentumActive = false;

    /* ── Prefetch full-res on hover / touch — head start before click ── */
    var lastPrefetchedIdx = -1;
    dom.wallContainer.addEventListener('pointerenter', function (e) {
        var el = e.target.closest('.postcard-item');
        if (!el) return;
        var idx = parseInt(el.dataset.index, 10);
        if (idx !== lastPrefetchedIdx) {
            lastPrefetchedIdx = idx;
            preloadSliderImages(idx);
        }
    }, true);

    dom.wallContainer.addEventListener('mousedown', function (e) {
        if (e.target.closest('.zoom-controls')) return;
        isDragging = true;
        pointerMoved = false;
        momentumActive = false;
        entranceActive = false;
        velSamples = [];
        velX = 0; velY = 0;
        pendingClickTarget = e.target.closest('.postcard-item');
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragOriginX = targetX;
        dragOriginY = targetY;
        dom.wallContainer.classList.add('is-dragging');
        e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        var dx = e.clientX - dragStartX;
        var dy = e.clientY - dragStartY;

        if (!pointerMoved && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
            pointerMoved = true;
            pendingClickTarget = null;
        }

        var now = performance.now();
        velSamples.push({ x: e.clientX, y: e.clientY, t: now });
        while (velSamples.length > 1 && now - velSamples[0].t > VEL_WINDOW_MS) {
            velSamples.shift();
        }

        var clamped = clampPan(dragOriginX + dx, dragOriginY + dy, targetScale);
        targetX = clamped.x;
        targetY = clamped.y;
        scheduleFrame();
    });

    window.addEventListener('mouseup', function () {
        if (!isDragging) return;
        isDragging = false;
        dom.wallContainer.classList.remove('is-dragging');

        if (!pointerMoved && pendingClickTarget) {
            var idx = parseInt(pendingClickTarget.dataset.index, 10);
            if (!isNaN(idx)) openSlide(idx, pendingClickTarget);
        }
        pendingClickTarget = null;
        pointerMoved = false;

        velX = 0; velY = 0;
        if (velSamples.length >= 2) {
            var oldest = velSamples[0];
            var newest = velSamples[velSamples.length - 1];
            var elapsed = newest.t - oldest.t;
            if (elapsed > 0) {
                velX = (newest.x - oldest.x) / elapsed * TARGET_MS;
                velY = (newest.y - oldest.y) / elapsed * TARGET_MS;
            }
        }
        velSamples = [];

        if (Math.abs(velX) > MOMENTUM_MIN || Math.abs(velY) > MOMENTUM_MIN) {
            momentumActive = true;
            (function momentum() {
                if (!momentumActive) return;
                velX *= MOMENTUM_DECAY;
                velY *= MOMENTUM_DECAY;
                if (Math.abs(velX) < MOMENTUM_MIN && Math.abs(velY) < MOMENTUM_MIN) {
                    momentumActive = false;
                    return;
                }
                var clamped = clampPan(targetX + velX, targetY + velY, targetScale);
                if (clamped.x === targetX) velX = 0;
                if (clamped.y === targetY) velY = 0;
                targetX = clamped.x;
                targetY = clamped.y;
                scheduleFrame();
                requestAnimationFrame(momentum);
            })();
        }
    });

    /* ---- Zoom (wheel / trackpad / pinch) ---- */
    dom.wallContainer.addEventListener('wheel', function (e) {
        e.preventDefault();
        momentumActive = false;
        entranceActive = false;

        var mouseX = e.clientX - containerRect.left;
        var mouseY = e.clientY - containerRect.top;

        if (e.ctrlKey) {
            var pinchDelta = -e.deltaY * 0.01;
            var newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale * (1 + pinchDelta)));
            var scaleRatio = newScale / targetScale;
            var newX = mouseX - scaleRatio * (mouseX - targetX);
            var newY = mouseY - scaleRatio * (mouseY - targetY);
            var clamped = clampPan(newX, newY, newScale);
            targetX = clamped.x;
            targetY = clamped.y;
            targetScale = newScale;
            scheduleFrame();

        } else if (e.deltaMode === 0) {
            var clamped2 = clampPan(targetX - e.deltaX, targetY - e.deltaY, targetScale);
            targetX = clamped2.x;
            targetY = clamped2.y;
            panX = clamped2.x;
            panY = clamped2.y;
            commitTransform();
            scheduleFrame();

        } else {
            var pixelY = e.deltaY;
            if (e.deltaMode === 1) pixelY *= 16;
            if (e.deltaMode === 2) pixelY *= 500;
            pixelY = Math.max(-200, Math.min(200, pixelY));
            var delta = -pixelY * 0.0015;
            var newScale2 = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale * (1 + delta)));
            var scaleRatio2 = newScale2 / targetScale;
            var newX2 = mouseX - scaleRatio2 * (mouseX - targetX);
            var newY2 = mouseY - scaleRatio2 * (mouseY - targetY);
            var clamped3 = clampPan(newX2, newY2, newScale2);
            targetX = clamped3.x;
            targetY = clamped3.y;
            targetScale = newScale2;
            scheduleFrame();
        }
    }, { passive: false });

    /* ---- Touch support ---- */
    var lastTouchDist = null;
    var touchStartX = 0, touchStartY = 0;
    var touchOriginX = 0, touchOriginY = 0;
    var touchVelSamples = [];
    var touchPointerMoved = false;
    var touchPendingTarget = null;

    dom.wallContainer.addEventListener('touchstart', function (e) {
        if (e.target.closest('.zoom-controls')) return;
        e.preventDefault();
        momentumActive = false;
        entranceActive = false;
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchOriginX = targetX;
            touchOriginY = targetY;
            touchVelSamples = [];
            velX = 0; velY = 0;
            touchPointerMoved = false;
            touchPendingTarget = e.target.closest('.postcard-item');
        }
        if (e.touches.length === 2) {
            lastTouchDist = getTouchDist(e.touches);
            touchPendingTarget = null;
        }
    }, { passive: false });

    dom.wallContainer.addEventListener('touchmove', function (e) {
        if (e.target.closest('.zoom-controls')) return;
        e.preventDefault();
        if (e.touches.length === 1) {
            var tdx = e.touches[0].clientX - touchStartX;
            var tdy = e.touches[0].clientY - touchStartY;

            if (!touchPointerMoved && Math.sqrt(tdx * tdx + tdy * tdy) > DRAG_THRESHOLD) {
                touchPointerMoved = true;
                touchPendingTarget = null;
            }

            var now = performance.now();
            touchVelSamples.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, t: now });
            while (touchVelSamples.length > 1 && now - touchVelSamples[0].t > VEL_WINDOW_MS) {
                touchVelSamples.shift();
            }

            var clamped = clampPan(touchOriginX + tdx, touchOriginY + tdy, targetScale);
            targetX = clamped.x;
            targetY = clamped.y;
            scheduleFrame();
        }
        if (e.touches.length === 2) {
            var dist = getTouchDist(e.touches);
            if (lastTouchDist) {
                var midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - containerRect.left;
                var midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - containerRect.top;
                var ratio = dist / lastTouchDist;
                var newS = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale * ratio));
                var scaleRatio = newS / targetScale;
                var newX = midX - scaleRatio * (midX - targetX);
                var newY = midY - scaleRatio * (midY - targetY);
                var clamped2 = clampPan(newX, newY, newS);
                targetX = clamped2.x;
                targetY = clamped2.y;
                targetScale = newS;
                scheduleFrame();
            }
            lastTouchDist = dist;
        }
    }, { passive: false });

    dom.wallContainer.addEventListener('touchend', function (e) {
        if (e.touches.length === 0 && !touchPointerMoved && touchPendingTarget) {
            var idx = parseInt(touchPendingTarget.dataset.index, 10);
            if (!isNaN(idx)) openSlide(idx, touchPendingTarget);
        }
        touchPendingTarget = null;
        touchPointerMoved = false;
        lastTouchDist = null;

        velX = 0; velY = 0;
        if (touchVelSamples.length >= 2) {
            var oldest = touchVelSamples[0];
            var newest = touchVelSamples[touchVelSamples.length - 1];
            var elapsed = newest.t - oldest.t;
            if (elapsed > 0) {
                velX = (newest.x - oldest.x) / elapsed * TARGET_MS;
                velY = (newest.y - oldest.y) / elapsed * TARGET_MS;
            }
        }
        touchVelSamples = [];

        if (Math.abs(velX) > MOMENTUM_MIN || Math.abs(velY) > MOMENTUM_MIN) {
            momentumActive = true;
            (function touchMomentum() {
                if (!momentumActive) return;
                velX *= MOMENTUM_DECAY;
                velY *= MOMENTUM_DECAY;
                if (Math.abs(velX) < MOMENTUM_MIN && Math.abs(velY) < MOMENTUM_MIN) {
                    momentumActive = false;
                    return;
                }
                var clamped = clampPan(targetX + velX, targetY + velY, targetScale);
                if (clamped.x === targetX) velX = 0;
                if (clamped.y === targetY) velY = 0;
                targetX = clamped.x;
                targetY = clamped.y;
                scheduleFrame();
                requestAnimationFrame(touchMomentum);
            })();
        }
    });

    function getTouchDist(touches) {
        var dx = touches[0].clientX - touches[1].clientX;
        var dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    return animateIn;
}

/* ================================================================
   MODULE: SLIDER (Roulette physics – hybrid with v1 hero transitions)
   ================================================================ */

var flyInFlipTimer = null;
var openOriginEl = null;
var _switchToRouletteTimer = null;

/* Track which DOM element is the center (for closeSlider fly-back) */
var sliderCards = { prev: null, center: null, next: null };
var sliderIndices = { prev: -1, center: -1, next: -1 };

/* ── Roulette state ── */
var roulette = {
    position: 0,
    velocity: 0,
    targetSnap: -1,
    phase: 'idle',
    lastTime: 0,
    rafId: null,
    dragStartX: 0,
    dragStartPos: 0,
    velSamples: [],
    isFlipped: false,
    settledIndex: -1,
};

var cardPool = [];
var _btnRepeatTimer = null;
var _btnRepeatInterval = ARROW_REPEAT_INITIAL;
var _rouletteActive = false;

function initSlider() {
    /* Create pool of card DOM elements */
    for (var i = 0; i < POOL_SIZE; i++) {
        var el = document.createElement('div');
        el.className = 'slider-card';
        dom.sliderTrack.appendChild(el);
        cardPool.push({ el: el, assignedIndex: -1 });
    }

    /* Click on adjacent cards is handled inside pointerup (no-drag tap) */


    /* Close button */
    dom.sliderClose.addEventListener('click', closeSlider);

    /* Prev/Next buttons — step 1 card, hold to repeat */
    dom.sliderPrev.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        stepCard(-1);
        startButtonRepeat(-1);
    });
    dom.sliderPrev.addEventListener('pointerup', stopButtonRepeat);
    dom.sliderPrev.addEventListener('pointerleave', stopButtonRepeat);

    dom.sliderNext.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        stepCard(1);
        startButtonRepeat(1);
    });
    dom.sliderNext.addEventListener('pointerup', stopButtonRepeat);
    dom.sliderNext.addEventListener('pointerleave', stopButtonRepeat);

    /* Keyboard — arrows step cards */
    window.addEventListener('keydown', function (e) {
        if (!dom.sliderModal.classList.contains('is-open')) return;
        var tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (e.key === 'Escape') { closeSlider(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); stepCard(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); stepCard(1); }
    });

    /* ── Drag on slider track (pointer events) ── */
    var sliderDragging = false;
    var sliderDragMoved = false;
    var sliderPointerTarget = null;   /* save original target (capture retargets) */

    dom.sliderTrack.addEventListener('pointerdown', function (e) {
        if (!dom.sliderModal.classList.contains('is-open')) return;
        if (!_rouletteActive) return;
        if (e.target.closest('#slider-nav') || e.target.closest('#slider-close')) return;

        e.preventDefault();
        dom.sliderTrack.setPointerCapture(e.pointerId);

        sliderDragging = true;
        sliderDragMoved = false;
        sliderPointerTarget = e.target;   /* remember real target before capture */

        roulette.phase = 'dragging';
        roulette.velocity = 0;
        roulette.dragStartX = e.clientX;
        roulette.dragStartPos = roulette.position;
        roulette.velSamples = [{ x: e.clientX, t: performance.now() }];

        unflipAll();
    });

    dom.sliderTrack.addEventListener('pointermove', function (e) {
        if (!sliderDragging) return;

        var dx = e.clientX - roulette.dragStartX;
        if (!sliderDragMoved && Math.abs(dx) > 5) sliderDragMoved = true;

        var cardDelta = -dx / DRAG_PIXELS_PER_CARD;
        var rawPos = roulette.dragStartPos + cardDelta;

        if (rawPos < 0) {
            roulette.position = rawPos * RUBBER_BAND;
        } else if (rawPos > POSTCARDS.length - 1) {
            var over = rawPos - (POSTCARDS.length - 1);
            roulette.position = (POSTCARDS.length - 1) + over * RUBBER_BAND;
        } else {
            roulette.position = rawPos;
        }

        var now = performance.now();
        roulette.velSamples.push({ x: e.clientX, t: now });
        while (roulette.velSamples.length > 1 && now - roulette.velSamples[0].t > VELOCITY_SAMPLE_MS) {
            roulette.velSamples.shift();
        }

        updateCardPositions();
        updateCounter();
    });

    dom.sliderTrack.addEventListener('pointerup', function (e) {
        if (!sliderDragging) return;
        sliderDragging = false;

        if (!sliderDragMoved) {
            /* Tap on adjacent card → navigate to it
             * Use sliderPointerTarget (saved from pointerdown) because
             * setPointerCapture retargets pointerup to the track element. */
            var tappedCard = sliderPointerTarget ? sliderPointerTarget.closest('.slider-card') : null;
            if (tappedCard && tappedCard.classList.contains('is-adjacent')) {
                for (var c = 0; c < cardPool.length; c++) {
                    if (cardPool[c].el === tappedCard) {
                        var targetIdx = cardPool[c].assignedIndex;
                        if (targetIdx >= 0) {
                            unflipAll();
                            roulette.targetSnap = targetIdx;
                            roulette.phase = 'snapping';
                            startRouletteLoop();
                        }
                        return;
                    }
                }
            }
            /* Tap on center or elsewhere → just snap in place */
            roulette.phase = 'snapping';
            roulette.targetSnap = Math.round(roulette.position);
            roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
            startRouletteLoop();
            return;
        }

        var vel = 0;
        var samples = roulette.velSamples;
        if (samples.length >= 2) {
            var oldest = samples[0];
            var newest = samples[samples.length - 1];
            var elapsed = newest.t - oldest.t;
            if (elapsed > 0) {
                var pxVel = (newest.x - oldest.x) / elapsed;
                vel = -pxVel * 16 / DRAG_PIXELS_PER_CARD;
            }
        }

        vel = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, vel));
        roulette.velocity = vel;

        if (Math.abs(vel) > SNAP_VEL_THRESHOLD) {
            roulette.phase = 'momentum';
        } else {
            roulette.phase = 'snapping';
            roulette.targetSnap = Math.round(roulette.position);
            roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
        }

        startRouletteLoop();
    });

    dom.sliderTrack.addEventListener('pointercancel', function () {
        if (!sliderDragging) return;
        sliderDragging = false;
        roulette.velocity = 0;
        roulette.phase = 'snapping';
        roulette.targetSnap = Math.round(roulette.position);
        roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
        startRouletteLoop();
    });

    /* ── Wheel / trackpad — physics-based impulse ── */
    dom.sliderModal.addEventListener('wheel', function (e) {
        if (!dom.sliderModal.classList.contains('is-open')) return;
        if (!_rouletteActive) return;
        e.preventDefault();

        var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        roulette.velocity += delta * WHEEL_SENSITIVITY;
        roulette.velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, roulette.velocity));

        if (roulette.phase === 'settled' || roulette.phase === 'idle' || roulette.phase === 'snapping') {
            roulette.phase = 'momentum';
            unflipAll();
        }

        startRouletteLoop();
    }, { passive: false });

    /* Click on modal background */
    dom.sliderModal.addEventListener('click', function (e) {
        if (e.target === dom.sliderModal) closeSlider();
    });

    /* postMessage from parent */
    window.addEventListener('message', function (event) {
        var data = event.data;
        if (!data || data.type !== 'SET_SLIDE') return;
        var index = slugToIndex(data.slug);
        if (index !== -1) openSlide(index);
    });

    /* ── Focus trap: keep Tab cycling within slider modal ── */
    dom.sliderModal.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        if (!dom.sliderModal.classList.contains('is-open')) return;

        var focusable = dom.sliderModal.querySelectorAll(
            'button:not([disabled]), [tabindex="0"]'
        );
        if (focusable.length === 0) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

/* ── Render card content (both faces) into a container ── */
function renderSliderCard(containerEl, index) {
    containerEl.innerHTML = '';
    if (index < 0 || index >= POSTCARDS.length) return;

    var card = POSTCARDS[index];

    var flipper = document.createElement('div');
    flipper.className = 'slider-flipper';

    /* ── Front face: LQIP → thumb → full-res ── */
    var frontFace = document.createElement('div');
    frontFace.className = 'slider-face slider-face--front';
    var frontImg = document.createElement('img');
    frontImg.src = card.frontLqip;
    frontImg.alt = (POSTCARD_ALTS['postcard-' + String(index + 1).padStart(3, '0') + '.webp'] || 'Postcard ' + (index + 1)) + ' (front)';
    frontImg.classList.add('is-thumb-placeholder');
    frontFace.appendChild(frontImg);
    upgradeImage(frontImg, card.frontThumb, card.frontFile);

    /* ── Back face: LQIP → thumb → full-res ── */
    var backFace = document.createElement('div');
    backFace.className = 'slider-face slider-face--back';
    var backImg = document.createElement('img');
    backImg.src = card.lqipFile;
    backImg.alt = POSTCARD_ALTS['postcard-' + String(index + 1).padStart(3, '0') + '.webp'] || 'Postcard ' + (index + 1);
    backImg.classList.add('is-thumb-placeholder');
    backFace.appendChild(backImg);
    upgradeImage(backImg, card.thumbFile, card.file);

    flipper.appendChild(frontFace);
    flipper.appendChild(backFace);
    containerEl.appendChild(flipper);
    // Default: no is-flipped → shows front (rotateY 0deg)
}

/* ── Progressive image upgrade: thumb (cached) → full-res ── */
function upgradeImage(imgEl, thumbSrc, fullSrc) {
    var thumb = new Image();
    thumb.onload = function () {
        if (imgEl.classList.contains('is-thumb-placeholder')) {
            imgEl.src = thumbSrc;
        }
    };
    thumb.src = thumbSrc;

    var full = new Image();
    full.onload = function () {
        imgEl.src = fullSrc;
        imgEl.classList.remove('is-thumb-placeholder');
    };
    full.src = fullSrc;
}

/* ── Preload full-res images for a given card index ── */
function preloadSliderImages(index) {
    if (index < 0 || index >= POSTCARDS.length) return;
    var card = POSTCARDS[index];
    var a = new Image(); a.src = card.frontFile;
    var b = new Image(); b.src = card.file;
}

/* ── Helper: set position class on a slider-card element ── */
/* ── Random subtle rotation for center card (±2°) ── */
function randomCenterRotation() {
    return (Math.random() * 4 - 2).toFixed(2) + 'deg';
}

function setCardPosition(el, position) {
    el.classList.remove(
        'slider-card--prev', 'slider-card--center', 'slider-card--next',
        'slider-card--off-left', 'slider-card--off-right'
    );
    el.classList.add('slider-card--' + position);
}

/* ── Helper: flip state ── */
function setFlipState(el, showBack) {
    var flipper = el.querySelector('.slider-flipper');
    if (!flipper) return;
    if (showBack) {
        flipper.classList.add('is-flipped');
    } else {
        flipper.classList.remove('is-flipped');
    }
}

/* ══════════════════════════════════════════════════════════
   ROULETTE NAVIGATION FUNCTIONS
   ══════════════════════════════════════════════════════════ */

/* ── Step exactly 1 card (arrows, buttons) ── */
function stepCard(direction) {
    if (!dom.sliderModal.classList.contains('is-open')) return;
    if (!_rouletteActive) return;

    if (roulette.phase === 'settled' || roulette.phase === 'idle') {
        unflipAll();
    }

    if (roulette.phase === 'snapping') {
        roulette.targetSnap += direction;
    } else {
        roulette.targetSnap = Math.round(roulette.position) + direction;
        roulette.velocity = 0;
    }

    roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
    roulette.phase = 'snapping';
    startRouletteLoop();
}

/* ── Button hold repeat system ── */
function startButtonRepeat(direction) {
    stopButtonRepeat();
    _btnRepeatInterval = ARROW_REPEAT_INITIAL;
    _btnRepeatTimer = setTimeout(function repeat() {
        stepCard(direction);
        _btnRepeatInterval = Math.max(ARROW_REPEAT_MIN, _btnRepeatInterval * ARROW_REPEAT_ACCEL);
        _btnRepeatTimer = setTimeout(repeat, _btnRepeatInterval);
    }, _btnRepeatInterval);
}

function stopButtonRepeat() {
    if (_btnRepeatTimer) {
        clearTimeout(_btnRepeatTimer);
        _btnRepeatTimer = null;
    }
}

/* ── Unflip all pool cards (for when motion starts) ── */
function unflipAll() {
    /* Cancel pending fly-in flip */
    if (flyInFlipTimer) { clearTimeout(flyInFlipTimer); flyInFlipTimer = null; }

    roulette.isFlipped = false;
    roulette.settledIndex = -1;
    for (var i = 0; i < cardPool.length; i++) {
        var flipper = cardPool[i].el.querySelector('.slider-flipper');
        if (flipper) {
            flipper.classList.add('no-flip-transition');
            flipper.classList.remove('is-flipped');
            flipper.offsetHeight;
            flipper.classList.remove('no-flip-transition');
        }
    }
}

/* ── Flip the settled center card (front → back) ── */
function flipSettledCard() {
    var centerIdx = Math.round(roulette.position);
    centerIdx = Math.max(0, Math.min(POSTCARDS.length - 1, centerIdx));

    for (var i = 0; i < cardPool.length; i++) {
        if (cardPool[i].assignedIndex === centerIdx) {
            var flipper = cardPool[i].el.querySelector('.slider-flipper');
            if (flipper && !flipper.classList.contains('is-flipped')) {
                flipper.classList.remove('no-flip-transition');
                flipper.classList.add('is-flipped');
                roulette.isFlipped = true;
                roulette.settledIndex = centerIdx;
            }
            /* Update sliderCards.center for closeSlider fly-back */
            sliderCards.center = cardPool[i].el;
            sliderIndices.center = centerIdx;
            break;
        }
    }
}

/* ── The main roulette physics loop ── */
function startRouletteLoop() {
    if (roulette.rafId) return;
    roulette.lastTime = performance.now();
    roulette.rafId = requestAnimationFrame(rouletteFrame);
}

function stopRouletteLoop() {
    if (roulette.rafId) {
        cancelAnimationFrame(roulette.rafId);
        roulette.rafId = null;
    }
}

function rouletteFrame(timestamp) {
    roulette.rafId = null;

    var dt = Math.min(timestamp - roulette.lastTime, 48);
    roulette.lastTime = timestamp;
    var dtNorm = dt / 16.667;

    if (roulette.phase === 'momentum') {
        roulette.velocity *= Math.pow(FRICTION, dtNorm);
        roulette.position += roulette.velocity * dtNorm;

        if (roulette.position < 0) {
            roulette.position = 0;
            roulette.velocity = Math.abs(roulette.velocity) * 0.3;
            if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) roulette.velocity = 0;
        } else if (roulette.position > POSTCARDS.length - 1) {
            roulette.position = POSTCARDS.length - 1;
            roulette.velocity = -Math.abs(roulette.velocity) * 0.3;
            if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) roulette.velocity = 0;
        }

        if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) {
            roulette.phase = 'snapping';
            roulette.targetSnap = Math.round(roulette.position);
            roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
            roulette.velocity = 0;
        }
    }

    if (roulette.phase === 'snapping') {
        var displacement = roulette.targetSnap - roulette.position;
        var lerpFactor = 1 - Math.pow(1 - SNAP_LERP, dtNorm);
        roulette.position += displacement * lerpFactor;
        roulette.velocity = 0;

        if (Math.abs(displacement) < SNAP_SETTLE) {
            roulette.position = roulette.targetSnap;
            roulette.velocity = 0;
            roulette.phase = 'settled';

            state.currentSlide = roulette.targetSnap;
            sliderIndices.center = roulette.targetSnap;
            var card = POSTCARDS[state.currentSlide];
            notifyParent(card.slug);
            updateURL(card.slug);
            dom.sliderCurrent.textContent = state.currentSlide + 1;
            announceSlide(state.currentSlide);

            /* Update sliderCards.center for closeSlider */
            for (var sc = 0; sc < cardPool.length; sc++) {
                if (cardPool[sc].assignedIndex === roulette.targetSnap) {
                    sliderCards.center = cardPool[sc].el;
                    break;
                }
            }

            /* Flip after settling */
            setTimeout(function () {
                if (roulette.phase === 'settled') {
                    flipSettledCard();
                }
            }, 80);
        }
    }

    updateCardPositions();
    updateCounter();

    if (roulette.phase !== 'settled' && roulette.phase !== 'idle') {
        roulette.rafId = requestAnimationFrame(rouletteFrame);
    }
}

/* ── Update all pool card transforms based on current position ── */
function updateCardPositions() {
    var center = roulette.position;
    var centerInt = Math.round(center);

    var visibleIndices = [];
    for (var offset = -MAX_VISIBLE_CARDS; offset <= MAX_VISIBLE_CARDS; offset++) {
        var idx = centerInt + offset;
        if (idx >= 0 && idx < POSTCARDS.length) {
            visibleIndices.push(idx);
        }
    }

    /* Assign pool cards to visible indices */
    var usedPools = {};
    var unassigned = [];

    for (var p = 0; p < cardPool.length; p++) {
        var pool = cardPool[p];
        if (visibleIndices.indexOf(pool.assignedIndex) !== -1 && !usedPools[pool.assignedIndex]) {
            usedPools[pool.assignedIndex] = pool;
        } else {
            unassigned.push(pool);
            pool.el.style.opacity = '0';
            pool.el.style.pointerEvents = 'none';
        }
    }

    for (var v = 0; v < visibleIndices.length; v++) {
        var vi = visibleIndices[v];
        if (!usedPools[vi] && unassigned.length > 0) {
            var poolCard = unassigned.shift();
            renderSliderCard(poolCard.el, vi);
            poolCard.assignedIndex = vi;
            usedPools[vi] = poolCard;

            if (vi === roulette.settledIndex && roulette.isFlipped) {
                var flipper = poolCard.el.querySelector('.slider-flipper');
                if (flipper) {
                    flipper.classList.add('no-flip-transition');
                    flipper.classList.add('is-flipped');
                    flipper.offsetHeight;
                    flipper.classList.remove('no-flip-transition');
                }
            }
        }
    }

    /* Position each visible card */
    var vpW = window.innerWidth;
    var spacingPx = vpW * CARD_SPACING_VW / 100;

    for (var vi2 = 0; vi2 < visibleIndices.length; vi2++) {
        var idx2 = visibleIndices[vi2];
        var pool2 = usedPools[idx2];
        if (!pool2) continue;

        var dist = idx2 - center;
        var absDist = Math.abs(dist);

        var translateX = dist * spacingPx;
        var scaleVal = 1 - (1 - SIDE_SCALE) * Math.min(absDist, 1);

        var tilt = 0;
        if (dist < -0.1) tilt = SIDE_TILT * Math.min(absDist, 1);
        else if (dist > 0.1) tilt = -SIDE_TILT * Math.min(absDist, 1);

        var opacity = absDist <= 1 ? 1 : Math.max(0, 1 - (absDist - 1) * 2);
        var zIndex = absDist < 0.5 ? 2 : 1;

        pool2.el.style.transform =
            'translate3d(' + translateX + 'px, 0, 0) ' +
            'scale(' + scaleVal + ') ' +
            'rotate(' + tilt + 'deg)';
        pool2.el.style.opacity = opacity;
        pool2.el.style.zIndex = zIndex;
        /* Pointer events: center + adjacent cards are interactive */
        if (absDist < 0.5) {
            pool2.el.style.pointerEvents = 'auto';
            pool2.el.classList.add('is-center');
            pool2.el.classList.remove('is-adjacent');
        } else if (absDist <= 1) {
            pool2.el.style.pointerEvents = 'auto';
            pool2.el.classList.remove('is-center');
            pool2.el.classList.add('is-adjacent');
        } else {
            pool2.el.style.pointerEvents = 'none';
            pool2.el.classList.remove('is-center', 'is-adjacent');
        }
    }
}

/* ── Update counter display ── */
function updateCounter() {
    var idx = Math.round(roulette.position);
    idx = Math.max(0, Math.min(POSTCARDS.length - 1, idx));
    dom.sliderCurrent.textContent = idx + 1;
}

/* ── Switch from CSS positioning to roulette mode ── */
function switchToRouletteMode(index) {
    _rouletteActive = true;

    roulette.position = index;
    roulette.velocity = 0;
    roulette.phase = 'settled';
    state.currentSlide = index;

    /* Check actual flip state of center card */
    var centerFlipper = sliderCards.center.querySelector('.slider-flipper');
    var isCurrentlyFlipped = centerFlipper && centerFlipper.classList.contains('is-flipped');
    roulette.isFlipped = isCurrentlyFlipped;
    roulette.settledIndex = isCurrentlyFlipped ? index : -1;

    /* Kill CSS transitions globally — rAF drives all motion now */
    dom.sliderTrack.classList.add('roulette-active');

    /* Remove CSS position classes */
    for (var i = 0; i < cardPool.length; i++) {
        var el = cardPool[i].el;
        el.classList.remove(
            'slider-card--prev', 'slider-card--center', 'slider-card--next',
            'slider-card--off-left', 'slider-card--off-right',
            'no-transition'
        );
        el.style.removeProperty('--center-rotation');
    }

    updateCardPositions();
}

/* ══════════════════════════════════════════════════════════
   openSlide() – Open slider from wall click
   ══════════════════════════════════════════════════════════ */
function openSlide(index, originEl) {
    if (index < 0 || index >= POSTCARDS.length) return;

    var isFirstOpen = state.currentSlide === -1;

    /* If slider is already open, snap roulette to the new index */
    if (!isFirstOpen) {
        if (index === state.currentSlide) return;
        if (_rouletteActive) {
            unflipAll();
            roulette.targetSnap = index;
            roulette.phase = 'snapping';
            startRouletteLoop();
        }
        return;
    }

    state.currentSlide = index;
    openOriginEl = originEl || null;  /* Store for fly-back on close */
    var card = POSTCARDS[index];

    notifyParent(card.slug);
    updateURL(card.slug);
    updateDebug('open: ' + card.slug);

    dom.sliderCurrent.textContent = index + 1;

    var prevIdx = (index - 1 + POSTCARDS.length) % POSTCARDS.length;
    var nextIdx = (index + 1) % POSTCARDS.length;

    sliderIndices.prev = prevIdx;
    sliderIndices.center = index;
    sliderIndices.next = nextIdx;

    /* Assign pool cards to the 3 initial roles */
    cardPool[0].assignedIndex = index;
    cardPool[1].assignedIndex = prevIdx;
    cardPool[2].assignedIndex = nextIdx;
    for (var p = 3; p < cardPool.length; p++) {
        cardPool[p].assignedIndex = -1;
        cardPool[p].el.style.opacity = '0';
    }

    sliderCards.center = cardPool[0].el;
    sliderCards.prev = cardPool[1].el;
    sliderCards.next = cardPool[2].el;

    /* Restore CSS transitions for hero expand lateral slide-in */
    for (var t = 0; t < cardPool.length; t++) {
        cardPool[t].el.style.transition = '';
    }

    /* Render all 3 cards */
    renderSliderCard(sliderCards.prev, prevIdx);
    renderSliderCard(sliderCards.center, index);
    renderSliderCard(sliderCards.next, nextIdx);

    /* Preload images 2 positions away for smoother future navigation */
    preloadSliderImages((prevIdx - 1 + POSTCARDS.length) % POSTCARDS.length);
    preloadSliderImages((nextIdx + 1) % POSTCARDS.length);

    /* Set positions instantly (no transition for setup) */
    sliderCards.prev.classList.add('no-transition');
    sliderCards.center.classList.add('no-transition');
    sliderCards.next.classList.add('no-transition');

    /* Prev/next inician fuera del viewport — entrarán deslizando DESPUÉS de que
     * la central aterrice. Esto evita que sean visibles durante el vuelo. */
    setCardPosition(sliderCards.prev, 'off-left');
    setCardPosition(sliderCards.center, 'center');
    /* --center-rotation is set later: inside hero-expand (with DOM measurement)
     * or inside the deep-link path (no hero needed). */
    setCardPosition(sliderCards.next, 'off-right');

    /* Laterals always show front */
    setFlipState(sliderCards.prev, false);
    setFlipState(sliderCards.next, false);

    /*
     * Center face depends on card.face from the wall:
     *   face=front → mount as FRONT, flip to back after hero arrives
     *   face=back  → mount as BACK instantly (no flip visible)
     *
     * IMPORTANT: no-transition stays ON until face is set.
     * Only removed AFTER the initial state is committed.
     */
    var cardShowsFront = (card.face === 'front');

    if (cardShowsFront) {
        /* Mount as FRONT — no is-flipped */
        setFlipState(sliderCards.center, false);
    } else {
        /* Mount as BACK instantly — is-flipped with no-transition still on */
        setFlipState(sliderCards.center, true);
    }

    /* Force layout to commit initial state */
    sliderCards.prev.getBoundingClientRect();
    sliderCards.center.getBoundingClientRect();
    sliderCards.next.getBoundingClientRect();

    /* NOW remove no-transition — state is fully committed */
    sliderCards.prev.classList.remove('no-transition');
    sliderCards.center.classList.remove('no-transition');
    sliderCards.next.classList.remove('no-transition');

    /* ── HERO EXPAND — True shared-element transition ────────────────
     * The clone uses a single CSS `transform` (translate + scale + rotate)
     * instead of separate left/top/width/height transitions.
     * This ensures position, scale and rotation interpolate on a single
     * curve — one continuous visual object, imperceptible swap.
     *
     * Steps:
     *   1. Generate --center-rotation but set 0deg for measuring (evita AABB inflado)
     *   2. Open slider as .is-measuring (display:flex, opacity:0)
     *   3. Measure the real rect of the center card's front image (a 0° exacto)
     *   4. Close measuring pass — set rotación real (slider sigue display:none)
     *   5. Create clone at source rect, animate via transform to target
     *   6. On transitionend: rAF → show slider + remove clone in same frame
     * ─────────────────────────────────────────────────────────────────── */
    if (originEl) {
        var fromRect    = originEl.getBoundingClientRect();
        /* Actual card dimensions (not AABB) — needed for clone sizing and fallback aspect */
        var cardW       = parseFloat(originEl.style.width);
        var cardH       = parseFloat(originEl.style.height);
        var wallRotation = originEl.style.getPropertyValue('--rotation');

        /* 1. Generate target rotation but don't apply yet (measure at 0°) */
        var targetRotation = randomCenterRotation();
        sliderCards.center.style.setProperty('--center-rotation', '0deg');

        /* 2. Measuring pass: measure the SLIDER-CARD CONTAINER, not the image.
         *
         * Why: The <img> has height:auto and depends on the loaded image's
         * natural aspect ratio. During the measuring pass the LQIP is usually
         * not loaded yet, so the old code fell back to window.innerWidth/Height
         * which gave wrong dimensions (especially in iframes).
         *
         * The .slider-card container has a fixed CSS width (52.45vw, max 900px)
         * that is 100% reliable and image-independent. We measure that width,
         * and derive the vertical center from the container's position. */
        dom.sliderModal.classList.add('is-measuring');
        void dom.sliderModal.offsetHeight;

        var containerRect = sliderCards.center.getBoundingClientRect();

        dom.sliderModal.classList.remove('is-measuring');
        sliderCards.center.style.setProperty('--center-rotation', targetRotation);

        /* Target: container width + height (reliable thanks to CSS aspect-ratio).
         * Non-uniform scale from cardW→toW / cardH→toH ensures the clone
         * arrives at the EXACT slider-card dimensions — no height jump on swap. */
        var toW = containerRect.width;
        var toH = containerRect.height;
        var vpCenterX = containerRect.left + containerRect.width / 2;
        var vpCenterY = containerRect.top + containerRect.height / 2;
        /* If container height collapsed (image not loaded), use viewport center */
        if (toH < 50) {
            vpCenterY = window.innerHeight / 2;
            toH = 0; /* flag: unreliable — will fall back to uniform scale */
        }

        /* 5. Create clone at source position (fixed, no transition yet).
         *
         * KEY FIX — use actual card dimensions (cardW/cardH, declared above), not the
         * AABB of the rotated element. fromRect on a rotated el returns an axis-aligned
         * bounding box that is slightly LARGER than the real card. Using AABB as the
         * clone's width/height causes two problems:
         *   a) non-uniform scale: AABB aspect ratio ≠ image natural ratio → stretching
         *   b) slight size overshoot at arrival (noticeable for off-center cards)
         * We position the clone from the AABB center (= card center) minus half the
         * actual dimensions. Initial transform = rotate(wallRotation) so the clone
         * visually matches the wall card pixel-perfectly at t=0. */
        var aabbCx = fromRect.left + fromRect.width  / 2;
        var aabbCy = fromRect.top  + fromRect.height / 2;
        /* Clone height comes from img aspect-ratio: 3/2, not the wall card's
         * fixed 233×154. This way the clone shows the SAME uncropped image
         * as the slider card — no content jump during crossfade. */
        var cloneH = cardW * 2 / 3; /* matches CSS aspect-ratio: 3/2 */
        var cloneLeft = aabbCx - cardW / 2;
        var cloneTop  = aabbCy - cloneH / 2;

        var clone = document.createElement('div');
        clone.className = 'hero-clone';
        clone.style.left   = cloneLeft + 'px';
        clone.style.top    = cloneTop  + 'px';
        clone.style.width  = cardW     + 'px';
        /* No fixed height — img with aspect-ratio: 3/2 determines it */
        /* Start at wall card's exact rotation — matches visually at t=0 */
        clone.style.transform = 'rotate(' + wallRotation + ')';

        var img = document.createElement('img');
        img.src = cardShowsFront ? card.frontThumb : card.thumbFile;
        img.alt = '';
        clone.appendChild(img);
        document.body.appendChild(clone);

        /* ── Scene transition: fade wall cards + morph background ── */
        originEl.style.visibility = 'hidden'; /* hide immediately — clone covers it */
        dom.wallCanvas.classList.add('is-transitioning-out');
        var sceneBg = document.getElementById('scene-bg');
        if (sceneBg) requestAnimationFrame(function () { sceneBg.classList.add('is-visible'); });

        /* Force layout to commit starting position */
        void clone.offsetHeight;

        /* Calculate transform: source center → target center.
         * transform-origin: 50% 50% means translate moves the center directly. */
        var dx = vpCenterX - aabbCx;
        var dy = vpCenterY - aabbCy;
        var sx = toW / cardW;
        var sy = toH > 0 ? (toH / cloneH) : sx; /* match slider-card exact height */
        var rotEnd = targetRotation; /* e.g. "1.37deg" */

        /* Apply the destination transform — CSS transition kicks in */
        clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) '
            + 'scale(' + sx + ',' + sy + ') '
            + 'rotate(' + rotEnd + ')';
        clone.style.boxShadow = 'none';

        /* 6. On arrival: swap clone for real slider in a single paint frame.
         * No setTimeout, no delay — rAF guarantees same-frame swap. */
        clone.addEventListener('transitionend', function onCloneArrived(e) {
            if (e.propertyName !== 'transform') return;
            clone.removeEventListener('transitionend', onCloneArrived);

            requestAnimationFrame(function () {
                /* Show slider behind clone (clone z:300, slider z:200).
                 * The slider card is already at scale(1) with the correct
                 * --center-rotation — identical dimensions to the clone.
                 * Pure opacity crossfade: no size change, no shape jump. */
                dom.sliderModal.classList.add('is-open');
                if (dom.sliderNav) dom.sliderNav.classList.add('is-visible');
                dom.sliderModal.classList.add('is-animating');
                /* Focus modal for screen readers — no visible outline */
dom.sliderModal.focus();
                announceSlide(index);

                /* Fade out clone — slider card shows through as clone dissolves */
                clone.style.transition = 'opacity 350ms ease';
                clone.style.opacity = '0';

                /* Remove clone from DOM after crossfade completes */
                setTimeout(function () {
                    if (clone.parentNode) clone.parentNode.removeChild(clone);
                }, 360);

                /* Prev/next aparecen tras LATERAL_APPEAR_DELAY */
                setTimeout(function () {
                    setCardPosition(sliderCards.prev, 'prev');
                    setCardPosition(sliderCards.next, 'next');
                }, LATERAL_APPEAR_DELAY);

                /* Switch to roulette after laterals have transitioned in */
                _switchToRouletteTimer = setTimeout(function () {
                    _switchToRouletteTimer = null;
                    switchToRouletteMode(index);
                }, LATERAL_APPEAR_DELAY + 550);

                if (cardShowsFront) {
                    flyInFlipTimer = setTimeout(function () {
                        flyInFlipTimer = null;
                        setFlipState(sliderCards.center, true);
                    }, FLY_IN_FLIP_DELAY);
                }
            });
        });

    } else {
        /* ── Deep link / SET_SLIDE: no hero — go straight to roulette ── */
        dom.sliderModal.classList.add('is-open', 'is-animating');
        if (dom.sliderNav) dom.sliderNav.classList.add('is-visible');
        /* Focus modal for screen readers — no visible outline */
dom.sliderModal.focus();
        announceSlide(index);

        /* Initialize roulette immediately */
        switchToRouletteMode(index);

        if (cardShowsFront) {
            setTimeout(function () {
                setFlipState(sliderCards.center, true);
            }, 200);
        }
    }
}

function _cancelSliderTimers() {
    if (flyInFlipTimer) { clearTimeout(flyInFlipTimer); flyInFlipTimer = null; }
    if (_switchToRouletteTimer) { clearTimeout(_switchToRouletteTimer); _switchToRouletteTimer = null; }
    stopButtonRepeat();
    stopRouletteLoop();
}

function _closeInstant() {
    _cancelSliderTimers();
    _rouletteActive = false;
    dom.sliderTrack.classList.remove('roulette-active');
    dom.sliderModal.classList.remove('is-open', 'is-animating');
    if (dom.sliderNav) dom.sliderNav.classList.remove('is-visible');
    /* Restore focus to the origin wall card */
    var restoreFocusEl = openOriginEl;
    state.currentSlide = -1;
    openOriginEl = null;
    clearSlideURL();
    if (dom.sliderLive) dom.sliderLive.textContent = '';

    /* Reset roulette state */
    roulette.position = 0;
    roulette.velocity = 0;
    roulette.phase = 'idle';
    roulette.targetSnap = -1;
    roulette.isFlipped = false;
    roulette.settledIndex = -1;

    /* Reset pool */
    for (var i = 0; i < cardPool.length; i++) {
        cardPool[i].assignedIndex = -1;
        cardPool[i].el.innerHTML = '';
        cardPool[i].el.style.cssText = '';
        cardPool[i].el.classList.remove(
            'slider-card--prev', 'slider-card--center', 'slider-card--next',
            'slider-card--off-left', 'slider-card--off-right',
            'no-transition', 'is-center', 'is-adjacent'
        );
    }

    /* Restore wall scene */
    dom.wallCanvas.classList.remove('is-transitioning-out');
    var sceneBg = document.getElementById('scene-bg');
    if (sceneBg) sceneBg.classList.remove('is-visible');
    var items = dom.wallCanvas.querySelectorAll('.postcard-item');
    for (var j = 0; j < items.length; j++) items[j].style.visibility = '';
    if (restoreFocusEl) restoreFocusEl.focus();
}

function closeSlider() {
    /* Find wall card for current center slide (may differ from origin if user navigated) */
    var wallCard = document.querySelector('.postcard-item[data-index="' + sliderIndices.center + '"]');

    if (CLOSE_ANIMATION === 'fly-back' && wallCard) {
        _closeWithFlyBack(wallCard);
    } else {
        _closeInstant();
    }
}

function _closeWithFlyBack(wallCard) {
    _cancelSliderTimers();
    _rouletteActive = false;
    dom.sliderTrack.classList.remove('roulette-active');

    /* ── Source: visible face of the center slider card ── */
    var centerCard = sliderCards.center;
    var flipper = centerCard.querySelector('.slider-flipper');
    var isFlipped = flipper && flipper.classList.contains('is-flipped');
    var visibleFaceSelector = isFlipped ? '.slider-face--back img' : '.slider-face--front img';
    var srcImg = centerCard.querySelector(visibleFaceSelector) || centerCard.querySelector('img');

    /* fromRect = AABB of the visible slider image (slider is still open) */
    var fromRect = srcImg ? srcImg.getBoundingClientRect() : centerCard.getBoundingClientRect();

    /* In roulette mode center card has rotate(0deg) via inline transform */
    var currentRotation = '0deg';

    /* ── Target: wall card ── */
    var wallFaceClass = wallCard.dataset.face === 'front' ? '.postcard-face--front img' : '.postcard-face--back img';
    var wallImg = wallCard.querySelector(wallFaceClass) || wallCard.querySelector('img');
    var toRect = wallImg ? wallImg.getBoundingClientRect() : wallCard.getBoundingClientRect();
    var wallRotation = wallCard.style.getPropertyValue('--rotation') || '0deg';

    /* ── Create clone matching the visible slider face ── */
    var clone = document.createElement('div');
    clone.className = 'hero-clone';
    clone.style.left   = fromRect.left   + 'px';
    clone.style.top    = fromRect.top    + 'px';
    clone.style.width  = fromRect.width  + 'px';
    clone.style.height = fromRect.height + 'px';
    clone.style.transform  = 'rotate(' + currentRotation + ')';
    clone.style.boxShadow  = '0 8px 48px rgba(0,0,0,0.5)';
    clone.style.transition = 'none';

    var img = new Image();
    img.src = srcImg ? srcImg.src : '';
    img.alt = '';
    clone.appendChild(img);
    document.body.appendChild(clone);

    /* ── Hide slider in the same frame as clone appears ── */
    dom.sliderModal.classList.remove('is-open', 'is-animating');
    if (dom.sliderNav) dom.sliderNav.classList.remove('is-visible');
    state.currentSlide = -1;
    openOriginEl = null;
    clearSlideURL();

    /* Reset roulette state */
    roulette.position = 0;
    roulette.velocity = 0;
    roulette.phase = 'idle';
    roulette.targetSnap = -1;
    roulette.isFlipped = false;
    roulette.settledIndex = -1;

    /* Reset pool */
    for (var pc = 0; pc < cardPool.length; pc++) {
        cardPool[pc].assignedIndex = -1;
        cardPool[pc].el.innerHTML = '';
        cardPool[pc].el.style.cssText = '';
        cardPool[pc].el.classList.remove(
            'slider-card--prev', 'slider-card--center', 'slider-card--next',
            'slider-card--off-left', 'slider-card--off-right',
            'no-transition', 'is-center', 'is-adjacent'
        );
    }

    /* ── Reverse scene transition: gray → blue, wall cards fade back in ── */
    dom.wallCanvas.classList.remove('is-transitioning-out');
    var sceneBg = document.getElementById('scene-bg');
    if (sceneBg) sceneBg.classList.remove('is-visible');

    /* ── Restore all wall cards immediately EXCEPT the target (clone covers it) ── */
    var allItems = dom.wallCanvas.querySelectorAll('.postcard-item');
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i] !== wallCard) allItems[i].style.visibility = '';
    }

    /* Force layout to commit clone starting position BEFORE enabling transition */
    void clone.offsetHeight;

    /* Enable transition now — same curve as the fly-in */
    clone.style.transition = '';

    /* ── Animate clone toward wall card ── */
    var dx = (toRect.left + toRect.width  / 2) - (fromRect.left + fromRect.width  / 2);
    var dy = (toRect.top  + toRect.height / 2) - (fromRect.top  + fromRect.height / 2);
    var sx = toRect.width  / fromRect.width;
    var sy = toRect.height / fromRect.height;

    clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) '
        + 'scale(' + sx + ',' + sy + ') '
        + 'rotate(' + wallRotation + ')';
    clone.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';

    clone.addEventListener('transitionend', function onCloneBack(e) {
        if (e.propertyName !== 'transform') return;
        clone.removeEventListener('transitionend', onCloneBack);
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        wallCard.style.visibility = '';
    });
}

/* ================================================================
   UTILITIES
   ================================================================ */
/* ── Announce slide change to screen readers ── */
function announceSlide(index) {
    if (!dom.sliderLive) return;
    dom.sliderLive.textContent = 'Postcard ' + (index + 1) + ' of ' + POSTCARDS.length;
}

function notifyParent(slug) {
    window.parent.postMessage({ type: 'SLIDE_CHANGE', slug: slug }, '*');
}

function notifyParentClosed() {
    window.parent.postMessage({ type: 'SLIDE_CLOSE' }, '*');
}

function updateURL(slug) {
    if (state.isInIframe) return;
    var url = new URL(window.location.href);
    url.searchParams.set('slide', slug);
    window.history.replaceState({ slide: slug }, '', url.toString());
}

function clearSlideURL() {
    if (state.isInIframe) {
        notifyParentClosed();
        return;
    }
    var url = new URL(window.location.href);
    url.searchParams.delete('slide');
    window.history.replaceState({}, '', url.toString());
}

function getSlideFromURL() {
    return new URLSearchParams(window.location.search).get('slide');
}

function slugToIndex(slug) {
    for (var i = 0; i < POSTCARDS.length; i++) {
        if (POSTCARDS[i].slug === slug) return i;
    }
    return -1;
}

function updateDebug(msg) {
    /* Debug output removed in production */
    void msg;
}

/* ================================================================
   INIT
   ================================================================ */
function init() {
    /* Scene background overlay for wall ↔ slider color transition */
    var bg = document.createElement('div');
    bg.id = 'scene-bg';
    document.body.appendChild(bg);

    initWall();
    var animateIn = initPanZoom();
    initSlider();

    var slugFromURL = getSlideFromURL();
    var indexFromURL = slugFromURL ? slugToIndex(slugFromURL) : -1;

    if (indexFromURL !== -1) {
        // Deep link: reveal wall immediately and open specific slide
        revealWall();
        openSlide(indexFromURL);
    } else {
        // Normal load (iframe or standalone): go straight to wall
        revealWall(animateIn);
    }
}

init();
