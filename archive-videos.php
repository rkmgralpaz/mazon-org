<?php get_header(); ?>

    <?php
            
    $post_id = 178;
    $is_archive = isset($_GET['archive']) ? $_GET['archive'] && $_GET['archive'] != 'false' : false;
    require 'partials/page-header.php';

    if($is_archive):

    ?>

    <main class="module module-boxes">
        <div class="outer site-padding-2 max-width">
            <div class="inner">
                <h2 class="label">All Videos</h2>
                <div class="boxes">
                    <?php
                    $n = 0;
                    $color_palette = array('','light-blue','orange','light-gray','blue');
                    // Start the Loop.
                    while ( have_posts() ) : the_post();
                        $n++;
                        $box_title = get_the_title();
                        $box_permalink = get_permalink();
                        $box_target = '';
                        $excerpt_content = get_field('excerpt_content');
                        if($excerpt_content == '' && get_field('text') != ''):
                            $excerpt_content = get_words(get_field('text'),30);
                        endif;
                        $cta_button = $excerpt_content['cta_button'];
                        if($cta_button):
                            $box_permalink = $cta_button['url'];
                            $box_target = $cta_button['target'];
                        endif;
                        $image = $excerpt_content['thumbnail']['image'];
                        if($n == 5):
                            $n = 0;
                        endif;
                    ?>
                    <div class="box color-palette-<?php echo $color_palette[$n]; ?>">
                        <a href="<?php echo $box_permalink; ?>" target="<?php $box_target; ?>">
                            <?php if($image): ?>
                            <div class="image-wrapper">
                                <div class="image" data-image="<?php echo $image['url']; ?>"></div>
                            </div>
                            <?php endif; ?>
                            <div class="inner-box">
                                <h3 class="title"><?php echo $box_title; ?></h3>
                                <div class="text">
                                    <?php echo $excerpt_content['excerpt']; ?>
                                </div>
                            </div>
                        </a>
                    </div>
                    <?php
                    
                    endwhile; // End the loop.

                    ?>
                </div>
            </div>
        </div>
    </main>

    <?php

    else:
        require 'partials/modules.php';
    endif;

    ?>
		
<?php get_footer(); ?>