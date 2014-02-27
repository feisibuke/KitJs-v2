define('widget/VerticalMove', [ 'widget/4Direction' ], function(FourDirection) {
	var VerticalMove = $.inherit(FourDirection);
	$.merge(VerticalMove.prototype, {
		touchMoveEvent : function(e) {
			var me = this;
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			me.nowPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.scrollDirection = me.CONSTANTS.VERTICAL;
			me.scroll();
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : e.timeStamp
			}
			me.fireEvent('touchMove');
		}
	});
	return VerticalMove;
});