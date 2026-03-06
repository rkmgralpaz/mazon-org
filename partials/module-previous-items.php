<div class="module module-previous-items">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <?php
                $label = get_sub_field('label');
                if($label):
            ?>
            <div class="label"><?php echo $label; ?></div>
            <?php endif; ?>
            <ul class="items">
                <?php
                $items = get_sub_field('items');
                if( $items ) :
                    foreach( $items as $item ) :
                        if($item->post_type == 'publications'):
                            $pdf_file = get_field('pdf',$item->ID);
                            $permalink = $pdf_file['url'];
                            $target = '_blank';
                        else:
                            $permalink = get_permalink($item->ID);
                            $target = '';
                        endif;
                ?>
                <li class="post-item"><a href="<?php echo $permalink; ?>" target="<?php echo $target; ?>"><?php echo $item->post_title; ?><span class="date"><?php echo get_the_date('',$item->ID); ?></span></a></li>
                <?php
                    endforeach;
                endif;
                ?>
            </ul>
            <?php
                $cta_button = get_sub_field('cta_button');
                if($cta_button):
            ?>
            <div><a class="cta-button" href="<?php echo $cta_button['url']; ?>" target="<?php echo $cta_button['target']; ?>"><?php echo $cta_button['title']; ?></a></div>
            <?php
                endif;
            ?>
            <?php
                $bottom_text = get_sub_field('text_bottom');
                if($bottom_text):
            ?>
            <div class="text-bottom"><?php echo $bottom_text; ?></div>
            <?php
                endif;
            ?>
        </div>
    </div>
</div>