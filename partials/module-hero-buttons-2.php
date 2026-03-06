<div class="module module-hero-buttons module-hero-buttons-2">
    <?php
        $classes = '';
        if(get_sub_field('remove_top_space')):
            $classes .= 'remove-top-space';
        endif;
        if(get_sub_field('remove_bottom_space')):
            $classes .= ' remove-bottom-space';
        endif;
    ?>
    <div class="outer max-width <?php echo $classes; ?>" ?>>
        <div class="inner <?php echo get_sub_field('buttons_align') ?> site-padding">
          <?php if (get_sub_field('button_1')): ?>
            <a href="<?php echo get_sub_field('button_1')['url']; ?>"  target="<?php echo get_sub_field('button_1')['target']; ?>" class="cta-button"><?php echo get_sub_field('button_1')['title']; ?></a>
          <?php endif; ?>
          
          <?php if (get_sub_field('button_2')): ?>
            <a href="<?php echo get_sub_field('button_2')['url']; ?>"  target="<?php echo get_sub_field('button_2')['target']; ?>" class="cta-button"><?php echo get_sub_field('button_2')['title']; ?></a>
          <?php endif; ?>

        </div>
        <div class="bg">
            <?php
            $image = get_sub_field('image');
            $bg_position = get_sub_field('image_horizontal_align').' '.get_sub_field('image_vertical_align');
            if($image['url']):
            ?>
            <div class="image" data-image="<?php echo $image['url']; ?>" data-position="<?php echo $bg_position; ?>" style="background-position: <?php echo $bg_position; ?>;"></div>
            <?php
            endif;
            ?>
        </div>
    </div>
</div>