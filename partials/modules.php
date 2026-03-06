<?php

if(!isset($post_id)):
    $post_id = get_the_ID();
endif;

// Check value exists.
if( have_rows('modules',$post_id) ):

    $n = 0;
    // Loop through rows.
    while ( have_rows('modules',$post_id) ) : the_row();

        // Case: module by the numbers.
        if( get_row_layout() == 'by_the_numbers' ):
            require 'module-by-the-numbers.php';

        // Case: module text slider.
        elseif( get_row_layout() == 'text_slider' ):
            require 'module-text-slider.php';

        // Case: module form
        elseif( get_row_layout() == 'form' ):
            require 'module-form.php';

        // Case: module grid: thumbnail + name.
        elseif( get_row_layout() == 'grid_thumbnail_name' ):
            require 'module-grid-thumbnail-name.php';

        // Case: module board items.
        elseif( get_row_layout() == 'board_items' ):
            require 'module-board-items.php';
        
        // Case: module staff items paragraph.
        elseif( get_row_layout() == 'staff_items' ):
            require 'module-staff-items.php';

        // Case: module centered.
        elseif( get_row_layout() == 'text_only' ):
            require 'module-text-only.php';

        // Case: module two column items.
        elseif( get_row_layout() == 'two_column_items' ):
            require 'module-two-column-items.php';

        // Case: module recent items.
        elseif( get_row_layout() == 'recent_items' ):
            require 'module-recent-items.php';

        // Case: module previous items.
        elseif( get_row_layout() == 'previous_items' ):
            require 'module-previous-items.php';

        // Case: module publications items.
        elseif( get_row_layout() == 'publications_items' ):
            require 'module-publications-items.php';

        // Case: module hero slider.
        elseif( get_row_layout() == 'hero_slider' ):
            require 'module-hero-slider.php';

        // Case: module hero video.
        elseif( get_row_layout() == 'hero_video' ):
            require 'module-hero-video.php';

        // Case: module take action layout.
        elseif( get_row_layout() == 'take_action' ):
            require 'module-take-action.php';

        // Case: module single feature layout.
        elseif( get_row_layout() == 'single_feature' ):
            require 'module-single-feature.php';
        
        // Case: module single feature custom bg layout.
        elseif( get_row_layout() == 'single_feature_custom_bg' ):
            require 'module-single-feature-custom-bg.php';

        // Case: module boxes layout.
        elseif( get_row_layout() == 'global_boxes' ):
            require 'module-global-boxes.php';

        // Case: module boxes layout.
        elseif( get_row_layout() == 'boxes' ):
            require 'module-boxes.php';
                
        // Case: stories items layout.
        elseif( get_row_layout() == 'stories_items' ):
            require 'module-stories-items.php';

        // Case: stories slider layout.
        elseif( get_row_layout() == 'stories_slider' ):
            require 'module-stories-slider.php';

        // Case: module hero buttons layout.
        elseif( get_row_layout() == 'hero_buttons' ):
            require 'module-hero-buttons.php';
            
        // Case: module hero buttons 2 layout.
        elseif( get_row_layout() == 'hero_buttons_2' ):
            require 'module-hero-buttons-2.php';
            
        

        // Case: module mission layout.
        elseif( get_row_layout() == 'mission' ):
            require 'module-mission.php';

        // Case: module suscription.
        elseif( get_row_layout() == 'subscription' ):
            require 'module-subscription.php';

        // Case: module lastest news and events.
        elseif( get_row_layout() == 'news_and_events' ):
            require 'module-news-and-events.php';

        // Case: module centered paragraph layout.
        elseif( get_row_layout() == 'centered_paragraph' ):
            require 'module-centered-paragraph.php';

        endif;

        $n++;
    // End loop.
    endwhile;

// No value.
else :
    // Do something...
endif;

?>