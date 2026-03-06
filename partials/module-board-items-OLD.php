<?php
    if(!$module_board_counter):
        $module_board_counter = 0;
    endif;
    $classes = get_sub_field('remove_top_space') ? 'remove-top-space' : '';
?>
<div class="module module-board-items <?php echo $classes; ?>">
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
                if(!$items || $module_board_counter > 0):
                    $items = get_sub_field('items');
                endif;
                if( $items ) :
                    foreach( $items as $item ) :
                        $title = get_the_title($item);
                        $info = get_field('info',$item);
                ?>
                <div class="post-item">
                    <h3 class="title"><a href="<?php echo get_permalink($item); ?>"><?php echo $title; ?></a></h3>
                    <div class="subtitle">
                    <?php
                    if($info['position'] != ""):
                        echo $info['position'];
                    endif;
                    if($info['position'] != "" && $info['city'] != ""):
                        echo '<br>';
                    endif;
                    if($info['city'] != ""):
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
    $module_board_counter ++;
?>