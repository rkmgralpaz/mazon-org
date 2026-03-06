<?php

get_header();

if(!is_user_logged_in()):
	wp_redirect( BASE_URL );
	exit;
endif;
          echo 'HOLA';
?>

	<div class="outer max-width">
		<div class="inner site-padding-2">
			<br><h1 class="global-boxes-list-title">Global Boxes</h1><br>
			<?php
			$global_boxes_list = array();
			// Start the Loop.
			while ( have_posts() ) : the_post();
				$id = get_the_ID();
				$obj_name = 'post_'.strval($id);
				$global_boxes_list[$obj_name]['id'] = $id;
				$global_boxes_list[$obj_name]['title'] = get_the_title();
				$global_boxes_list[$obj_name]['page_list'] = array();
				//echo '$='.get_the_title().'<br>';
			endwhile; // End the loop.
			//
			$loop = new WP_Query(
				array('post_type' => array(
					'page',
					'stories',
					'priorities',
					'policy_actions',
					'board',
					'staff',
					'events',
					'mazon_statements',
					'mazon_news',
					'blog',
					'videos',
					'publications'
				),
				'order' => 'ASC'
				),
			);
			//
			while ( $loop->have_posts() ) : $loop->the_post();
				$modules = get_field('modules');
				if($modules):
					$post_data = array();
					$post_data['id'] = get_the_id();
					$post_data['title'] = get_the_title();
					$post_data['permalink'] = get_permalink();
					$post_data['post_type'] = get_post_type();
					//
					foreach($modules as $module):
						if($module['acf_fc_layout'] == 'global_boxes'):
							foreach($module['boxes'] as $box):
								if(get_post_status($box) != 'pending'):
									$obj_name = 'post_'.$box;
									array_push($global_boxes_list[$obj_name]['page_list'],$post_data);
								endif;
							endforeach;
						endif;
					endforeach;
				endif;
			endwhile;
            //
			$num = 0;
			$html = '<ul class="global-boxes-list">';
			foreach($global_boxes_list as $global_box):
				if($global_box['id']):
					$num++;
					$html .= '<li class="box-title"><span class="box-title">'.$global_box['title'].'</span>';
					$html .= '<ul>';
					if(count($global_box['page_list'])):
						foreach($global_box['page_list'] as $current_page):
							if($current_page['post_type'] == 'page' && wp_get_post_parent_id($current_page['id'])):
								$ancestors = get_post_ancestors($current_page['id']);
								$type = 'page child of: ';
								$i = 0;
								foreach($ancestors as $ancestor):
									$type .= '<a href="'.get_permalink($ancestor).'" target="_blank">'.get_the_title($ancestor).'</a>';
									$i++;
									if($i < count($ancestors)):
										$type .= ' / ';
									endif;
								endforeach;
							else:
								$type = $current_page['post_type'];
							endif;
							$html .= '<li><a href="'.$current_page['permalink'].'" target="_blank">'.$current_page['title'].'</a> <span class="info">['.$type.']</span></li>';
						endforeach;
					else:
						$html .= '<li class="not-used">Not used</li>';
					endif;
					$html .= '</ul></li>';
				endif;
			endforeach;
			$html .= '</ul>';
			$html .= '<br><br><span class="global-boxes-total">Total Boxes: '.$num.'</span>';
			//
			echo $html;
			?>
			<br><br><br><br>
		</div><!-- #main -->
	</div><!-- #primary -->

	<style>
		.global-boxes-list-title{
			font-size: 2rem;
			font-weight: 700;
			color: #00335A;
			padding-top: 1.2rem;
			padding-bottom: 1rem;
		}
		.global-boxes-list{
			padding-left: 1.55rem;
		}
		.global-boxes-list li{
			font-size: 1.4rem;
			margin-bottom: 0.8rem;
			color: #00335A;
			user-select: none;
			list-style: circle;
		}
		.global-boxes-list li a{
			font-size: 1.3rem;
			color: #00A3C1;
			transition: color 0.3s;
		}
		.global-boxes-list li a:hover{
			color: #F07C1D;
		}
		.global-boxes-list li .box-title{
			cursor: pointer;
			transition: all 0.3s;
			border-bottom: solid 1px transparent;
		}
		.global-boxes-list li .box-title.expanded,
		.global-boxes-list li .box-title:hover{
			border-bottom: solid 1px #00335A;
		}
		.global-boxes-list li .info{
			font-size: 1rem;
			color: #00335A;
		}
		.global-boxes-list li .info a{
			font-size: 1rem;
		}
		.global-boxes-list li.not-used{
			color: red;
		}
		.global-boxes-list li ul{
			padding-left: 1.35rem;
			display: none;
			padding-top: 1rem;
			padding-bottom: 0.05rem;
		}
		.global-boxes-list li ul.visible{
			display: block;
		}
		.global-boxes-list li ul li{
			font-size: 1.2rem;
			list-style: disc;
			
		}
		.global-boxes-total{
			font-size: 1.4rem;
			color: #00335A;
		}
	</style>
	<script>
		$(document).ready(function(){
			$('.global-boxes-list').find('li .box-title').click(function(){
				var $this = $(this);
				$this.parent().children('ul').toggleClass('visible');
				$this.toggleClass('expanded');
			});
		});
	</script>

<?php get_footer(); ?>
