define('widget/4DirectionIframe', [ 'widget/4Direction' ], function(FourDirection) {
	var FourDirectionIframe = $.inherit(FourDirection);
	$.merge(FourDirectionIframe.prototype, {
		constructor : function(config) {
			FourDirectionIframe.superClass.apply(this, arguments);
			this.config.scrollYIframeSelector = 'J_scrollYIframe';
			this.config.wrapper[0].fourDirection = this;
		},
		touchMoveEventImmediately : function(e) {
			var me = this;
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
			me.scrollDirection = e.scrollDirection;
			me.scroll();
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : e.timeStamp
			}
			me.fireEvent({
				type : 'touchMove'
			});
		}
		/*
		scrollY : function(distance) {
			var me = this;
			me.movedDistance.y += distance;
			var canMove = true;
			if (me.movedDistance.y > 0) {
				if (me.config.disableOverEnd || me.config.disableOverTopEnd) {
					canMove = false;
				}
				me.fireEvent({
					type : 'overingTopEnd',
					tabIndex : me.scrollYDomIndex,
					scrollYDom : me.scrollYDom[0],
					extraDistance : me.movedDistance.y,
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					scrollDirection : me.scrollDirection
				});
			} else if ((me.scrollYDom.height() - parseFloat(me.config.wrapper.css('height'))) < Math.abs(me.movedDistance.y)) {
				if (me.config.disableOverEnd || me.config.disableOverBottomEnd) {
					canMove = false;
				}
				me.fireEvent({
					type : 'overingBottomEnd',
					tabIndex : me.scrollYDomIndex,
					scrollYDom : me.scrollYDom[0],
					extraDistance : me.movedDistance.y - me.scrollYDom.height() + parseFloat(me.config.wrapper.css('height')),
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					scrollDirection : me.scrollDirection
				});
			}
			if (canMove) {
				me.scrollYDom.css({
					'-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)'
				});
				me.fireEvent({
					type : 'scrollY',
					tabIndex : me.scrollYDomIndex,
					scrollYDom : me.scrollYDom[0]
				})
			}
		}*/
	});
	return FourDirectionIframe;
});