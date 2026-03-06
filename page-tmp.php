
<?php 
$hide_header_and_footer = true;
get_header(); ?>

	
		<main>

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();
            
            $ancestors = get_post_ancestors(get_the_ID());
                            
            require 'partials/page-header.php';
            
            if(count($ancestors) == 2):
                $post_id = 0;
            endif;
            
            require 'partials/modules.php';
            
			endwhile; // End the loop.
            
			?>

		</main><!-- #main -->

		<script>
			function myIframeFunction () {
				parent.newFromIframe.myFunction();
			};
			$(document).ready(function(){
				$(this).scrollTop(0);
				myIframeFunction();
			});
		</script>

<?php get_footer(); ?>
