<?php get_header(); ?>

	
		<main>

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();
            
            $ancestors = get_post_ancestors(get_the_ID());
			if(count($ancestors) > 0):
				$ancestor_link = $ancestors[0];
			endif;
            require 'partials/page-header.php';
            
            if(count($ancestors) == 2):
                $post_id = 0;
            endif;
            
            require 'partials/modules.php';
            
			endwhile; // End the loop.
            
			?>

		</main><!-- #main -->

<?php get_footer(); ?>
