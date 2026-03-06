<?php $classes = get_sub_field('remove_top_space') ? 'remove-top-space' : ''; ?>
<div class="module module-publications-items <?php echo $classes; ?>">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <div class="items <?php echo  get_sub_field('columns'); ?>">
            <?php
            $items = get_sub_field('items');
            if( $items ) :
                $n = 0;
                foreach( $items as $item ) :
                    $image = get_field('image',$item);
                    $pdf_file = get_field('pdf',$item);

                    $href = get_field('real3d_flipbook_view',$item) ? get_permalink($item) : $pdf_file['url'];
                    $target = get_field('real3d_flipbook_view',$item) ? '_self' : '_blank';

            ?>
                    <div class="post-item">

                        <a href="<?php echo $href; ?>" target="<?php echo $target; ?>">

                            <div class="thumbnail">
                                <?php if($image): ?>
                                <div class="image">
                                    <div class="img" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                </div>
                                <?php endif; ?>
                            </div>
                            <div class="title"><?php echo get_the_title($item); ?></div>


                        </a>

                    </div>
            <?php

                endforeach;
            endif;

            ?>
            </div>
            <?php
            $cta_button = get_sub_field('cta_button');
            if($cta_button):
            ?>
            <a href="<?php echo $cta_button['url']; ?>"  target="<?php echo $cta_button['target']; ?>" class="cta-button"><?php echo $cta_button['title']; ?></a>
            <?php
            endif;
            ?>
        </div>
    </div>
</div>
