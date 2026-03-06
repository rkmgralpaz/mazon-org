<div class="module module-news-and-events">
    <div class="outer site-padding max-width">
        <div class="inner">
            <div class="top-area">
                <?php
                $label = get_sub_field('label');
                if( $label ):
                ?>
                <div class="left">
                    <div class="label"><?php echo $label; ?></div>
                </div>
                <?php endif; ?>
                <div class="right">
                    <?php
                    $cta_button = get_sub_field('cta_button');
                    if( $cta_button ):
                    ?>
                    <a href="<?php echo $cta_button['url']; ?>" target="<?php echo $cta_button['target']; ?>">
                        <div class="cta-button">
                            <span><?php echo $cta_button['title']; ?></span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
                              <path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#000"/>
                            </svg>
                        </div>
                    </a>
                    <?php endif; ?>
                </div>
                <div class="clear-both"></div>
            </div>
            <div class="boxes">
                
                <?php
                    $featured_posts = get_sub_field('featured_news');
                    if($featured_posts):
                        foreach( $featured_posts as $featured_post ):
                            $permalink = get_permalink( $featured_post->ID );
                            $title = get_the_title( $featured_post->ID );
                            $excerpt_content = get_field( 'excerpt_content', $featured_post->ID );
                            $text = strip_tags(get_field( 'text', $featured_post->ID ));
                            if(!$excerpt_content['excerpt']):
                                $excerpt_content['excerpt'] = get_words($text,30);
                                if(strlen($text) > strlen($excerpt_content['excerpt']) && strlen($excerpt_content['excerpt']) > 4):
                                    $excerpt_content['excerpt'] .= '...';
                                endif;
                            endif;
                            $cta_button = $excerpt_content['cta_button'];
                            if(!$cta_button):
                                $cta_button = array();
                                $cta_button['url'] = get_permalink($featured_post->ID);
                                $cta_button['title'] = 'Read more.';
                                $cta_button['target'] = '';
                            endif;
                            $excerpt_content['excerpt'] .= ' <a href="'.$cta_button['url'].'" target="'.$cta_button['target'].'">'.$cta_button['title'].'</a>';
                ?>
                <div class="box">
                    <div class="title"><?php echo $title; ?></div>
                    <div class="text">
                        <p>
                            <?php echo $excerpt_content['excerpt']; ?>
                        </p>
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