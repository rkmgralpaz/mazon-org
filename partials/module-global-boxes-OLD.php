<div class="module module-boxes">
    <div class="outer site-padding-2 max-width">
        <div class="inner">
            <?php
                $label = get_sub_field('label');
                if($label):
            ?>
            <div class="label"><?php echo $label; ?></div>
            <?php endif; ?>
            <div class="boxes">
                <?php
                $boxes_color_pattern = get_sub_field('boxes_color_pattern');
                $boxes = get_sub_field('boxes');
                if( $boxes ) :
                    $n = 0;
                    foreach( $boxes as $box ) :
                        $n++;
                        $box_title = get_field('title',$box);
                        if($box_title == ''):
                            $box_title = get_the_title($box);
                        endif;
                        $text = get_field('text',$box);
                        $image = get_field('image',$box);
                        $bottom_links = get_field('bottom_links',$box);
                        if((substr_count($text, "<a href=") == 1 && !$bottom_links) || (substr_count($text, "<a href=") == 0 && count($bottom_links) == 1)):
                            $box_classes = 'one-link';
                        else:
                            $box_classes = '';
                        endif;
                ?>
                

                <div class="box color-palette-<?php echo $boxes_color_pattern['box_'.$n]; echo ' '.$box_classes; ?>">
                    <?php if($image['image']): ?>
                    <div class="image-wrapper">
                        <?php $image_class = $image['black_and_white'] ? 'bw-filter' : ''; ?>
                        <div class="image <?php echo $image_class; ?>" data-image="<?php echo $image['image']['url']; ?>"></div>
                    </div>
                    <?php endif; ?>
                    <div class="inner-box">
                        <div class="title"><?php echo $box_title; ?></div>
                        <div class="text">
                            <?php echo $text; ?>
                        </div>
                        <?php
                            if($bottom_links):
                        ?>
                        <div class="bottom-links">
                        <?php foreach( $bottom_links as $link ): ?>
                            <a href="<?php echo $link['link']['url']; ?>" target="<?php echo $link['link']['target']; ?>">
                            <?php
                                if($link['icon'] != 'none'):
                                    require 'icon-'.$link['icon'].'.php';
                                endif;
                            ?>
                            <?php echo $link['link']['title']; ?>
                            </a><br>
                        <?php endforeach; ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                <?php
                        if($n == 4):
                            $n = 0;
                        endif;
                    endforeach;
                endif;
                ?>
            </div>
        </div>
    </div>
</div>