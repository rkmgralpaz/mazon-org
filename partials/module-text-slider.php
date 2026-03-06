<div class="module module-text-slider" data-autoplay="false">
    <div class="site-padding-2 max-width">
        <div class="outer site-padding">
            <div class="label"><?php echo get_sub_field('label'); ?></div>
            <div class="slides">
                <?php
                $slides = get_sub_field('slides');
                $cta_button = get_sub_field('cta_button');
                if( $slides ):
                    $dots_html = '';
                    foreach( $slides as $index => $slide ):
                        $dots_html .= '<button class="button" aria-label="Slide '.($index + 1).'"><div class="dot"></div></button>';
                ?>
                <div class="slide">
                    <div class="title"><?php echo $slide['title']; ?></div>
                    <div class="text">
                        <?php echo $slide['text']; ?>
                    </div>
                </div>
                <?php
                    endforeach;
                endif;
                ?>
            </div>
            <div class="bottom-area">
                <div class="dots">
                    <?php echo $dots_html; ?>
                </div>
                <div class="cta-button">
                    <?php if($cta_button): ?>
                    <a href="<?php echo $cta_button['url']; ?>" target="<?php echo $cta_button['target']; ?>">
                        <span><?php echo $cta_button['title']; ?></span>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>