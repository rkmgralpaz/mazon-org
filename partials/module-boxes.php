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
                $boxes = get_sub_field('boxes');
                if( $boxes ) :
                    foreach( $boxes as $box ) :
                        $image = $box['image'];
                ?>
                <div class="box color-palette-<?php echo $box['color_palette']; ?>">
                    <?php if($image['image']): ?>
                    <div class="image-wrapper">
                        <?php $image_class = $image['black_and_white'] ? 'bw-filter' : ''; ?>
                        <div class="image <?php echo $image_class; ?>" data-image="<?php echo $image['image']['url']; ?>"></div>
                    </div>
                    <?php endif; ?>
                    <div class="inner-box">
                        <div class="title"><?php echo $box['title']; ?></div>
                        <div class="text">
                            <?php echo $box['text']; ?>
                        </div>
                        <?php
                        $bottom_links = $box['bottom_links'];
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
                    endforeach;
                endif;
                ?>
            </div>
        </div>
    </div>
</div>