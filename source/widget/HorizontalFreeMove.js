define('widget/HorizontalFreeMove', [ 'widget/4Direction' ], function(FourDirection) {
	var HorizontalFreeMove = $.inherit(FourDirection);
	$.merge(HorizontalFreeMove.prototype, {
		touchMoveEvent : function(e) {
			var me = this;
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			me.nowPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.scrollDirection = me.CONSTANTS.HORIZONTAL;
			me.scroll();
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : e.timeStamp
			}
			me.fireEvent('touchMove');
		},
		touchEndEvent : function(e) {
			var me = this;
			if (me.maxTouchPoints) {
				me.maxTouchPoints = false;
				return;
			}
			if (me.scrollDirection == me.CONSTANTS.HORIZONTAL) {
				if (Math.abs(me.movedDistance.x) > 0 && me.movedDistance.x < me.config.wrapper.width() - me.scrollXDom.width() + 20) {
					me.fireEvent({
						type : 'overRightEnd'
					});
					if (me.scrollXDom.width() <= me.config.wrapper.width()) {
						me.movedDistance.x = 0;
					} else {
						me.movedDistance.x = me.config.wrapper.width() - me.scrollXDom.width();
					}
					me.scrollXDom.animate({
						'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
					}, me.config.animationDuration, me.config.animationFx, function() {
					});
				} else if (me.movedDistance.x > 0) {
					index = 0;
					me.fireEvent({
						type : 'overLeftEnd'
					});
					me.movedDistance.x = 0;
					me.scrollXDom.animate({
						'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
					}, me.config.animationDuration, me.config.animationFx, function() {
					});
				}
			} else if (me.scrollDirection == me.CONSTANTS.VERTICAL) {
				//
			}
			//reset
			me.scrollDirection = 0;
			me.fireEvent({
				type : 'touchEnd'
			});
			me.startPos = me.lastPos = me.nowPos = null;
		},
		resetPosition : function() {
			var me = this;
			me.fireEvent('resetPosition');
		}
	});
	return HorizontalFreeMove;
});