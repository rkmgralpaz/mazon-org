<div class="module module-form">
    <?php 
        $background_color = get_sub_field('background_color');
        $classes_outer = get_sub_field('remove_top_space') ? 'remove-top-space' : '';
        if(get_sub_field('remove_side_space')):
            $classes_outer .= 'remove-side-space';
        endif;
        $hide_txt = get_sub_field('hide_text');
        $classes = $hide_txt ? 'hide-text' : '';
    ?>
    <div class="outer site-padding-2 max-width bg-<?php echo $background_color; ?> <?php echo $classes_outer; ?>">
        <div class="inner <?php echo $classes; ?>">
            <?php if(!$hide_txt): ?>
            <div class="text">
                <?php echo get_sub_field('text'); ?>
            </div>
            <?php endif; ?>
            <div class="form">
                <?php echo do_shortcode(get_sub_field('form_code')); ?>
            </div>
        </div>
    </div>
</div>