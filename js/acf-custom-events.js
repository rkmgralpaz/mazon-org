
acf.add_action('ready', function( $el ){
    // $el will be equivalent to $('body')
    //
    // find a specific field    
    //use jQuery() no conflict mode
    jQuery(document).ready(function($){

        //--- paths ---//

        var themeFolderName = 'mazon-acc';
        var themePath = String(window.location).split('wp-admin')[0]+'wp-content/themes/'+themeFolderName;
        var assetsFolder = themePath+'/assets/acf/';
        let noCacheVersion = '0002';


        //------------------//
        //--- flex thumb ---//

        var flexThumb;
        $('body').append(`
        <style id="flex-content-thumb-preview-style">
            #flex-content-thumb-preview{
                position: absolute;
                left: 0;
                top: 0;
                /* transform: translateX(calc(-100% - 3px))  scale(0.95); */
                transform: translateX(calc(-100% - 3px));
                height: auto;
                /* background: #1f2938; */
                background: rgba(31, 41, 56, 0.8);
                overflow: hidden;
                /* box-shadow: 0 0 18px rgba(0,0,0,0.3); */
                box-shadow: 0 0 25px rgba(0,0,0,0.5);
                line-height: 0;
                height: 150px;
                visibility: hidden;
                border-radius: 6px;
                opacity: 0;
                display: flex;
                flex-direction: column;
            }
            #flex-content-thumb-preview.visible{
                transition-property: opacity, transform;
                transition-duration: 0.2s;
                transition-timing-function: cubic-bezier(.08,.57,.54,1.02);
                transform: translateX(calc(-100% - 3px)) scale(1);
                visibility: visible;
                overflow: visible;
                opacity: 1;
                height: auto;
            }
            #flex-content-thumb-preview img{
                width: auto;
                height: 100%;
                height: 150px;
                border-radius: 6px 6px 0 0;
            }
            #flex-content-thumb-preview .alt-text{
                padding: 10px;
                color: #eeeeee;
                background: #1f2938;
                border-radius: 0 0 6px 6px;
                line-height: 1.5em;
                width: auto;
            }
            #flex-content-thumb-preloader{
                position: absolute;
                left: 0;
                top: 0;
                transform: translateX(calc(-100% - 3px));
                width: 20px;
                height: 20px;
                background-image: url(${assetsFolder}acf-flex-content-thumb-preloader.svg);
                background-size: contain;
                visibility: hidden;
            }
            #flex-content-thumb-preloader.visible{
                visibility: visible;
            }
            .acf-tooltip.acf-fc-popup.bottom{
                /* padding-bottom: 50px; */
            }
        </style>
        `);
        var flexThumbTimeout;
        var flexThumbTexts;
        $.ajax({
            url : assetsFolder+'acf-flex-content-thumb-alt-texts.json?version='+noCacheVersion,
            dataType: "text",
            success : function (data) {
                flexThumbTexts = JSON.parse(data);
            }
        });
        var addFlexThumb = function($el){
            clearTimeout(flexThumbTimeout);
            $('#flex-content-thumb-preloader').remove();
            $('#flex-content-thumb-preview').remove();
            const thumbName = 'acf-flex-content-thumb-'+$el.data('layout').split('_').join('-');
            const image = assetsFolder+thumbName+'.jpg?version='+noCacheVersion;
            const $parent = $el.parent();
            const $parentParent = $parent.parent();
            const top = $parent.position().top;
            const position = Math.max(0, Math.min($parentParent.outerHeight()-140, top - 62));
            const thumbAltText = flexThumbTexts[thumbName] ? flexThumbTexts[thumbName] : '';
            let html = '<div id="flex-content-thumb-preview" style="top:'+position+'px"><img src="'+image+'" /><div class="alt-text">'+thumbAltText+'</di></div>';
            html += '<div id="flex-content-thumb-preloader" style="top:'+(top+5)+'px"></div>';
            const img = new Image();
            img.onload = function(){
                $('#flex-content-thumb-preloader').remove();
                const $preview = $('#flex-content-thumb-preview');
                $preview.addClass('visible');
                let repos;
                const pos2 = Math.max(0, Math.min($parentParent.outerHeight()));
                const txtH = $preview.find('.alt-text').outerHeight();
                repos = Math.min(Math.max(0, position - txtH / 2), $parentParent.outerHeight() - $preview.outerHeight() + 10);
                $preview.css({top: repos});
            }
            img.src = image;
            $parentParent.append(html);
            flexThumbTimeout = setTimeout(function(){
                $('#flex-content-thumb-preloader').addClass('visible');
            },300);
            //$parentParent.append('<div id="flex-content-thumb-preview" style="top:'+position+'px;background-image:url('+image+');"></div>');
        }
        var removeFlexThumb = function(){
            clearTimeout(flexThumbTimeout);
            flexThumbTimeout = setTimeout(function(){
                $('#flex-content-thumb-preloader').remove();
                $('#flex-content-thumb-preview').remove();
            },100);
        }
        $('body').on('mouseover focus','.acf-tooltip.acf-fc-popup.show-thumbs a',function(){
            removeFlexThumb();
            addFlexThumb($(this));
        }).on('mouseout','.acf-tooltip.acf-fc-popup.show-thumbs a',function(){
            removeFlexThumb();
        });

        $('.acf-field-flexible-content.show-thumbs .button-primary').click(function(){
            setTimeout(function(){
                $('.acf-tooltip.acf-fc-popup').addClass('show-thumbs')
            },10);
        });


        //--- flex-thumb ---//
        //------------------//

        //
        /*
        if ($('.acf-color-picker').length) {
            //ACF color picker restricted color palette with plugin acf-restrict-color-picker
            //https://es.wordpress.org/plugins/acf-restrict-color-picker/
            setTimeout(function(){
                $('.acf-color-picker').each(function() {
                    //hide input field to color picker by Ivan Radulovich
                    $(this).find('.wp-picker-input-wrap label').attr("style", "display: none !important");
                });    
            },10);
        }
        */
        
        //--- disable edit slug button from page/post id ---//
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
        var disableEditSlug = [45,49,73,123,125,155,163,170,172,174,176,178,981];
        var winloc = String(window.location);
        for(var i=0; i<disableEditSlug.length; i++){
            if(winloc.indexOf('post='+disableEditSlug[i]) !== -1){
                $('#edit-slug-buttons').remove();
                break;
            }
        }
        //--- --- ---//
        
        //alert($('.acf-field-flexible-content .layout[data-layout="form"]').length)
        $('.acf-field-flexible-content .layout[data-layout="form"]').each(function(){
            var $this = $(this);
            var $switch = $this.find('.hide-txt-btn .acf-true-false .acf-switch');
            $switch.click(function(){
                if($(this).hasClass('-on')){
                    $this.find('.text-code').removeClass('full-width');
                }else{
                    $this.find('.text-code').addClass('full-width');
                }
            });
        });
        
        // refresh flex content row title (apply blur event to input, textarea and )
        if($('.acf-field-flexible-content').length){
            
            setTimeout(function(){
                $('.acf-field-flexible-content .layout').addClass('-collapsed');
                $('.acf-field-flexible-content .layout[data-layout="form"]').each(function(){
                    var $this = $(this);
                    var $switch = $this.find('.hide-txt-btn .acf-true-false .acf-switch');
                    if($switch.hasClass('-on')){
                        $this.find('.text-code').addClass('full-width');
                    }else{
                        $this.find('.text-code').removeClass('full-width');
                    }
                });
            },100);
            
            $('body').on('blur','.acf-field-flexible-content .chapter-title input',function(){
                var $target = $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find('.acf-fc-layout-handle');
                $target.click();
                $target.click();
            }).on('blur','.acf-field-flexible-content .block-title input',function(){
                var $target = $(this).parent().parent().parent().parent().parent().parent().parent().find('.acf-fc-layout-handle');
                $target.click();
                $target.click();
            });
            
            ACFinitTinymceEditor = function(){
                $('.acf-field-flexible-content .layout').each(function(){
                    var $currentModule = $(this);
                    if(!$currentModule.hasClass('ivan-loaded')){
                        $currentModule.addClass('ivan-loaded');
                        var $iframe = $currentModule.find('iframe');
                        if($iframe.length){
                            $iframe.contents().find("#tinymce").blur(function(){
                                var $target  = $currentModule.find('.acf-fc-layout-handle.ui-sortable-handle');
                                $target.click();
                                $target.click();
                            });    
                        }
                    }
                });
            }
            
        }
        
    });
});

//--- event when append rows (repeater and flex content)
acf.add_action('append', function( $el ){
    //    
});


//---tinymce init events
var ACFinitTinymceEditorTimeout;
var ACFtinymceEditorTimeout;
acf.add_action('wysiwyg_tinymce_init', function( ed, id, mceInit, $field ){
    
    //console.log(JSON.stringify(mceInit));
    //alert(JSON.stringify(mceInit['style_formats']));
    
    clearTimeout(ACFinitTinymceEditorTimeout);
    ACFinitTinymceEditorTimeout = setTimeout(function(){
        //--- call unique event when all tinymce editors has initialized
        
        
        //--- Apply 'mce-styles-colorize' class to 'ACF wysiwyg editor' to restrict styles ('colorize' only)
        //--- The class 'mce-styles-colorize-submenu' is applied automatically
        var duration = 30;
        var $ = jQuery;
        var n = 0;
        $('body').append('<style>.fullscreen-media-button-custom-wrapper{display: none !important; border-color:#0071a1 !important;box-shadow:none !important; margin-left: 10px !important; border-radius: 3px !important;} .fullscreen-media-button-custom{border-color:#0071a1;color:#0071a1;height:20px;line-height:20px;user-select:none;padding:5px;}.fullscreen-media-button-custom span{font: normal 18px/1 dashicons;speak: none;-webkit-font-smoothing: antialiased;margin-right:5px}.mce-fullscreen .fullscreen-media-button-custom-wrapper{display: inline-block !important;</style>')
        $('.acf-field-wysiwyg').each(function(){
            var $editor = $(this);
            var mceStylesColorize = $editor.hasClass('mce-styles-colorize');
            var mceStylesArrow = $editor.hasClass('mce-styles-arrow');
            var mceStylesHighlight = $editor.hasClass('mce-styles-highlight');
            var mceStylesHeading = $editor.hasClass('mce-styles-heading');
            var mceStylesFull = $editor.hasClass('mce-styles-full');
            if(!mceStylesColorize && !mceStylesArrow && !mceStylesHighlight && !mceStylesHeading){
                mceStylesFull = true;
            }
            //
            if($editor.find('.insert-media').length){
                $editor.find('.mce-btn.mce-last').unbind().attr('aria-label','Add Media').addClass('fullscreen-media-button-custom-wrapper').removeAttr('id');
                $editor.find('.mce-btn.mce-last button').unbind().bind('click',function(){
                    $editor.find('.insert-media').click();
                }).html('<span class="fullscreen-media-button-custom"><span class="dashicons dashicons-admin-media"></span>Add Media</span>');
            }else{
                $editor.find('.mce-btn.mce-last').remove();
            }
            //
            $editor.find('.mce-menubtn button').first().bind('click',function(){
                clearTimeout(ACFtinymceEditorTimeout);
                var $this = $(this);
                $editor.attr('id','acf-field-wysiwyg-'+n);
                $this.data('editor_id','acf-field-wysiwyg-'+n);
                if($this.data('target_id')){
                    ACFtinymceEditorTimeout = setTimeout(function(){
                        $('#'+$this.data('target_id')).addClass('mce-styles-colorize-submenu');
                        $(window).resize();
                        var top = $this.offset().top+$this.outerHeight();
                        $('#'+$this.data('target_id')).css({top:top});
                    },duration);      
                }else{
                    ACFtinymceEditorTimeout = setTimeout(function(){
                        var id = $('.mce-floatpanel').last().attr('id');
                        $this.data('target_id',id);
                        if(mceStylesFull){
                            //
                        }else{
                            $('#'+id+' .mce-menu-item').each(function(){
                                var $this = $(this);
                                var txt = $this.text().toLowerCase().split(' ').join('').split(' ').join('');
                                if((txt == 'color' && mceStylesColorize) || (txt == '→arrow' && mceStylesArrow) || (txt == 'highlight' && mceStylesHighlight) || (txt == 'heading' && mceStylesHeading)){
                                    //
                                }else{
                                    $this.addClass('remove-this');
                                }
                            });
                        }
                        /*
                        if(mceStylesFull){
                            //
                        }else if(mceStylesColorize){
                            //$('#'+id+' .mce-menu-item:not(".mce-last")').remove();
                            $('#'+id+' .mce-menu-item').each(function(){
                                var $this = $(this);
                                var txt = $this.text().toLowerCase().split(' ').join('').split(' ').join('');
                                if(txt != 'color'){
                                    $this.addClass('remove-this');
                                }
                            });
                            $('#'+id).css({height:45});
                        }else if(mceStylesArrow){
                            $('#'+id+' .mce-menu-item').each(function(){
                                var $this = $(this);
                                var txt = $this.text().toLowerCase().split(' ').join('').split(' ').join('');
                                if(txt != '→arrow'){
                                    $this.addClass('remove-this');
                                }
                            });
                            //$('#'+id).css({height:45});
                        }else{
                            //$('#'+id+' .mce-menu-item.mce-last').remove();
                            //alert(1)
                            $('#'+id+' .mce-menu-item').each(function(){
                                var $this = $(this);
                                var txt = $this.text().toLowerCase().split(' ').join('').split(' ').join('');
                                if(txt == 'color' || txt == '→arrow' ){
                                    $this.addClass('remove-this');
                                }
                            });
                        }
                        */
                        $('.remove-this').remove();
                        ACFtinymceEditorTimeout = setTimeout(function(){
                            $this.click();
                            $this.click();
                            var top = $this.offset().top+$('#'+id).outerHeight();
                            $('#'+id).css({top:top});
                        },15);
                        $('.mce-floatpanel').last().find('.mce-menu-item .mce-text').each(function(){
                            var $this = $(this);
                            var _class = String($this.text().toLocaleLowerCase()).split(' ').join('-');
                            if(_class != 'colorize' && _class != 'small-caps'){
                               _class = 'ts-'+_class; 
                            }
                            $this.addClass(_class);
                        });
                    },duration);
                }
            });
        });
    },100);
    
});



