<?php

get_header();

?>
	
<header class="page-header color-palette-light-blue">
    <div class="outer max-width">
        <div class="inner site-padding-2">
            <br>
            <?php if ( have_posts() ) : ?>
            <h1 class="title"><span class="txt-color-dark-blue">Search results for:</span> <?php echo $_GET['s']; ?></h1>
            <?php else: ?>
            <h1 class="title"><span class="txt-color-dark-blue">No results for:</span> <?php echo $_GET['s']; ?></h1>
            <?php endif; ?>
            <div class="text"></div>
        </div>
    </div>
</header>

<div class="search-list">
    <div class="max-width">
        <div class="site-padding-2">
            <?php
						
						$array = array();
            if ( have_posts() ) :
            global $wp_query;

            ?>
            <div class="search-list-header">
                <h2><?php echo $wp_query->found_posts; ?> results for: <span><?php echo $_GET['s']; ?></span></h2>
                <div class="search-again-btn">Search Again</div>
            </div>

            <?php while ( have_posts() ) : the_post();
						
								if (get_post_status() === 'private') :
																	
                elseif(get_post_type() == 'publications'):
                    $pdf_file = get_field('pdf');
                    $permalink = get_field('real3d_flipbook_view') ? get_permalink() : $pdf_file['url'];
                    $target = get_field('real3d_flipbook_view') ? '_self' : '_blank';
                    $section = 'Publications';
                    $date = get_the_date();
                else:
                    $permalink = get_permalink();
                    $target = '';
                    $postType = get_post_type();
                    if($postType == 'page'):
                        $ancestors = get_ancestors(get_the_ID(), 'page');
                        if(count($ancestors) > 0):
                            $tmp_id = $ancestors[(count($ancestors)-1)];
                            $section = get_the_title($tmp_id);
                        else:
                            $section = 'Pages';
                        endif;
                        $date = '';
                    else:
                        $postType = get_post_type_object($postType);
                        $section = $postType->labels->singular_name;
												
												if ($section === 'MAZON Statements') {
													$section = 'Statements';
												}
												if ($section === 'MAZON News') {
													$section = 'News';
												}
												
                        $date = get_the_date();
                    endif;
                    $text = '';
                    $excerpt = isset(get_field('excerpt_content')['excerpt']) ? get_field('excerpt_content')['excerpt'] : '';
                    if(!$excerpt):
                        $excerpt = isset(get_field('excerpt_content')['subtitle']) ? get_field('excerpt_content')['subtitle'] : '';
                    endif;
                    if(!$excerpt || $excerpt == ''):
                        $f = strip_tags(get_field('text'));
                    else:
                        $text = strip_tags($excerpt);
                    endif;
                    if($text == ''):
                        $modules = get_field('modules');
                        if(isset($modules[0]['text']) AND strip_tags($modules[0]['text']) != ''):
                            $text = strip_tags($modules[0]['text']);
                        endif;
                    endif;
                    if($text == ''):
                        $_header = get_field('header');
                        if(isset($_header['text']) AND strip_tags($_header['text']) != ''):
                            $text = strip_tags($_header['text']);
                        endif;
                    endif;
                    // $words = get_snippet($text,35);
									$words = get_snippet($text,20);
                    //echo str_word_count($text,35).'#';
                    if(strlen($text) > strlen($words)){
                        $text = $words.'...';
                    }
                    if($date != '' && $text != ''):
                        $text = $date.' — '.$text;
                    elseif($date != ''):
                        $text = $date;
                    endif;
										
										
									array_push( $array, array(
										'permalink' => $permalink,
										'target' => $target,
										'section' => $section,
										'title' => get_the_title(),
										'text' => $text
									));
                endif;
								
								
            ?>
                
            <?php endwhile; ?>
						
						<?php
					
						
function array_value_recursive($key, array $array)
{
    $val = array();
    array_walk_recursive($array, function($v, $k) use($key, &$val){
        if($k == $key) array_push($val, $v);
    });

    return count($val) >= 1 ? $val : array_pop($val);
}

function getPeopleByAge($arrPeople)
{
    $arrAges = array_value_recursive('section', $arrPeople);

    if(is_array($arrAges)){
        $arrAges = array_unique(array_value_recursive('section', $arrPeople));
    }

    $arrPeopleGroupingByAge = [];

    if(is_array($arrAges)){
        foreach ($arrAges as $age) {
            $arrPeopleGroupingByAge[$age] = getPeopleForAgeOf($age, $arrPeople);
        }
    }

    return $arrPeopleGroupingByAge;
}

function getPeopleForAgeOf($age, $arrPeople)
{
    $result = [];
    foreach ($arrPeople as $personData) {
        foreach ($personData as $key => $value) {
            if ($key === 'section' && $value === $age) {
                $result[] = $personData;
            }
        }
    }
    return $result;
}

// Traza:
$arrFinal = getPeopleByAge($array);

foreach ($arrFinal as $key => $value) { ?>
	
	<div class="accordion accordion-search">
	<button
		aria-label=""
		aria-expanded="false" type="button" class="accordion-btn">
		<h3 class="accordion-title"><span class="li-label"><?php echo $key ?></h3>
		<span class="accordion-icon">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#00a3c1"><g stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#00a3c1"></path> </g></svg>
		</span>
	</button>
	<div class="accordion-content">
		<div class="content-grid">
			<?php foreach ($value as $keyv => $v) { ?>
				<a href="<?php echo $v['permalink']; ?>" target="<?php echo $v['target']; ?>">
					<span class="li-title"><?php echo $v['title'] ?></span>
					<?php if($v['text'] != ''): ?>
						<span class="li-date-text"><?php echo $v['text'] ?></span>
					<?php endif; ?>
				</a>
			<?php } ?>
		</div>
		</div>
	</div>
<?php } ?>

            <?php else : ?>
						
            <?php  endif;?>
        </div>
    </div>
</div>

<?php


get_footer();

?>
