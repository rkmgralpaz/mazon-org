<?php
/**
 * Template Name: Postcards — Intro
 * Description: Página de introducción a la campaña Postcards.
 *              Muestra título, texto y botón (ACF) + 4 postales decorativas.
 *              No carga lógica del muro ni del slider.
 *              Estilos en: sass/main/_postcards-intro.scss
 */

get_header();

/* ── ACF Fields ─────────────────────────────────────────────── */
$intro_title = get_field('intro_title');
$intro_text  = get_field('intro_text');
$intro_link  = get_field('intro_link');

/* intro_link return_format = array → [ url, title, target ] */
$link_url    = $intro_link ? $intro_link['url']    : '#';
$link_title  = $intro_link ? $intro_link['title']  : 'Browse Postcards';
$link_target = ($intro_link && !empty($intro_link['target'])) ? $intro_link['target'] : '_self';

/* ── Base URL para las imágenes (JS hace la aleatorización) ── */
$intro_base_url = get_template_directory_uri() . '/assets/postcards/intro/';
?>

<main class="postcards-intro">

  <!-- Decorative postcards (JS asigna src aleatorio) -->
  <div class="postcards-intro__postal postcards-intro__postal--1"><img alt="" aria-hidden="true" width="800" height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--2"><img alt="" aria-hidden="true" width="800" height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--3"><img alt="" aria-hidden="true" width="800" height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--4"><img alt="" aria-hidden="true" width="800" height="600"></div>

  <!-- Central content (title + text + CTA) -->
  <div class="postcards-intro__content">

    <?php if ($intro_title) : ?>
      <h1 class="postcards-intro__title"><?php echo esc_html($intro_title); ?></h1>
    <?php endif; ?>

    <?php if ($intro_text) : ?>
      <div class="postcards-intro__text"><?php echo wp_kses_post($intro_text); ?></div>
    <?php endif; ?>

    <?php if ($intro_link) : ?>
      <a
        href="<?php echo esc_url($link_url); ?>"
        class="postcards-intro__button"
        <?php if ($link_target !== '_self') : ?>target="<?php echo esc_attr($link_target); ?>" rel="noopener noreferrer"<?php endif; ?>
      >
        <?php echo esc_html($link_title); ?>
      </a>
    <?php endif; ?>

  </div>

</main>

<script>
(function () {
  var base = <?php echo json_encode(esc_url($intro_base_url)); ?>;

  // Fixed selection: LGBT front, blue front, two best backs
  var imgs = document.querySelectorAll('.postcards-intro__postal img');
  imgs[0].src = base + 'intro-front-01.webp'; // LGBT (rainbow flag)
  imgs[1].src = base + 'intro-back-05.webp';  // Feed the People
  imgs[2].src = base + 'intro-back-06.webp';  // We the People
  imgs[3].src = base + 'intro-front-05.webp'; // Blue (Nadie merece pasar hambre)

  // --header-height
  var header = document.getElementById('header');
  if (header) {
    document.documentElement.style.setProperty(
      '--header-height', header.offsetHeight + 'px'
    );
  }

  // Esperar a que carguen las 4 imágenes y mostrar animación
  var wrapper = document.querySelector('.postcards-intro');
  if (!wrapper) return;
  Promise.all(Array.prototype.map.call(imgs, function (img) {
    return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
  })).then(function () {
    wrapper.classList.add('postcards-intro--ready');
  });
})();
</script>
<?php get_footer(); ?>
