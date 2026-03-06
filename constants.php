<?php

define('TEMPLATE_DIR', esc_url(get_template_directory_uri())."/");
define('IS_HOME',is_front_page()); 
define('BASE_URL',home_url("/"));
define('PATH',str_replace(home_url(), "", get_home_url(null, $wp->request, null)));
$GLOBALS['PATH_NAMES'] = explode("/",PATH);
array_shift($GLOBALS['PATH_NAMES']);
define('PHONE_MEDIA_QUERY',767);
define('ARCHIVE_ITEMS_PER_PAGE',12);

?>