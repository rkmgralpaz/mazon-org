<?php 

$location = home_url().$_SERVER["REQUEST_URI"];

if ($location != strtolower($location)) :
	wp_redirect( strtolower($location) );
	exit;
endif;

get_header(); ?>

	
		<main id="main" class="site-padding-2">

			<div class="page-not-found">Page not found!</div>

		</main><!-- #main -->
	

<?php get_footer(); ?>
