<?php
/**
 * Template Name: Postcards — Wall 3
 * Description: Postcards wall con slider roulette (physics-based).
 *              Wall visual de v1 + slider con inercia de v2.
 */

// ACF fields for buttons
$link_1 = get_field('link_1');
$link_2 = get_field('link_2');

get_header(); ?>

<style>
/* ── Overlay Buttons (WordPress layer, above iframe) ── */
.postcards-overlay-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
}

.postcards-overlay-buttons__links {
  display: flex;
  flex-direction: row;
  gap: 18px;
}

.postcards-overlay-buttons__share {
  position: relative;
}

/* Button base */
.postcards-btn {

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 88px;
  background: #033052;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-family: sofia-pro, sans-serif;
  font-size: 21px;
  font-style: normal;
  font-weight: 800;
  line-height: 1;

  transition: background 0.2s;
  height: 56px;
}
.postcards-btn:hover { background: #04436e; }

.postcards-btn--icon {
  width: 56px;
  height: 56px;
  padding: 16px;
}

.postcards-btn--link {
  padding: 12px 24px 16px 24px;
  white-space: nowrap;
}

/* ── Share Menu (deploys upward) ── */
.postcards-share-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, gap 0.4s ease;
}

.postcards-share-menu.is-open {
  gap: 8px;
  opacity: 1;
  pointer-events: all;
}

.postcards-share-btn {
  display: flex;
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 88px;
  background: #033052;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.3s ease-out, opacity 0.3s ease-out;
  transform: translateY(20px);
  opacity: 0;
}
.postcards-share-btn:hover { background: #04436e; }

.postcards-share-menu.is-open .postcards-share-btn {
  transform: translateY(0);
  opacity: 1;
}

/* Stagger the animation */
.postcards-share-menu.is-open .postcards-share-btn:nth-child(1) { transition-delay: 0s; }
.postcards-share-menu.is-open .postcards-share-btn:nth-child(2) { transition-delay: 0.04s; }
.postcards-share-menu.is-open .postcards-share-btn:nth-child(3) { transition-delay: 0.08s; }
.postcards-share-menu.is-open .postcards-share-btn:nth-child(4) { transition-delay: 0.12s; }

/* Share button icon colors */
.postcards-share-btn svg path[fill] { fill: white; }
.postcards-share-btn svg path[stroke] { stroke: white; }

/* Link copied feedback */
.postcards-copied-feedback {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: #033052;
  color: white;
  padding: 10px 20px;
  border-radius: 88px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.postcards-copied-feedback.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Share button active state */
.postcards-btn--icon.is-active {
  background: #04436e;
}

/* ── Responsive (≤699px) ── */
@media (max-width: 699px) {
  .postcards-overlay-buttons {
    bottom: auto;
    right: auto;
    top: 90px; /* 70px header + 20px */
    left: 20px;
    flex-direction: column;
    align-items: flex-start;
  }

  .postcards-overlay-buttons__links {
    position: fixed;
    bottom: 20px;
    right: 20px;
    flex-direction: column;
    gap: 8px;
  }

  .postcards-btn {
    height: 45px;
  }

  .postcards-btn--icon {
    width: 45px;
    height: 45px;
    padding: 12px;
  }

  .postcards-btn--link {
    font-size: 16px;
    padding: 10px 20px 12px 20px;
  }

  .postcards-share-btn {
    width: 45px;
    height: 45px;
  }

  .postcards-share-menu {
    bottom: auto;
    top: calc(100% + 8px);
    right: auto;
    left: 0;
  }

  .postcards-share-btn {
    transform: translateY(-20px);
  }

  .postcards-copied-feedback {
    bottom: auto;
    top: 0;
    right: auto;
    left: calc(100% + 8px);
  }
}
</style>

<main class="postcards-page" style="
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
">
  <iframe
    id="postcards-wall-iframe"
    src="<?php echo get_template_directory_uri(); ?>/postcards-wall-3/index.html"
    width="100%"
    style="
      display: block;
      width: 100%;
      flex: 1;
      min-height: 0;
      border: none;
    "
    frameborder="0"
    allowfullscreen
    title="Postcards Wall"
  ></iframe>

  <!-- Overlay Buttons (WordPress layer, above iframe) -->
  <div class="postcards-overlay-buttons">
    <div class="postcards-overlay-buttons__share">
      <button class="postcards-btn postcards-btn--icon js-postcards-share" aria-label="Share" aria-expanded="false">
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5761 8.26691C15.7796 8.09254 15.8813 8.00536 15.9186 7.90161C15.9513 7.81055 15.9513 7.71094 15.9186 7.61988C15.8813 7.51613 15.7796 7.42894 15.5761 7.25457L8.51719 1.20405C8.167 0.903887 7.99191 0.753805 7.84367 0.750128C7.71483 0.746933 7.59177 0.803534 7.51035 0.903432C7.41667 1.01838 7.41667 1.24899 7.41667 1.71022V5.2896C5.63777 5.60081 4.00966 6.50221 2.79976 7.85563C1.48069 9.33117 0.751029 11.2407 0.75 13.2199V13.7299C1.62445 12.6765 2.71626 11.8245 3.95063 11.2323C5.03891 10.7103 6.21535 10.401 7.41667 10.3195V13.8113C7.41667 14.2725 7.41667 14.5031 7.51035 14.6181C7.59177 14.718 7.71483 14.7746 7.84367 14.7714C7.99191 14.7677 8.167 14.6176 8.51719 14.3174L15.5761 8.26691Z" stroke="white" stroke-width="1.5" stroke-linecap="square"/>
        </svg>
      </button>
      <div class="postcards-share-menu js-postcards-share-menu" aria-hidden="true">
        <button class="postcards-share-btn" data-network="instagram" aria-label="Share on Instagram">
          <?php include get_template_directory() . '/postcards-wall/icons/social-instagram.svg'; ?>
        </button>
        <button class="postcards-share-btn" data-network="linkedin" aria-label="Share on LinkedIn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5713 2C21.3302 2 22 2.67006 22 3.47363V20.5713C22 21.3749 21.3302 22 20.5713 22H3.38379C2.62492 21.9999 2 21.3748 2 20.5713V3.47363C2 2.67011 2.62492 2.00008 3.38379 2H20.5713ZM5.08008 19.1426H8.02637V9.63379H5.08008V19.1426ZM15.5713 9.36621C14.1428 9.36626 13.1606 10.1698 12.7588 10.9287H12.7139V9.63379H9.90137V19.1426H12.8486V14.4551C12.8487 13.2052 13.0715 12.0001 14.6338 12C16.1516 12 16.1514 13.4286 16.1514 14.5V19.1426H19.1426V13.9199C19.1426 11.3753 18.5624 9.36621 15.5713 9.36621ZM6.55371 4.85742C5.57157 4.85742 4.8125 5.66113 4.8125 6.59863C4.81273 7.53594 5.57171 8.29492 6.55371 8.29492C7.49101 8.29485 8.24977 7.53589 8.25 6.59863C8.25 5.66118 7.49115 4.8575 6.55371 4.85742Z" fill="white"/>
          </svg>
        </button>
        <button class="postcards-share-btn" data-network="facebook" aria-label="Share on Facebook">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0674 2C15.4441 2.00006 16.8848 2.24316 16.8848 2.24316V5.30078H15.2959C13.7324 5.30094 13.2461 6.26026 13.2461 7.24316V9.57324H16.7373L16.1787 13.165H13.2461V21.8496C12.6044 21.9491 11.9471 22 11.2783 22C10.6097 22 9.9531 21.9491 9.31152 21.8496V13.165H6.11523V9.57324H9.31152V6.83496C9.31152 3.72086 11.1907 2 14.0674 2Z" fill="white"/>
          </svg>
        </button>
        <button class="postcards-share-btn js-copy-link" aria-label="Copy link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H9M15 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15M7 12L17 12" stroke="white" stroke-width="1.5" stroke-linecap="square"/>
          </svg>
        </button>
      </div>
      <span class="postcards-copied-feedback js-postcards-copied">Link copied!</span>
    </div>
    <div class="postcards-overlay-buttons__links">
      <?php if ($link_1) : ?>
        <a href="<?php echo esc_url($link_1['url']); ?>" class="postcards-btn postcards-btn--link" <?php echo !empty($link_1['target']) ? 'target="' . esc_attr($link_1['target']) . '"' : ''; ?>>
          <?php echo esc_html($link_1['title']); ?>
        </a>
      <?php endif; ?>

      <?php if ($link_2) : ?>
        <a href="<?php echo esc_url($link_2['url']); ?>" class="postcards-btn postcards-btn--link" <?php echo !empty($link_2['target']) ? 'target="' . esc_attr($link_2['target']) . '"' : ''; ?>>
          <?php echo esc_html($link_2['title']); ?>
        </a>
      <?php endif; ?>
    </div>
  </div>
</main>

<script>
(function () {
  // ── IFRAME SYNC ──────────────────────────────────────────────
  var iframe = document.getElementById('postcards-wall-iframe');

  var parentParams = new URLSearchParams(window.location.search);
  var initialSlide = parentParams.get('slide');

  if (initialSlide) {
    var currentSrc = new URL(iframe.src);
    currentSrc.searchParams.set('slide', initialSlide);
    iframe.src = currentSrc.toString();
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data) return;
    if (data.type === 'SLIDE_CHANGE') {
      var url = new URL(window.location.href);
      url.searchParams.set('slide', data.slug);
      window.history.pushState({ slide: data.slug }, '', url.toString());
    } else if (data.type === 'SLIDE_CLOSE') {
      var url = new URL(window.location.href);
      url.searchParams.delete('slide');
      window.history.pushState({}, '', url.toString());
    }
  });

  window.addEventListener('popstate', function (event) {
    var popState = event.state;
    var slug = (popState && popState.slide) || 'postcard-001';
    iframe.contentWindow.postMessage({ type: 'SET_SLIDE', slug: slug }, '*');
  });

  // ── SHARE BUTTON ─────────────────────────────────────────────
  var shareBtn = document.querySelector('.js-postcards-share');
  var shareMenu = document.querySelector('.js-postcards-share-menu');
  var copiedFeedback = document.querySelector('.js-postcards-copied');
  var inactivityTimer = null;
  var INACTIVITY_DELAY = 2000;

  function getShareURL() {
    return window.location.href;
  }

  function openMenu() {
    shareBtn.classList.add('is-active');
    shareBtn.setAttribute('aria-expanded', 'true');
    shareMenu.classList.add('is-open');
    shareMenu.setAttribute('aria-hidden', 'false');
    startInactivityTimer();
  }

  function closeMenu() {
    shareBtn.classList.remove('is-active');
    shareBtn.setAttribute('aria-expanded', 'false');
    shareMenu.classList.remove('is-open');
    shareMenu.setAttribute('aria-hidden', 'true');
    clearInactivityTimer();
  }

  function toggleMenu() {
    // Mobile: use native share if available
    if ('share' in navigator && window.innerWidth <= 699) {
      navigator.share({
        title: document.title,
        url: getShareURL()
      }).catch(function () {});
      return;
    }
    // Desktop: toggle custom menu
    if (shareMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function startInactivityTimer() {
    clearInactivityTimer();
    inactivityTimer = setTimeout(closeMenu, INACTIVITY_DELAY);
  }

  function clearInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Pause timer on hover
  if (shareMenu) {
    shareMenu.addEventListener('mouseenter', clearInactivityTimer);
    shareMenu.addEventListener('mouseleave', startInactivityTimer);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shareMenu && shareMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (shareMenu && shareMenu.classList.contains('is-open')) {
      if (!e.target.closest('.postcards-overlay-buttons__share')) {
        closeMenu();
      }
    }
  });

  // Social share click handler
  var SHARE_URLS = {
    instagram: function (url) { return <?php echo json_encode(esc_url(get_field('instagram', 'option')) ?: 'https://www.instagram.com/'); ?>; },
    linkedin: function (url) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url); },
    facebook: function (url) { return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url); }
  };

  document.querySelectorAll('.postcards-share-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var network = btn.dataset.network;

      if (btn.classList.contains('js-copy-link')) {
        // Copy link
        var shareURL = getShareURL();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareURL).then(showCopied).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }
        return;
      }

      if (network && SHARE_URLS[network]) {
        var popupUrl = SHARE_URLS[network](getShareURL());
        var w = 600, h = 500;
        var left = (screen.width - w) / 2;
        var top = (screen.height - h) / 2;
        window.open(popupUrl, 'share-' + network, 'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top);
        setTimeout(closeMenu, 500);
      }
    });
  });

  function fallbackCopy() {
    var ta = document.createElement('textarea');
    ta.value = getShareURL();
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied();
  }

  function showCopied() {
    if (!copiedFeedback) return;
    copiedFeedback.classList.add('is-visible');
    setTimeout(function () {
      copiedFeedback.classList.remove('is-visible');
    }, 1500);
    setTimeout(closeMenu, 500);
  }
})();
</script>

<?php get_footer(); ?>
