<?php get_header(); ?>

	
		<main>

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();
                            
            $post_parent = get_page(49);
            require 'partials/page-header.php';
            
            require 'partials/modules.php';
            
			endwhile; // End the loop.
            
			?>

		</main><!-- #main -->

<?php get_footer(); ?>
