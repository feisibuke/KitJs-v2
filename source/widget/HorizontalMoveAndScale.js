define('widget/HorizontalMoveAndScale', [ 'widget/4Direction' ], function(FourDirection) {
	var HorizontalMoveAndScale = $.inherit(FourDirection);
	$.merge(HorizontalMoveAndScale.prototype, {
		init : function() {
			var me = this;
			HorizontalMoveAndScale.superClass.prototype.init.apply(me, arguments);
			$(me.config.wrapper).bind('gestureend', function(e) {
				if (e.scale <= 1) {
					me.scrollYDom.css({
						'-webkit-transform' : 'translateY(0)'
					});
				}
			});
		},
		touchMoveEvent : function(e) {
			var me = this;
			if (e.touches && e.touches.length > 1) {
				me.maxTouchPoints = true;
				return;
			}
			if (me.lock_gesture) {
				return;
			}
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			me.nowPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom <= 1) {
				me.scrollDirection = me.CONSTANTS.HORIZONTAL;
				me.scroll();
			} else {
				me.scrollFree();
				me.scrollDirection = null;
			}
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : e.timeStamp
			}
			me.fireEvent('touchMove');
		}
	});
	return HorizontalMoveAndScale;
});