<?php
    if(!isset($module_staff_counter)):
        $module_staff_counter = 0;
    elseif(!$module_staff_counter):
        $module_staff_counter = 0;
    endif;
    $classes = get_sub_field('remove_top_space') ? 'remove-top-space' : '';
?>
<div class="module module-staff-items <?php echo $classes; ?>">
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
                if(!isset($items)):
                    $items = get_sub_field('items');
                elseif(!$items || $module_staff_counter > 0):
                    $items = get_sub_field('items');
                else:
                    $items = false;
                endif;
                if( $items ) :
                    foreach( $items as $item ) :
                        $title = get_the_title($item);
                        $info = get_field('info',$item);
                        $thumbnail = get_field('thumbnail',$item);
                        $image = $thumbnail['image'];
                ?>
                <div class="post-item">
                    <a href="<?php echo get_permalink($item); ?>">
                        <div class="post-item">
                            <div class="thumbnail">
                                <?php if($image): ?>
                                <div class="image" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                <?php endif; ?>
                            </div>
                            <div class="title"><?php echo $title; ?></div>
                            <div class="subtitle"><?php echo $info['position']; ?></div>
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
    $module_staff_counter ++;
?>