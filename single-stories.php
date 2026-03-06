<?php get_header(); ?>

<main>

    <?php

    // Start the Loop.
    while ( have_posts() ) : the_post();

    $post_parent_parent = 39;
    $post_parent = 45;
    $header_options = get_field('header_options',$post_parent);
    if($header_options == 'parent-header' && get_field('header',$post_parent_parent)):
        $post_parent = $post_parent_parent;
        require 'partials/page-header.php';
    elseif($header_options == 'sub-pages-header' && get_field('header_for_sub_pages',$post_parent_parent)):
        $post_parent = $post_parent_parent;
        require 'partials/page-header.php';
    elseif($header_options == 'create-header' && get_field('header',$post_parent)):
        $post_id = $post_parent;
        $title_link = get_permalink($post_parent);
        require 'partials/page-header.php';
    endif;

    //$back_url = BASE_URL.$GLOBALS['PATH_NAMES'][0].'/'.$GLOBALS['PATH_NAMES'][1].'/'

    ?>

    <div class="max-width">
        <div class="site-padding-2">

            <div class="stories-post-content">
                
                <div class="top-area">
                    <?php    
                        $name = explode(',',get_the_title());
                        $name = $name[0];
                        if(strtolower(substr($name,-1)) == 's'):
                            $name .= "’ Story";
                        else:
                            $name .= "’s Story";
                        endif;
                        $image = get_field('image');
                    ?>
                    <div class="g1">
                        <div class="image-wrapper">
                            <div class="image">
                                <?php if($image): ?>
                                <div class="img" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <div class="g2">
                        <div class="name"><?php echo $name; ?></div>
                        <div class="quote"><?php echo get_field('quote'); ?></div>
                    </div>
                </div>
                <div class="text-area">
                    <h2 class="title"><?php echo get_the_title(); ?></h2>
                    <div class="text"><?php echo get_field('text'); ?></div>
                </div>
                
            </div>

        </div>
    </div><!-- #main -->
    
    <?php
        $items = get_field('related_stories');
        if($items):
            require 'partials/module-stories-items.php';
        endif;
    ?>

    <?php

    endwhile; // End the loop.

    ?>
    <div class="stories-post-content-bottom-space"></div>
        
</main>


<?php get_footer(); ?>
