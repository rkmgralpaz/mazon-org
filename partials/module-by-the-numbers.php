<div class="module module-by-the-numbers">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <div class="label"><?php echo get_sub_field('label'); ?></div>
            <div class="slides">
                <?php
                $slides = get_sub_field('slides');
                if( $slides ):
                    $dots_html = '';
                    foreach( $slides as $index => $slide ):
                        $dots_html .= '<button class="button button-dot" aria-label="Slide '.($index + 1).'"><div class="dot"></div></button>';
                ?>
                <div class="slide">
                    <div class="left">
                        <div class="title"><?php echo $slide['title_1']; ?></div>
                        <div class="text">
                            <?php echo $slide['text_1']; ?>
                        </div>
                    </div>
                    <div class="right">
                        <div class="title"><?php echo $slide['title_2']; ?></div>
                        <div class="text">
                            <?php echo $slide['text_2']; ?>
                        </div>
                    </div>
                </div>
                <?php
                    endforeach;
                    
                endif;
                ?>
            </div>
            <div class="dots">
                <?php echo $dots_html; ?>
            </div>
        </div>
    </div>
</div>