<?php

require 'constants.php';

$site_title = wp_get_document_title('');
$site_keywords = '';

?>

<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only">

		<meta name="title" content="<?= $site_title ?>">
		<meta name="author" content="Loyal Design | https://thisisloyal.com">
		<meta name="keywords" content="<?= $site_keywords ?>">
		<meta name="copyright" content="Mazon" />
		<meta name="DC.Title" content="<?= $site_title ?>" />
		<meta name="distribution" content="Global" />
		<meta name="rating" content="General" />
		
		<title><?= $site_title ?></title>
		
		
		<!-- ICONS -->
		<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
        <!-- <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff"> -->

        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N7Q2T8J3');</script>
        <!-- End Google Tag Manager -->

		
		<?php wp_head(); ?>

        <!-- Fundraise Up: -->
        <script>(function(w,d,s,n,a){if(!w[n]){var l='call,catch,on,once,set,then,track,openCheckout'
        .split(','),i,o=function(n){return'function'==typeof n?o.l.push([arguments])&&o
        :function(){return o.l.push([n,arguments])&&o}},t=d.getElementsByTagName(s)[0],
        j=d.createElement(s);j.async=!0;j.src='https://cdn.fundraiseup.com/widget/'+a+'';
        t.parentNode.insertBefore(j,t);o.s=Date.now();o.v=5;o.h=w.location.href;o.l=[];
        for(i=0;i<8;i++)o[l[i]]=o(l[i]);w[n]=o}
        })(window,document,'script','FundraiseUp','ARHXXBJG');</script>
        <!-- End Fundraise Up -->

        <!-- FORM: HEAD SECTION -->
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="referrer" content="no-referrer-when-downgrade">
        <!-- THIS SCRIPT NEEDS TO BE LOADED FIRST BEFORE wforms.js -->
        <script type="text/javascript" data-for="FA__DOMContentLoadedEventDispatch" src=https://www.tfaforms.com/js/FA__DOMContentLoadedEventDispatcher.js defer></script>
            <script type="text/javascript">
            document.addEventListener("FA__DOMContentLoaded", function(){
                const FORM_TIME_START = Math.floor((new Date).getTime()/1000);
                let formElement = document.getElementById("tfa_0");
                if (null === formElement) {
                    formElement = document.getElementById("0");
                }
                let appendJsTimerElement = function(){
                    let formTimeDiff = Math.floor((new Date).getTime()/1000) - FORM_TIME_START;
                    let cumulatedTimeElement = document.getElementById("tfa_dbCumulatedTime");
                    if (null !== cumulatedTimeElement) {
                        let cumulatedTime = parseInt(cumulatedTimeElement.value);
                        if (null !== cumulatedTime && cumulatedTime > 0) {
                            formTimeDiff += cumulatedTime;
                        }
                    }
                    let jsTimeInput = document.createElement("input");
                    jsTimeInput.setAttribute("type", "hidden");
                    jsTimeInput.setAttribute("value", formTimeDiff.toString());
                    jsTimeInput.setAttribute("name", "tfa_dbElapsedJsTime");
                    jsTimeInput.setAttribute("id", "tfa_dbElapsedJsTime");
                    jsTimeInput.setAttribute("autocomplete", "off");
                    if (null !== formElement) {
                        formElement.appendChild(jsTimeInput);
                    }
                };
                if (null !== formElement) {
                    if(formElement.addEventListener){
                        formElement.addEventListener('submit', appendJsTimerElement, false);
                    } else if(formElement.attachEvent){
                        formElement.attachEvent('onsubmit', appendJsTimerElement);
                    }
                }
            });
        </script>
        <link href=https://www.tfaforms.com/dist/form-builder/5.0.0/wforms-layout.css?v=1748988531 rel="stylesheet" type="text/css" />
        <link href=https://www.tfaforms.com/uploads/themes/theme-101448.css rel="stylesheet" type="text/css" />
        <link href=https://www.tfaforms.com/dist/form-builder/5.0.0/wforms-jsonly.css?v=1748988531 rel="alternate stylesheet" title="This stylesheet activated by javascript" type="text/css" />
        <script type="text/javascript" src=https://www.tfaforms.com/wForms/3.11/js/wforms.js?v=1748988531></script>
        <script type="text/javascript">
            wFORMS.behaviors.prefill.skip = false;
        </script>
            <link rel="stylesheet" type="text/css" href=https://www.tfaforms.com/css/kalendae.css />
                <script type="text/javascript" src=https://www.tfaforms.com/js/kalendae/kalendae.standalone.min.js ></script>
                <script type="text/javascript" src=https://www.tfaforms.com/wForms/3.11/js/wforms_calendar.js></script>
        <script type="text/javascript" src=https://www.tfaforms.com/wForms/3.11/js/localization-en_US.js?v=1748988531></script>
		<!-- END FORM HEAD SECTION -->

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MCD8JH44K7"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-MCD8JH44K7');
        </script>

        <!-- Start cookieyes banner -->
        <script id="cookieyes" type="text/javascript" src=https://cdn-cookieyes.com/client_data/4dde5728a0eaf4772b779356/script.js></script>
        <!-- End cookieyes banner -->
	</head>
    
    <?php
    $body_classes = implode(' ',get_body_class( 'class-name' ));// -> edited from functions.php
    if(isset($GLOBALS["hide_header_and_footer"])):
        if($GLOBALS["hide_header_and_footer"]):
            $body_classes .= ' hide-header-and-footer';
        endif;
    endif;
    if(get_field('announcement')):
        $body_classes .= ' has-announcement';
    endif;
    ?>
	
	<body class="<?php echo $body_classes; ?>">
    
  
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src=https://www.googletagmanager.com/ns.html?id=GTM-N7Q2T8J3
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
		
		
		<button href="#main-content" id="skip-btn" aria-label="Skip to content">Skip to content</button>
			
		<header id="header" class="unselectable">
            <div id="header-top">
                <div class="max-width">
                    <div class="inner">
                        <div class="left-area">
                            <a id="header-logo" aria-label="<?= $site_title ?>" href="<?php echo BASE_URL ?>" >
                                <img role="img" alt="" class="logo" src="<?php echo TEMPLATE_DIR ?>/assets/logo-2026.webp" width="auto" height="80" />
                                <img role="img" alt="" class="logo-mobile" src="<?php echo TEMPLATE_DIR ?>/assets/logo-2026.webp" width="150" height="auto" />
                            </a>
                        </div>
                        <div class="right-area">
                            <nav id="header-main-nav">
                                <?php get_main_nav(); ?>
                            </nav>
														<button id="header-secondary-nav-button" aria-label="Secondary Nav" aria-expanded="false">
																<span></span>
																<span></span>
																<span></span>
														</button>
                            <button id="header-search-button" aria-label="Search">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                     viewBox="0 0 30 30" style="enable-background:new 0 0 30 30;" xml:space="preserve">
                                <path d="M20.3,19.6L20.3,19.6c1.8-1.8,2.7-4,2.7-6.5c0-2.5-0.9-4.6-2.7-6.4c-1.8-1.8-3.9-2.7-6.4-2.7S9.2,5,7.4,6.8
                                    s-2.7,3.9-2.7,6.4c0,2.5,0.9,4.7,2.7,6.5c1.8,1.8,3.9,2.6,6.4,2.6c1.8,0,3.4-0.4,4.9-1.4c0,0,0.1,0.1,0.1,0.1l4.7,4.7
                                    c0.2,0.2,0.4,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.2-0.2,0.3-0.4,0.3-0.7s-0.1-0.5-0.3-0.7L20.3,19.6 M13.9,6.1c1.9,0,3.6,0.7,5,2
                                    c1.4,1.4,2.1,3.1,2.1,5c0,2-0.7,3.6-2.1,5c-0.1,0.1-0.3,0.3-0.4,0.4l-0.1,0.1c-0.1,0.1-0.2,0.1-0.2,0.2c-1.3,0.9-2.7,1.4-4.2,1.4
                                    c-2,0-3.6-0.7-5-2.1c-1.4-1.4-2-3-2.1-5c0-1.9,0.7-3.6,2.1-5C10.2,6.8,11.9,6.1,13.9,6.1z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="clear-both"></div>
                    </div>
                </div>
            </div>
            <div id="secondary-nav-wrapper">
                <?php
                     wp_nav_menu(
                        array(
                            'menu' 			=> 'Secondary nav',
                            'menu_id'		=> '',
                            'menu_class'	=> 'secondary-nav',
                            'container'		=> ''
                        )
                    );
                ?>
            </div>
            <div id="header-submenu-bg"></div>
            <div id="nav-mobile">
            
            </div>

		</header>
		
		
        <main id="main-content">