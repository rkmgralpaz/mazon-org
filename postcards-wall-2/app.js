/**
 * app.js – Postcards Wall 2 (Roulette Slider)
 * ============================================================
 * Wall + PanZoom: identical to v1
 * Slider: completely rewritten with physics-based roulette
 * ============================================================
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ══════════════════════════════════════════════════════════ */

// WALL — ZOOM
var ZOOM_STEP = 0.3;
var MAX_SCALE = 2.0;

// WALL — FRONT/BACK DISTRIBUTION
var FRONTS_PER_BLOCK = 4;
var BLOCK_SIZE = 24;

// WALL — LQIP
var LQIP_STAGGER_PER_ROW = 40;
var LQIP_JITTER_MAX = 100;

// SLIDER — ROULETTE PHYSICS
var FRICTION = 0.92;                // per-frame friction (lower = stops sooner, gentler)
var SNAP_VEL_THRESHOLD = 0.005;     // velocity below this triggers snap (in cards/frame)
var SNAP_LERP = 0.07;              // lerp factor for smooth snap (lower = softer arrival)
var SNAP_SETTLE = 0.001;           // position threshold to consider settled
var RUBBER_BAND = 0.2;              // edge resistance factor
var DRAG_PIXELS_PER_CARD = 500;     // pixels of drag = 1 card (higher = needs more drag)
var VELOCITY_SAMPLE_MS = 100;       // window for velocity sampling
var WHEEL_SENSITIVITY = 0.001;      // wheel delta → velocity
var MAX_VELOCITY = 0.4;             // max cards/frame velocity cap
var FLIP_DURATION = 600;            // ms for flip animation

// SLIDER — ARROWS / BUTTONS
var ARROW_REPEAT_INITIAL = 220;     // ms before first repeat when holding
var ARROW_REPEAT_MIN = 70;          // ms minimum repeat interval (fastest)
var ARROW_REPEAT_ACCEL = 0.8;       // multiply interval each repeat (accelerate)

// SLIDER — HERO
var FLY_IN_FLIP_DELAY = 800;
var CLOSE_ANIMATION = 'fly-back';

// FLAT LAYOUT (like v1 but closer)
var CARD_SPACING_VW = 45;           // vw between card centers
var SIDE_SCALE = 0.595;             // scale of adjacent cards (match v1)
var SIDE_TILT = 2;                  // subtle degrees of rotation for side cards
var MAX_VISIBLE_CARDS = 1;          // only prev+next visible

// POOL
var POOL_SIZE = 5;                  // DOM card elements in the pool

/* ──────────────────────────────────────────────────────── */
/* FRONT IMAGES                                             */
/* ──────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────── */
/* POSTCARD DATA                                            */
/* ──────────────────────────────────────────────────────── */
var POSTCARDS = (function () {
    var list = [];
    for (var i = 1; i <= 100; i++) {
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

/* Front/Back distribution */
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

/* ──────────────────────────────────────────────────────── */
/* LAYOUT CONFIG                                            */
/* ──────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────── */
/* STATE                                                    */
/* ──────────────────────────────────────────────────────── */
var state = {
    currentSlide: -1,
    isInIframe: window.self !== window.top,
};

/* ──────────────────────────────────────────────────────── */
/* DOM REFERENCES                                           */
/* ──────────────────────────────────────────────────────── */
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
    zoomIn: document.getElementById('zoom-in-btn'),
    zoomOut: document.getElementById('zoom-out-btn'),
};

function revealWall(animateIn) {
    dom.wallContainer.classList.add('is-visible');
    if (typeof animateIn === 'function') animateIn();
}

/* ================================================================
   MODULE: WALL (identical to v1)
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
        el.style.setProperty('--rotation', rotation + 'deg');
        el.style.setProperty('--hover-rotation', rand(-rotMax, rotMax) + 'deg');

        var flipper = document.createElement('div');
        flipper.className = 'postcard-flipper';

        var frontFace = document.createElement('div');
        frontFace.className = 'postcard-face postcard-face--front';
        var frontImg = document.createElement('img');
        frontImg.src = card.frontLqip;
        frontImg.dataset.thumb = card.frontThumb;
        frontImg.alt = 'Postcard ' + (index + 1) + ' front';
        frontImg.loading = 'lazy';
        frontImg.className = 'is-lqip';
        frontFace.appendChild(frontImg);

        var backFace = document.createElement('div');
        backFace.className = 'postcard-face postcard-face--back';
        var backImg = document.createElement('img');
        backImg.src = card.lqipFile;
        backImg.dataset.thumb = card.thumbFile;
        backImg.alt = 'Postcard ' + (index + 1);
        backImg.loading = 'lazy';
        backImg.className = 'is-lqip';
        backFace.appendChild(backImg);

        flipper.appendChild(frontFace);
        flipper.appendChild(backFace);
        el.appendChild(flipper);
        dom.wallCanvas.appendChild(el);

        var delay = row * LQIP_STAGGER_PER_ROW + Math.random() * LQIP_JITTER_MAX;
        loadThumbWithDelay(backImg, delay);
        if (isFront) loadThumbWithDelay(frontImg, delay);
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
   MODULE: PAN & ZOOM (identical to v1)
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

    var DRAG_THRESHOLD = 5;
    var MOMENTUM_DECAY = 0.92;
    var MOMENTUM_MIN = 0.3;
    var VEL_WINDOW_MS = 100;

    var pointerMoved = false;
    var pendingClickTarget = null;
    var velX = 0, velY = 0;
    var velSamples = [];
    var momentumActive = false;

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

    /* Touch support */
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
   MODULE: ROULETTE SLIDER
   ================================================================ */

/* ── Roulette state ── */
var roulette = {
    position: 0,         // fractional card index (e.g. 42.7)
    velocity: 0,         // cards per frame (~16ms)
    targetSnap: -1,      // target integer index when snapping
    phase: 'idle',       // idle | dragging | momentum | snapping | settled
    lastTime: 0,
    rafId: null,
    dragStartX: 0,
    dragStartPos: 0,
    velSamples: [],
    isFlipped: false,    // whether center card is currently showing back
    settledIndex: -1,    // last fully settled card (flipped)
};

/* ── Card pool ── */
var cardPool = [];       // array of {el, assignedIndex}
var openOriginEl = null;
var flyInFlipTimer = null;

function initSlider() {
    /* Create pool of card DOM elements */
    for (var i = 0; i < POOL_SIZE; i++) {
        var el = document.createElement('div');
        el.className = 'slider-card';
        dom.sliderTrack.appendChild(el);
        cardPool.push({ el: el, assignedIndex: -1 });
    }

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

    /* Keyboard — allow repeat for hold */
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

    dom.sliderTrack.addEventListener('pointerdown', function (e) {
        if (!dom.sliderModal.classList.contains('is-open')) return;
        if (e.target.closest('#slider-nav') || e.target.closest('#slider-close')) return;

        e.preventDefault();
        dom.sliderTrack.setPointerCapture(e.pointerId);

        sliderDragging = true;
        sliderDragMoved = false;

        /* Cancel any ongoing momentum/snap */
        roulette.phase = 'dragging';
        roulette.velocity = 0;
        roulette.dragStartX = e.clientX;
        roulette.dragStartPos = roulette.position;
        roulette.velSamples = [{ x: e.clientX, t: performance.now() }];

        /* Unflip center immediately during drag */
        unflipAll();
    });

    dom.sliderTrack.addEventListener('pointermove', function (e) {
        if (!sliderDragging) return;

        var dx = e.clientX - roulette.dragStartX;
        if (!sliderDragMoved && Math.abs(dx) > 5) sliderDragMoved = true;

        /* Convert pixel drag to card positions (negative because drag right = go to previous) */
        var cardDelta = -dx / DRAG_PIXELS_PER_CARD;
        var rawPos = roulette.dragStartPos + cardDelta;

        /* Rubber-band at edges */
        if (rawPos < 0) {
            roulette.position = rawPos * RUBBER_BAND;
        } else if (rawPos > POSTCARDS.length - 1) {
            var over = rawPos - (POSTCARDS.length - 1);
            roulette.position = (POSTCARDS.length - 1) + over * RUBBER_BAND;
        } else {
            roulette.position = rawPos;
        }

        /* Velocity sampling */
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

        /* Click without drag → do nothing special */
        if (!sliderDragMoved) {
            roulette.phase = 'snapping';
            roulette.targetSnap = Math.round(roulette.position);
            roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
            startRouletteLoop();
            return;
        }

        /* Calculate release velocity from samples */
        var vel = 0;
        var samples = roulette.velSamples;
        if (samples.length >= 2) {
            var oldest = samples[0];
            var newest = samples[samples.length - 1];
            var elapsed = newest.t - oldest.t;
            if (elapsed > 0) {
                var pxVel = (newest.x - oldest.x) / elapsed; // px/ms
                vel = -pxVel * 16 / DRAG_PIXELS_PER_CARD;    // cards/frame
            }
        }

        /* Clamp velocity for gentle, controlled feel */
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

    /* ── Wheel / trackpad on slider ── */
    dom.sliderModal.addEventListener('wheel', function (e) {
        if (!dom.sliderModal.classList.contains('is-open')) return;
        e.preventDefault();

        var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

        /* Add velocity impulse */
        roulette.velocity += delta * WHEEL_SENSITIVITY;

        /* Clamp */
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
}

/* ── Step exactly 1 card (arrows, buttons) ── */
function stepCard(direction) {
    if (!dom.sliderModal.classList.contains('is-open')) return;

    /* If settled or idle, unflip first */
    if (roulette.phase === 'settled' || roulette.phase === 'idle') {
        unflipAll();
    }

    /* If already snapping, just move the target further */
    if (roulette.phase === 'snapping') {
        roulette.targetSnap += direction;
    } else {
        /* From momentum or other: snap to nearest + direction */
        roulette.targetSnap = Math.round(roulette.position) + direction;
        roulette.velocity = 0;
    }

    roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
    roulette.phase = 'snapping';
    startRouletteLoop();
}

/* ── Button hold repeat system ── */
var _btnRepeatTimer = null;
var _btnRepeatInterval = ARROW_REPEAT_INITIAL;

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
    roulette.isFlipped = false;
    roulette.settledIndex = -1;
    for (var i = 0; i < cardPool.length; i++) {
        var flipper = cardPool[i].el.querySelector('.slider-flipper');
        if (flipper) {
            flipper.classList.add('no-flip-transition');
            flipper.classList.remove('is-flipped');
            /* Force reflow then remove no-transition */
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
            break;
        }
    }
}

/* ── The main roulette physics loop ── */
function startRouletteLoop() {
    if (roulette.rafId) return; // already running
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

    var dt = Math.min(timestamp - roulette.lastTime, 48); // cap at ~3 frames
    roulette.lastTime = timestamp;
    var dtNorm = dt / 16.667; // normalize to 60fps

    if (roulette.phase === 'momentum') {
        /* Apply friction */
        roulette.velocity *= Math.pow(FRICTION, dtNorm);
        roulette.position += roulette.velocity * dtNorm;

        /* Edge clamping with bounce */
        if (roulette.position < 0) {
            roulette.position = 0;
            roulette.velocity = Math.abs(roulette.velocity) * 0.3;
            if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) roulette.velocity = 0;
        } else if (roulette.position > POSTCARDS.length - 1) {
            roulette.position = POSTCARDS.length - 1;
            roulette.velocity = -Math.abs(roulette.velocity) * 0.3;
            if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) roulette.velocity = 0;
        }

        /* Transition to snapping when slow enough */
        if (Math.abs(roulette.velocity) < SNAP_VEL_THRESHOLD) {
            roulette.phase = 'snapping';
            roulette.targetSnap = Math.round(roulette.position);
            roulette.targetSnap = Math.max(0, Math.min(POSTCARDS.length - 1, roulette.targetSnap));
            roulette.velocity = 0;
        }
    }

    if (roulette.phase === 'snapping') {
        /* Smooth lerp toward target — no overshoot */
        var displacement = roulette.targetSnap - roulette.position;
        var lerpFactor = 1 - Math.pow(1 - SNAP_LERP, dtNorm);
        roulette.position += displacement * lerpFactor;
        roulette.velocity = 0;

        /* Settle check */
        if (Math.abs(displacement) < SNAP_SETTLE) {
            roulette.position = roulette.targetSnap;
            roulette.velocity = 0;
            roulette.phase = 'settled';

            /* Update state */
            state.currentSlide = roulette.targetSnap;
            var card = POSTCARDS[state.currentSlide];
            notifyParent(card.slug);
            updateURL(card.slug);

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

    /* Continue loop if not settled */
    if (roulette.phase !== 'settled' && roulette.phase !== 'idle') {
        roulette.rafId = requestAnimationFrame(rouletteFrame);
    }
}

/* ── Update all pool card transforms based on current position ── */
function updateCardPositions() {
    var center = roulette.position;
    var centerInt = Math.round(center);

    /* Determine which card indices need to be visible */
    var visibleIndices = [];
    for (var offset = -MAX_VISIBLE_CARDS; offset <= MAX_VISIBLE_CARDS; offset++) {
        var idx = centerInt + offset;
        if (idx >= 0 && idx < POSTCARDS.length) {
            visibleIndices.push(idx);
        }
    }

    /* Assign pool cards to visible indices */
    /* First, mark which pool cards are already correctly assigned */
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

    /* Assign unassigned pools to missing indices */
    for (var v = 0; v < visibleIndices.length; v++) {
        var vi = visibleIndices[v];
        if (!usedPools[vi] && unassigned.length > 0) {
            var poolCard = unassigned.shift();
            renderSliderCard(poolCard.el, vi);
            poolCard.assignedIndex = vi;
            usedPools[vi] = poolCard;

            /* If this card was previously the settled+flipped card, restore flip */
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

    /* Position each visible card — flat layout like v1 */
    var vpW = window.innerWidth;
    var spacingPx = vpW * CARD_SPACING_VW / 100;

    for (var vi2 = 0; vi2 < visibleIndices.length; vi2++) {
        var idx2 = visibleIndices[vi2];
        var pool2 = usedPools[idx2];
        if (!pool2) continue;

        var dist = idx2 - center; // fractional distance from center
        var absDist = Math.abs(dist);

        /* Horizontal offset */
        var translateX = dist * spacingPx;

        /* Scale: lerp from 1 (center) to SIDE_SCALE (±1) */
        var scaleVal = 1 - (1 - SIDE_SCALE) * Math.min(absDist, 1);

        /* Subtle tilt like v1: +2° left, -2° right, 0° center */
        var tilt = 0;
        if (dist < -0.1) tilt = SIDE_TILT * Math.min(absDist, 1);
        else if (dist > 0.1) tilt = -SIDE_TILT * Math.min(absDist, 1);

        /* Opacity: fade cards beyond ±1 */
        var opacity = absDist <= 1 ? 1 : Math.max(0, 1 - (absDist - 1) * 2);

        /* Z-index: center on top */
        var zIndex = absDist < 0.5 ? 2 : 1;

        pool2.el.style.transform =
            'translate3d(' + translateX + 'px, 0, 0) ' +
            'scale(' + scaleVal + ') ' +
            'rotate(' + tilt + 'deg)';
        pool2.el.style.opacity = opacity;
        pool2.el.style.zIndex = zIndex;
        pool2.el.style.pointerEvents = absDist < 0.5 ? 'auto' : 'none';

        if (absDist < 0.5) {
            pool2.el.classList.add('is-center');
        } else {
            pool2.el.classList.remove('is-center');
        }
    }
}

/* ── Update counter display ── */
function updateCounter() {
    var idx = Math.round(roulette.position);
    idx = Math.max(0, Math.min(POSTCARDS.length - 1, idx));
    dom.sliderCurrent.textContent = idx + 1;
}

/* ── Render card content ── */
function renderSliderCard(containerEl, index) {
    containerEl.innerHTML = '';
    if (index < 0 || index >= POSTCARDS.length) return;

    var card = POSTCARDS[index];

    var flipper = document.createElement('div');
    flipper.className = 'slider-flipper';

    var frontFace = document.createElement('div');
    frontFace.className = 'slider-face slider-face--front';
    var frontImg = document.createElement('img');
    frontImg.src = card.frontLqip;
    frontImg.alt = 'Postcard ' + (index + 1) + ' front';
    frontImg.classList.add('is-thumb-placeholder');
    frontFace.appendChild(frontImg);
    upgradeImage(frontImg, card.frontThumb, card.frontFile);

    var backFace = document.createElement('div');
    backFace.className = 'slider-face slider-face--back';
    var backImg = document.createElement('img');
    backImg.src = card.lqipFile;
    backImg.alt = 'Postcard ' + (index + 1);
    backImg.classList.add('is-thumb-placeholder');
    backFace.appendChild(backImg);
    upgradeImage(backImg, card.thumbFile, card.file);

    flipper.appendChild(frontFace);
    flipper.appendChild(backFace);
    containerEl.appendChild(flipper);
}

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

function preloadSliderImages(index) {
    if (index < 0 || index >= POSTCARDS.length) return;
    var card = POSTCARDS[index];
    new Image().src = card.frontFile;
    new Image().src = card.file;
}

/* ══════════════════════════════════════════════════════════
   openSlide() – Open slider from wall click
   ══════════════════════════════════════════════════════════ */
function openSlide(index, originEl) {
    if (index < 0 || index >= POSTCARDS.length) return;

    /* If already open, add impulse toward that card */
    if (state.currentSlide !== -1 && dom.sliderModal.classList.contains('is-open')) {
        var diff = index - roulette.position;
        if (Math.abs(diff) > 0.5) {
            unflipAll();
            roulette.velocity = diff * 0.08;
            roulette.phase = 'momentum';
            startRouletteLoop();
        }
        return;
    }

    state.currentSlide = index;
    openOriginEl = originEl || null;

    var card = POSTCARDS[index];
    notifyParent(card.slug);
    updateURL(card.slug);
    dom.sliderCurrent.textContent = index + 1;

    /* Initialize roulette state */
    roulette.position = index;
    roulette.velocity = 0;
    roulette.phase = 'idle';
    roulette.targetSnap = index;
    roulette.isFlipped = false;
    roulette.settledIndex = -1;

    /* Reset pool assignments */
    for (var i = 0; i < cardPool.length; i++) {
        cardPool[i].assignedIndex = -1;
        cardPool[i].el.style.opacity = '0';
    }

    /* Preload nearby images */
    for (var p = -3; p <= 3; p++) {
        preloadSliderImages(index + p);
    }

    /* HERO EXPAND */
    if (originEl) {
        var fromRect = originEl.getBoundingClientRect();
        var cardW = parseFloat(originEl.style.width);
        var cardH = parseFloat(originEl.style.height);
        var wallRotation = originEl.style.getPropertyValue('--rotation');
        var cardShowsFront = (card.face === 'front');

        /* Create clone */
        var aabbCx = fromRect.left + fromRect.width / 2;
        var aabbCy = fromRect.top + fromRect.height / 2;
        var cloneLeft = aabbCx - cardW / 2;
        var cloneTop = aabbCy - cardH / 2;

        var clone = document.createElement('div');
        clone.className = 'hero-clone';
        clone.style.left = cloneLeft + 'px';
        clone.style.top = cloneTop + 'px';
        clone.style.width = cardW + 'px';
        clone.style.height = cardH + 'px';
        clone.style.transform = 'rotate(' + wallRotation + ')';

        var img = document.createElement('img');
        img.src = cardShowsFront ? card.frontThumb : card.thumbFile;
        img.alt = '';
        clone.appendChild(img);
        document.body.appendChild(clone);

        void clone.offsetHeight;

        /* Calculate target: center of viewport */
        var vpW = window.innerWidth;
        var vpH = window.innerHeight;
        var targetW = Math.min(vpW * 0.5245, 900);
        var targetH = targetW / (cardW / cardH);
        if (targetH > vpH * 0.85) {
            targetH = vpH * 0.85;
            targetW = targetH * (cardW / cardH);
        }
        var toLeft = (vpW - targetW) / 2;
        var toTop = (vpH - targetH) / 2;

        var dx = (toLeft + targetW / 2) - aabbCx;
        var dy = (toTop + targetH / 2) - aabbCy;
        var sx = targetW / cardW;
        var sy = targetH / cardH;

        clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ') rotate(0deg)';
        clone.style.boxShadow = '0 8px 48px rgba(0,0,0,0.5)';

        clone.addEventListener('transitionend', function onArrived(e) {
            if (e.propertyName !== 'transform') return;
            clone.removeEventListener('transitionend', onArrived);

            requestAnimationFrame(function () {
                dom.sliderModal.classList.add('is-open');
                if (dom.sliderNav) dom.sliderNav.classList.add('is-visible');

                if (clone.parentNode) clone.parentNode.removeChild(clone);

                /* Now render cards and show */
                updateCardPositions();

                /* Flip center after delay */
                roulette.phase = 'settled';
                roulette.settledIndex = index;
                flyInFlipTimer = setTimeout(function () {
                    flyInFlipTimer = null;
                    if (roulette.phase === 'settled') {
                        flipSettledCard();
                    }
                }, FLY_IN_FLIP_DELAY);
            });
        });

    } else {
        /* Deep link — no hero animation */
        dom.sliderModal.classList.add('is-open');
        if (dom.sliderNav) dom.sliderNav.classList.add('is-visible');
        updateCardPositions();

        roulette.phase = 'settled';
        roulette.settledIndex = index;
        setTimeout(function () {
            if (roulette.phase === 'settled') {
                flipSettledCard();
            }
        }, 200);
    }
}

/* ══════════════════════════════════════════════════════════
   closeSlider()
   ══════════════════════════════════════════════════════════ */
function closeSlider() {
    if (flyInFlipTimer) {
        clearTimeout(flyInFlipTimer);
        flyInFlipTimer = null;
    }
    stopRouletteLoop();

    var wallCard = document.querySelector('.postcard-item[data-index="' + Math.round(roulette.position) + '"]');

    if (CLOSE_ANIMATION === 'fly-back' && wallCard) {
        _closeWithFlyBack(wallCard);
    } else {
        _closeInstant();
    }
}

function _closeInstant() {
    dom.sliderModal.classList.remove('is-open');
    if (dom.sliderNav) dom.sliderNav.classList.remove('is-visible');
    state.currentSlide = -1;
    roulette.phase = 'idle';
    openOriginEl = null;
}

function _closeWithFlyBack(wallCard) {
    /* Find the visible center pool card */
    var centerIdx = Math.round(roulette.position);
    var centerPool = null;
    for (var i = 0; i < cardPool.length; i++) {
        if (cardPool[i].assignedIndex === centerIdx) {
            centerPool = cardPool[i];
            break;
        }
    }

    if (!centerPool) {
        _closeInstant();
        return;
    }

    /* Source: visible face of center card */
    var flipper = centerPool.el.querySelector('.slider-flipper');
    var isFlipped = flipper && flipper.classList.contains('is-flipped');
    var faceSelector = isFlipped ? '.slider-face--back img' : '.slider-face--front img';
    var srcImg = centerPool.el.querySelector(faceSelector) || centerPool.el.querySelector('img');
    var fromRect = srcImg ? srcImg.getBoundingClientRect() : centerPool.el.getBoundingClientRect();

    /* Target: wall card */
    var wallFaceClass = wallCard.dataset.face === 'front' ? '.postcard-face--front img' : '.postcard-face--back img';
    var wallImg = wallCard.querySelector(wallFaceClass) || wallCard.querySelector('img');
    var toRect = wallImg ? wallImg.getBoundingClientRect() : wallCard.getBoundingClientRect();
    var wallRotation = wallCard.style.getPropertyValue('--rotation') || '0deg';

    /* Create clone */
    var clone = document.createElement('div');
    clone.className = 'hero-clone';
    clone.style.left = fromRect.left + 'px';
    clone.style.top = fromRect.top + 'px';
    clone.style.width = fromRect.width + 'px';
    clone.style.height = fromRect.height + 'px';
    clone.style.transform = 'rotate(0deg)';
    clone.style.boxShadow = '0 8px 48px rgba(0,0,0,0.5)';
    clone.style.transition = 'none';

    var img = new Image();
    img.src = srcImg ? srcImg.src : '';
    img.alt = '';
    clone.appendChild(img);
    document.body.appendChild(clone);

    /* Hide slider */
    dom.sliderModal.classList.remove('is-open');
    if (dom.sliderNav) dom.sliderNav.classList.remove('is-visible');
    state.currentSlide = -1;
    roulette.phase = 'idle';
    openOriginEl = null;

    void clone.offsetHeight;
    clone.style.transition = '';

    /* Animate to wall card */
    var dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
    var dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
    var sx = toRect.width / fromRect.width;
    var sy = toRect.height / fromRect.height;

    clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ') rotate(' + wallRotation + ')';
    clone.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';

    clone.addEventListener('transitionend', function onBack(e) {
        if (e.propertyName !== 'transform') return;
        clone.removeEventListener('transitionend', onBack);
        if (clone.parentNode) clone.parentNode.removeChild(clone);
    });
}

/* ================================================================
   UTILITIES
   ================================================================ */
function notifyParent(slug) {
    window.parent.postMessage({ type: 'SLIDE_CHANGE', slug: slug }, '*');
}

function updateURL(slug) {
    if (state.isInIframe) return;
    var url = new URL(window.location.href);
    url.searchParams.set('slide', slug);
    window.history.replaceState({ slide: slug }, '', url.toString());
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

function updateDebug(msg) { void msg; }

/* ================================================================
   INIT
   ================================================================ */
function init() {
    initWall();
    var animateIn = initPanZoom();
    initSlider();

    var slugFromURL = getSlideFromURL();
    var indexFromURL = slugFromURL ? slugToIndex(slugFromURL) : -1;

    if (indexFromURL !== -1) {
        revealWall();
        openSlide(indexFromURL);
    } else {
        revealWall(animateIn);
    }
}

init();
