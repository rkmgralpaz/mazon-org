<?php get_header(); ?>
			<?php

            // Start the Loop.
			while ( have_posts() ) : the_post();
            
            $post_id = 73;//get_page(73);
            //$ancestors = get_post_ancestors($post_id);
            $ancestor_link = 73;
            require 'partials/page-header.php';
						
						?>
						
						<div class="module module-hero-buttons">
							<div class="outer max-width <?php echo $classes; ?>">
								<div class="bg">
										<?php if(get_field('image')): ?>
										<div class="image" data-image="<?php echo get_field('image'); ?>" data-position="center center" style="background-position: center center;"></div>
										<?php endif; ?>
								</div>
							</div>
						</div>
						
						<div class="wrap-content">
							
							<div class="content">
								
								<div class="description-title">
									<?php echo get_field('title') ?>
								</div>
								
								<div class="description">
									<?php echo get_field('description') ?>
								</div>
								
							</div>
							
							<div class="form-code">
								
								<div class="form-title">
									<?php echo get_field('form_title') ?>
								</div>
								
								
							</div>
							
							
							
						</div>
						
						
						
						
						
						<?php
						          
            $post_id = get_the_ID();
            require 'partials/modules.php';
            
			endwhile;

			?>

<?php get_footer(); ?>
