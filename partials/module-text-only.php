<?php 
if(!isset($is_transparent_bg)): 
    $is_transparent_bg = false;
endif;
if($is_transparent_bg): 
?>
<div class="module module-text-only" style="background-color:transparent;">
<?php else: ?>
<div class="module module-text-only">
<?php endif; ?>
    <?php
    $classes = get_sub_field('remove_top_space') ? 'remove-top-space': '';
    ?>
    <div class="outer max-width <?php echo $classes; ?>">
        <div class="inner site-padding-2">
            <?php
            $title = get_sub_field('title');
            $cta_button = get_sub_field('cta_button');
            $columns = get_sub_field('columns');
            if($title != '' || $cta_button):
            ?>
            <div class="top">
                <div class="title left"><?php echo $title; ?></div>
                <div class="cta-button right">
                <?php if($cta_button): ?>
                    <a href="<?php echo $cta_button['url']; ?>" target="<?php echo $cta_button['target']; ?>"><?php echo $cta_button['title']; ?></a>
                <?php endif; ?>
                </div>
                <div class="clear-both"></div>
            </div>
            <?php
            endif;
            if($columns == 'two-columns'):
            ?>
            <div class="two-columns">
                <div class="col col-1 text">
                <?php echo get_sub_field('text_1'); ?>
                </div>
                <div class="col col-2 text">
                <?php echo get_sub_field('text_2'); ?>
                </div>
            </div>
            <?php else: ?>
            <div class="one-column">
                <div class="text">
                <?php echo get_sub_field('text'); ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>