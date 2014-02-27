define('widget/IframeScrollTouchMove', [ 'common', 'widget/Base' ], function($, Base) {
	var IframeScrollTouchMove = $.inherit(Base);
	$.merge(IframeScrollTouchMove.prototype, {
		constructor : function(config) {
			this.config = $.mix({
				animationDuration : 'fast',
				animationFx : 'ease-out'
			}, config)
			this.movedDistance = {
				x : 0,
				y : 0
			}
			this.scrollDirection = 0;
			this.event = {};
			this.CONSTANTS = {
				HORIZONTAL : 1,//水平
				VERTICAL : 2
			//竖排
			}
			this.containerHeight = 600;
			this.movedDistance = {
				x : document.body.scrollLeft,
				y : document.body.scrollTop
			}
			this.registEvent();
			this.dealPostMessage();
		},
		dealPostMessage : function() {
			var me = this;
			self.addEventListener('message', function(e) {
				if (e.data) {
					if (e.data.cmd == 'iframeScrollTouchMove_height') {
						me.containerHeight = parseInt(e.data.value);
					}
				}
			})
			parent.postMessage({
				cmd : 'iframeScrollTouchMoveReady',
				value : 1
			}, '*');
		},
		touchStartEvent : function(e) {
			var me = this;
			me.startPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.lastPos = {
				x : e.touches ? e.touches[0].clientX : e.clientX,
				y : e.touches ? e.touches[0].clientY : e.clientY,
				timeStamp : e.timeStamp
			}
			me.fireEvent({
				type : 'touchStart'
			});
		},
		touchMoveEvent : function(e) {
			var me = this;
			//
			//e.stopPropagation();
			if (e.touches && e.touches.length > 1) {
				me.maxTouchPoints = true;
				return;
			}
			e.preventDefault && e.preventDefault();
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
			if (me.scrollDirection != 0) {
				me.scroll();
			} else {
				if (Math.abs(me.nowPos.x - me.startPos.x) > 25) {
					me.scrollDirection = me.CONSTANTS.HORIZONTAL;
				} else if (Math.abs(me.nowPos.y - me.startPos.y) > 15) {
					me.scrollDirection = me.CONSTANTS.VERTICAL;
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
		},
		touchEndEvent : function(e) {
			var me = this;
			if (me.maxTouchPoints) {
				me.maxTouchPoints = false;
				return;
			}
			if (me.nowPos) {
				var accelerationY = (me.nowPos.y - me.startPos.y) / (me.nowPos.timeStamp - me.startPos.timeStamp);
				var accelerationX = (me.nowPos.x - me.startPos.x) / (me.nowPos.timeStamp - me.startPos.timeStamp);
				if (me.scrollDirection == me.CONSTANTS.HORIZONTAL) {
					if (me.overEnd) {
						if (accelerationX < -0.4) {
							me.fireEvent('overRightEnd');
						} else if (accelerationX > 0.4) {
							me.fireEvent('overLeftEnd');
						}
					}
				} else if (me.scrollDirection == me.CONSTANTS.VERTICAL) {
					if (Math.abs(accelerationY) > 0.4) {
						me.movedDistance.y += accelerationY * (me.nowPos.timeStamp - me.startPos.timeStamp);
					}
					if (me.movedDistance.y > 0) {
						me.movedDistance.y = 0;
						me.fireEvent({
							type : 'overTopEnd'
						});
					} else {
						var maxL = -document.body.scrollHeight + me.containerHeight;
						if (me.movedDistance.y <= maxL) {
							me.movedDistance.y = maxL;
							me.fireEvent({
								type : 'overBottomEnd'
							});
						} else {
							$(document.body).animate({
								'-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)'
							}, me.config.animationDuration, me.config.animationFx);
						}
					}
				}
			}
			//reset
			me.scrollDirection = 0;
			me.overEnd = false;
			me.fireEvent({
				type : 'touchEnd'
			});
			me.startPos = me.lastPos = me.nowPos = null;
		},
		registEvent : function() {
			var me = this;
			$(window).bind('touchstart', function(e) {
				me.touchStartEvent(e)
			});

			$(window).bind('touchmove', function(e) {
				me.touchMoveEvent(e)
			});
			$(window).bind('touchend', function(e) {
				me.touchEndEvent(e)
			});
		},
		scroll : function() {
			var me = this;
			if (me.scrollDirection == me.CONSTANTS.HORIZONTAL) {
				me.scrollX(me.nowPos.x - me.lastPos.x);
			} else if (me.scrollDirection == me.CONSTANTS.VERTICAL) {
				me.scrollY(me.nowPos.y - me.lastPos.y);
			}
		},
		scrollY : function(distance) {
			var me = this;
			me.movedDistance.y += distance;
			var moveD = me.movedDistance.y;
			if (me.movedDistance.y > 0) {
				moveD = 0;
				me.overEnd = true;
				me.fireEvent({
					type : 'overingTopEnd',
					extraDistance : me.movedDistance.y,
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
			} else if (document.body.scrollHeight - me.containerHeight < -me.movedDistance.y) {
				moveD = -document.body.scrollHeight + me.containerHeight;
				me.overEnd = true;
				me.fireEvent({
					type : 'overingBottomEnd',
					extraDistance : me.movedDistance.y - document.body.scrollHeight,
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
			}
			$(document.body).css({
				'-webkit-transform' : 'translateY(' + moveD + 'px)'
			});

		},
		scrollX : function(distance) {
			var me = this;
			me.movedDistance.x += distance;
			var canMove = true;
			if (me.movedDistance.x > 0) {
				me.movedDistance.x = 0
				me.overEnd = true;
				me.fireEvent({
					type : 'overingLeftEnd',
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
			} else if (document.body.scrollWidth - $(window).width() < -me.movedDistance.x) {
				me.movedDistance.x = $(window).width() - document.body.scrollWidth;
				me.overEnd = true;
				me.fireEvent({
					type : 'overingRightEnd',
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
			}
			$(document.body).css({
				'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
			});
		}
	})
	return IframeScrollTouchMove;

})