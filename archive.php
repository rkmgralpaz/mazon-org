<?php get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();
				
            echo get_the_title();

			endwhile; // End the loop.
            
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
