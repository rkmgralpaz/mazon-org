<?php 
    $page = get_posts(
        array(
            'name'      => 'board',
            'post_type' => 'page'
        )
    );
    if(count($page)):
        $url = get_permalink($page[0]->ID);
        wp_redirect( $url );
        exit;
    endif;
?>
