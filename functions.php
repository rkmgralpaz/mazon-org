<?php

function get_num_version(){
    return '1.0.144';
}

//-----------------------------//
//--- AD MENU COMPATIBILITY ---//
//-----------------------------//


register_nav_menus();


//----------------//
//--- SETTINGS ---//
//----------------//


function custom_menu_order($menu_ord) {
    if (!$menu_ord) return true;
     
    return array(
        'index.php', // Dashboard
        'separator1', // First separator
		'edit.php?post_type=page', // Pages
        'edit.php', // Posts Default
		'edit.php?post_type=stories', // Stories
        'edit.php?post_type=priorities', // Priorities
        'edit.php?post_type=policy_actions', // Policy Actions
        'edit.php?post_type=board', // Board
        'edit.php?post_type=staff', // Staff
        'edit.php?post_type=events', // Events
        'edit.php?post_type=mazon_statements', // Mazon Statements
        'edit.php?post_type=mazon_news', // Mazon News
        'edit.php?post_type=blog', // Blog
        'edit.php?post_type=videos', // Videos
        'edit.php?post_type=publications', // Publications
        'edit.php?post_type=global_boxes', // Global Boxes
        'edit.php?post_type=announcement', // Announcement
		'upload.php', // Media
        'wpcf7',
        'theme-options',
        'users.php', // Users
        'separator2', // Second separator
        'themes.php', // Appearance
        'separator3', // Third separator
        'separator4', // Fourth separator
		'plugins.php', // Plugins
        'edit-comments.php', // Comments
        // 'tools.php', // Tools
        'options-general.php', // Settings
		//'separator-last', // Last separator
    );
}
add_filter('custom_menu_order', 'custom_menu_order'); // Activate custom_menu_order
add_filter('menu_order', 'custom_menu_order');

function remove_menus(){
	remove_menu_page( 'index.php' );                  //Dashboard
	remove_menu_page( 'edit.php' );                   //Posts
	//remove_menu_page( 'upload.php' );                 //Media
	//remove_menu_page( 'edit.php?post_type=page' );    //Pages
	remove_menu_page( 'edit-comments.php' );          //Comments
	//remove_menu_page( 'themes.php' );                 //Appearance
	//remove_menu_page( 'plugins.php' );                //Plugins
	//remove_menu_page( 'users.php' );                  //Users
	//remove_menu_page( 'tools.php' );                  //Tools
	//remove_menu_page( 'options-general.php' );        //Settings
}
add_action( 'admin_menu', 'remove_menus' );

function remove_customize() {
    $customize_url_arr = array();
    $customize_url_arr[] = 'customize.php'; // 3.x
	$customize_url_arr[] = 'themes.php'; // 3.x
    $customize_url = add_query_arg( 'return', urlencode( wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'customize.php' );
    $customize_url_arr[] = $customize_url; // 4.0 & 4.1
    if ( current_theme_supports( 'custom-header' ) && current_user_can( 'customize') ) {
        $customize_url_arr[] = add_query_arg( 'autofocus[control]', 'header_image', $customize_url ); // 4.1
        $customize_url_arr[] = 'custom-header'; // 4.0
    }
    if ( current_theme_supports( 'custom-background' ) && current_user_can( 'customize') ) {
        $customize_url_arr[] = add_query_arg( 'autofocus[control]', 'background_image', $customize_url ); // 4.1
        $customize_url_arr[] = 'custom-background'; // 4.0
    }
    foreach ( $customize_url_arr as $customize_url ) {
        remove_submenu_page( 'themes.php', $customize_url );
    }
}
//add_action( 'admin_menu', 'remove_customize', 999 );


function wpb_custom_new_menu() {
  register_nav_menu('my-custom-menu',__( 'My Custom Menu' ));
}
add_action( 'init', 'wpb_custom_new_menu' );

/* Disable WordPress Admin Bar for all users but admins. */
show_admin_bar(false);



function remove_admin_bar_links() {
    global $wp_admin_bar;
    //$wp_admin_bar->remove_menu('wp-logo');          // Remove the Wordpress logo
    //$wp_admin_bar->remove_menu('about');            // Remove the about Wordpress link
    //$wp_admin_bar->remove_menu('wporg');            // Remove the Wordpress.org link
    //$wp_admin_bar->remove_menu('documentation');    // Remove the Wordpress documentation link
    //$wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
   	//$wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
    //$wp_admin_bar->remove_menu('site-name');        // Remove the site name menu
    //$wp_admin_bar->remove_menu('view-site');        // Remove the view site link
    //$wp_admin_bar->remove_menu('updates');          // Remove the updates link
    $wp_admin_bar->remove_menu('comments');         // Remove the comments link
    $wp_admin_bar->remove_menu('new-content');      // Remove the content link
    //$wp_admin_bar->remove_menu('w3tc');             // If you use w3 total cache remove the performance link
    //$wp_admin_bar->remove_menu('my-account');       // Remove the user details tab
}
add_action( 'wp_before_admin_bar_render', 'remove_admin_bar_links' );


//--- DISABLE SAERCH EVERYTHING PLUGIN UPDATE ---//

//disable search everything plugin update -> lasted updates trigger errors when filter custom post list by custom taxonomies
function filter_plugin_updates( $value ) {
    unset( $value->response['search-everything/search-everything.php'] );
    return $value;
}
add_filter( 'site_transient_update_plugins', 'filter_plugin_updates' );

//--- FUTURE PERMALINK ---//

// post, page post type
add_filter( 'post_link', 'future_permalink', 10, 3 );
// custom post types
add_filter( 'post_type_link', 'future_permalink', 10, 4 );

function future_permalink( $permalink, $post, $leavename, $sample = false ) {
	/* for filter recursion (infinite loop) */
	static $recursing = false;

	if ( empty( $post->ID ) ) {
		return $permalink;
	}

	if ( !$recursing ) {
		if ( isset( $post->post_status ) && ( 'future' === $post->post_status ) ) {
			// set the post status to publish to get the 'publish' permalink
			$post->post_status = 'publish';
			$recursing = true;
			return get_permalink( $post, $leavename ) ;
		}
	}

	$recursing = false;
	return $permalink;
}


//--- CONFIG WYSIWYG EDITOR ---//

//
add_action( 'init', 'my_theme_add_editor_styles' );
function my_theme_add_editor_styles() {
    add_editor_style( 'custom-editor-style.css' );
}

//
add_filter( 'acf/fields/wysiwyg/toolbars' , 'my_toolbars'  );
function my_toolbars( $toolbars ){
	// Add a new toolbar called "Very Simple"
	// - this toolbar has only 1 row of buttons
	//$toolbars['Custom One' ] = array();
	//$toolbars['Custom One' ][1] = array('formatselect','styleselect','bold','italic','underline','link','unlink','removeformat','fullscreen');
	
    //--- IMPORTANT MESSAGE ---//
    //uses 'wp_adv' as 'add media button' in fullscreen mode. 'wp_adv' button has modified from file  /js/acf-custom-events.js
    
	$toolbars['Super Basic'] = array();
	$toolbars['Super Basic'][1] = array('bold','italic','underline','removeformat','fullscreen','wp_adv');
	
	$toolbars['Basic'] = array();
	$toolbars['Basic'][1] = array('bold','italic','underline','link','unlink','removeformat','fullscreen','wp_adv');
	
    $toolbars['Basic And Styles'] = array();
	$toolbars['Basic And Styles'][1] = array('styleselect','bold','italic','underline','link','unlink','removeformat','fullscreen','wp_adv');

	$toolbars['Basic And Bullist'] = array();
	$toolbars['Basic And Bullist'][1] = array('bold','italic','underline','bullist','numlist','link','unlink','removeformat','fullscreen','wp_adv');
    
    $toolbars['Basic Indent'] = array();
	$toolbars['Basic Indent'][1] = array('bold','italic','underline','bullist','numlist','outdent','indent','link','unlink','removeformat','fullscreen','wp_adv');
	
	$toolbars['Advanced'] = array();
	$toolbars['Advanced'][1] = array('styleselect','formatselect','bold','italic','underline','link','unlink','removeformat','fullscreen','wp_adv');
    
    $toolbars['Styles And Link'] = array();
	$toolbars['Styles And Link'][1] = array('styleselect','link','unlink','add_media_custom','removeformat','fullscreen','wp_adv');
	
    $toolbars['Styles And Link And Italic'] = array();
	$toolbars['Styles And Link And Italic'][1] = array('styleselect','italic','link','unlink','removeformat','fullscreen','wp_adv');

	$toolbars['Full'] = array();
	$toolbars['Full'][1] = array('styleselect','formatselect','bold','italic','underline','bullist','numlist','link','unlink','removeformat','table','outdent', 'indent', 'undo', 'redo','add_media_custom','fullscreen','wp_adv');
    
    $toolbars['Link Only'] = array();
	$toolbars['Link Only'][1] = array('link','unlink','fullscreen','wp_adv');

    $toolbars['Italic Only'] = array();
	$toolbars['Italic Only'][1] = array('italic','removeformat','fullscreen','wp_adv');
    
    $toolbars['Formats Only'] = array();
	$toolbars['Formats Only'][1] = array('styleselect','removeformat','fullscreen','wp_adv');
	

	//$toolbars['Full'] = array();
	//$toolbars['Full'][1] = array('formatselect','bold','italic','underline','bullist','link','unlink','removeformat','table','wp_more','fullscreen');
	
	/*
	$toolbars['Full'] = array();
	$toolbars['Full'][1] = array('bold', 'italic', 'underline', 'bullist', 'numlist', 'alignleft', 'aligncenter', 'alignright', 'alignjustify', 'link', 'unlink', 'hr', 'spellchecker', 'wp_more', 'wp_adv' );
	$toolbars['Full'][2] = array('styleselect', 'formatselect', 'fontselect', 'fontsizeselect', 'forecolor', 'pastetext', 'removeformat', 'charmap', 'outdent', 'indent', 'undo', 'redo', 'wp_help' );
	*/

	// remove the 'Basic' toolbar completely
	//unset( $toolbars['Basic' ] );
	
	// return $toolbars - IMPORTANT!
	return $toolbars;
}


function plugin_register_buttons( $buttons ) {
    $buttons[] = 'add_media_custom';
    return $buttons;
}
add_filter( 'mce_buttons', 'plugin_register_buttons' );


function plugin_register_plugin( $plugin_array ) {
    $plugin_array['customs'] = get_template_directory_uri(). '/js/tinymce-plugin.js';
    return $plugin_array;
}
add_filter( 'mce_external_plugins', 'plugin_register_plugin' );


add_filter( 'tiny_mce_before_init', function( $settings ){
	$settings['block_formats'] = 'Paragraph=p;Heading=h3';
	return $settings;
} );


/*
* Callback function to filter the MCE settings
*/

function my_mce_before_init_insert_formats( $init_array ) {

// Define the style_formats array

	$style_formats = array(
/*
* Each array child is a format with it's own settings
* Notice that each array has title, block, classes, and wrapper arguments
* Title is the label which will be visible in Formats menu
* Block defines whether it is a span, div, selector, or inline style
* Classes allows you to define CSS classes
* Wrapper whether or not to add a new block-level element around any selected elements
*/
		array(
			'title' => 'Color',
			'inline' => 'span',
			'classes' => 'colorize',
			'wrapper' => true,
		),
        array(
			'title' => 'Highlight',
			'inline' => 'span',
			'classes' => 'highlight',
			'wrapper' => true,
		),
        array(
			'title' => '→Arrow',
			'inline' => 'span',
			'classes' => 'arrow-format',
			'wrapper' => true,
		),
        array(
			'title' => 'Heading',
			'inline' => 'span',
			'classes' => 'heading-format',
			'wrapper' => true,
		),
    
    array(
      'title' => 'Add media custom',
      'inline' => 'span',
      'classes' => '',
      
    ),

		  
	);
	// Insert the array, JSON ENCODED, into 'style_formats'
	$init_array['style_formats'] = json_encode( $style_formats );
	
	return $init_array;
  
}
// Attach callback to 'tiny_mce_before_init'
add_filter( 'tiny_mce_before_init', 'my_mce_before_init_insert_formats' );

//----------------------------------------------------//
//--- ACF FLEXIBLE CONTENT GET TITLE FROM SUBFIELD ---//
//http://www.advancedcustomfields.com/resources/acf-fields-flexible_content-layout_title/
function my_acf_flexible_content_layout_title( $title, $field, $layout, $i ) {

	// backup default title
	$tmp_title = $title;
    // remove layout title from text
	$title = '';

	// load sub field image
	// note you may need to add extra CSS to the page t style these elements

	/*
	if( $image = get_sub_field('image') ) {
        $title .= '<div class="thumbnail">';
		$title .= '<img src="' . $image['sizes']['thumbnail'] . '" height="36px" />';
        $title .= '</div>';
	}
    */

	// load text sub field
	if( $text = get_sub_field('title') ) {
        $title = strip_tags($text);
    }else if( $text = get_sub_field('Title') ) {
        $title = strip_tags($text);
    }else if( $text = get_sub_field('label') ) {
        $title = strip_tags($text);
    }else if( $text = get_sub_field('text') ) {
        $title = strip_tags($text);
    }else if( $text = get_sub_field('text_1') ) {
        $title = strip_tags($text);
    }else if(get_sub_field('unique_text')) {//hero slider
        if(get_sub_field('unique_text')['has_unique_text']){
            $title = strip_tags(get_sub_field('unique_text')['text']);
        }else{
            $slides = get_sub_field('slides');
            foreach($slides as $slide):
                if($slide['text'] != ''):
                    $title = strip_tags($slide['text']);
                    break;
                endif;
            endforeach;
        }
    }else if(get_sub_field('buttons')) {//hero buttons
        $buttons = get_sub_field('buttons');
        $txt = array();
        foreach($buttons as $button):
            if($button['button']['title'] != ''):
                $txt[] .= strip_tags($button['button']['title']);
            endif;
        endforeach;
        $title = implode(' / ',$txt);
    }else if(get_sub_field('button_1') OR get_sub_field('button_2')) {//hero buttons
        $button1 = get_sub_field('button_1');
        $button2 = get_sub_field('button_2');
        $txt = array();
        
        if($button1):
            $txt[] .= strip_tags($button1['title']);
        endif;
        if($button2):
            $txt[] .= strip_tags($button2['title']);
        endif;
        
        $title = implode(' / ',$txt);
    }else if(get_sub_field('items')) {//hero buttons
        $items = get_sub_field('items');
        $txt = array();
        $n = 0;
        foreach($items as $item):
            $n++;
            $hit = false;
            if(is_numeric($item)):
                $txt[] .= get_the_title($item);
            elseif(isset($item['title']) && $item['title'] != ''):
                $txt[] .= strip_tags($item['title']);
                $hit = true;
            else:
                $txt[] .= strip_tags($item['link']['title']);
                $hit = true;
            endif;
            if($n == 5){
                break;
            }
        endforeach;
        $title = implode(' / ',$txt);
    }else if(get_sub_field('boxes')) {//hero buttons
        $items = get_sub_field('boxes');
        $txt = array();
        $n = 0;
        foreach($items as $item):
            $n++;
            $txt[] .= get_the_title($item);
            if($n == 5){
                break;
            }
        endforeach;
        $title = implode(' / ',$txt);
    }
    

    if(strlen($title) > 53){
        $title = substr($title,0,53).'...';
    }

    if($title == ''){
        $title = '<b> <span style="color:#aaaaaa">'.$tmp_title.'</span></b>';
    }else{
        //$title .= '</b> <span style="color:#aaaaaa">('.$tmp_title.')</span>';
        $title = '<b><span style="color:#aaaaaa">'.$tmp_title.':</span></b> '.$title;
    }

	// return
	return $title;

}

// name
add_filter('acf/fields/flexible_content/layout_title/name=modules', 'my_acf_flexible_content_layout_title', 10, 4);
//add_filter('acf/fields/flexible_content/layout_title/name=blocks', 'my_acf_flexible_content_layout_title', 10, 4);

//-----------------------------------------------//
//--- ADDES JS FILE WITH CUSTOM EVENTS TO ACF ---//

function my_admin_enqueue_scripts() {
	wp_enqueue_script( 'my-admin-js', get_template_directory_uri() . '/js/acf-custom-events.js', array(), get_num_version(), true );
}
add_action('acf/input/admin_enqueue_scripts', 'my_admin_enqueue_scripts');

//--- ACF OPTIONS PAGE ---//

if(function_exists('acf_add_options_page')){
	acf_add_options_page(array(
		'page_title' 	=> 'Theme Options',
		'menu_title'	=> 'Theme Options',
		'menu_slug' 	=> 'theme-options',
		'capability'	=> 'edit_posts',
        'redirect'		=> true,
        'position' => '63.3'
	));
    /*
    acf_add_options_sub_page(array(
    'page_title' => 'Footer',
    'menu_title' => 'Footer',
    'parent_slug'	=> 'theme-options',
	));
    */
}

//-------------------------//
//--- remove body class ---//

add_filter('body_class','my_class_names');
function my_class_names($classes) {
    global $wp_query;

    $arr = array();

    //if(is_page()) {
        $id = $wp_query->get_queried_object_id();
        $type = get_post_type($id);
        $slug = get_post_field( 'post_name', $id );
        if(is_single()) {
            $arr[] = 'type-'.$type.'-single';
        }else{
            $arr[] = 'type-'.$type;
        }
        if(is_page() || is_single()) {
            $arr[] = $type.'--'.$slug;
        }
        if(is_front_page()){
            $arr[] = 'page-home';
        }
    //}
    /*
    if(is_single()) {
        $id = $wp_query->get_queried_object_id();
        $arr[] = 'type-post post--'.get_post_field( 'post_name', $id );
    }
    */

    return $arr;
}


//-----------------------------//
//--- BUILD CUSTOM MAIN NAV ---//
//-----------------------------//

function buildTree(array &$flatNav, $parentId = 0) {
    $branch = [];
    foreach ($flatNav as &$navItem) {
        if($navItem->menu_item_parent == $parentId) {
            $children = buildTree($flatNav, $navItem->ID);
            if($children) {
                $navItem->children = $children;
            }
            $branch[$navItem->menu_order] = $navItem;
            unset($navItem);
        }
    }
    return $branch;
}
function get_main_nav($location_name = 'my-custom-menu'){
    // get current url to compare and apply selected class to items
    $actual_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    // get navs
    $locations = get_nav_menu_locations();
    // get menu items by menu name
    $flatMainNav = wp_get_nav_menu_items($locations[$location_name]);
    $mainNav = buildTree($flatMainNav);
    //
    $home_url = get_home_url().'/';
    //
    $html = '<ul id="menu-nav-main" class="menu level-1">';
    foreach ($mainNav as $level_1):
        $id = 'menu-item-'.$level_1->ID;
        $classes = $level_1->children ? 'menu-item-has-children '.$id : $id;
        $a_classes = '';
        if($actual_url == $level_1->url):
            $a_classes .= 'selected';
            $classes .= ' current_page_item';
        //elseif(strrpos($actual_url,$level_1->url) !== false && $level_1->url !== $home_url):
            //$a_classes .= 'selected';
            //$classes .= ' current_page_item';
        endif;
        $classes_by_user = '';
        if($level_1->classes[0]):
            $classes_by_user = $level_1->classes[0];
            $classes .= ' '.$classes_by_user;
        endif;
        $html .= '<li id="'.$id.'" class="'.$classes.'" data-special-classes="'.$classes_by_user.'"><a class="'.$a_classes.'" href="'.$level_1->url.'" target="'.$level_1->target.'">'.$level_1->title.'</a>';
        if($level_1->children):
            $align = get_field('align_child_items',$level_1->ID);
            $columns = get_field('columns_for_child_items',$level_1->ID);
            $html .= '<ul class="sub-menu level-2 align-'.$align.' columns-'.$columns.'" style="margin-left:'.get_field('offset_x_position',$level_1->ID).'px">';
            foreach ($level_1->children as $level_2):
                $id = 'menu-item-'.$level_2->ID;
                $classes = $level_2->children ? 'menu-item-has-children '.$id : $id . ' '.$level_2->classes[0];
                $a_classes = '';
                if($actual_url == $level_2->url):
                    $a_classes .= 'selected';
                    $classes .= ' current_page_item';
                //elseif(strrpos($actual_url,$level_2->url) !== false && $level_2->url !== $home_url):
                    //$a_classes .= 'selected';
                    //$classes .= ' current_page_item';
                endif;
                $html .= '<li id="'.$id.'" class="'.$classes.'"><a class="'.$a_classes.'" href="'.$level_2->url.'" target="'.$level_2->target.'">'.$level_2->title.'</a><span class="description">'.$level_2->description.'</span></li>';
                /*// disable level 3
                if($level_2->children):
                    $html .= '<ul class="sub-menu level-3">';
                    foreach ($level_2->children as $level_3):
                        $id = 'menu-item-'.$level_3->ID;
                        $classes = $id;
                        $a_classes = '';
                        if($actual_url == $level_3->url):
                            $a_classes .= 'selected';
                            $classes .= ' current_page_item';
                        elseif(strrpos($actual_url,$level_3->url) !== false && $level_3->url !== $home_url):
                            $a_classes .= 'selected';
                            $classes .= ' current_page_item';
                        endif;
                        $html .= '<li id="'.$id.'" class="'.$classes.'"><a class="'.$a_classes.'" href="'.$level_3->url.'" target="'.$level_3->target.'">'.$level_3->title.'</a></li>';
                    endforeach;
                    $html .= '</ul>';
                endif;
                */
            endforeach;
            $html .= '</ul>';
            $html .= '</li>';
        else:
            $html .= '</li>';
        endif;
    endforeach;
    $html .= '</ul>';
    
    echo $html;
}

//-----------------//
//--- FUNCTIONS ---//
//-----------------//

function get_words($sentence, $count = 10) {
  preg_match("/(?:\w+(?:\W+|$)){0,$count}/", $sentence, $matches);
  return $matches[0];
}
function get_snippet( $str, $wordCount = 10 ) {
    return implode(
      '',
      array_slice(
        preg_split(
          '/([\s,\.;\?\!]+)/',
          $str,
          $wordCount*2+1,
          PREG_SPLIT_DELIM_CAPTURE
        ),
        0,
        $wordCount*2-1
      )
    );
  }

function remove_a($str){
	$regex = '/<a (.*)<\/a>/isU';
	preg_match_all($regex,$str,$result);
	foreach($result[0] as $rs){
		$regex = '/<a (.*)>(.*)<\/a>/isU';
		$text = preg_replace($regex,'$2',$rs);
		$str = str_replace($rs,$text,$str);
	}
	return $str;
}
function remove_p($str, $new_tag = 'div'){
	$str = str_replace('<p','<'.$new_tag,$str);
	$str = str_replace('</p>','</'.$new_tag.'>',$str);
	//$str = str_replace('<p>','',$str);
	//$str = str_replace('</p>','',$str);
	return $str;
}
function get_excerpt($str){
	if(isset($str)){
		$str = explode('[!--more--]',strip_tags(str_replace('<!--more-->','[!--more--]',$str),'<br><b><strong><i><em><span>'));
		return $str[0];
	}
}
function slugify($string, $replace = array(), $delimiter = '-') {
  // https://github.com/phalcon/incubator/blob/master/Library/Phalcon/Utils/Slug.php
  if (!extension_loaded('iconv')) {
    throw new Exception('iconv module not loaded');
  }
  // Save the old locale and set the new locale to UTF-8
  $oldLocale = setlocale(LC_ALL, '0');
  setlocale(LC_ALL, 'en_US.UTF-8');
  $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
  if (!empty($replace)) {
    $clean = str_replace((array) $replace, ' ', $clean);
  }
  $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
  $clean = strtolower($clean);
  $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
  $clean = trim($clean, $delimiter);
  // Revert back to the old locale
  setlocale(LC_ALL, $oldLocale);
  return $clean;
}


//--- NEXT PREV POST ---//


function get_next_prev_post($type, $cat, $ID){
	$args = array(
		'post_type' => $type,
		'post_status' => 'publish',
		'posts_per_page' => -1,
		'caller_get_posts'=> 1,
		'category_name' => $cat
	);
	$list = null;
	$list = new WP_Query($args);
	$result = array();
	$posts_ID = array();
	$n = -1;
	$i = 0;
	if( $list -> have_posts() ) {
		while ($list -> have_posts()) : $list -> the_post();
			$post_ID = get_the_ID();
			$list_ID[] += $post_ID;
			if($post_ID == $ID){
				$n = $i;
			}
			$i++;
		endwhile;
	}
	wp_reset_query();
	if($n < $i-1){
		if($n == 0){
			$j = $n+1;
			$next = get_permalink($list_ID[$j]);
			$j = $i-1;
			$prev = get_permalink($list_ID[$j]);
		}else{
			$j = $n+1;
			$next = get_permalink($list_ID[$j]);
			$j = $n-1;
			$prev = get_permalink($list_ID[$j]);
		}
		$result = array($prev,$next);
	}else{
		$j = 0;
		$next = get_permalink($list_ID[$j]);
		$j = $n-1;
		$prev = get_permalink($list_ID[$j]);
		$result = array($prev,$next);
	}
	return $result;
}


//--- DETECT HAS CHILDREN ---//

function has_children($post_ID = null) {
    if ($post_ID === null) {
        global $post;
        $post_ID = $post->ID;
    }
    $query = new WP_Query(array('post_parent' => $post_ID, 'post_type' => 'any'));

    return $query->have_posts();
}

//--- DETECT HAS PARENT ---//

function has_parent(){
	global $post;     // if outside the loop
	if ( is_page() && $post->post_parent ) {
		return true;
	} else {
		return false;
	}
}
function get_parent(){
    global $post;
    return $post->post_parent;
}

//--- LIMIT HIERARCHICAL PAGES DEPTH TO CHILDREN ONLY ---//

function my_hierarchical_page_depth_limit($a) {
  $a['depth'] = 1;
  return $a;
}
//add_action('page_attributes_dropdown_pages_args','my_hierarchical_page_depth_limit');

//--- CHANGE JPG THUMBNAILS QUALITY ---//

#add_filter( 'jpeg_quality', create_function( '', 'return 100;' ) );

//--- SHORT CODE ---//
/*
//example
function my_shortcode_handler( $atts, $content = null ) {
    $a = shortcode_atts( array(
        'attr_1' => 'attribute 1 default',
        'attr_2' => 'attribute 2 default',
        // ...etc
    ), $atts );
	return '<p>'.$a['attr_1'].' '.$a['attr_2'].'<p>';
}
add_shortcode( 'myshortcode', 'my_shortcode_handler' );
*/

//form shortcode
function form_shortcode($atts = [], $content = null, $tag = ''){
    ob_start();
    $id = 'form-'.uniqid();
    $a = shortcode_atts( array(
        'src' => '',
		'height' => '300px',
		'height-tablet' => '',
        'height-phone' => '',
        'mq-tablet' => '1024px',
        'mq-phone' => '414px',
        'scrolling' => 'no'
	), $atts );
    if($a['height-tablet'] == ''){
        $a['height-tablet'] = $a['height'];
    }
    if($a['height-phone'] == ''){
        $a['height-phone'] = $a['height-tablet'];
    }
    if($a['src'] == ''){
        $a['src'] = $content;
    }
	echo '
    <style>
        #'.$id.'{
            width: 100%;
            border: none;
            height: '.$a['height'].'
        }
        @media only screen and (max-width: '.$a['mq-tablet'].') {
            #'.$id.'{
                height: '.$a['height-tablet'].'
            }
        }
        @media only screen and (max-width: '.$a['mq-phone'].') {
            #'.$id.'{
                height: '.$a['height-phone'].'
            }
        }
    </style>
    <iframe  id="'.$id.'" src="'.$a['src'].'" height="auto" frameborder="0" scrolling="'.$a['scrolling'].'"> <a href="'.$a['src'].'">Loading</a> </iframe>';
    return ob_get_clean();
}
add_shortcode('form', 'form_shortcode');

function share_shortcode($atts = [], $content = null, $tag = ''){
    ob_start();
    $a = shortcode_atts( array(
        'url' => '',
		'mode' => 'default'
	), $atts );
    if($a['url'] == ''){
        $a['url'] = $content;
    }
    if($a['url'] == ''){
        $a['url'] = rtrim(BASE_URL, "/").PATH;
    }
    if($a['mode'] == 'icons'):
        echo '
        <div class="share-buttons-sc mode-icons">
            <div class="sh-label">Share</div>
            <a class="facebook" href="https://www.facebook.com/sharer/sharer.php?u='.$a['url'].'" target="_blank">
                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M18,0H6A6.018,6.018,0,0,0,0,6V18a6.018,6.018,0,0,0,6,6H18a6.018,6.018,0,0,0,6-6V6A6.018,6.018,0,0,0,18,0ZM16.5,8.25H14.25A.822.822,0,0,0,13.5,9v.75h2.25v3H13.5v6h-3v-6H8.25v-3H10.5V8.25a3.337,3.337,0,0,1,3.478-3H16.5Z"></path>
                </svg>
                <span>Facebook</span>
            </a>
            <a class="twitter" href="https://twitter.com/intent/tweet?url='.$a['url'].'" target="_blank">
                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="26" height="21.13" viewBox="0 0 26 21.13">
                <path d="M76,71.234a10.667,10.667,0,0,1-3.064.84,5.352,5.352,0,0,0,2.345-2.951,10.675,10.675,0,0,1-3.387,1.294,5.339,5.339,0,0,0-9.09,4.865A15.144,15.144,0,0,1,51.81,69.709a5.34,5.34,0,0,0,1.651,7.122,5.313,5.313,0,0,1-2.416-.667c0,.022,0,.045,0,.067a5.338,5.338,0,0,0,4.279,5.231,5.347,5.347,0,0,1-2.409.091,5.34,5.34,0,0,0,4.983,3.7,10.7,10.7,0,0,1-6.625,2.283A10.82,10.82,0,0,1,50,87.466a15.17,15.17,0,0,0,23.354-12.78q0-.347-.015-.69A10.838,10.838,0,0,0,76,71.234Z" transform="translate(-50 -68.733)"></path>
                </svg>
                <span>Twitter</span>
            </a>
        </div>
        ';
    elseif($a['mode'] == 'text'):
        echo '
        <div class="share-buttons-sc mode-text">
            <a href="https://www.facebook.com/sharer/sharer.php?u='.$a['url'].'" target="_blank" alt="Share on Facebook">Share on Facebook</a> <br><br>
            <a href="https://twitter.com/intent/tweet?url='.$a['url'].'" target="_blank" alt="Share on Twitter">Share on Twitter</a>
        </div>
        ';
    else:
        echo '
        <div class="share-buttons-sc mode-default">
            <div class="sh-label">Share:</div>
            <a class="facebook" href="https://www.facebook.com/sharer/sharer.php?u='.$a['url'].'" target="_blank">
                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M18,0H6A6.018,6.018,0,0,0,0,6V18a6.018,6.018,0,0,0,6,6H18a6.018,6.018,0,0,0,6-6V6A6.018,6.018,0,0,0,18,0ZM16.5,8.25H14.25A.822.822,0,0,0,13.5,9v.75h2.25v3H13.5v6h-3v-6H8.25v-3H10.5V8.25a3.337,3.337,0,0,1,3.478-3H16.5Z"></path>
                </svg>
                <span>Facebook</span>
            </a>
            <a class="twitter" href="https://twitter.com/intent/tweet?url='.$a['url'].'" target="_blank">
                <svg role="img" xmlns="http://www.w3.org/2000/svg" width="26" height="21.13" viewBox="0 0 26 21.13">
                <path d="M76,71.234a10.667,10.667,0,0,1-3.064.84,5.352,5.352,0,0,0,2.345-2.951,10.675,10.675,0,0,1-3.387,1.294,5.339,5.339,0,0,0-9.09,4.865A15.144,15.144,0,0,1,51.81,69.709a5.34,5.34,0,0,0,1.651,7.122,5.313,5.313,0,0,1-2.416-.667c0,.022,0,.045,0,.067a5.338,5.338,0,0,0,4.279,5.231,5.347,5.347,0,0,1-2.409.091,5.34,5.34,0,0,0,4.983,3.7,10.7,10.7,0,0,1-6.625,2.283A10.82,10.82,0,0,1,50,87.466a15.17,15.17,0,0,0,23.354-12.78q0-.347-.015-.69A10.838,10.838,0,0,0,76,71.234Z" transform="translate(-50 -68.733)"></path>
                </svg>
                <span>Twitter</span>
            </a>
        </div>
        ';
    endif;
    return ob_get_clean();
}
add_shortcode('share', 'share_shortcode');

//--- HEADER STYLES AND SCRIPTS ---//

function on__style(){
    //echo '<link rel="stylesheet" href="https://use.typekit.net/lpi2qki.css">';
	wp_enqueue_style('style-theme', get_bloginfo('stylesheet_url'), false, get_num_version(), 'screen');
}
add_action('wp_print_styles', 'on__style');

function my_scripts() {
	if (!is_admin()) {
		wp_deregister_script('jquery');
		wp_register_script('jquery', get_template_directory_uri().'/js/jquery-3.4.1.min.js', false, false, false);
 		wp_enqueue_script('jquery');
	}
	// El primer paso es usar wp_register_script para registrar el script que queremos cargar. Fíjense que aquí sí usamos *get_template_directory_uri()*
	wp_register_script( 'main-script', get_template_directory_uri() . '/js/main.min.js', array( 'jquery'), get_num_version(), false);
	// Una vez que registramos el script debemos colocarlo en la cola de WordPress
	wp_enqueue_script( 'main-script' );
}
// Agregamos la función a la lista de cargas de WordPress.
add_action( 'wp_enqueue_scripts', 'my_scripts' );

function on__script(){
    echo '
	<!--[if lt IE 9]>
		<script type="text/javascript" src="'. get_template_directory_uri() .'/js/html5shiv.js"></script>
    <![endif]-->
    <script>
		$(document).ready(function(){
			BASE_URL = "'. get_site_url() .'/";
            PATH = "'. PATH .'";
            TEMPLATE_DIR = "'. TEMPLATE_DIR .'";
			page.init();
		});
    </script>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=UA-4748051-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "UA-4748051-1");
    </script> -->
    ';
}
add_action('wp_head', 'on__script');


//----------------------------------//
//--- ACF 'HAS PARENT' CONDITION ---//




//------------------------//
//--- ACF RELATIONSHIP ---//

add_filter('acf/fields/relationship/result', 'my_acf_fields_relationship_result', 10, 4);
function my_acf_fields_relationship_result( $text, $post, $field, $post_id ) {
    //if(get_post_type($post->ID) == 'editors'){
        $company = get_field( 'company', $post->ID );
        if( $company ) {
            $text .= ' ' . sprintf( '(%s)', $company );
        }
    //}
    return $text;
}


//-------------------------//
//--- ACF ADMIN COLUMNS ---//

//https://medium.com/@thecenteno/adding-acf-fields-as-admin-columns-to-your-cpt-7c468fecaa99
//https://www.smashingmagazine.com/2018/12/customizing-admin-columns-wordpress/
//
//- Columns Projets
//Add columns to exhibition post list
function add_projects_acf_columns ( $columns ) {
    return array_merge ( $columns, array (
        'company' => __ ( 'Company' )
    ));
}
add_filter ( 'manage_edit-projects_columns', 'add_projects_acf_columns' );
//Add Sortable columns
function projects_column_register_sortable( $columns ) {
	$columns['company'] = 'Company';
	return $columns;
}
add_filter('manage_edit-projects_sortable_columns', 'projects_column_register_sortable' );
//Add columns to exhibition post list
function projects_custom_column ( $column, $post_id ) {
    switch ( $column ) {
     case 'company':
       echo get_post_meta( $post_id, 'company', true );
       break;
    }
}
add_action ( 'manage_projects_posts_custom_column', 'projects_custom_column', 10, 2 );
//reorder columns
function projects_filter_posts_columns( $columns ) {
  $columns = array(
      'cb' => $columns['cb'],
      'title' => __( 'Title' ),
      'company' => __( 'Company'),
      'date' => __( 'Date' ),
    );

  return $columns;
}
add_filter( 'manage_projects_posts_columns', 'projects_filter_posts_columns' );
//
//- Columns Editors
//
function add_editors_acf_columns ( $columns ) {
    return array_merge ( $columns, array (
        'country' => __ ( 'Country' )
    ));
}
add_filter ( 'manage_edit-editors_columns', 'add_editors_acf_columns' );
//Add Sortable columns
function editors_column_register_sortable( $columns ) {
	$columns['country'] = 'Country';
	return $columns;
}
add_filter('manage_edit-editors_sortable_columns', 'editors_column_register_sortable' );
//Add columns to exhibition post list
function editors_custom_column ( $column, $post_id ) {
    switch ( $column ) {
     case 'country':
       echo get_post_meta( $post_id, 'country', true );
       break;
    }
}
add_action ( 'manage_editors_posts_custom_column', 'editors_custom_column', 10, 2 );
//reorder columns
function editors_filter_posts_columns( $columns ) {
  $columns = array(
      'cb' => $columns['cb'],
      'title' => __( 'Title' ),
      'country' => __( 'Country'),
      'date' => __( 'Date' ),
    );

  return $columns;
}
add_filter( 'manage_editors_posts_columns', 'editors_filter_posts_columns' );

add_action('admin_head', 'my_admin_custom_styles');// --- delete this --- //
function my_admin_custom_styles() {
    $output_css = '<style type="text/css">
        .column-company { width: 60% !important;}
        .column-country { width: 60% !important;}
        @media only screen and (max-width: 1100px) {
            .column-company { width: 50% !important;}
            .column-country { width: 50% !important;}
        }
        @media only screen and (max-width: 782px) {
            .column-company { width: auto !important;}
            .column-country { width: auto !important;}
        }
    </style>';
    echo $output_css;
}

//-------------------------//
//--- ACF CUSTOM STYLES ---//

function my_acf_admin_head()
{
    ?>
    <style type="text/css">
        
        
      .mce-custom-media-button{
          border-color: #2271b1 !important;
      }
      .mce-custom-media-button button{
          color: #2271b1 !important;
          padding-left: 5px !important;
          padding-right: 6px !important;
      }
      .mce-custom-media-button button .mce-txt{
          vertical-align: middle;
      }
      .mce-custom-media-button button i{
          padding-right: 5px !important;
          transform: translateY(1px) !important;
      }
      .mce-custom-media-button button i:before{
          font: normal 18px/1 dashicons !important;
          content: "\f104" !important;
          color: #2271b1 !important;
      }
      .mce-custom-media-button button:hover{
          color: white !important;
          background-color: #2271b1 !important;
      }
      .mce-custom-media-button button:hover i:before{
          color: white !important;
      }
        
        .wysiwyg-small-height iframe {
			max-height: 80px !important;
		}
        .mce-fullscreen .wysiwyg-small-height iframe {
			max-height: none !important;
		}
        .no-resize .mce-flow-layout-item.mce-last.mce-resizehandle{
            display: none !important;
        }
        .no-resize textarea{
            resize: none !important;
        }
        .text-code textarea,
        .text-code input{
            font-family: monospace;
            background: #333;
            color: white;
        }
        .text-code.full-width{
            width: 100% !important;
        }

        .acf-field.hidden{
            display: none;
        }
        .acf-realtionship-small .acf-relationship{
            height: 309px;
        }
        .acf-realtionship-medium .acf-relationship{
            height: 435px;
        }
        .acf-realtionship-large .acf-relationship{
            height: 500px;
        }
        .acf-realtionship-small .acf-relationship .selection,
        .acf-realtionship-medium .acf-relationship .selection,
        .acf-realtionship-large .acf-relationship .selection{
            height: 100%;
            height: calc(100% - 45px);
        }
        .acf-realtionship-small .acf-relationship .selection .choices,
        .acf-realtionship-small .acf-relationship .selection .values,
        .acf-realtionship-medium .acf-relationship .selection .choices,
        .acf-realtionship-medium .acf-relationship .selection .values,
        .acf-realtionship-large .acf-relationship .selection .choices,
        .acf-realtionship-large .acf-relationship .selection .values{
            height: 100%;
        }
        .acf-realtionship-small .acf-relationship .selection .choices ul,
        .acf-realtionship-small .acf-relationship .selection .values ul,
        .acf-realtionship-medium .acf-relationship .selection .choices ul,
        .acf-realtionship-medium .acf-relationship .selection .values ul,
        .acf-realtionship-large .acf-relationship .selection .choices ul,
        .acf-realtionship-large .acf-relationship .selection .values ul{
            height: 100%;
            height: calc(100% - 10px);
        }
        .acf-tab-wrap.-left .acf-tab-group li:first-child{
            border-top: solid 1px #cccccc;
        }
        .acf-tab-wrap.-left:before{
            content:' ';
            border-top: solid 1px #cccccc !important;
            display: block;
            width: calc(80% - 14px);
            position: absolute;
            margin-left: -9px;
        }
        .acf-field.acf-field-group.acf-group-no-borders .acf-fields .acf-fields.-border{
            border: none;
        }
        .acf-field.acf-field-group.acf-group-no-borders .acf-fields .acf-fields > .acf-field{
            border: none;
            
        }
        /*
        .acf-tab-wrap.-left:after{
            content:' ';
            border-bottom: solid 1px #cccccc !important;
            display: block;
            width: calc(80% - 14px);
            position: absolute;
            margin-left: -9px;
            bottom: 0px;
        }
        */
        
        .menu-item-depth-1 .acf-menu-item-fields .show-only-first-level,
        .menu-item-depth-2 .acf-menu-item-fields .show-only-first-level{
            display: none;
        }
        .menu-item-depth-2{
            opacity: 0.3;
        }
        
        .r3d-insert-flipbook-button {
          display: none !important;
        }
        
    </style>
    
    <script type="text/javascript">
    /*
    (function($){
 
         //
 
    })(jQuery);
    /*
    </script>
    
    <?php
}
 
add_action('acf/input/admin_head', 'my_acf_admin_head');

//elimina parametros de versión en los css y js del wp_head()
//add_filter( 'style_loader_src', 't5_remove_version' );
//add_filter( 'script_loader_src', 't5_remove_version' );

function t5_remove_version( $url )
{
    return remove_query_arg( 'ver', $url );
}

// REMOVE WP EMOJI
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

//remove_action( 'wp_head', 'wlwmanifest_link');

//HIDE JSON API REST
/*
add_filter( 'rest_authentication_errors', function( $result ) {
  if ( ! empty( $result ) ) {
    return $result;
  }
  if ( ! is_user_logged_in() ) {
    return new WP_Error( 'rest_not_logged_in', 'You are not currently logged in.', array( 'status' => 401 ) );
  }
  if ( ! current_user_can( 'administrator' ) ) {
    return new WP_Error( 'rest_not_admin', 'You are not an administrator.', array( 'status' => 401 ) );
  }
  return $result;
});
*/
// Disable some endpoints for unauthenticated users
add_filter( 'rest_endpoints', 'disable_default_endpoints' );
function disable_default_endpoints( $endpoints ) {
    $endpoints_to_remove = array(
        '/oembed/1.0',
        '/wp/v2',
        '/wp/v2/media',
        '/wp/v2/types',
        '/wp/v2/statuses',
        '/wp/v2/taxonomies',
        '/wp/v2/tags',
        '/wp/v2/users',
        '/wp/v2/comments',
        '/wp/v2/settings',
        '/wp/v2/themes',
        '/wp/v2/blocks',
        '/wp/v2/oembed',
        '/wp/v2/posts',
        '/wp/v2/pages',
        '/wp/v2/block-renderer',
        '/wp/v2/search',
        '/wp/v2/categories'
    );

    if ( ! is_user_logged_in() ) {
        foreach ( $endpoints_to_remove as $rem_endpoint ) {
            // $base_endpoint = "/wp/v2/{$rem_endpoint}";
            foreach ( $endpoints as $maybe_endpoint => $object ) {
                if ( stripos( $maybe_endpoint, $rem_endpoint ) !== false ) {
                    unset( $endpoints[ $maybe_endpoint ] );
                }
            }
        }
    }
    return $endpoints;
}
/*
   Debug preview with custom fields
*/

add_filter('_wp_post_revision_fields', 'add_field_debug_preview');
function add_field_debug_preview($fields){
   $fields["debug_preview"] = "debug_preview";
   return $fields;
}

add_action( 'edit_form_after_title', 'add_input_debug_preview' );
function add_input_debug_preview() {
   echo '<input type="hidden" name="debug_preview" value="debug_preview">';
}

/**
 * Generate custom search form
 *
 * @param string $form Form HTML.
 * @return string Modified form HTML.
 */
function wpdocs_my_search_form( $form ) {
    $form = '<form role="search" method="get" id="searchform" class="searchform max-width" action="' . home_url( '/' ) . '" >
        <label class="screen-reader-text" for="s">' . __( 'Search for:' ) . '</label>
        <input type="text" value="' . get_search_query() . '" name="s" id="s" placeholder="Search" />
        <button type="submit" id="searchsubmit">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 44.2 46.8" style="enable-background:new 0 0 44.2 46.8;" xml:space="preserve">
            <path d="M42.4,41.5l-8.7-8.7C37,29.3,39,24.6,39,19.5C39,8.7,30.3,0,19.5,0C8.7,0,0,8.7,0,19.5C0,30.3,8.7,39,19.5,39
                c3.8,0,7.3-1.1,10.3-3l9.1,9.1c0.5,0.5,1.1,0.7,1.8,0.7s1.3-0.2,1.8-0.7C43.4,44.1,43.4,42.5,42.4,41.5z M5,19.5
                C5,11.5,11.5,5,19.5,5S34,11.5,34,19.5S27.5,34,19.5,34S5,27.5,5,19.5z"/>
            </svg>
            <span>Search</span>
        </button>
    </form>';
 
    return $form;
}
add_filter( 'get_search_form', 'wpdocs_my_search_form' );

//
//--- disable trash post/page ---//
add_action('wp_trash_post', 'prevent_post_deletion');
function prevent_post_deletion($postid){
    //https://wordpress.stackexchange.com/questions/29357/how-to-disable-page-delete
    /*
    stories: 45;
    priorities: 49;
    take-action: 73;
    board: 123;
    staff: 125;
    events: 155;
    news: 163;
    mazon_statements: 170;
    mazon_news: 172;
    blog: 174
    publications: 176
    videos: 178
    thank-you-for-taking-action: 981
    */
    $restricted_pages = array(45,49,73,123,125,155,163,170,172,174,176,178,981);
    if (in_array($postid, $restricted_pages)) {
        exit('<div style="text-align:center;padding:30px;font-family:sans-serif;">The page you were trying to delete is protected.<br><br><div style="cursor:pointer;" onclick="window.history.back()">BACK</div></div>');
    }
}

add_filter('wpcf7_autop_or_not', '__return_false');

//
//--- sharer ---//
function get_twitter_share_url(){
    return 'https://twitter.com/intent/tweet?url='.rtrim(BASE_URL, "/").PATH;
}
function get_facebook_share_url(){
    return 'https://www.facebook.com/sharer/sharer.php?u='.rtrim(BASE_URL, "/").PATH;
}
function get_linkedin_share_url(){
    return 'https://www.linkedin.com/feed/?shareActive=true&text={' .rtrim(BASE_URL, "/").PATH. '}';
}
function get_bluesky_share_url(){
    return 'https://bsky.app/intent/compose?text='.rtrim(BASE_URL, "/").PATH;
}


?>



<?php
add_action('admin_print_footer_scripts', function() {
?>
    <script type="text/javascript">
    /* <![CDATA[ */
    (function($) {
        $(function() {
            let clickOutsideOfTiniMCE = false;
            $(document).on("click",".acf-link .button, .acf-link .link-wrap .acf-icon", function(inputs_wrap) {
                //tinyMCE.activeEditor.selection.collapse();
                clickOutsideOfTiniMCE = true;
            });
            $(document).on("wplink-open", function(inputs_wrap) {
                if(!$("#link-options .link-custom-classes").length){
                    $("#link-options").append(
                        $("<div></div>").addClass("link-custom-classes").html(
                            $("<label></label>").html([
                            $("<span>Classes</span>"),
                            $("<input></input>").attr({"type": "text", "id": "wp-link-custom-classes"}),
                            ])
                        )
                    );
                }
                if(!$("#link-options .link-aria-label").length){
                    $("#link-options").append(
                        $("<div></div>").addClass("link-aria-label").html(
                            $("<label></label>").html([
                            $("<span>Aria Label</span>"),
                            $("<input></input>").attr({"type": "text", "id": "wp-link-aria-label"}),
                            ])
                        )
                    );
                }
                $("#wp-link-custom-classes").val('');
                $("#link-options .link-custom-classes").css({display: 'none'});
                $("#wp-link-aria-label").val('');
                $("#link-options .link-aria-label").css({display: 'none'});
                setTimeout(() => {
                    if(clickOutsideOfTiniMCE){
                        clickOutsideOfTiniMCE = false;
                    }else{
                        const node = tinyMCE.activeEditor.selection.getNode();
                        //if(node.nodeName == 'A'){
                        //}
                        $("#link-options .link-custom-classes").css({display: 'block'});
                        $("#wp-link-custom-classes").val(node.getAttribute('class'));
                        $("#link-options .link-aria-label").css({display: 'block'});
                        $("#wp-link-aria-label").val(node.getAttribute('aria-label'));
                    }
                }, 50);
                if (wpLink && typeof(wpLink.getAttrs) == "function") {
                    wpLink.getAttrs = function() {
                        wpLink.correctURL();
                        <?php /* [attention] Do not use inputs.url.val() or any input.* */ ?>
                        return {
                        href: $.trim( $("#wp-link-url").val() ),
                        target: $("#wp-link-target").prop("checked") ? "_blank" : null,
                        class: $("#wp-link-custom-classes").val(),
                        'aria-label': $("#wp-link-aria-label").val()
                        };
                    };
                }
            });
        });
    })(jQuery);
    /* ]]> */
    </script>
<?php
}, 45);
?>




<?php
add_shortcode('accordion', 'shortcode_accordion');

function shortcode_accordion($atts, $content = null) {
  
    $html = '<div class="accordion">
    <button
      aria-label="Read more about '.$atts['title'].'"
      aria-expanded="false" type="button" class="accordion-btn">
      <h3 class="accordion-title">'.$atts['title'].'</h3>
      <span class="accordion-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#00a3c1"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#00a3c1"></path> </g></svg>
      </span>
    </button>
    <div class="accordion-content">
      '.$content.'
    </div>
    </div>';
  
  
  
    return $html;
}



//---------------------//
//--- IMAGE TO WEBP ---//
//

start_webp_conversion(array(
    'image_quality' => 80,
    'image_max_size' => 2500,
    'delete_original_images_outscale' => true
));
function start_webp_conversion($params){
    //
    $GLOBALS["webp_image_quality"] = !empty($params['image_quality']) ? $params['image_quality'] : 80;
    $GLOBALS["webp_image_max_size"] = !empty($params['image_max_size']) ? $params['image_max_size'] : 2890;
    $GLOBALS['webp_delete_original_images_outscale'] = !empty($params['delete_original_images_outscale']) ? $params['delete_original_images_outscale'] : false;
    //
    //add_filter('intermediate_image_sizes_advanced', '__return_empty_array');//->disable intermediate sizes
    add_filter('intermediate_image_sizes_advanced', function ($sizes){
        //prefix_remove_default_images
        unset($sizes['1536x1536']);
        unset($sizes['2048x2048']);
        unset($sizes['medium_large']); // 768px
        return $sizes;
    });
    function replace_extensions($str, $new_str = ''){
        return str_replace(array('.avif','.jpeg','.jpg','.png','.gif','.bmp','.AVIF','.JPEG','.JPG','.PNG','.GIF','.BMP'),$new_str,$str);
    }
    function webpConvert2($file, $compression_quality = 80){
        //https://stackoverflow.com/questions/26314508/convert-jpg-to-webp-using-imagewebp
        // check if file exists
        if (!file_exists($file)) {
            return false;
        }
        $file_type = exif_imagetype($file);
        //https://www.php.net/manual/en/function.exif-imagetype.php
        //exif_imagetype($file);
        // 1    IMAGETYPE_GIF
        // 2    IMAGETYPE_JPEG
        // 3    IMAGETYPE_PNG
        // 6    IMAGETYPE_BMP
        // 15   IMAGETYPE_WBMP
        // 16   IMAGETYPE_XBM
        $output_file =  replace_extensions($file, '') . '.webp';
        if (file_exists($output_file)) {
            return $output_file;
        }
        if (function_exists('imagewebp')) {
            switch ($file_type) {
                case '1': //IMAGETYPE_GIF
                    $image = imagecreatefromgif($file);
                    break;
                case '2': //IMAGETYPE_JPEG
                    $image = imagecreatefromjpeg($file);
                    break;
                case '3': //IMAGETYPE_PNG
                        $image = imagecreatefrompng($file);
                        imagepalettetotruecolor($image);
                        imagealphablending($image, true);
                        imagesavealpha($image, true);
                        break;
                case '6': // IMAGETYPE_BMP
                    $image = imagecreatefrombmp($file);
                    break;
                case '15': //IMAGETYPE_Webp
                return false;
                    break;
                case '16': //IMAGETYPE_XBM
                    $image = imagecreatefromxbm($file);
                    break;
                case '19': //IMAGETYPE_AVIF
                    $image = imagecreatefromavif($file);
                    break;
                default:
                    return false;
            }

            // Save the image
            $result = imagewebp($image, $output_file, $compression_quality);
            
            if (false === $result) {
                return false;
            }
            // Free up memory
            imagedestroy($image);
            return $output_file;
        } elseif (class_exists('Imagick')) {
            $image = new Imagick();
            $image->readImage($file);
            if ($file_type === "3") {
                $image->setImageFormat('webp');
                $image->setImageCompressionQuality($compression_quality);
                $image->setOption('webp:lossless', 'true');
            }
            $image->writeImage($output_file);
            return $output_file;
        }
        return false;
    }
    //
    add_filter( 'wp_handle_upload', function ($file) {
        //create_webp
        if($file['type'] === "image/avif" || $file['type'] === "image/jpg" || $file['type'] === "image/jpeg" || $file['type'] === "image/png" || $file['type'] === "image/gif" || $file['type'] === "image/bmp"){
            webpConvert2($file['file'], $GLOBALS["webp_image_quality"]);
            unlink($file['file']);
            $file['file'] = replace_extensions($file['file'],'.webp');  // Update the file path
            $file['type'] = 'image/webp';
            $file['url'] = replace_extensions($file['url'],'.webp');
        }
        //
        return $file;
    });
    //
    add_filter('big_image_size_threshold', function(){
        //increase the image size threshold
        return $GLOBALS["webp_image_max_size"];
    }, 999, 1);
    //
    if($GLOBALS['webp_delete_original_images_outscale']){
        add_filter( 'wp_generate_attachment_metadata', function ( $metadata, $attachment_id ) {
            //delete_unscaled_upload from plugin https://wordpress.org/plugins/delete-unscaled-images/
            if ( ! empty( $metadata['original_image'] ) ) {
                $upload_dir = wp_upload_dir();
                $original_image = path_join( dirname( $metadata['file'] ), $metadata['original_image'] );
                $original_file = path_join( $upload_dir['basedir'], $original_image );
                //
                if ( unlink( $original_file ) ) {
                    unset( $metadata['original_image'] );
                }
            }
            return $metadata;
        }, 10, 2 );
    }
}

//
//--- IMAGE TO WEBP ---//
//---------------------//



?>