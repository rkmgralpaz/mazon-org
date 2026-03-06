        </main>

        <?php
        if (!IS_HOME):
          $donate_button_global = get_field('donate_cta_button', 'option');
        ?>
          <div id="donate-button-global">
            <a href="<?php echo $donate_button_global['url']; ?>" target="<?php echo $donate_button_global['target'] ?>" class="cta-button donate-btn-pop-up">
              <?php echo $donate_button_global['title'] ?>
            </a>
          </div>
        <?php
        endif;
        ?>


        <div id="donate-popup" role="dialog" aria-labelledby="donate-iframe">
          <div class="popup-inner" id="donate-iframe">
            <label>Donate Form</label>
            <iframe role="form"
              allowpaymentrequest="true"
              data-src="https://give.mazon.org/give/<?php echo get_field('donate_id_form', 'option') ?>/#!/donation/checkout?eg=true"
              src=""
              width="100%" height="100%"
              tabindex=0></iframe>
            <button class="close-button" aria-label="Close">
              <svg role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" width="19" y="0px" height="19" viewBox="0 0 19 19" xml:space="preserve">
                <polygon points="18.9,17.2 10.9,9.2 18.7,1.4 17.2,0 9.5,7.8 1.7,0 0.3,1.4 8,9.2 0,17.2 1.4,18.7 9.5,10.6 17.5,18.7"></polygon>
              </svg>
            </button>
          </div>
        </div>

        <div id="suscribe-popup" role="dialog" aria-labelledby="suscribe-iframe">
          <div class="popup-inner" id="suscribe-iframe">
            <div class="form-title">Subscribe to our Newsletter</div>

            <?php echo do_shortcode(get_field('shortcode_suscription', 'option')); ?>


            <button class="close-button" aria-label="Close">
              <svg role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" width="19" y="0px" height="19" viewBox="0 0 19 19" xml:space="preserve">
                <polygon points="18.9,17.2 10.9,9.2 18.7,1.4 17.2,0 9.5,7.8 1.7,0 0.3,1.4 8,9.2 0,17.2 1.4,18.7 9.5,10.6 17.5,18.7"></polygon>
              </svg>
            </button>
          </div>
        </div>


        <div id="search-lightbox">
          <?php echo get_search_form(); ?>
          <button class="close-button" aria-label="Close Search">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
              <path d="M29.6,0.4C29.3,0.1,28.9,0,28.5,0c-0.4,0-0.7,0.1-1,0.4L15,13L2.5,0.4C2.2,0.1,1.9,0,1.5,0c-0.4,0-0.7,0.1-1,0.4
                    S0,1.1,0,1.5c0,0.4,0.1,0.8,0.4,1L13,15L0.4,27.5c-0.3,0.3-0.4,0.6-0.4,1c0,0.4,0.1,0.8,0.4,1.1c0.3,0.3,0.6,0.4,1,0.4
                    c0.4,0,0.8-0.1,1-0.4L15,17l12.5,12.6c0.3,0.3,0.6,0.4,1,0.4c0.4,0,0.8-0.1,1.1-0.4c0.3-0.3,0.4-0.7,0.4-1.1c0-0.4-0.1-0.7-0.4-1
                    L17,15L29.6,2.5c0.3-0.3,0.4-0.6,0.4-1C30,1.1,29.9,0.8,29.6,0.4z" />
            </svg>
            <span>Close</span>
          </button>
        </div>


        <div id="video-lightbox">
          <div class="video-outer">
            <div class="video-inner">
              <div class="video"></div>
            </div>
          </div>
          <button aria-label="Close Video" class="close-button">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
              <path d="M29.6,0.4C29.3,0.1,28.9,0,28.5,0c-0.4,0-0.7,0.1-1,0.4L15,13L2.5,0.4C2.2,0.1,1.9,0,1.5,0c-0.4,0-0.7,0.1-1,0.4
                    S0,1.1,0,1.5c0,0.4,0.1,0.8,0.4,1L13,15L0.4,27.5c-0.3,0.3-0.4,0.6-0.4,1c0,0.4,0.1,0.8,0.4,1.1c0.3,0.3,0.6,0.4,1,0.4
                    c0.4,0,0.8-0.1,1-0.4L15,17l12.5,12.6c0.3,0.3,0.6,0.4,1,0.4c0.4,0,0.8-0.1,1.1-0.4c0.3-0.3,0.4-0.7,0.4-1.1c0-0.4-0.1-0.7-0.4-1
                    L17,15L29.6,2.5c0.3-0.3,0.4-0.6,0.4-1C30,1.1,29.9,0.8,29.6,0.4z" />
            </svg>
            <span>Close</span>
          </button>
        </div>


        <footer id="footer">

          <div class="inner site-padding max-width">
            <div class="left">
              <div class="left__top">
                <div class="title"><?php the_field('footer_title', 'option') ?></div>
                <div class="description">
                  <?php the_field('footer_text', 'option') ?>
                </div>
              </div>
              <div class="left__bottom">

                <?php if (have_rows('logos', 'option')) : ?>
                  <ul class="logos">
                    <?php while (have_rows('logos', 'option')) : the_row(); 
                      $link = get_sub_field('link');
                      $image = get_sub_field('image');
                    ?>
                      <li>
                        <?php if ($link && isset($link['url'], $link['title'])) : ?>
                          <a href="<?php echo esc_url($link['url']); ?>" target="_blank">
                            <?php if ($image) : ?>
                              <img src="<?php echo esc_url($image); ?>" alt="">
                            <?php endif; ?>
                            <?php echo esc_html($link['title']); ?>
                          </a>
                        <?php endif; ?>
                      </li>
                    <?php endwhile; ?>
                  </ul>
                <?php endif; ?>

              </div>
            </div>
            <div class="right">
              <ul class="social">
                <?php
                $social_links = [
                  'facebook' => get_field('facebook', 'option'),
                  'bluesky' => get_field('bluesky', 'option'),
                  'instagram' => get_field('instagram', 'option'),
                  'linkedin' => get_field('linkedin', 'option'),
                ];

                foreach ($social_links as $platform => $url) {
                  if ($url) {
                    echo '<li><a href="' . esc_url($url) . '" target="_blank">';
                    include get_template_directory() . "/assets/social icons/{$platform}.php";
                    echo '</a></li>';
                  }
                }
                ?>
              </ul>
              <div class="credits">Site by <a href="https://thisisloyal.com" target="_blank">Loyal</a></div>
            </div>
            <div class="clear-both"></div>
          </div>

        </footer>

        <?php wp_footer(); ?>

        </body>

        </html>