define('widget/messageBox/BackgroundShadow', [ 'common' ], function($) {
	var DEFAULT_CONFIG = {
		tpl : '<div class="y_dt y_dt_txtone"><div class="inner J_contentContainer"></div></div>'
	}
	function BackgroundShadow(config) {
		if (!window.__backgroundShadow) {
			this.config = $.mix(DEFAULT_CONFIG, config);
			this.element = $(this.config.tpl).appendTo(document.body);
			window.__backgroundShadow = this;
			this.contentContainer = this.element.find('.J_contentContainer');
			this.element.hide();
			return this;
		}
		return window.__backgroundShadow;
	}
	$.merge(BackgroundShadow.prototype, {
		clear : function() {
			this.contentContainer.innerHTML = '';
		},
		show : function() {
			this.element.show();
		},
		hide : function() {
			this.element.hide();
		}
	});
	return BackgroundShadow;
})