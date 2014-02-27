define([
	'common'
], function($) {
	var BackTop = function() {
		this.isInit = false;
		this.isShow = false;
		this.$window = $(window);
		this.$wrapper = null;
	};

	$.merge(BackTop.prototype, {
		init: function(selector) {
			var me = this;
			if (me.isInit) {
				return;
			}
			me.isInit = true;
			if (typeof selector == 'string') {
				me.$wrapper = $(selector);
			} else {
				me.$wrapper = selector;
			}
			me.$window.on('scroll.backTop', judgeShow);
			me.$wrapper.on('click', function(event) {
				event.preventDefault();
				me.$window.scrollTop(0);
			});

			judgeShow();

			function judgeShow() {
				var current = me.$window.scrollTop();
				if (current > 0) {
					me.show();
				} else {
					me.hide();
				}
			}
		},

		dispose: function() {
			this.$window.off('.backTop');
			this.hide();
			this.$wrapper = null;
			this.isInit = false;
		},

		show: function() {
			if (this.isInit && !this.isShow) {
				this.$wrapper.addClass('WX_backtop_active');
				this.isShow = true;
			}
		},

		hide: function() {
			if (this.isInit && this.isShow) {
				this.$wrapper.removeClass('WX_backtop_active');
				this.isShow = false;
			}
		}
	});

	return new BackTop();
});