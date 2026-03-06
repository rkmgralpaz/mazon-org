<?php 
    
    get_header(); 

?>

	<div class="page-home">
        <h1 class="h1-home">Mazon | A Jewish Response To Hunger</h1>
		<main class="modules">
            
			<?php
            
			// Start the Loop.
			while ( have_posts() ) : the_post();
                
               require 'partials/modules.php';
            
			endwhile; // End the loop.
            
			?>
            
            
            
            
            
            
            
            
            
		</main><!-- #main -->
	</div><!-- #primary -->

	<?php 
	
	$announcement = get_field('announcement');
	if($announcement): 
		$announcement_type = get_field('type',$announcement);
		$announcement_title = get_field('title',$announcement) ? get_field('title',$announcement) : get_the_title($announcement);
	?>	
	


	<div class="announcement unselectable">
		<div class="a-wrapper">
			<div class="a-box <?php echo $announcement_type; ?> color-<?php echo get_field('color',$announcement); ?>">
				<div class="a-box-inner">
					<?php 				
					$announcement_cta_button = get_field('cta_button',$announcement);
					if($announcement_type == 'image-text'): 
						$announcement_image = get_field('image',$announcement);
						$announcement_image_src = $announcement_image['image'] ? $announcement_image['image']['url'] : '';
						$announcement_image_fx = $announcement_image['black_and_white'] ? 'bw': '';
					?>
					<div class="a-box-column left <?php echo $announcement_image_fx; ?>" style="background-image:url(<?php echo $announcement_image_src; ?>);">

					</div>
					<div class="a-box-column right">
						<?php if($announcement_cta_button): ?>
						<a href="<?php echo $announcement_cta_button['url']; ?>"target="<?php echo $announcement_cta_button['target']; ?>">
							<div class="a-title"><?php echo $announcement_title; ?></div>
						</a>
						<?php else: ?>
						<div class="a-title"><?php echo $announcement_title; ?></div>
						<?php endif; ?>
						<div class="a-text"><?php echo get_field('text',$announcement); ?></div>	
						<?php if($announcement_cta_button): ?>
							<div class="a-cta-button">
								<a href="<?php echo $announcement_cta_button['url']; ?>"target="<?php echo $announcement_cta_button['target']; ?>">
									<?php echo $announcement_cta_button['title']; ?>
									<svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
										<path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#f0f0ef"/>
									</svg>
								</a>
							</div>
						<?php endif; ?>
					</div>
						<?php if($announcement_image_src != ''): ?>
					<img src="<?php echo $announcement_image_src; ?>" class="image-mobile <?php echo $announcement_image_fx; ?>" width="<?php echo $announcement_image['image']['width']; ?>" height="<?php echo $announcement_image['image']['height']; ?>" />
						<?php endif; ?>
					<?php else: ?>
					<div class="a-box-column left">
						<?php if($announcement_cta_button): ?>
						<a href="<?php echo $announcement_cta_button['url']; ?>"target="<?php echo $announcement_cta_button['target']; ?>">
							<div class="a-title"><?php echo $announcement_title; ?></div>
						</a>
						<?php else: ?>
						<div class="a-title"><?php echo $announcement_title; ?></div>
						<?php endif; ?>
						<?php if(get_field('subtitle',$announcement) != ''): ?>
							<div class="a-subtitle"><?php echo get_field('subtitle',$announcement); ?></div>
						<?php endif; ?>
					</div>
					<div class="a-box-column right">
						<div class="a-text"><?php echo get_field('text',$announcement); ?></div>
						<?php if($announcement_cta_button): ?>
							<div class="a-cta-button">
								<a href="<?php echo $announcement_cta_button['url']; ?>"target="<?php echo $announcement_cta_button['target']; ?>">
									<?php echo $announcement_cta_button['title']; ?>
									<svg xmlns="http://www.w3.org/2000/svg" width="19.241" height="12.358" viewBox="0 0 19.241 12.358">
										<path d="M12.7,4.722l-.843.843a.516.516,0,0,0,.007.737L15.33,9.633H.516A.516.516,0,0,0,0,10.148v1.2a.516.516,0,0,0,.516.516H15.33L11.862,15.2a.516.516,0,0,0-.007.737l.843.843a.516.516,0,0,0,.729,0l5.663-5.663a.516.516,0,0,0,0-.729L13.427,4.722A.516.516,0,0,0,12.7,4.722Z" transform="translate(0 -4.571)" fill="#f0f0ef"/>
									</svg>
								</a>
							</div>
						<?php endif; ?>	
					</div>
					<?php endif; ?>
				</div>
				<div class="a-close-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="34.701" height="34.702" viewBox="0 0 34.701 34.702">
						<g transform="translate(-2.086 -0.086)">
							<path d="M0,0H45.075" transform="translate(3.5 1.5) rotate(45)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2"/>
							<line x2="45.075" transform="translate(3.5 33.373) rotate(-45)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2"/>
						</g>
					</svg>
				</div>
			</div>
		</div>
	</div>

	<?php endif; ?>	

<?php get_footer(); ?>
