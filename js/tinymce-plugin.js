(function() {

	// Adds a custom command that later can be executed using execCommand

	tinymce.PluginManager.add( 'customs', function( editor ){

		let $mediaButton = document.querySelector('#wp-'+editor.id+'-media-buttons button.insert-media');
		if(!!$mediaButton){
			editor.addButton('add_media_custom', {
				icon: 'image',
				tooltip: 'Add Media',
				text: 'Add Media',
				classes: 'custom-media-button',
				onclick: function() {
					let $mediaButton = document.querySelector('#wp-'+editor.id+'-media-buttons button.insert-media');
					$mediaButton.click();
				},
				onpostrender: function() {
					var btn = this;
					editor.on('init', function() {
						editor.formatter.formatChanged('add_media_custom', function(state) {
							btn.active(state);
						});
					});
				}
			});
		}

		editor.on("init", function(){
			editor.addShortcut("ctrl+u", "", function(){
				editor.execCommand('mceToggleFormat', false, 'font_underline');
			});
			editor.addShortcut("meta+u", "", function(){
				editor.execCommand('mceToggleFormat', false, 'font_underline');
			});
			let $mediaButton = document.querySelector('#wp-'+editor.id+'-media-buttons button.insert-media');
			if(!!$mediaButton){
				$mediaButton.style.display = 'none';
			}
		});
		
	});
})();