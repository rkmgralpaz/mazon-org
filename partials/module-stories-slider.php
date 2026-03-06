<?php

$stories_content = '';
$stories_dots = '';
$stories = get_sub_field('stories');
$cta_button = get_sub_field('cta_button');
if($stories):
    foreach($stories as $index => $story):
        $image = get_field('image',$story->ID);
        if(!$image['url']):
            $image['url'] = TEMPLATE_DIR.'assets/empty.png';
        endif;
        $stories_dots .= '<button class="button button-dot" aria-label="Slide '.($index + 1).'"><div class="dot"></div></button>';
        $stories_content .= '
        <div class="slide" data-image="'.$image['url'].'">
            <div class="text"><p>'.get_field('quote',$story->ID).'</p></div>
            <div class="cta-button">
                <a href="'.get_permalink($story->ID).'">
                    <span>'.get_the_title($story->ID).'</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
                      <path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#000"/>
                    </svg>
                </a>
            </div>
        </div>';
    endforeach;
    
    if (get_sub_field('autoplay') && count($stories) > 1) {
      $stories_dots  .= '<button aria-label="Pause Slider" class="button button-play"><div class="play-btn"></div></button>';
    }
    
endif;

?>
<div class="module module-stories-slider" data-autoplay="<?php echo get_sub_field('autoplay'); ?>">
    <div class="site-padding-2 max-width">
    <div class="outer site-padding">
        <div class="label top">This is Hunger</div>
        <div class="inner">
            <div class="column img">
                <div class="square"></div>
                <div class="image-wrapper">
                    <!-- image here -->
                </div>
            </div>
            <div class="column txt">
                <div class="top-area">
                    <div class="label"><?php echo get_sub_field('label'); ?></div>
                </div>
                <div class="content-area">
                    <div class="content-holder">
                        <!-- content here -->
                    </div>
                    <div class="bottom-area">
                        <div class="dots">
                            <?php echo $stories_dots; ?>
                        </div>
                        <div class="cta-button">
                            <a href="<?php echo $cta_button['url']; ?>" target="<?php echo $cta_button['target']; ?>">
                                <span><?php echo $cta_button['title']; ?></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="slides">
                <?php echo $stories_content; ?>
            </div>
        </div>
    </div>
    </div>
</div>