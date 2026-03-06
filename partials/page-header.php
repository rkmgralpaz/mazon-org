<?php
    if(!isset($ancestors)):
        $ancestors = array();
    elseif(!$ancestors):
        $ancestors = array();
    endif;
    if(count($ancestors) > 1):
        $header_options_parent = get_field('header_options',$ancestors[0]);
        if($header_options_parent == 'sub-pages-header'):
            $post_parent = $ancestors[1];
            $header_options = 'sub-pages-header';
        elseif($header_options_parent == 'no-header'):
            $header_options = 'no-header';
        endif;
    endif;
    if(!isset($post_id)):
        $post_id = 0;
    endif;
    if(!isset($post_parent)):
        $post_parent = 0;
    endif;
    if(!$post_parent):
        $post_parent = get_parent();
    endif;
    if(!$post_id):
        $post_id = get_the_ID();
    endif;
    $header = false;
    if(!isset($header_options)):
        $header_options = 0;
    endif;
    if(!$header_options):
        $header_options = get_field('header_options',$post_id);
    endif;
    $page_title = get_the_title($post_id);
    if(($header_options == 'parent-header' && !$post_parent) || $header_options == ''):
        $header_options == 'no-header';
    endif; 
    if($header_options == 'create-header' || $header_options == 'create-two-headers'):
        $header = get_field('header',$post_id);
        if($header['title'] != ''):
            $page_title = $header['title'];
        endif;
    elseif($header_options == 'parent-header'):
        if(count($ancestors) > 1):
            if($header_options_parent == 'create-header'):
                $post_parent = $ancestors[0];                
            else:
                $post_parent = $ancestors[1];
            endif;            
        else:
            $post_parent = $ancestors[0];
        endif;
        $header = get_field('header', $post_parent);  
        if($header['title'] != ''):
            $page_title = $header['title'];
        endif;
        if($header['title'] == ''):
            $page_title = get_the_title($post_parent);
        else:
            $page_title = $header['title'];
        endif;
        $title_link = get_permalink($post_parent);
    elseif($header_options == 'sub-pages-header'):
        if(count($ancestors) > 1):
            $post_parent = $ancestors[1];
        endif;
        $header = get_field('header_for_sub_pages', $post_parent);  
        if($header['title'] != ''):
            $page_title = $header['title'];
        endif;
        if($header['title'] == ''):
            $page_title = get_the_title($post_parent);
        else:
            $page_title = $header['title'];
        endif;
    else:
        $header = false;
    endif;
    if(!isset($ancestor_link)):
        $ancestor_link = 0;
    endif;
    if(($ancestor_link && $ancestor_link == $post_id) || ($ancestor_link && $header_options != 'create-header' && $header_options != 'create-two-headers')):
        $title_link = get_permalink($ancestor_link);
    endif;

    if($header && $header_options != ''):
        if(!isset($title_link)):
            $title_link = 0;
        endif;
?>

<header class="page-header color-palette-<?php echo $header['color_palette']; ?>">
    <div class="outer max-width">
        <div class="inner site-padding-2">
        <?php //echo $tmp_control; ?><br>
            <?php if($title_link): ?>
            <a href="<?php echo $title_link; ?>"><h1 class="title"><?php echo $page_title; ?></h1></a>
            <?php else: ?>
            <h1 class="title"><?php echo $page_title; ?></h1>
            <?php endif; ?>
            <div class="text">
                <?php echo $header['text']; ?>
            </div>
            <!--
            <?php 
            $donate_button = get_field('donate_cta_button','option');
            if($header['donate_button'] && $donate_button): 
            ?>
            <div class="cta-wrapper site-padding-2">
                <a class="donate-button" href="<?php echo $donate_button['url']; ?>" target="<?php echo $donate_button['target']; ?>">
                    <div class="cta-button">
                        <?php echo $donate_button['title']; ?>
                    </div>
                </a>
            </div>
            <?php endif; ?>
            -->
        </div>
    </div>
</header>

<?php

endif;

?>