<?php get_header(); ?>

			<?php

            // Start the Loop.
			while ( have_posts() ) : the_post();
            
            $post_id = 73;//get_page(73);
            //$ancestors = get_post_ancestors($post_id);
            $ancestor_link = 73;                
            require 'partials/page-header.php';
            
            $post_id = get_the_ID();
            require 'partials/modules.php';
            
			endwhile; // End the loop.

			?>

<?php get_footer(); ?>
