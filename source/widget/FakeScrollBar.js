define('widget/FakeScrollBar', [ 'common', 'widget/Base' ], function($, Base) {
	var FakeScrollBar = $.inherit(Base);
	$.merge(FakeScrollBar.prototype, {
		constructor : function(config) {
			var me = this;
			me.config = $.mix({
				tpl : '<div style="display:none" class="J_fakeScrollBar"><div class="J_moveBar"></div></div>'
			}, config);
			me.config.wrapper.append($(me.config.tpl));
			me.scrollBar = $('.J_fakeScrollBar', me.config.wrapper);
			me.moveBar = $('.J_moveBar', me.scrollBar);
		},
		move : function(config) {
			var me = this;
			$.merge(me.config, config);
			clearTimeout(me.timeoutHide);
			me.scrollBar.show();
			me.scrollBar.css({
				opacity : 1,
				'-webkit-transform' : 'translateY(' + me.config.top + 'px) translateZ(0)',
				height : me.config.viewportHeight * (me.config.scrollHeight - me.config.viewportHeight) / me.config.scrollHeight
			});
			me.moveBar.css({
				height : (me.config.viewportHeight / me.config.scrollHeight * 100).toFixed(2) + '%'
			});
			me.moveBar.css({
				'-webkit-transform' : 'translateY(' + (me.config.scrollTop / me.config.scrollHeight * me.scrollBar[0].offsetHeight) + 'px) translateZ(0)',
			});
			me.timeoutHide = setTimeout(function() {
				me.scrollBar.animate({
					opacity : 0
				}, 'slow', 'ease-out', function() {
					me.scrollBar.hide();
				})
			}, 1000)
		},
		hide : function() {
			this.scrollBar.hide();
		}
	})
	return FakeScrollBar;
})