<?php
    if(!isset($module_board_counter)):
        $module_board_counter = 0;
    endif;
    $label = get_sub_field('label');
    $classes = get_sub_field('remove_top_space') ? 'remove-top-space' : '';
    if($label && !get_sub_field('remove_top_space')):
        $classes = 'add-top-space';
    endif;
?>
<div class="module module-board-items <?php echo $classes; ?>">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <?php
            if($label):
            ?>
            <div class="label"><?php echo $label; ?></div>
            <?php
            endif;
            ?>
            <div class="items two-columns">
                
                <?php
                if(!isset($items) || $module_stories_counter > 0):
                    $items = get_sub_field('items');
                endif;
                if( $items ) :
                    foreach( $items as $item ) :
                        $title = get_the_title($item);
                        $info = get_field('info',$item);
                ?>
                <div class="post-item">
                    <div class="title"><a href="<?php echo get_permalink($item); ?>"><?php echo $title; ?></a></div>
                    <div class="subtitle">
                    <?php
                    if(isset($info['position']) && $info['position'] != ""):
                        echo $info['position'];
                    endif;
                    if(isset($info['position']) && $info['position'] != "" && isset($info['city']) && $info['city'] != ""):
                        echo '<br>';
                    endif;
                    if(isset($info['city']) && $info['city'] != ""):
                        echo $info['city'];
                    endif;
                    ?>
                    </div>
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
    $module_board_counter ++;
?>