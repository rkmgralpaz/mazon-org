<?php get_header(); ?>




<?php

// Start the Loop.
while (have_posts()) : the_post();

    $post_id = 170;
    //$ancestors = get_post_ancestors($post_id);
    $ancestor_link = 170;
    require 'partials/page-header.php';

    $back_url = BASE_URL . $GLOBALS['PATH_NAMES'][0] . '/' . $GLOBALS['PATH_NAMES'][1] . '/';

    $type = get_field('type');

    if ($type != 'modules-only'):
        $modules_block_space = get_field('modules_block_space');
        $style_space = !get_field('modules') || $modules_block_space == '' ? '' : 'style="padding-bottom:' . $modules_block_space . 'px;"'
?>

        <main class="max-width">
            <div class="site-padding-2">

                <div class="news-post-content">
                    <div class="left">
                        <h2 class="title"><?php the_title(); ?></h2>
                        <div class="g-1">
                            <div class="author"><?php echo get_field('author'); ?></div>
                            <div class="date"><?php the_date(); ?></div>
                        </div>
                        <div class="g-2">
                            <div class="icons">
                                <a class="facebook" href="<?php echo get_facebook_share_url(); ?>" target="_blank">
                                    <span>Facebook</span>
                                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M18,0H6A6.018,6.018,0,0,0,0,6V18a6.018,6.018,0,0,0,6,6H18a6.018,6.018,0,0,0,6-6V6A6.018,6.018,0,0,0,18,0ZM16.5,8.25H14.25A.822.822,0,0,0,13.5,9v.75h2.25v3H13.5v6h-3v-6H8.25v-3H10.5V8.25a3.337,3.337,0,0,1,3.478-3H16.5Z" />
                                    </svg>
                                </a>
                                <a class="twitter" href="<?php echo get_linkedin_share_url(); ?>" target="_blank">
                                    <span>LinkedIn</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                        <g id="surface1">
                                            <path style=" stroke:none;fill-rule:evenodd;fill-opacity:1;" d="M 2.667969 24 L 21.332031 24 C 22.804688 24 24 22.804688 24 21.332031 L 24 2.667969 C 24 1.195312 22.804688 0 21.332031 0 L 2.667969 0 C 1.195312 0 0 1.195312 0 2.667969 L 0 21.332031 C 0 22.804688 1.195312 24 2.667969 24 Z M 2.667969 24 " />
                                            <path style=" stroke:none;fill-rule:evenodd;fill:rgb(100%,100%,100%);fill-opacity:1;" d="M 20.667969 20.667969 L 17.105469 20.667969 L 17.105469 14.601562 C 17.105469 12.9375 16.472656 12.007812 15.15625 12.007812 C 13.726562 12.007812 12.976562 12.976562 12.976562 14.601562 L 12.976562 20.667969 L 9.542969 20.667969 L 9.542969 9.109375 L 12.976562 9.109375 L 12.976562 10.667969 C 12.976562 10.667969 14.007812 8.757812 16.460938 8.757812 C 18.910156 8.757812 20.667969 10.253906 20.667969 13.351562 Z M 5.449219 7.597656 C 4.28125 7.597656 3.332031 6.644531 3.332031 5.464844 C 3.332031 4.289062 4.28125 3.332031 5.449219 3.332031 C 6.617188 3.332031 7.566406 4.289062 7.566406 5.464844 C 7.566406 6.644531 6.617188 7.597656 5.449219 7.597656 Z M 3.675781 20.667969 L 7.257812 20.667969 L 7.257812 9.109375 L 3.675781 9.109375 Z M 3.675781 20.667969 " />
                                        </g>
                                    </svg>
                                </a>
                                <a class="twitter" href="<?php echo get_bluesky_share_url(); ?>" target="_blank">
                                    <span>Bluesky</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 21" version="1.1">
                                        <g id="surface1">
                                            <path d="M 5.429688 1.746094 C 8.089844 3.722656 10.949219 7.734375 12 9.886719 C 13.050781 7.734375 15.910156 3.722656 18.570312 1.746094 C 20.492188 0.316406 23.601562 -0.785156 23.601562 2.726562 C 23.601562 3.429688 23.195312 8.621094 22.957031 9.464844 C 22.128906 12.398438 19.109375 13.144531 16.425781 12.691406 C 21.117188 13.484375 22.3125 16.101562 19.734375 18.722656 C 14.835938 23.699219 12.695312 17.476562 12.148438 15.878906 C 12.046875 15.585938 12 15.449219 12 15.566406 C 12 15.449219 11.953125 15.585938 11.851562 15.878906 C 11.304688 17.476562 9.164062 23.699219 4.265625 18.722656 C 1.6875 16.101562 2.882812 13.484375 7.574219 12.691406 C 4.890625 13.144531 1.871094 12.398438 1.042969 9.464844 C 0.804688 8.621094 0.398438 3.429688 0.398438 2.726562 C 0.398438 -0.785156 3.507812 0.316406 5.429688 1.746094 Z M 5.429688 1.746094 " />
                                        </g>
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

        <?php get_template_part('partials/single-news-modules'); ?>

<?php

    endif;

    $post_id = get_the_ID(); //reset id from parent header (line 12)
    require 'partials/modules.php';

endwhile; // End the loop.

?>

<?php get_footer(); ?>