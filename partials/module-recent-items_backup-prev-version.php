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
                $boxes = get_sub_field('items');
                if( $boxes ) :
                    $n = 0;
                    foreach( $boxes as $box ) :
                        $n++;
                        $box_post_type = get_post_type($box);
                        $box_title = get_the_title($box);
                        $box_permalink = get_permalink($box);
                        $excerpt_content = get_field('excerpt_content',$box);
                        if($excerpt_content == '' && get_field('text',$box) != ''):
                            $excerpt_content = get_words(get_field('text',$box),30);
                        endif;
                        $cta_button = $excerpt_content['cta_button'];
                        $image = $excerpt_content['thumbnail'];
                        if($n == 5):
                            $n = 0;
                        endif;
                ?>
                <div class="box color-palette-<?php echo $boxes_color_pattern['box_'.$n]; ?>">
                    <?php if($image['image']): ?>
                    <div class="image-wrapper">
                        <?php $image_class = $image['black_and_white'] ? 'bw-filter' : ''; ?>
                        <div class="image <?php echo $image_class; ?>" data-image="<?php echo $image['image']['url']; ?>"></div>
                    </div>
                    <?php endif; ?>
                    <div class="inner-box">
                            <?php
                            if($cta_button):
                                echo '<a href="'.$cta_button['url'].'" target="'.$cta_button['target'].'"><div class="title">'.$box_title.'</div></a>';
                            else:
                                echo '<a href="'.$box_permalink.'"><div class="title">'.$box_title.'</div></a>';
                            endif;
                            ?>
                        <div class="text">
                            <span class="date"><?php echo get_the_date('',$box); ?></span> —
                            <?php echo $excerpt_content['excerpt']; ?>
                            <?php
                            
                            if($cta_button):
                                echo '<a href="'.$cta_button['url'].'" target="'.$cta_button['target'].'">Read more.</a>';
                            else:
                                echo '<a href="'.$box_permalink.'">Read more.</a>';
                            endif;
                            
                            ?>
                        </div>
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