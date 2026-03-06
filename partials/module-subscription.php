<div class="module module-subscription">
    <div class="outer site-padding max-width">
        <div class="inner">
            <?php
                $cta_button = get_field('subscription_cta_button','option'); 
                $subscription_form_link = get_field('subscription_form_link', 'option');
            ?>
            <p><?php the_field('subscription_text','option'); ?> <br>
              
              <a href="<?php echo $subscription_form_link; ?>" target="_blank"><?php echo $cta_button; ?></a>
              
            </p>
            
            
        </div>
    </div>
</div>