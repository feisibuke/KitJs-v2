define('widget/4DirectionNativeUpDown', [ 'widget/4Direction' ], function(FourDirection) {
	var FourDirectionNativeUpDown = $.inherit(FourDirection);
	$.merge(FourDirection.prototype, {
		touchMoveEvent : function(e) {
			var me = this;
			//
			//e.stopPropagation();
			if (e.touches && e.touches.length > 1) {
				me.maxTouchPoints = true;
				return;
			}
			//e.preventDefault && e.preventDefault();
			me.startPos = me.startPos || {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.lastPos = me.lastPos || {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.nowPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			if (me.scrollDirection == me.CONSTANTS.HORIZONTAL) {
				e.preventDefault && e.preventDefault();
				me.scroll();
			} else {
				if (Math.abs(me.nowPos.x - me.startPos.x) > 5) {
					e.preventDefault && e.preventDefault();
					me.scrollDirection = me.CONSTANTS.HORIZONTAL;
					/*
					me.scrollYDomArray.each(function(i, o) {
						if (o != me.scrollYDom[0]) {
							$(o).css({
								'visibility' : 'visible'
							})
						}
					});
					*/
				} else if (Math.abs(me.nowPos.y - me.startPos.y) > 5) {
					me.scrollDirection = me.CONSTANTS.VERTICAL;
					/*
					me.scrollYDomArray.each(function(i, o) {
						if (o != me.scrollYDom[0]) {
							$(o).css({
								'visibility' : 'hidden'
							})
						}
					});
					*/
				} else {
					e.preventDefault && e.preventDefault();
				}
			}
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : e.timeStamp
			}
			me.fireEvent({
				type : 'touchMove'
			});
		}
	});
	return FourDirectionNativeUpDown;
});