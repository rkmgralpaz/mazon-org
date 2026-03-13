<?php
/**
 * Template Name: Postcards — Intro
 * Description: Página de introducción a la campaña Postcards.
 *              Muestra título, texto y botón (ACF) + 4 postales decorativas.
 *              No carga lógica del muro ni del slider.
 *              Estilos en: sass/main/_postcards-intro.scss
 */

get_header();

$intro_title = get_field('intro_title');
$intro_text = get_field('intro_text');
$button_1 = get_field('button_1');
$button_2 = get_field('button_2');


$intro_base_url = get_template_directory_uri() . '/assets/postcards/intro/';
?>

<main class="postcards-intro">

  <div class="postcards-intro__postal postcards-intro__postal--1"><img alt="" aria-hidden="true" width="800"
      height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--2"><img alt="" aria-hidden="true" width="800"
      height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--3"><img alt="" aria-hidden="true" width="800"
      height="600"></div>
  <div class="postcards-intro__postal postcards-intro__postal--4"><img alt="" aria-hidden="true" width="800"
      height="600"></div>

  <!-- Central content (title + text + CTA) -->
  <div class="postcards-intro__content">

    <?php if ($intro_title): ?>
      <h1 class="postcards-intro__title"><?php echo esc_html($intro_title); ?></h1>
    <?php endif; ?>

    <?php if ($intro_text): ?>
      <div class="postcards-intro__text"><?php echo wp_kses_post($intro_text); ?></div>
    <?php endif; ?>

    <div class="postcards-intro__buttons">
      <?php if ($button_1): ?>
        <a href="<?php echo $button_1['url']; ?>" class="postcards-intro__button"
          target="<?php echo $button_1['target']; ?>" rel="noopener noreferrer">
          <?php echo $button_1['title']; ?>
        </a>
      <?php endif; ?>

      <?php if ($button_2): ?>
        <a href="<?php echo $button_2['url']; ?>" class="postcards-intro__button"
          target="<?php echo $button_2['target']; ?>" rel="noopener noreferrer">
          <?php echo $button_2['title']; ?>
        </a>
      <?php endif; ?>
    </div>

  </div>

</main>

<script>
  (function () {
    var base = <?php echo json_encode(esc_url($intro_base_url)); ?>;

    var imgs = document.querySelectorAll('.postcards-intro__postal img');
    imgs[0].src = base + 'intro-front-01.webp';
    imgs[1].src = base + 'intro-back-05.webp';
    imgs[2].src = base + 'intro-back-06.webp'; 
    imgs[3].src = base + 'intro-front-english.webp';
    var header = document.getElementById('header');
    if (header) {
      document.documentElement.style.setProperty(
        '--header-height', header.offsetHeight + 'px'
      );
    }

    var wrapper = document.querySelector('.postcards-intro');
    if (!wrapper) return;
    Promise.all(Array.prototype.map.call(imgs, function (img) {
      return img.decode ? img.decode().catch(function () { }) : Promise.resolve();
    })).then(function () {
      wrapper.classList.add('postcards-intro--ready');
    });
  })();
</script>
<?php get_footer(); ?>