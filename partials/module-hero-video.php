<div class="module module-hero-video unselectable">
    <div class="outer max-width">
        <div class="inner site-padding">
            <div class="holder">
                <?php
                $text = get_sub_field('text');
                if($text != ''):
                ?>
                <div class="phrase"><?php echo $text; ?></div>
                <?php 
                endif;
                //
                $video_url = get_sub_field('video_url');
                $video_duration = get_sub_field('video_duration');
                if($video_url != ''):
                ?>
                <a class="video-button" href="<?php echo $video_url; ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10.176" height="13" viewBox="0 0 10.176 13">
                        <path d="M6.5,0,13,10.176H0Z" transform="translate(10.176) rotate(90)" fill="#fff"/>
                    </svg>
                    <?php
                    if($video_duration != ''):
                    ?>
                    <div class="time"><?php echo $video_duration; ?></div>
                    <?php
                    endif;
                    ?>
                </a>
                <?php
                endif;
                ?>
            </div>
            <?php
            $image = get_sub_field('image');
            if(!$image):
                $image['url'] = '';
            endif;
            ?>
            <div class="bg" data-image="<?php echo $image['url'] ?>" style="background-image:url(<?php echo $image['url'] ?>);"></div>
        </div>
    </div>
</div>
