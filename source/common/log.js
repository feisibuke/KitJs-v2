/**
 * @module log
 * @requires module:service/log
 * @desc 日志模块
 */
define('common/log', [ 'service/s_log' ], function(service) {

	/**
	 * 服务接口
	 * @inner
	 */
	var service = service.send;
	/**
	 * window下挂的日志存储变量
	 * @inner
	 * @memberof module:log
	 */
	var stack = [];
	/**
	 * 日志前缀
	 * @private
	 */
	var PREFIX_LOG = 'LOG';
	var PREFIX_WARN = 'WARN';
	var PREFIX_DEBUG = 'DEBUG';
	var PREFIX_ERROR = 'ERROR';
	var KV_SPLIT_FLAG = '<=>';
	var SPLIT_FLAG = ',';
	var SEPARATOR = '    ';
	/**
	 * @desc info级别的日志记录
	 * @function
	 * @memberof module:log
	 * @param {String|Array} 
	 */
	function info() {
		if (window._debug_ && console && console.log) {
			for (var i = 0; i < arguments.length; i++) {
				console.log(arguments[i]);
			}
		}
		var info = [ PREFIX_LOG, currentTime(), _log.apply(this, arguments) ].join(SEPARATOR);
		stack.push(info);
	}
	/**
	 * @desc 警告级别的日志记录
	 * @function
	 * @memberof module:log
	 * @param {String|Array} 
	 */
	function warn() {
		if (window._debug_ && console && console.warn) {
			for (var i = 0; i < arguments.length; i++) {
				console.warn(arguments[i]);
			}
		}
		var info = [ PREFIX_WARN, currentTime(), _log.apply(this, arguments) ].join(SEPARATOR);
		stack.push(info);
	}
	/**
	 * @desc 调试级别的日志记录
	 * @function
	 * @memberof module:log
	 * @param {String|Array} 
	 */
	function debug() {
		if (window._debug_ && console && console.debug) {
			for (var i = 0; i < arguments.length; i++) {
				console.debug(arguments[i]);
			}
		}
		var info = [ PREFIX_DEBUG, currentTime(), _log.apply(this, arguments) ].join(SEPARATOR);
		stack.push(info);
	}
	/**
	 * @desc 错误级别的日志记录
	 * @function
	 * @memberof module:log
	 * @param {String|Array} 
	 */
	function error() {
		if (window._debug_ && console && console.error) {
			for (var i = 0; i < arguments.length; i++) {
				//alert(arguments[i]);
				console.error(arguments[i].stack || arguments[i]);
			}
		}
		if (window._debug_ && alert) {
			try {
				var m = [];
				for (var i = 0; i < arguments.length; i++) {
					//alert(typeof arguments[i].stack);
					m.push((arguments[i].stack ? (typeof arguments[i].stack == 'string' ? arguments[i].stack : JSON.stringify(arguments[i].stack)) + '\r\n\r\n\r\n' + arguments[i].message : '') || arguments[i].message || (typeof arguments[i] == 'string' ? arguments[i] : JSON.stringify(arguments[i])));
				}
				alert(m.join(''));
			} catch (e) {
				for (var i = 0; i < arguments.length; i++) {
					alert(arguments[i].stack || arguments[i]);
				}
			}
		}
		var info = [ PREFIX_ERROR, currentTime(), _log.apply(this, arguments) ].join(SEPARATOR);
		stack.push(info);
		//sendReport();
	}
	/**
	 * 日志公用方法
	 * @private
	 */
	function _log() {
		var a = [];
		for (var i = 0; i < arguments.length; i++) {
			try {
				if (arguments[i] == null) {
					if (arguments[i] === null) {
						a.push('NULL');
					} else {
						a.push('UNDEFINED');
					}
				} else {
					a.push(typeof arguments[i] == 'object' ? JSON.stringify(arguments[i].stack || arguments[i]) : arguments[i]);
				}
			} catch (e) {
				a.push(e);
			}
		}
		return a.join(SPLIT_FLAG);
	}
	/**
	 * 当前时间
	 * @private
	 */
	function currentTime() {
		return new Date().toString('yyyy-MM-dd hh:mm:ss');
	}
	/**
	 * @desc 收集日记
	 * @memberof module:log
	 * @alias report
	 * @function
	 * @param {Integer} level 0表示info，1表示debug，2表示warn，3表示error级别
	 * @return {String} 返回日志文本
	 */
	function collectReport(level) {
		//根据级别筛选
		var report = [];
		switch (level) {
		case 0://info
			report = stack;
			break;
		case 1://debug
			report = stack.filter(function(item) {
				return item.indexOf(PREFIX_DEBUG) == 0 || item.indexOf(PREFIX_WARN) == 0 || item.indexOf(PREFIX_ERROR) == 0
			});
			break;
		case 2://warn
			report = stack.filter(function(item) {
				return item.indexOf(PREFIX_WARN) == 0 || item.indexOf(PREFIX_ERROR) == 0
			});
			break;
		case 3://error
			report = stack.filter(function(item) {
				return item.indexOf(PREFIX_ERROR) == 0
			});
			break;
		default:
			report = stack;
			break;
		}
		return report.join('\n');
	}
	/**
	 * @desc 发送报告到cgi
	 * @memberof module:log
	 * @alias send
	 * @function
	 * @param {Integer} level 0表示info，1表示debug，2表示warn，3表示error级别
	 */
	function sendReport(level) {
		if (window.__DEFAULT_LOG_LEVEL__ != null && window._DEFAULT_LOG_LEVEL_.toString().length) {
			leval = parseInt(__DEFAULT_LOG_LEVEL__);
		} else {
			leval = 1;
		}
		level == window._DEFAULT_LOG_LEVEL_ || 1;
		var cgi = service.url;
		//ajax
		track = new XMLHttpRequest();
		window._track = track;
		track.addEventListener('readystatechange', function() {
			if (track.readyState == 1) {
				//console.log('log='+result);
				//stack = [];
			}
		})

		//发送请求
		var result = encodeURIComponent(collectReport(level));
		//console.log(collectReport(level));
		track.open('POST', cgi);
		track.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		//track.setRequestHeader("Content-Type","multipart/form-data");
		track.send('log= ' + result);
		//track.send('log=hello');

		//发送报告
	}
	//
	//
	/**
	 * @desc 美化对于json的打印，对于,加上换行符
	 * @memberof module:log
	 * @param {Object}
	 * @return {String}
	 */
	function beautiful(json) {
		var print = [];
		for ( var row in json) {
			print.push(row + ' : ' + (typeof json[row] == 'string' ? json[row] : JSON.stringify(json[row])));
		}
		return print.join('\r\n');
	}

	return (function() {
		if (location.hash == '#debug') {
			try {
				localStorage.setItem('_debug_', '1');
			} catch (e) {
				//
			}
			window._debug_ = true;

		} else if (location.hash == '#nodebug') {
			try {
				localStorage.removeItem('_debug_');
			} catch (e) {
				//
			}
			window._debug_ = false;
		}
		try {
			if (localStorage.getItem('_debug_') == '1') {
				window._debug_ = true;
			}
		} catch (e) {
		}
		try {
			if (window._debug_) {
				require([ 'common/debugWindow' ], function(debugWin) {
					debugWin.show();
				});
			}
		} catch (e) {
		}
		/**
		 * 给日期原型加上toString
		 */
		Date.prototype.toString = function() {
			var args = {
				"d" : 'getDate',
				"h" : 'getHours',
				"m" : 'getMinutes',
				"s" : 'getSeconds'
			}, rDate = /(yy|M|d|h|m|s)\1?/g, toString = Date.prototype.toString;

			return function(format) {
				var me = this;

				if (!format)
					return toString.call(me);

				return format.replace(rDate, function replace(key, reg) {
					var l = key != reg, t;
					switch (reg) {
					case 'yy':
						t = me.getFullYear();
						return l && t || (t % 100);
					case 'M':
						t = me.getMonth() + 1;
						break;
					default:
						t = me[args[reg]]();
					}
					return l && t <= 9 && ("0" + t) || t;
				});
			}
		}()
		return (
		/**
		 * @lends module:log
		 */
		{
			info : info,
			log : info,
			warn : warn,
			debug : debug,
			error : error,
			report : collectReport,
			send : sendReport,
			beautiful : beautiful
		})
	})()
})