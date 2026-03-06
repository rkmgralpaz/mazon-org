<div class="module module-hero-buttons">
    <?php
    $classes = '';
    if (get_sub_field('remove_top_space')):
        $classes .= 'remove-top-space';
    endif;
    if (get_sub_field('remove_bottom_space')):
        $classes .= ' remove-bottom-space';
    endif;
    ?>
    <div class="outer max-width <?php echo $classes; ?>">
        <div class="inner">
            <?php
            $donate_button_global = get_field('donate_cta_button', 'option');
            ?>

            <?php if (1 === 4) : ?>
                <a href="<?php echo $donate_button_global['url']; ?>" target="<?php echo $donate_button_global['target'] ?>" class="cta-button donate-btn-pop-up">
                    <?php echo $donate_button_global['title'] ?>
                </a>

            <?php endif; ?>

            <?php
            $buttons = get_sub_field('buttons');
            if ($buttons):
                foreach ($buttons as $button):
            ?>
                    <a href="<?php echo $button['button']['url']; ?>" target="<?php echo $button['button']['target']; ?>" class="cta-button"><?php echo $button['button']['title']; ?></a>
            <?php
                endforeach;
            endif;
            ?>
        </div>
        <div class="bg">
            <?php
            $image = get_sub_field('image');
            $bg_position = get_sub_field('image_horizontal_align') . ' ' . get_sub_field('image_vertical_align');
            if ($image['url']):
            ?>
                <div class="image" data-image="<?php echo $image['url']; ?>" data-position="<?php echo $bg_position; ?>" style="background-position: <?php echo $bg_position; ?>;"></div>
            <?php
            endif;
            ?>
        </div>
    </div>
</div>