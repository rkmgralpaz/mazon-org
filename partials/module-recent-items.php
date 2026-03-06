<?php
$boxes_color_pattern = get_sub_field('boxes_color_pattern');
$boxes = get_sub_field('items');
if( $boxes ) : ?>

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
                        $box_target = '';
                        $box_read_more = $box_post_type == 'videos' ? 'View Video': 'Read More';
                        $excerpt_content = get_field('excerpt_content',$box);
                        if($excerpt_content == '' && get_field('text',$box) != ''):
                            $excerpt_content = get_words(get_field('text',$box),30);
                        endif;
                        $cta_button = $excerpt_content['cta_button'];
                        if($cta_button):
                            $box_permalink = $cta_button['url'];
                            $box_target = $cta_button['target'];
                        endif;
                        $image = isset($excerpt_content['thumbnail']) ? $excerpt_content['thumbnail'] : array('image' => array('url' => ''));
                ?>
                <div class="box color-palette-<?php echo $boxes_color_pattern['box_'.$n]; ?>">
                    <a href="<?php echo $box_permalink; ?>" target="<?php echo $box_target; ?>">
                        <?php if($image['image']): ?>
                        <div class="image-wrapper">
                            <?php $image_class = $image['black_and_white'] ? 'bw-filter' : ''; ?>
                            <div class="image <?php echo $image_class; ?>" data-image="<?php echo $image['image']['url']; ?>"></div>
                        </div>
                        <?php endif; ?>
                        <div class="inner-box">
                            <div class="title"><?php echo $box_title; ?></div>
                            <div class="text">
                                <span class="date">
                                  <?php if (get_field('date',$box)): ?>
																		<?php echo get_field('date',$box); ?>
																	<?php else: ?>
																		<?php echo get_the_date('',$box); ?>
																	<?php endif; ?>
                                </span> —
                                <?php echo $excerpt_content['excerpt']; ?> <br>
                                <div class="read-more"><?php echo $box_read_more; ?></div>
                            </div>
                        </div>
                    </a>
                </div>
                <?php
                        if($n == 4):
                            $n = 0;
                        endif;
                    endforeach;
                endif;
                ?>
            </div> <!-- end boxes -->
            
        </div>
    </div>
</div>

<?php endif; ?>