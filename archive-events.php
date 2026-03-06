<?php get_header(); ?>

    <?php
            
    $post_id = 155;
    $is_archive = isset($_GET['archive']) ? $_GET['archive'] && $_GET['archive'] != 'false' : false;
    $is_past = isset($_GET['past']) ? $_GET['past'] && $_GET['past'] != 'false' : false;
    require 'partials/page-header.php';

    if($is_archive):

    ?>
    
    <main class="module module-previous-items archive">
        <div class="outer max-width">
            <div class="inner site-padding-2">
                <h2 class="label">Events Archive</h2>
                <?php
                $post_type = 'events';
                $total_posts = $is_past ? wp_count_posts($post_type)->publish : wp_count_posts($post_type)->publish + wp_count_posts($post_type)->future;
                ?>
                <div class="items" data-total="<?php echo $total_posts ?>" data-posts-per-page="<?php echo ARCHIVE_ITEMS_PER_PAGE; ?>">
                <!-- PAGINATION -->
                <?php
                
                $post_status = $is_past ? array('publish') : array('publish','future');
                $paged = isset($_GET['page']) ? $_GET['page'] : 1;

                $args = array(
                    'post_type' => $post_type,
                    'orderby' => 'date',
                    'order'   => 'DESC',
                    'posts_per_page' => ARCHIVE_ITEMS_PER_PAGE,
                    'paged' => $paged,
                    'post_status' => $post_status,
                );

                $query = new WP_Query( $args );
                // Start the Loop.
                while ( $query->have_posts() ) : $query->the_post();

                ?>
                    <div class="post-item"><a href="<?php echo get_permalink(); ?>"><?php echo get_the_title(); ?><span class="date">
                      <?php if (get_field('date')): ?>
                        <?php echo get_field('date'); ?>
                      <?php else: ?>
                        <?php echo get_the_date(); ?>
                      <?php endif; ?>
                    </span>
                    
                    </a></div>
                <?php

                endwhile; // End the loop.

                ?>
                <!-- PAGINATION -->
                </div>
                <?php if($total_posts > ARCHIVE_ITEMS_PER_PAGE): ?>
                <div class="load-more-wrapper">
                    <button aria-label="Load More" class="load-more-button">Load More</button>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </main><!-- #main -->

    <?php

    else:
        require 'partials/modules.php';
    endif;

    ?>
		
<?php get_footer(); ?>