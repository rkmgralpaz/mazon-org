<div class="module module-single-feature">
    <div class="outer site-padding-2 max-width">
        <div class="inner">
            <div class="left">
                <div class="title">
                    <?php echo get_sub_field('Title'); ?>
                </div>
            </div>
            <div class="right">
                <div class="text">
                    <?php echo get_sub_field('text'); ?>
                </div>
                <?php 
            
                $cta_button = get_sub_field('cta_button');
                if($cta_button):

                ?>
                <div class="cta-button">
                    <a href="<?php echo $cta_button['url'] ?>" target="<?php echo $cta_button['target'] ?>">
                        <?php echo $cta_button['title'] ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
                          <path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#000"/>
                        </svg>
                    </a>
                </div>
                <?php endif; ?>
                
            </div>
            <div class="clear-both"></div>
        </div>
    </div>
</div>