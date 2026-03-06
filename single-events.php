<?php get_header(); ?>

	
		

			<?php

			// Start the Loop.
			while ( have_posts() ) : the_post();
                            
            //$post_parent = get_page(155);
            $post_id = 155;
            //$ancestors = get_post_ancestors($post_id);
            $ancestor_link = 155;
            require 'partials/page-header.php';

            $back_url = BASE_URL.$GLOBALS['PATH_NAMES'][0].'/';

            $type = get_field('type');
            
            if($type != 'modules-only'):
                $modules_block_space = get_field('modules_block_space');
                $style_space = !get_field('modules') || $modules_block_space == '' ? '' : 'style="padding-bottom:'.$modules_block_space.'px;"'
            ?>

            <main class="max-width">
                <div class="site-padding-2">
            
                    <div class="news-post-content" <?php echo $style_space; ?>>
                        <div class="left">
                            <h2 class="title"><?php the_title(); ?></h2>
                            <div class="g-1">
                                <div class="author"><?php echo get_field('author'); ?></div>
                                <div class="date">
																	<?php if (get_field('date')): ?>
																		<?php echo get_field('date'); ?>
																	<?php else: ?>
																		<?php echo get_the_date(); ?>
																	<?php endif; ?>
																</div>
                            </div>
                            <div class="g-2">
															
                                <div class="icons">
																	<div class="date">Share:</div>
                                    <a class="facebook" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo get_permalink(); ?>" target="_blank">
                                        <span>Facebook</span>
                                        <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                          <path d="M18,0H6A6.018,6.018,0,0,0,0,6V18a6.018,6.018,0,0,0,6,6H18a6.018,6.018,0,0,0,6-6V6A6.018,6.018,0,0,0,18,0ZM16.5,8.25H14.25A.822.822,0,0,0,13.5,9v.75h2.25v3H13.5v6h-3v-6H8.25v-3H10.5V8.25a3.337,3.337,0,0,1,3.478-3H16.5Z" />
                                        </svg>
                                    </a>
                                    <a class="twitter" href="https://twitter.com/intent/tweet?url=<?php echo get_permalink(); ?>" target="_blank">
                                        <span>Twitter</span>
                                        <svg role="img" xmlns="http://www.w3.org/2000/svg" width="26" height="21.13" viewBox="0 0 26 21.13">
                                          <path d="M76,71.234a10.667,10.667,0,0,1-3.064.84,5.352,5.352,0,0,0,2.345-2.951,10.675,10.675,0,0,1-3.387,1.294,5.339,5.339,0,0,0-9.09,4.865A15.144,15.144,0,0,1,51.81,69.709a5.34,5.34,0,0,0,1.651,7.122,5.313,5.313,0,0,1-2.416-.667c0,.022,0,.045,0,.067a5.338,5.338,0,0,0,4.279,5.231,5.347,5.347,0,0,1-2.409.091,5.34,5.34,0,0,0,4.983,3.7,10.7,10.7,0,0,1-6.625,2.283A10.82,10.82,0,0,1,50,87.466a15.17,15.17,0,0,0,23.354-12.78q0-.347-.015-.69A10.838,10.838,0,0,0,76,71.234Z" transform="translate(-50 -68.733)" />
                                        </svg>
                                    </a>
                                </div>
                                <a class="back-button" href="<?php echo $back_url; ?>">Back</a>
                            </div>
                        </div>
                        <div class="right">
                            <div class="text"><?php echo get_field('text'); ?></div>
                        </div>
                    </div>
                    
                </div>

            </main><!-- #main -->

            <?php

            endif;

            if(get_field('real3d_flipbook_view')):
                echo do_shortcode( get_field('shortcode_pdf_viewer') );
            endif;

            $post_id = get_the_ID();//reset id from parent header (line 12)
            require 'partials/modules.php';

			endwhile; // End the loop.
            
			?>

<?php get_footer(); ?>
