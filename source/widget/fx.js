define('widget/fx', [ 'common', 'widget/math' ], function($, math) {
	var defaultTimeSeg = 17;
	var defaultDuration = 1000
	var initTimerId = 1;
	var timerDefaultPrefix = 'MOTION_TIMER_';
	var specialAttr = [ 'scrollTop', 'scrollLeft' ];
	var timerStore = {};
	var Fx = {
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		swing : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInQuad : function(t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutQuad : function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutQuad : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInCubic : function(t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutCubic : function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutCubic : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInQuart : function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutQuart : function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutQuart : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInQuint : function(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutQuint : function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutQuint : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInSine : function(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutSine : function(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutSine : function(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInExpo : function(t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutExpo : function(t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutExpo : function(t, b, c, d) {
			if (t == 0)
				return b;
			if (t == d)
				return b + c;
			if ((t /= d / 2) < 1)
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInCirc : function(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutCirc : function(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutCirc : function(t, b, c, d) {
			if ((t /= d / 2) < 1)
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutElastic : function(t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d / 2) == 2)
				return b + c;
			if (!p)
				p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1)
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInBack : function(t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutBack : function(t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutBack : function(t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			if ((t /= d / 2) < 1)
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInBounce : function(t, b, c, d) {
			return c - Fx.easeOutBounce(d - t, 0, c, d) + b;
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeOutBounce : function(t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		},
		/**
		 * @param {Number} t current time（当前时间）
		 * @param {Number} b beginning value（初始值）置0，即b=0；
		 * @param {Number} c change in value（变化量）置1，即c=1；
		 * @param {Number} d duration（持续时间） 置1，即d=1。
		 * @return {Number}
		 */
		easeInOutBounce : function(t, b, c, d) {
			if (t < d / 2)
				return Fx.easeInBounce(t * 2, 0, c, d) * .5 + b;
			return Fx.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
		}
	}
	function loop() {
		var fn;
		if (window.requestAnimationFrame && window.cancelAnimationFrame) {
			fn = window.requestAnimationFrame;
		} else if (window.msRequestAnimationFrame && window.msCancelAnimationFrame) {
			fn = window.msRequestAnimationFrame;
		} else if (window.webkitRequestAnimationFrame && window.webkitCancelAnimationFrame) {
			fn = window.webkitRequestAnimationFrame;
		} else {
			fn = setInterval;
		}
		return fn.apply(undefined, arguments)
	}
	function stop() {
		/*
		 * 三星有该死的bug
		 * https://code.google.com/p/android/issues/detail?id=66243
		 * Reproduced on Samsung Galaxy S4 (i9500) with Android 4.3 (I9500XXUEMK8).
		 */
		var fn;
		if (window.requestAnimationFrame && window.cancelAnimationFrame) {
			fn = window.cancelAnimationFrame;
		} else if (window.msRequestAnimationFrame && window.msCancelAnimationFrame) {
			fn = window.msCancelAnimationFrame;
		} else if (window.webkitRequestAnimationFrame && window.webkitCancelAnimationFrame) {
			fn = window.webkitCancelAnimationFrame;
		} else {
			fn = clearInterval;
		}
		return fn.apply(undefined, arguments)
	}
	/**
	 * alian
	 */
	$.merge(Fx, {
		'ease-out' : Fx.easeOutQuad,
		'ease-in' : Fx.easeInQuad
	});
	function motion(config) {
		initTimerId++;
		if (config.timer) {
			if (typeof config.timer == 'number') {
				stop(config.timer);
			} else if (typeof config.timer == 'string' && config.timer in timerStore) {
				stop(timerStore[config.timer]);
			}
		}
		config.hold = config.hold || 0;
		config.duration = config.duration || defaultDuration;
		config.timeSeg = config.timeSeg || defaultTimeSeg;
		config.fx = typeof (config.fx) == 'function' ? config.fx : Fx['swing'];
		for (var elIndex = 0; elIndex < config.effects.length; elIndex++) {
			var effect = config.effects[elIndex];
			var el = $(effect.el);
			if (effect.from) {
				applyCss(el, effect.from);
			}
		}
		//
		var count = 0;
		config._startTime = Date.now();
		var timer = loop(loopFn, config.timeSeg);
		config._realTimer = timer;
		function loopFn(nowTime) {
			if (nowTime) {
				config.hold = Date.now() - config._startTime;
			} else {
				config.hold += config.timeSeg;
			}
			for (var elIndex = 0; elIndex < config.effects.length; elIndex++) {
				var effect = config.effects[elIndex];
				var el = $(effect.el);
				//
				effect.fx = typeof (effect.fx) == 'function' ? effect.fx : (Fx[effect.fx] || config.fx);
				var resultStyleString = '', currentStyle, targetStyle, changeStyle = {};
				//
				for ( var cssName in effect.to) {
					var _from, _to = effect.to[cssName];
					if (effect.from == null || !(cssName in effect.from)) {
						_from = getCss(el, cssName);
						effect.from = effect.from || {};
						effect.from[cssName] = _from;
						_to = effect.to[cssName];
						if (_from == _to) {
							continue;
						}
						if (_from != null && _from != '' && _from != 'none' && _from.indexOf('rgb') == '0' && _to.indexOf('#') == 0) {
							var re = '#';
							$.each(_from.match(/\d+/g), function(i, d) {
								if (i == 3) {
									return false;
								}
								re += math.padZero(math.convert(d, 10, 16), (_to.length - 1) / 3);
							});
							_from = re;
						}
						currentStyle = identifyCssValue(_from);
					} else {
						_from = effect.from[cssName];
						currentStyle = identifyCssValue(_from);
					}
					targetStyle = identifyCssValue(_to);
					if (currentStyle == null || targetStyle == null || currentStyle.length != targetStyle.length) {
						continue;
					}
					for (var i = 0; i < targetStyle.length; i++) {
						if (i > 0) {
							resultStyleString += ' ';
						}
						var o = targetStyle[i];
						var changeValue;
						if (o.value.indexOf('#') == 0) {//rgb
							if (currentStyle[i].value.length == 4) {
								currentStyle[i].value = currentStyle[i].value.substring(0, 1) + currentStyle[i].value.substring(1, 2)//
										+ currentStyle[i].value.substring(1, 2) + currentStyle[i].value.substring(1, 2)//
										+ currentStyle[i].value.substring(2, 3) + currentStyle[i].value.substring(2, 3)//
										+ currentStyle[i].value.substring(3, 4) + currentStyle[i].value.substring(3, 4);
							}
							if (targetStyle[i].value.length == 4) {
								targetStyle[i].value = targetStyle[i].value.substring(0, 1) + targetStyle[i].value.substring(1, 2)//
										+ targetStyle[i].value.substring(1, 2) + targetStyle[i].value.substring(1, 2)//
										+ targetStyle[i].value.substring(2, 3) + targetStyle[i].value.substring(2, 3)//
										+ targetStyle[i].value.substring(3, 4) + targetStyle[i].value.substring(3, 4);
							}
							var rgbFrom = {
								r : 0,
								g : 0,
								b : 0
							}
							if (currentStyle != null) {
								rgbFrom = {
									r : parseFloat(math.convert(currentStyle[i].value.substring(1, 3), 16, 10)),
									g : parseFloat(math.convert(currentStyle[i].value.substring(3, 5), 16, 10)),
									b : parseFloat(math.convert(currentStyle[i].value.substring(5, 7), 16, 10))
								}
							}
							var rgbTo = {
								r : parseFloat(math.convert(targetStyle[i].value.substring(1, 3), 16, 10)),
								g : parseFloat(math.convert(targetStyle[i].value.substring(3, 5), 16, 10)),
								b : parseFloat(math.convert(targetStyle[i].value.substring(5, 7), 16, 10))
							}
							var rgb = {
								r : effect.fx(config.hold, rgbFrom.r, rgbTo.r - rgbFrom.r, config.duration),
								g : effect.fx(config.hold, rgbFrom.g, rgbTo.g - rgbFrom.g, config.duration),
								b : effect.fx(config.hold, rgbFrom.b, rgbTo.b - rgbFrom.b, config.duration)
							}
							changeValue = '#' + math.padZero(math.convert(rgb.r, 10, 16), 2) + //
							math.padZero(math.convert(rgb.g, 10, 16), 2) + //
							math.padZero(math.convert(rgb.b, 10, 16), 2);
						} else {
							var t = config.hold;
							var b = currentStyle == null ? 0 : parseFloat(currentStyle[i].value);
							var c = currentStyle == null ? parseFloat(targetStyle[i].value) : parseFloat(targetStyle[i].value) - parseFloat(currentStyle[i].value);
							var d = config.duration;
							changeValue = effect.fx(t, b, c, d);
							/**
							 * 摇头
							 */
							if (effect.reverse && count % 2 == 1) {
								changeValue = -changeValue;
							}
						}
						resultStyleString += o.prefix + changeValue + o.unit + o.postfix;
					}
					if (resultStyleString.indexOf('rgba') > -1) {
						var _tmp = resultStyleString;
						var a = _tmp.match(/rgba?\s*\((\d+\.?\d*\s*,?)+\s*\)/ig);
						if (a && a.length) {
							$.each(a, function(idx, o) {
								var o1 = o;
								$.each(o.match(/(\d+\.?\d*)/g), function(i, p, ary) {
									o1 = o1.replace(p, parseFloat(p) > 1 ? Math.round(p) : p);
								});
								_tmp = _tmp.replace(o, o1);
							});
						}
						resultStyleString = _tmp;
					}
					changeStyle[cssName] = resultStyleString;
				}
				if (config.hold >= config.duration) {
					applyCss(el, effect.to);
				} else {
					applyCss(el, changeStyle);
				}
			}
			count++;
			if (config.hold >= config.duration) {
				stop(timer);

				if (config.then && typeof (config.then) == 'function') {
					config.then();
				}
			} else if (nowTime) {
				timer = loop(loopFn, config.timeSeg);
				config._realTimer = timer;
			}
		}
		if (typeof config.timer == 'string' && config.timer in timerStore) {
			timerStore[config.timer] = timer;
		} else {
			var key = timerDefaultPrefix + initTimerId;
			timerStore[key] = timer;
			config.timer = key;
		}
		return config;
	}
	function cancel(config) {
		if (config) {
			stop(config._realTimer);
			delete timerStore[config.timer];
		}
	}
	/**
	* 分解css的值，知道哪个是value(数字)，那个是单位
	* @param {String}
	* @private
	*/
	function identifyCssValue(cssStr) {
		if (typeof (cssStr) != "undefined") {
			cssStr = cssStr.toString();
			var a1 = cssStr.match(/([a-z\(,\s]*)([+\-]?\d+\.?\d*|#[\da-f]{6}|#[\da-f]{3})([a-z|%]*)([a-z\)]*)/ig);
			if (a1 != null) {
				var resultStyle = [];
				for (var i = 0; i < a1.length; i++) {
					var a = a1[i].match(/([a-z\(,\s]*)([+\-]?\d+\.?\d*|#[\da-f]{6}|#[\da-f]{3})([a-z|%]*)([a-z\)]*)/i);
					var sty = {
						style : a[0],
						prefix : a[1],
						value : a[2],
						unit : a[3],
						postfix : a[4]
					}
					resultStyle.push(sty);
				}
				return resultStyle;
			}
		}
		return null;
	}
	function applyCss(el, css) {
		var cloneOne = $.mix(css);
		specialAttr.forEach(function(o, idx, a) {
			if (o in css) {
				el[0][o] = cloneOne[o];
				delete cloneOne[o];
			}
		});
		el.css(cloneOne);
	}
	function getCss(el, cssName) {
		var re = '', specail = false;
		specialAttr.forEach(function(o, idx, a) {
			if (o == cssName) {
				re = el[0][o];
				specail = true;
			}
		});
		if (!specail) {
			re = el.css(cssName);
		}
		return re;
	}
	return {
		glide : function(config) {
			var el = $(config.el);
			var wrapper = $('<div></div>');
			el.wrap(wrapper);
			wrapper.css({
				height : '1px',
				overflow : 'hidden'
			});
			/*
			var oldPostion = el.css('position');
			el.css({
				position : 'absolute',
			});
			*/
			wrapper.animate({
				height : el.height()
			}, 'fast', 'ease', function() {
				el.unwrap();
				config.then && config.then();
			});
		},
		upglide : function(config) {
			var el = $(config.el);
			var wrapper = $('<div></div>');
			el.wrap(wrapper);
			wrapper.css({
				height : el.height(),
				overflow : 'hidden'
			});
			/*
			var oldPostion = el.css('position');
			el.css({
				position : 'absolute',
			});
			*/
			wrapper.animate({
				height : 1
			}, 'fast', 'ease', function() {
				el.unwrap();
				config.then && config.then();
			});
		},
		slideToRight : function(config) {
			var el = $(config.el);
			el.css({
				'-webkit-transform' : 'translateX(0)'
			});
			el.animate({
				'-webkit-transform' : 'translateX(' + el.width() + 'px' + ')'
			}, 'fast', 'ease', function() {
				config.then && config.then();
			});
		},
		slideFromRight : function(config) {
			var el = $(config.el);
			el.css({
				'-webkit-transform' : 'translateX(' + el.width() + 'px' + ')'
			});
			el.animate({
				'-webkit-transform' : 'translateX(0)'
			}, 'fast', 'ease', function() {
				config.then && config.then();
			});
		},
		motion : motion,
		Fx : Fx,
		cancel : cancel
	}
})