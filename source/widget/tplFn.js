define('widget/tplFn', function() {
	var tplFn = {
		//Simple JavaScript Templating
		//John Resig - http://ejohn.org/ - MIT Licensed
		jtpl : (function() {
			var cache = {};
			this.tmpl = function tmpl(str, data) {
				/*
				// Figure out if we're getting a template, or if we need to
				// load the template - and be sure to cache the result.
				var fn = str.length && str in cache ? cache[str] :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).

				new Function("$OBJECT", "var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};" +

				// Introduce the data as local variables using with(){}
				"with($OBJECT){$T=tplFn=this;_p_.push('" +

				// Convert the template into pure JavaScript
				str.split(/({%.+%})/g).map(function(o) {
					if (o.indexOf('{%') == -1) {
						return o.replace(/"([^"']*('[^"']+')+)+[^"']*"/g, function(str) {
							return str.replace(/\'/g, '\\"')
						})
					} else {
						return o;
					}
				}).join('').replace(/[\r\t\n]/g, " ").split("{%").join("\t").replace(/((^|%})[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%}/g, "',$1,'").split("\t").join("');").split("%}").join("_p_.push('").split("\r").join("\\'") + "');}return _p_.join('');");

				// Provide some basic currying to the user
				return data ? fn.call(tplFn, data) : fn;
				*/
				var fn;
				if (str.length && str in cache) {
					fn = cache[str];
				} else {
					var functionString = [//
					"var _p_=[],print=function(){_p_.push.apply(_p_,arguments);};",//
					"with($OBJECT){$T=tplFn=$TPLFN;_p_.push('",//
					(function() {
						var a = str.split(/({%.+%})/g).map(function(o) {
							if (o.indexOf('{%') == -1) {
								return o.replace(/"([^"']*('[^"']+')+)+[^"']*"/g, function(str) {
									return str.replace(/\'/g, '\\"');
								})
							} else {
								return o;
							}
						});
						var b = a.join('').replace(/[\r\t\n]/g, " ");
						b = b.split("{%").join("\t");
						b = b.replace(/((^|%})[^\t]*)'/g, "$1\r");
						b = b.replace(/\t=(.*?)%}/g, "',$1,'");
						b = b.split("\t").join("');").split("%}").join("_p_.push('").split("\r").join("\\'");
						return b;
					})(),//
					"');}return _p_.join('');"//
					].join('');

					fn = new Function("$OBJECT", "$TPLFN", functionString);

					return data ? fn.call(data, data, tplFn) : fn;
				}
			};
			return this.tmpl;
		})(),
		/**
		 * touch版本价格函数，如果是10000，展示为100，如果是12345，展示为123.45，12340，展示为123.40
		 * @param s
		 * @return
		 */
		priceFormat : function(s) {
			if (s / 100 == parseInt(s / 100)) {
				return s / 100;
			} else if (s / 10 == parseInt(s / 10)) {
				return (s / 100).toFixed(1);
			} else {
				return (s / 100).toFixed(2);
			}
		},
		toFixed : function(num, n1) {
			var s = num.toFixed(n1).toString();
			var strAfterDot = s.substr(s.length - n1);
			var strBeforeDot = s.substr(0, s.length - n1);
			var a = strAfterDot.split('');
			while (a[a.length - 1] == '0') {
				a.splice(a.length - 1);
			}
			return strBeforeDot + a.join('');
		},
		step : function(s) {
			if (tplFn.thread == 1) {
				if ($ENV.step[s] % 2 == 0) {
					$ENV.step[s] += 1;
				} else {
					$ENV.step[s] += 2;
				}
			} else {
				if ($ENV.step[s] % 2 == 1) {
					$ENV.step[s] += 1;
				} else {
					$ENV.step[s] += 2;
				}
			}
			return $ENV.step[s];
		},
		/**
		 * 获取CDN上产品图片
		 * @param pCharId 产品product_id
		 * @param type 图片类型，比如pic160
		 * @param picIdx 0为默认图，1,2,3,4等等为子图
		 */
		getPicUrl : function(pCharId, type, picIdx) {
			var parts = pCharId.split("R", 2);
			pCharId = parts[0];
			parts = pCharId.split("-", 3);
			picIdx = picIdx || 0;
			var part1 = parts[0], part2 = parts[1], part3 = parts[2];
			return 'http://img' + (parseInt(part3) % 2 ? '1' : '2') + '.icson.com/product/' + type + '/' + part1 + '/' + part2 + '/' + pCharId + (picIdx == 0 ? '' : ('-' + (picIdx < 10 ? ('0' + picIdx) : picIdx))) + '.jpg';
		},
		/**
		 * 获取小图地址
		 * @param String pCharId 商品编号
		 * @param Integer picIndex 图片序号
		 */
		getSmallUrl : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'small', picIdx);//30
		},
		getSSUrl : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'ss', picIdx);//80
		},
		getMMUrl : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'mm', picIdx);//300
		},
		getMiddleUrl : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'middle', picIdx);//120
		},
		getBigUrl : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'mpic', picIdx);//800
		},
		getPic160Url : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'pic160', picIdx);
		},
		getPic60Url : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'pic60', picIdx);
		},
		getPic200Url : function(pCharId, picIdx) {
			return this.getPicUrl(pCharId, 'pic200', picIdx);
		},
		/**
		 * 测量对象长度
		 */
		size : function(o) {
			if (o.length) {
				return o.length;
			} else if (typeof o == 'object') {
				var count = 0;
				for ( var p in o) {
					count++;
				}
				return count;
			}
			return 1;
		},
		orEmpty : function(o) {
			if (o == null) {
				return '';
			}
			return o;
		},
		formatDate : function(time, format) {
			return new Date(time).toString(format);
		},
		isNull : function(o) {
			return o == null;
		},
		isEmpty : function(o) {
			return o == null || o == '' || (/array/i.test(Object.prototype.toString.call(o)) && o.length == 0) || (typeof (o) == 'object' && (function(o) {
				var i = 0;
				for ( var p in o) {
					i++;
				}
				return i == 0
			})(o))
		},
		/**
		 * 评价1~5
		 */
		pingjia : function(n) {
			if (n <= 1) {
				return '非常不满意';
			} else if (n > 1 && n <= 2) {
				return '不满意';
			} else if (n > 2 && n <= 3) {
				return '一般';
			} else if (n > 3 && n <= 4) {
				return '满意';
			} else if (n > 4) {
				return '非常满意';
			}
		},

		/**
		 * 讨论时间格式化，当天讨论展示hh:mm，非当天讨论展示MM-dd
		 * @param {number} time 讨论发布的unix时间戳
		 * @returns {string} 格式化后的时间字符串
		 */
		formatDiscussionTime : (function() {
			var now = new Date(), today = now.toString('yyyyMMdd');
			return function(time) {
				time = new Date(time * 1000);
				var date = time.toString('yyyyMMdd');
				if (today == date) {
					return time.toString('hh:mm');
				} else {
					return time.toString('MM-dd');
				}
			}
		})()
	}

	//
	return tplFn;
})
