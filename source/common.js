define('common', [ 'common/zepto', 'common/iframePost', 'common/makeUrl', 'common/store', 'common/cookie', 'common/url', 'common/log' ],//
function(undefined, iframePost, makeUrl, store, cookie, url, log) {
	/**
	 * iframe post
	 */
	$.iframePost = iframePost;
	/**
	 * localstorage
	 */
	$.store = store;
	/**
	 * make service url
	 */
	$.makeUrl = makeUrl;
	/**
	 * cookie
	 */
	$.cookie = cookie;
	/**
	 * url util
	 */
	$.url = url;
	//---------------------------------------------------------------------------------------------------
	/**
	 * 集合所有参数生成一个新的集合对象
	 */
	$.mix = function() {
		var re = {};
		for (var i = 0; i < arguments.length; i++) {
			var o = arguments[i];
			for ( var p in o) {
				if (p in re) {
					if (o[p] != undefined) {
						re[p] = o[p];
					}
				} else {
					re[p] = o[p];
				}
			}
		}
		return re;
	}
	/**
	 * 把参数2,3...在参数1存在key的value更新到最新的一个value
	 */
	$.copy = function() {
		if (arguments.length > 0) {
			var re = arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				var o = arguments[i];
				for ( var p in re) {
					if (o[p] != undefined) {
						re[p] = o[p];
					}
				}
			}
			return re;
		}
		return undefined;
	}
	/**
	 * 把参数2,3...的所有不为undefined的key复制到参数1上
	 */
	$.merge = function() {
		if (arguments.length > 0) {
			var re = arguments[0];
			for (var i = 1; i < arguments.length; i++) {
				var o = arguments[i];
				for ( var p in o) {
					if (o[p] != undefined) {
						re[p] = o[p];
					}
				}
			}
			return re;
		}
		return undefined;
	}
	/**
	 * 判断是否为空
	 */
	$.isNull = function(o) {
		return o == undefined || o == null || o == '';
	}
	/**
	 * 节点替换成制定HTML
	 */
	$.replaceHTML = function(element, html) {
		/**
		var range = element.ownerDocument.createRange();
		range.selectNodeContents(element);
		element.parentNode.replaceChild(range.createContextualFragment(html), element);
		range.detach();
		*/
		var div = document.createElement('div');
		div.innerHTML = html;
		for (var i = 0, a = div.childNodes; i < a.length;) {
			if (element.parentNode) {
				element.parentNode.insertBefore(a[0], element);
			}
		}
		div = null;
		element.parentNode.removeChild(element);
	}
	$.insertHTML = function(element, html, pos) {
		var div = document.createElement('div');
		div.innerHTML = html;
		pos = pos || 'after';
		for (var i = 0, a = div.childNodes; i < a.length;) {
			switch (pos.toLowerCase()) {
			case 'before':
				element.parentNode.insertBefore(a[0], element);
				break;
			case 'after':
				if (element.parentNode.lastChild == element) {
					element.parentNode.appendChild(a[a.length - 1]);
				} else {
					element.parentNode.insertBefore(a[a.length - 1], element.nextSibling);
				}
				break;
			}

		}
		div = null;
		//element.parentNode.removeChild(element);
	}
	//$.xsr = $.iframePost;
	$.xsr = function() {
		var headers = {
		//withCredentials : true
		};
		var timeout = 10000;
		switch (arguments.length) {
		case 1:
			//一个参数的时候
			var mixedRequest = arguments[0];
			if (typeof mixedRequest == 'string') {
				$.get(mixedRequest);
			} else if (typeof mixedRequest == 'object') {
				$.ajax({
					url : mixedRequest.url,
					type : mixedRequest.method,
					timeout : mixedRequest.timeout || timeout,
					dataType : mixedRequest.dataType || 'json',
					success : mixedRequest.success,
					error : mixedRequest.error
				});
			} else {
				//
			}
			break;
		case 2:
			//两个参数的时候
			var mixedRequest = arguments[0], callback = arguments[1];
			if (typeof mixedRequest == 'string' && typeof callback == 'function') {
				$.ajax({
					url : mixedRequest,
					type : 'get',
					timeout : timeout,
					dataType : mixedRequest.dataType || 'json',
					success : callback,
					error : function(xhr, type, error) {
						callback({
							errno : type.toUpperCase(),
							errCode : type.toUpperCase()
						});
					}
				});
			} else if (typeof mixedRequest == 'object' && typeof callback == 'function') {
				switch (mixedRequest.way) {
				case 'jsonp':
					$.ajax({
						type : 'get',
						dataType : 'jsonp',
						url : mixedRequest.url,
						headers : headers,
						timeout : timeout,
						success : callback,
						error : function(xhr, type, error) {
							callback({
								errno : type.toUpperCase(),
								errCode : type.toUpperCase()
							});
						}
					});
					break;
				case 'iframePost':
					$.iframePost.apply(this, arguments);
					break;
				case 'script':
					var scriptDom = document.createElement('script');
					if (mixedRequest.urlEncodeCharset) {
						scriptDom.charset = mixedRequest.urlEncodeCharset;
					}
					document.body.appendChild(scriptDom);
					var timeout = setTimeout(function() {
						document.body.removeChild(scriptDom);
					}, 5000);
					scriptDom.onload = function() {
						clearTimeout(timeout);
						try {
							callback();
						} catch (e) {

						} finally {
							document.body.removeChild(scriptDom);
						}
					}
					scriptDom.src = mixedRequest.url;
					break;
				case 'sandboxscript':
					var iframeDom = document.createElement('iframe');
					iframeDom.style.display = 'none';
					document.body.appendChild(iframeDom);
					//
					var scriptDom = document.createElement('script');
					if (mixedRequest.urlEncodeCharset) {
						scriptDom.charset = mixedRequest.urlEncodeCharset;
					}
					iframeDom.contentWindow.document.body.appendChild(scriptDom);
					var timeout = setTimeout(function() {
						iframeDom.contentWindow.document.body.removeChild(scriptDom);
						documen.body.removeChild(iframeDom);
					}, 5000);
					scriptDom.onload = function() {
						clearTimeout(timeout);
						try {
							callback();
						} catch (e) {

						} finally {
							iframeDom.contentWindow.document.body.removeChild(scriptDom);
							documen.body.removeChild(iframeDom);
						}
					}
					scriptDom.src = mixedRequest.url;
					break;
				default:
					if (mixedRequest.urlEncodeCharset) {
						headers['urlEncodeCharset'] = mixedRequest.urlEncodeCharset;
					}
					if (mixedRequest.method == 'get') {
						$.ajax({
							type : 'get',
							url : mixedRequest.url,
							headers : headers,
							timeout : timeout,
							dataType : mixedRequest.dataType || 'json',
							success : callback,
							error : function(xhr, type, error) {
								callback({
									errno : type.toUpperCase(),
									errCode : type.toUpperCase()
								});
							},
							withCredentials : mixedRequest.cookie == false ? false : true
						});
					} else {
						$.ajax({
							url : mixedRequest.url,
							type : 'post',
							data : mixedRequest.postData,
							headers : headers,
							timeout : timeout,
							dataType : mixedRequest.dataType || 'json',
							success : callback,
							error : function(xhr, type, error) {
								callback({
									errno : type.toUpperCase(),
									errCode : type.toUpperCase()
								});
							},
							withCredentials : mixedRequest.cookie == false ? false : true
						});
					}
				}

			} else {
				//$.iframePost.apply(this, arguments);
			}
			break;
		default:
			//三个参数的时候
			$.iframePost.apply(this, arguments);
			/*
			
			*/
		}
	}
	/**
	* 反向each
	*/
	$.reverseEach = function(a, fn) {
		var _a = [];
		$.each(a, function(idx, o) {
			_a.push({
				idx : idx,
				o : o
			});
		})
		_a.reverse();
		$.each(_a, function(idx, o) {
			return fn(o.idx, o.o, a);
		})
	}
	/**
	 * jsonparse
	 */
	$.parseJSON = function(str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			//避免xss漏洞 
			//try {
			//eval('var ___$re$___' + str);
			//return ___$re$___;
			//} catch (e1) {
			//return undefined;
			//}

			return undefined;
		}
	}
	$.log = function(o, title) {
		if (window._debug_) {
			//console.groupCollapsed(title ? '==========' + title + (o ? o : '') + '==========' : o);
			log.info.apply(this, arguments);
			//console.trace();
			//console.groupEnd();
		}
	}
	/**
	 * 继承
	 */
	$.inherit = function(subClass, superClass, config) {
		var subClassNotDefine = false;
		if (typeof (superClass) != 'function') {
			subClassNotDefine = true;
			config = superClass;
			superClass = subClass;
			subClass = function() {
				if (subClass.prototype.constructor != subClass) {
					subClass.prototype.constructor.apply(this, arguments);
				} else {
					subClass.superClass.apply(this, arguments);
				}
			};
		}
		//
		var Agency = new Function();
		Agency.prototype = superClass.prototype;
		subClass.prototype = new Agency();
		//
		subClass.prototype.constructor = subClass;
		subClass.superClass = superClass;
		return subClass;
	}
	window.Logger = log;
	/**
	 * 
	 */
	$.formatToValueType = function(o) {
		var re = {};
		for ( var p in o) {
			if (o[p] != null) {
				re[p] = o[p].toString();
			}
		}
		return re;
	};

	$.groupBy = function(arr, key) {
		var result = {};
		$.each(arr, function(index, item) {
			if (!result[item[key]]) {
				result[item[key]] = [];
			}
			result[item[key]].push(item);
		});
		return result;
	};
	/**
	 * 找到当前iframeWindow对应的parent的iframe节点
	 * @param {Number} deep
	 */
	$.findParentIframeDom = function(deep) {
		deep = deep || 1;
		var parent = window, frame;
		try {
			while (deep--) {
				parent = parent.parent;
			}
			for (var i = 0, a = parent.document.getElementsByTagName('iframe'); i < a.length; i++) {
				if (a[i].contentWindow == window) {
					frame = a[i];
				}
			}
		} catch (e) {
		}
		return frame;
	}
	return $;
})
