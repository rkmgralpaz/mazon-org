<?php get_header(); ?>


		<main>

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();

			if(!get_field('real3d_flipbook_view')):
				$pdf_file = get_field('pdf');
				$url = $pdf_file ? $pdf_file['url'] : BASE_URL;
				wp_redirect( $url );
				exit;
			endif;

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

			<?php echo do_shortcode( get_field('shortcode_pdf_viewer') ) ?>

			<br>
			<br>
			<br>
			<br>

		</main><!-- #main -->

<?php get_footer(); ?>
