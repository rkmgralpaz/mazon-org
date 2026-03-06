<?php
$slides = get_sub_field('slides');
$unique_text = get_sub_field('unique_text');
if ($slides):
    $slides_html = '';
    $dots_html = '';
    $cta_default = get_sub_field('cta_default');
    foreach ($slides as $index => $slide):
        $image = $slide['image'];
        $text = $unique_text['has_unique_text'] ? '' : $slide['text'];
        if (!$unique_text['has_unique_text'] && $slide['link']):
            //aca va el link por slide
            $text .= " <a href='{$slide['link']['url']}' target='{$slide['link']['target']}'>{$slide['link']['title']}</a>";
        elseif (!$unique_text['has_unique_text'] && $cta_default):
            $text .= " <a href='{$cta_default['url']}' target='{$cta_default['target']}'>{$cta_default['title']}</a>";
        endif;
        $enable_slide = $image['url'] || $text != '';
        if (!$image['url']):
            $image['url'] = TEMPLATE_DIR . 'assets/empty.png';
        endif;
        if ($enable_slide):
            $slides_html .= '<div class="slide" data-image="' . $image['url'] . '">' . $text . '</div>';
            if (count($slides) > 1) {
                $dots_html .= '<button aria-label="Slide ' . ($index + 1) . '" class="button button-dot"><div class="dot"></div></button>';
            }
        endif;
    endforeach;
    if (get_sub_field('autoplay') && count($slides) > 1) {
        $dots_html .= '<button aria-label="Pause Slider" class="button button-play"><div class="play-btn"></div></button>';
    }

?>
    <div class="module module-hero-slider unselectable" data-autoplay="<?php echo get_sub_field('autoplay'); ?>">
        <div class="outer max-width">
            <div class="inner site-padding">
                <div class="wrapper">
                    <div class="upper">
                        <?php
                        $unique_text = get_sub_field('unique_text');
                        $text_class = $unique_text['has_unique_text'] ? 'unique-text' : 'multiple-text';
                        ?>
                        <div class="text <?php echo $text_class; ?>">
                            <?php
                            if ($unique_text['has_unique_text']):
                                echo $unique_text['text'];
                            endif;
                            if ($unique_text['has_unique_text'] && $unique_text['link']):
                                //aca va el link unique text
                                echo " <a href='{$unique_text['link']['url']}' target='{$unique_text['link']['target']}'>{$unique_text['link']['title']}</a>";
                            endif;
                            ?>
                        </div>
                    </div>
                    <div class="lower">
                        <button class="cta-button">CTA Button</button>
                        <div class="controls">
                            <?php
                            $video_url = get_sub_field('video_url');
                            $video_duration = get_sub_field('video_duration');
                            if ($video_url != ''):
                            ?>
                                <a class="video-button" aria-label="Watch video" href="<?php echo $video_url; ?>">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 10.176 13">
                                        <path d="M6.5,0,13,10.176H0Z" transform="translate(10.176) rotate(90)" fill="#fff" />
                                    </svg>
                                    <?php if ($video_duration != ''): ?>
                                        <div class="time"><?php echo $video_duration; ?></div>
                                    <?php endif; ?>
                                </a>
                            <?php
                            endif;
                            ?>
                            <div class="dots">
                                <?php echo $dots_html; ?>
                            </div>
                        </div>
                        <?php
                        $donate_button_global = get_field('donate_cta_button', 'option');
                        if (get_sub_field('donate_button') && $donate_button_global):
                        ?>
                            <?php if (1 === 4) : ?>

                                <div class="donate-btn-pop-up">
                                    <a href="<?php echo $donate_button_global['url']; ?>" target="<?php echo $donate_button_global['target'] ?>" class="cta donate-button">
                                        <?php echo $donate_button_global['title'] ?>
                                    </a>

                                </div>

                            <?php endif; ?>

                        <?php
                        endif;
                        ?>
                    </div>
                </div>
            </div>
            <div class="bg">
                <!--<div class="img"></div>-->
            </div>
            <div class="gradient"></div>
            <div class="slides">
                <?php echo $slides_html; ?>
            </div>
        </div>
    </div>
<?php
endif;
?>