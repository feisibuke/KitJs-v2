/*
 * @author gangzhao
 * @modify by addison 2013/07/24
 * @modify by addison 2013/12/3 添加mediaquery方式直接css触发
 */
define('widget/orientation', [ 'common' ], function($) {
	var watchFnArray = [];
	var currentOrientation = !window.orientation ? 'portrait' : 'landscape';
	function watch(fn) {
		if (typeof (fn) == 'function') {
			watchFnArray.push(fn);
		}
	}
	function cancel(fn) {
		var newArray = [];
		for (var i = 0; i < watchFnArray; i++) {
			if (watchFnArray[i] == fn) {
				//
			} else {
				newArray.push(watchFnArray[i]);
			}
		}
		watchFnArray = newArray;
	}
	if ($('.J_ScanOrientation').length) {
		var oldValue = $('.J_ScanOrientation').css('text-align');
		$('.J_ScanOrientation').bind("resize", function(e) {
			try {
				var newValue = $('.J_ScanOrientation').css('text-align');
				if (oldValue != newValue) {
					oldValue = newValue;
					if (oldValue == 'left') {
						currentOrientation = 'portrait';//竖排
					} else {
						currentOrientation = 'landscape';//横排
					}
					exec();
				}
			} catch (e) {
				Logger.error(e);
				throw e;
			}
		}, false);
	} else {
		var interval, oldWidth = $(window).width();
		window.addEventListener("orientationchange", function() {
			try {
				clearInterval(interval);
				interval = setInterval(function() {
					try {
						if (oldWidth != $(window).width()) {
							clearInterval(interval);
							oldWidth = $(window).width();
							if (currentOrientation == 'portrait') {
								currentOrientation = 'landscape';
							} else {
								currentOrientation = 'portrait';
							}
							exec();
						}
					} catch (e) {
						Logger.error(e);
						throw e;
					}
				}, 300);
			} catch (e) {
				Logger.error(e);
				throw e;
			}
		}, false);
	}
	function exec() {
		for (var i = 0; i < watchFnArray.length; i++) {
			try {
				watchFnArray[i]();
			} catch (e) {
				Logger.error(e);
			}
		}
	}
	function nowOrientation() {
		return currentOrientation;
	}
	return {
		watch : watch,
		cancel : cancel,
		nowOrientation : nowOrientation
	}
})