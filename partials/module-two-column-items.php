<div class="module module-two-column-items">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <?php  
                $_classes = get_sub_field('remove_top_space') ? 'remove-top-space' : '';
                $items = get_sub_field('items');
                if( $items ) :
            ?>
            <div class="items <?php echo $_classes; ?>">
                <?php  
                    foreach( $items as $item ) : 
                ?>
                <div class="item">
                    <?php if($item['link']): ?>
                    <a href="<?php echo $item['link']['url']; ?>" target="<?php echo $item['link']['target']; ?>">
                    <div class="title"><?php echo $item['link']['title']; ?></div>
                    </a>
                    <?php endif; ?>
                    <?php if($item['text'] != ''): ?>
                    <div class="text"><?php echo $item['text']; ?></div>
                    <?php endif; ?>
                    <?php if($item['bottom_link']): ?>
                    <div class="link">
                        <a href="<?php echo $item['bottom_link']['url']; ?>" target="<?php echo $item['bottom_link']['target']; ?>">
                            <?php
                                if($item['icon'] != 'none'):
                                    require 'icon-'.$item['icon'].'.php';
                                endif;
                            ?>
                            <?php echo $item['bottom_link']['title']; ?>
                        </a>
                    </div>
                    <?php endif; ?>
                </div>
                <?php
                    endforeach;
                ?>
            </div>
            <?php
                endif;
            ?>
        </div>
    </div>
</div>
<?php
    unset($items);
?>