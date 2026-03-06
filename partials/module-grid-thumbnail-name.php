<div class="module module-priorities-items">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <div class="items">

            <?php
            $items = get_sub_field('items');
            if( $items ) :
                $n = 0;
                foreach( $items as $item ) :
                    $image = $item['thumbnail'];
                    $base_url = str_replace('http','',str_replace('https','',BASE_URL));
                    $link_target = $item['link'] && strpos($item['link'],$base_url) === false || $item['link'] && strpos(strtolower($item['link']),'.pdf') !== false ? '_blank' : '';
                        
            ?>
                    <div class="post-item">
                        <?php if($item['link']): ?>
                        <a href="<?php echo $item['link']; ?>" target="<?php echo $link_target; ?>">
                        <?php endif; ?>
                            <div class="thumbnail">
                                <?php if($image): ?>
                                <div class="image" style="background-image:url(<?php echo $image['url']; ?>);"></div>
                                <?php endif; ?>
                            </div>
                            <div class="title"><?php echo $item['title']; ?></div>
                            <div class="subtitle"><?php echo $item['text']; ?></div>
                        <?php if($item['link']): ?>
                        </a>
                        <?php endif; ?>
                    </div>
            <?php
                    
                endforeach;
            endif;

            ?>
            </div>
        </div>
    </div>
</div>