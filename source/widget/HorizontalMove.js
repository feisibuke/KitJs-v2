define('widget/HorizontalMove', [ 'widget/4Direction' ], function(FourDirection) {
	var HorizontalMove = $.inherit(FourDirection);
	$.merge(HorizontalMove.prototype, {
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
		}
	});
	return HorizontalMove;
});