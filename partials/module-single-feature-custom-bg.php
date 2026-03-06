<div class="module module-single-feature-custom-bg">
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
                    </a>
                </div>
                <?php endif; ?>
                
            </div>
            <div class="clear-both"></div>
        </div>
    </div>
    <?php
        $background = get_sub_field('background');
        if(!isset($background['portrait_orientation']['image']['url'])):
            $background['portrait_orientation']['image']['url'] = $background['landscape_orientation']['image']['url'];
        endif;
        $background['landscape_orientation']['opacity'] = $background['landscape_orientation']['opacity'] / 100; 
        $landscape_style = "background-image: url({$background['landscape_orientation']['image']['url']});";
        $landscape_style .= "background-position: {$background['landscape_orientation']['align']};";
        $landscape_style .= "opacity: {$background['landscape_orientation']['opacity']};";
        $background['portrait_orientation']['opacity'] = $background['portrait_orientation']['opacity'] / 100; 
        $portrait_style = "background-image: url({$background['portrait_orientation']['image']['url']});";
        $portrait_style .= "background-position: {$background['portrait_orientation']['align']};";
        $portrait_style .= "opacity: {$background['portrait_orientation']['opacity']};";
    ?>
    <div class="bg <?php echo $background['color']; ?>">
        <div class="bg-img landscape" style="<?php echo $landscape_style; ?>"></div>
        <div class="bg-img portrait" style="<?php echo $portrait_style; ?>"></div>
    </div>
</div>