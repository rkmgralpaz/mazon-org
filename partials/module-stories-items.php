<?php 
    if(!isset($module_stories_counter)):
        $module_stories_counter = 0;
    endif;
?>
<div class="module module-stories-items">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <?php 
            $label = get_sub_field('label');
            if($label):
            ?>
            <div class="label"><?php echo $label; ?></div>
            <?php
            endif;
            ?>
            <div class="items two-columns">
                <?php
               if(!isset($items) ||  $module_stories_counter > 0):
                    $items = get_sub_field('items');
                endif;
                if( $items ) :
                    foreach( $items as $item ) :
                        $title = get_the_title($item);
                        $quote = get_field('quote',$item);
                        $image = get_field('image',$item);
                ?>   
                <div class="post-item">
                    <a href="<?php echo get_permalink($item); ?>">
                        <div class="thumbnail-wrapper">
                            <div class="thumbnail">
                                <?php if($image): ?>
                                <div class="image" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="quote"><?php echo $quote; ?></div>
                        <div class="title">
                            <span><?php echo $title; ?></span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
                              <path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#581038"/>
                            </svg>
                        </div>
                    </a>
                </div>   
                <?php
                    endforeach;
                endif;
                ?>
            </div>
        </div>
    </div>
</div>
<?php 
    unset($items);
    $module_stories_counter ++;    
?>