<?php
$subscription_cta_label = get_field('subscription_cta_button', 'option');
$subscription_form_link = get_field('subscription_form_link', 'option');
?>
<div class="module module-subscription">
    <div class="outer site-padding max-width">
        <div class="inner">
            <p><?php the_field('subscription_text', 'option'); ?> <br>
                <a href="<?php echo $subscription_form_link; ?>" target="_blank"><?php echo $subscription_cta_label; ?></a>
            </p>
        </div>
    </div>
</div>
<?php
$news_and_events = get_field('news_and_events');
$featured_posts = array();

if (is_array($news_and_events) && !empty($news_and_events['featured_news'])) {
    $featured_posts = $news_and_events['featured_news'];
} else {
    $featured_posts = get_posts(array(
        'post_type' => 'mazon_news',
        'posts_per_page' => 3,
        'post__not_in' => array(get_the_ID()),
    ));
}
?>
<div class="module module-news-and-events">
    <div class="outer site-padding max-width">
        <div class="inner">
            <div class="top-area">
                <div class="left">
                    <div class="label">News & Events

                    </div>
                </div>
                <div class="right">
                    <a href="<?php echo site_url('/news/mazon_news'); ?>" target="_self">
                        <div class="cta-button">
                            <span>All News</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
                                <path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#000" />
                            </svg>
                        </div>
                    </a>
                </div>
                <div class="clear-both"></div>
            </div>
            <div class="boxes">
                <?php if ($featured_posts): ?>
                    <?php foreach ($featured_posts as $featured_post): ?>
                        <?php
                        $featured_post_id = is_object($featured_post) ? $featured_post->ID : $featured_post;
                        $title = get_the_title($featured_post_id);
                        $excerpt_content = get_field('excerpt_content', $featured_post_id);
                        $text = strip_tags(get_field('text', $featured_post_id));
                        if (!$excerpt_content['excerpt']) {
                            $excerpt_content['excerpt'] = get_words($text, 30);
                            if (strlen($text) > strlen($excerpt_content['excerpt']) && strlen($excerpt_content['excerpt']) > 4) {
                                $excerpt_content['excerpt'] .= '...';
                            }
                        }
                        $cta_button = $excerpt_content['cta_button'];
                        if (!$cta_button) {
                            $cta_button = array();
                            $cta_button['url'] = get_permalink($featured_post_id);
                            $cta_button['title'] = 'Read more.';
                            $cta_button['target'] = '';
                        }
                        $excerpt_content['excerpt'] .= ' <a href="' . $cta_button['url'] . '" target="' . $cta_button['target'] . '">' . $cta_button['title'] . '</a>';
                        ?>
                        <div class="box">
                            <div class="title"><?php echo $title; ?></div>
                            <div class="text">
                                <p>
                                    <?php echo $excerpt_content['excerpt']; ?>
                                </p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
