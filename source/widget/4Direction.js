define('widget/4Direction', [ 'common', 'widget/Base', 'widget/fx' ], function($, Base, fx) {
	function FourDirection(config) {
		this.config = $.mix({
			wrapper : $(document.body),
			scrollXDomSelector : '.J_scrollX',
			scrollYDomSelector : '.J_scrollY',
			accelerationYLimit : 0.1,
			accelerationXLimit : 0.3,
			animationDuration : 'fast',
			animationFx : 'ease-out',
			disableOverEnd : false,
			disableOverTopEnd : false,
			disableOverBottomEnd : false,
			disableOverLeftEnd : false,
			disableOverRightEnd : false,
			resetYWhenMoveTab : true
		}, config);
		this.scrollXDom = $(this.config.scrollXDomSelector, this.config.wrapper);
		this.scrollYDomIndex = this.config.scrollYDomIndex || 0;
		this.scrollYDom = $(this.config.scrollYDomSelector, this.config.wrapper).eq(this.scrollYDomIndex);
		this.scrollYDomArray = $(this.config.scrollYDomSelector, this.config.wrapper);
		this.movedDistance = {
			x : 0,
			y : 0
		}
		this.scrollDirection = 0;
		this.event = {};
		this.CONSTANTS = {
			HORIZONTAL : 1,// 水平
			VERTICAL : 2
		// 竖排
		}
	}
	$.inherit(FourDirection, Base);
	$.merge(FourDirection.prototype, {
		init : function() {
			var me = this;
			/*
			if (/asd/i.test(navigator.userAgent)) {
				me.scrollYDomArray.each(function(i, o) {
					$(o).css({
						overflow : 'auto',
						'-webkit-overflow-scrolling' : 'touch',
						height : $(me.config.wrapper).height()
					})
					$(o).bind('scroll', function() {
						me.nativeScrollY = true;
					})
				});
				me.useNative = true;
			}
			*/
			//
			$(me.config.wrapper).bind('touchstart', function(e) {
				me.touchStartEvent(e);
			});
			$(me.config.wrapper).bind('gesturestart', function(e) {
				me.lock_gesture = true;
			});
			$(me.config.wrapper).bind('touchmove', function(e) {
				if (me.lockTouchMove != true) {
					me.lockTouchMove = true;
					me.touchMoveEvent(e);
					var raf = window.requestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame;
					if (raf) {
						raf(function() {
							me.lockTouchMove = false;
						})
					} else {
						me.lockTouchMove = false;
					}
				}
			});
			/*
			$(me.config.wrapper).bind('touchmove', function(e) {
				me.touchMoveEvent(e);
			});
			*/
			$(me.config.wrapper).bind('touchend', function(e) {
				me.touchEndEvent(e);
			});
		},
		touchStartEvent : function(e) {
			var me = this;
			if (me.timer) {
				fx.cancel(me.timer);
				me.timer = null;
				me.fireEvent('scrollYEnd');
			}
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
			var movedDistanceY;
			try {
				movedDistanceY = parseFloat(me.scrollYDom.css('-webkit-transform').match(/translateY\(((-)?(\d+)(\.\d+)?)(px)?\)/)[1]);
			} catch (e) {
				movedDistanceY = 0;
			}
			me.movedDistance.y = movedDistanceY;
			//
			me.scrollDirection = 0;
		},
		touchMoveEvent : function(e) {
			var me = this;
			//
			// e.stopPropagation();
			if (e.touches && e.touches.length > 1) {
				me.maxTouchPoints = true;
				return;
			}
			if (me.lock_gesture) {
				return;
			}
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
			/*
			if (me.useNative) {
				if (Math.abs(me.nowPos.x - me.startPos.x) > 0 && !me.nativeScrollY) {
					e.preventDefault && e.preventDefault();
					e.stopPropagation && e.stopPropagation();
				}
			} else {
			*/
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			/*}*/
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom <= 1) {
				if (me.scrollDirection != 0) {
					me.scroll();
				} else {
					//if ((!me.useNative && Math.abs(me.nowPos.y - me.startPos.y) > 15) || me.nativeScrollY) {
					if (Math.abs(me.nowPos.y - me.startPos.y) > 15) {
						me.scrollDirection = me.CONSTANTS.VERTICAL;
						me.scrollYDomArray.each(function(i, o) {
							if (o != me.scrollYDom[0]) {
								$(o).css({
									'visibility' : 'hidden'
								})
								/*
								$(o).css({
									'-webkit-backface-visibility' : null
								});
								*/
							} else {
								/*
								$(o).css({
									'-webkit-backface-visibility' : 'hidden'
								})
								*/
							}
						});
					} else if (Math.abs(me.nowPos.x - me.startPos.x) > 15) {
						me.scrollDirection = me.CONSTANTS.HORIZONTAL;
						/*
						 * me.scrollYDom.prev(me.config.scrollYDomSelector, me.config.wrapper).css({ 'visibility' : 'visible' }); me.scrollYDom.next(me.config.scrollYDomSelector, me.config.wrapper).css({ 'visibility' : 'visible' });
						 */
						me.scrollYDomArray.each(function(i, o) {
							if (o != me.scrollYDom[0]) {
								$(o).css({
									'visibility' : 'visible'
								})
							}
						});
					} else {
						me.scroll();
					}
				}
			} else {
				//放大之后就可以自由滑动了
				me.scrollFree();
			}
			me.touchEndLastPos = me.lastPos;
			me.lastPos = {
				x : me.nowPos.x,
				y : me.nowPos.y,
				timeStamp : me.nowPos.timeStamp
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
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom == 1) {
				if (me.nowPos != null) {
					var accelerationY = (me.nowPos.y - me.touchEndLastPos.y) / (me.nowPos.timeStamp - me.touchEndLastPos.timeStamp);
					var accelerationX = (me.nowPos.x - me.touchEndLastPos.x) / (me.nowPos.timeStamp - me.touchEndLastPos.timeStamp);
					if (me.scrollDirection == me.CONSTANTS.HORIZONTAL && !isNaN(accelerationX)) {
						var perWidth = me.config.wrapper.width();
						var n = 0;
						n = -me.movedDistance.x / perWidth;
						var index = me.judgeCrossHorizontal({
							ratio : n,
							direction : (me.startPos.x > me.nowPos.x ? 'left' : 'right'),
							distance : (me.nowPos.x - me.startPos.x),
							accelerationY : accelerationY,
							accelerationX : accelerationX
						});
						if (index > me.scrollYDomArray.length - 1) {
							index = me.scrollYDomArray.length - 1;
							me.fireEvent({
								type : 'overRightEnd'
							});
						} else if (index < 0) {
							index = 0;
							me.fireEvent({
								type : 'overLeftEnd'
							});
						}
						var needResetY = false;
						var tabChanged = false;
						if (index != me.scrollYDomIndex) {
							if (me.config.resetYWhenMoveTab) {
								me.movedDistance.y = 0;
							}
							me.scrollYDomIndex = index;
							needResetY = true;
							tabChanged = true;
						}
						me.scrollYDom = me.scrollYDomArray.eq(me.scrollYDomIndex)
						me.movedDistance.x = index * -perWidth;
						me._moveTab({
							needResetY : needResetY,
							tabChanged : tabChanged
						});
						//} else if (me.scrollDirection == me.CONSTANTS.VERTICAL && !isNaN(accelerationY) && !me.useNative) {
					} else if (me.scrollDirection == me.CONSTANTS.VERTICAL && !isNaN(accelerationY)) {
						var needA = false, duration = (me.nowPos.timeStamp - me.startPos.timeStamp);
						if (Math.abs(accelerationY) > me.config.accelerationYLimit) {
							me.fireEvent({
								type : 'scrollAccelerationYStart'
							});
							if (Math.abs(accelerationY) < 1) {
								me.movedDistance.y += accelerationY * (me.nowPos.timeStamp - me.startPos.timeStamp) * 2;
								//duration *= 2;
								duration = 300;
							} else if (Math.abs(accelerationY) >= 1 && Math.abs(accelerationY) < 2) {
								me.movedDistance.y += (accelerationY < 0 ? -1 : 1) * Math.pow(accelerationY, 2) * (me.nowPos.timeStamp - me.startPos.timeStamp) * 3;
								//duration *= 2.5;
								duration = 500;
							} else if (Math.abs(accelerationY) >= 2 && Math.abs(accelerationY) < 3) {
								me.movedDistance.y += Math.pow(accelerationY, 3) * (me.nowPos.timeStamp - me.startPos.timeStamp) * 4;
								//duration *= 3;
								duration = 800;
							} else if (Math.abs(accelerationY) >= 3) {
								me.movedDistance.y += (accelerationY < 0 ? -1 : 1) * Math.pow(accelerationY, 4) * (me.nowPos.timeStamp - me.startPos.timeStamp) * 5;
								//duration *= 3.5;
								duration = 1000;
							}
							needA = true;
						}
						if (me.movedDistance.y > 0) {
							me.movedDistance.y = 0;
							me.moveY({
								distanceY : 0,
								duration : duration,
								then : function() {
									/*
									me.scrollYDom.css({
										'-webkit-backface-visibility' : null
									});
									*/
									me.timer = null;
									me.fireEvent({
										type : 'overTopEnd',
										tabIndex : me.scrollYDomIndex,
										scrollYDom : me.scrollYDom[0]
									});
									me.fireEvent({
										type : 'scrollYEnd'
									});
								}
							})
							/*
							 * me.timer = fx.motion({ effects : [ { el : me.scrollYDom, to : { '-webkit-transform' : 'translateY(0px)' } } ], then : function() { me.timer = null; me.fireEvent({ type : 'overTopEnd', tabIndex : me.scrollYDomIndex, scrollYDom : me.scrollYDom[0] }); me.fireEvent({ type :
							 * 'scrollYEnd' }); }, duration : duration, fx : 'easeOutQuad' })
							 */
							/*
							 * me.scrollYDom.animate({ '-webkit-transform' : 'translateY(0)' }, me.config.animationDuration, me.config.animationFx, function() {
							 * 
							 * });
							 */
						} else {
							// var maxL = -(me.scrollYDom.height()) + parseFloat(me.config.wrapper.css('height'));
							var maxL = -(me.scrollYDom.height()) + document.documentElement.clientHeight - parseFloat(me.config.wrapper.css('padding-top'));
							maxL = maxL > 0 ? 0 : maxL;
							if (me.movedDistance.y <= maxL) {
								me.movedDistance.y = maxL;
								me.moveY({
									distanceY : me.movedDistance.y,
									duration : duration,
									then : function() {
										/*
										me.scrollYDom.css({
											'-webkit-backface-visibility' : null
										});
										*/
										me.timer = null;
										me.fireEvent({
											type : 'overBottomEnd',
											tabIndex : me.scrollYDomIndex,
											scrollYDom : me.scrollYDom[0]
										});
										me.fireEvent({
											type : 'scrollAccelerationYEnd'
										});
										me.fireEvent({
											type : 'scrollYEnd'
										});

									}
								})
								/*
								 * me.timer = fx.motion({ effects : [ { el : me.scrollYDom, to : { '-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)' } } ], then : function() { me.timer = null; me.fireEvent({ type : 'overBottomEnd', tabIndex : me.scrollYDomIndex, scrollYDom :
								 * me.scrollYDom[0] }); me.fireEvent({ type : 'scrollAccelerationYEnd' }); me.fireEvent({ type : 'scrollYEnd' }); }, duration : duration, fx : 'easeOutQuad' })
								 */
								/*
								 * me.scrollYDom.animate({ '-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)' }, me.config.animationDuration, me.config.animationFx, function() { me.scrollYDom.attr('data-movedDistanceY', me.movedDistance.y); me.fireEvent({ type : 'overBottomEnd', tabIndex :
								 * me.scrollYDomIndex, scrollYDom : me.scrollYDom[0] }); me.fireEvent({ type : 'scrollAccelerationYEnd' }); me.fireEvent({ type : 'scrollYEnd' }); });
								 */
							} else {
								if (needA) {
									me.moveY({
										distanceY : me.movedDistance.y,
										duration : duration,
										then : function() {
											/*
											me.scrollYDom.css({
												'-webkit-backface-visibility' : null
											});
											*/
											me.timer = null;
											me.fireEvent({
												type : 'scrollAccelerationYEnd'
											});
											me.fireEvent({
												type : 'scrollYEnd'
											});

										}
									})
									/*
									 * me.timer = fx.motion({ effects : [ { el : me.scrollYDom, to : { '-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)' } } ], then : function() { me.timer = null; me.fireEvent({ type : 'scrollAccelerationYEnd' }); me.fireEvent({ type : 'scrollYEnd' }); },
									 * duration : duration, fx : 'easeOutQuad' });
									 */
									/*
									 * me.scrollYDom.animate({ '-webkit-transform' : 'translateY(' + me.movedDistance.y + 'px)' }, me.config.animationDuration, me.config.animationFx, function() { me.scrollYDom.attr('data-movedDistanceY', me.movedDistance.y); me.fireEvent({ type :
									 * 'scrollAccelerationYEnd' }); me.fireEvent({ type : 'scrollYEnd' }); });
									 */
								} else {
									me.fireEvent({
										type : 'scrollYEnd'
									});
								}
							}
						}
					}
				}
			}
			// reset
			me.scrollDirection = 0;
			me.fireEvent({
				type : 'touchEnd'
			});
			me.startPos = me.lastPos = me.nowPos = me.touchEndLastPos = null;
			/*if (me.useNative) {
				me.nativeScrollY = false;
			}*/
			me.nativeScrollY = false;
			me.overXEnd = false;
			me.lock_gesture = false;
		},
		scroll : function() {
			var me = this;
			if (me.scrollDirection == me.CONSTANTS.HORIZONTAL) {
				me.scrollX(me.nowPos.x - me.lastPos.x);
				//} else if (me.scrollDirection == me.CONSTANTS.VERTICAL) {
			} else {
				/*if (!me.useNative) {
					me.scrollY(me.nowPos.y - me.lastPos.y);
				}
				*/
				me.scrollY(me.nowPos.y - me.lastPos.y);
			}
		},
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
					timeStamp : me.nowPos.timeStamp,
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
					timeStamp : me.nowPos.timeStamp,
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
				});
			}
		},
		scrollX : function(distance) {
			var me = this;
			me.movedDistance.x += distance;
			var canMove = true;
			if (me.movedDistance.x > 0) {
				if (me.config.disableOverEnd || me.config.disableOverLeftEnd) {
					canMove = false;
				}
				me.fireEvent({
					type : 'overingLeftEnd',
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
				me.overXEnd = true;
			} else if (me.config.wrapper.width() * (me.scrollYDomArray.length - 1) < Math.abs(me.movedDistance.x)) {
				if (me.config.disableOverEnd || me.config.disableOverRightEnd) {
					canMove = false;
				}
				me.fireEvent({
					type : 'overingRightEnd',
					clientX : me.nowPos.x,
					clientY : me.nowPos.y,
					timeStamp : me.nowPos.timeStamp,
					scrollDirection : me.scrollDirection
				});
				me.overXEnd = true;
			}
			if (canMove) {
				if ((me.overXEnd && parent != self)) {
					return;
				}
				me.scrollXDom.css({
					'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
				});
				me.fireEvent('scrollX');
			}
		},
		scrollFree : function() {
			var me = this;
			me.scrollX(me.nowPos.x - me.lastPos.x);
			me.scrollY(me.nowPos.y - me.lastPos.y);
		},
		moveTab : function(index, noAnim) {
			var me = this;
			index = index < 0 ? 0 : index;
			if (index != me.scrollYDomIndex) {
				var perWidth = me.config.wrapper.width();
				if (index > me.scrollYDomArray.length - 1) {
					index = me.scrollYDomArray.length - 1;
				}
				if (index != me.scrollYDomIndex) {
					me.movedDistance.y = 0;
					me.scrollYDomIndex = index;
				}

				me.movedDistance.x = index * -perWidth;
				me._moveTab({
					noAnim : noAnim,
					tabChanged : true
				});
			}
		},
		_moveTab : function(config) {
			var me = this;
			config = $.mix({
				noAnim : false,
				needResetY : true
			}, config)
			me.scrollYDom = me.scrollYDomArray.eq(me.scrollYDomIndex)
			if (config.noAnim) {
				me.scrollYDomArray.each(function(i, o) {
					if (o != me.scrollYDom[0]) {
						$(o).css({
							'visibility' : 'hidden'
						})
					} else {
						$(o).css({
							'visibility' : 'visible'
						})
					}
				});
				me.scrollXDom.css({
					'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
				});
				if (config.needResetY) {
					if (me.config.resetYWhenMoveTab) {
						me.scrollYDomArray.each(function(idx, o) {
							if (o != me.scrollYDom[0]) {
								$(o).css({
									'-webkit-transform' : 'translateY(0)'
								})
							}
						});
					}
				}
				(window.requestAnimationFrame || window.msRequestAnimationFrame || window.webkitRequestAnimationFrame || window.setTimeout).apply(window, [ function() {
					me.fireEvent({
						type : 'moveTab',
						tabIndex : me.scrollYDomIndex,
						scrollYDom : me.scrollYDom[0],
						tabChanged : config.tabChanged
					});
				}, 30 ]);
			} else {
				me.scrollXDom.animate({
					'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
				}, me.config.animationDuration, me.config.animationFx, function() {
					if (config.needResetY) {
						if (me.config.resetYWhenMoveTab) {
							me.scrollYDomArray.each(function(idx, o) {
								if (o != me.scrollYDom[0]) {
									$(o).css({
										'-webkit-transform' : 'translateY(0)'
									})
								}
							});
						}
					}
					me.scrollYDomArray.each(function(i, o) {
						if (o != me.scrollYDom[0]) {
							$(o).css({
								'visibility' : 'hidden'
							})
						} else {
							$(o).css({
								'visibility' : 'visible'
							})
						}
					});
					me.fireEvent({
						type : 'moveTab',
						tabIndex : me.scrollYDomIndex,
						scrollYDom : me.scrollYDom[0],
						tabChanged : config.tabChanged
					});
				});
			}
			if (config.needResetY) {
				me.movedDistance.y = 0;
			}
		},
		resetPosition : function() {
			var me = this;
			if (me.config.wrapper.is(':visible')) {
				var perWidth = me.config.wrapper.width();
				me.movedDistance.x = me.scrollYDomIndex * -perWidth;
				var me = this;
				if (me.scrollXDom.is(':visible')) {
					me.scrollXDom.animate({
						'-webkit-transform' : 'translateX(' + me.movedDistance.x + 'px)'
					}, me.config.animationDuration, me.config.animationFx, function() {
						if (me.config.resetYWhenMoveTab) {
							me.scrollYDomArray.each(function(idx, o) {
								if (o != me.scrollYDom[0]) {
									$(o).css({
										'-webkit-transform' : 'translateY(0)'
									})

								}

							});
						}
					});
					me.movedDistance.y = 0;
				}
			}
			me.fireEvent('resetPosition');

		},
		judgeCrossHorizontal : function(config) {
			var n = config.ratio, direction = config.direction, //
			distance = config.distance, accelerationX = config.accelerationX, accelerationY = config.accelerationY;
			var me = this;
			var n1 = Math.floor(n);
			var n2 = n - n1;
			if (direction == 'left') {
				// left
				if (n2 > 0.5 || Math.abs(accelerationX) > me.config.accelerationXLimit) {
					return n1 + 1;
				}
				return n1;
			} else {
				// right
				if ((1 - n2 > 0.5) || Math.abs(accelerationX) > me.config.accelerationXLimit) {
					return n1;
				}
				return n1 + 1;
			}
		},
		moveY : function(config) {
			var me = this;
			me.timer = fx.motion({
				effects : [ {
					el : me.scrollYDom,
					to : {
						'-webkit-transform' : 'translateY(' + config.distanceY + 'px)'
					}
				} ],
				then : config.then,
				duration : config.duration || 200,
				fx : 'easeOutQuad'
			})
		}
	})
	return FourDirection;
})