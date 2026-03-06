<?php get_header(); ?>

    <main>

    <?php
            
    $post_id = 49;    
    require 'partials/page-header.php';

    ?>
        
    <div class="module module-priorities-items archive">
        <div class="outer max-width">
            <div class="inner site-padding-2">
                <ul class="items">
            <?php

            // Start the Loop.
            while ( have_posts() ) : the_post();
                    $excerpt_content = get_field('excerpt_content');
                    $title =  $excerpt_content['text']['title'] == '' ? get_the_title() : $excerpt_content['text']['title'];
                    $subtitle = $excerpt_content['text']['subtitle'];
                    $image = $excerpt_content['thumbnail']['image'];
                
            ?>
                    <li class="post-item">
                        <a href="<?php echo get_permalink(); ?>">
                            <div class="thumbnail">
                                <?php if($image): ?>
                                <div class="image" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                <?php endif; ?>
                            </div>
                            <h3 class="title"><?php echo $title; ?></h3>
                            <div class="subtitle"><?php echo $subtitle; ?></div>
                        </a>
                    </li>   
            <?php
                    
            endwhile; // End the loop.

            ?>
                </ul>
            </div>
        </div>
    </div>

    <?php

    require 'partials/modules.php';

    ?>
    
    </main><!-- #main -->
		
<?php get_footer(); ?>