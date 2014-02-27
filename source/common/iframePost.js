/**
 * @module iframePost
 */
define('common/iframePost', function() {
	return (
	/**
	 * @desc 用于基于iframePost+document.domain方式跨域post提交，当然也可以get
	 * @constructor module:iframePost
	 * @function
	 * @param {String|MixedUrl} url 请求的url或者一个url json对象
	 * @param {Map|Function} data form的map对象或者一个mixed对象，当请求只有两个参数的，即第一个参数是Mixed Url对象时，第二个参数即回调
	 * @param {Function} [callback] 回调 
	 */
	function(url, data, callback) {
		var requestType = 'post', charset;
		try {
			var a = location.host.split('.');
			var n = a.length - 1;
			document.domain = a[n - 1] + '.' + a[n];
		} catch (e) {
		}
		switch (arguments.length) {
		case 1:
			data = {};
			break;
		case 2:
			if (typeof data == 'function' && typeof url == 'string') {
				callback = data;
				data = {};
			} else if (typeof url == 'object') {
				charset = url.urlEncodeCharset;
				if (typeof data == 'function') {
					callback = data;
				}
				if (url.method == 'get') {
					requestType = 'get';
					data = url.getData;
					url = url.originUrl;
				} else {
					data = url.postData || {};
					url = url.url;
				}
			}
			break;
		/*
		case 3:
		if (typeof url == 'string') {
			if (typeof data == 'function') {
				charset = callback;
				callback = data;
				data = {};
			} else if (typeof callback != 'function') {
				charset = callback;
				callback = null;
			}
		} else if (typeof url == 'object') {
			charset = callback;
			callback = data;
			if (url.method == 'get') {
				requestType = 'get';
				data = url.getData;
				url = url.originUrl;
			} else {
				data = url.postData || {};
				url = url.url;
			}
		}
		break;
		*/
		default:
			charset = data.urlEncodeCharset;
		}
		window._iframePost_iframe_pIndex = (window._iframePost_iframe_pIndex || 0) + 1;
		//
		var iframe = document.createElement('iframe');
		iframe.name = "pIframe_" + window._iframePost_iframe_pIndex;
		iframe.style.display = "none";
		iframe.width = "0";
		iframe.height = "0";
		iframe.scrolling = "no";
		iframe.allowtransparency = "true";
		iframe.frameborder = "0";
		iframe.src = "about:blank";
		document.body.appendChild(iframe);
		//
		var _timeout = setTimeout(function() {
			clearTimeout(_timeout);
			if (typeof callback == 'function') {
				callback({
					errno : 'TIMEOUT'
				})
			}
			delete iframe.callback;
			form.parentNode.removeChild(form);
			try {
				iframe.parentNode.removeChild(iframe);
			} catch (e) {
			}
			iframe = form = null;
		}, 10000);
		iframe.callback = function(o) {
			clearTimeout(_timeout);
			if (typeof callback == 'function') {
				callback(o);
			}
			//iframe.src = 'about:blank';
			form.parentNode.removeChild(form);
			iframe.parentNode.removeChild(iframe);
			iframe = form = null;
		};
		//iframe.addEventListener('load', function() {
		//iframe.removeEventListener('load', arguments.callee, false);
		var form = document.createElement('form');
		form.style.display = 'none';
		form.method = requestType;
		form.target = 'pIframe_' + window._iframePost_iframe_pIndex;
		for ( var k in data) {
			var v = data[k];
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = k;
			input.value = v;
			form.appendChild(input);
		}
		if (requestType == 'post') {
			if (!/(\?|&(amp;)?)fmt=[^0 &]+/.test(url)) {
				url += (url.indexOf('?') > 0 ? '&' : '?') + 'fmt=1';
			}
		} else {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'fmt';
			input.value = 1;
			form.appendChild(input);
		}
		form.action = url;
		if (charset) {
			form.acceptCharset = charset;
		}
		document.body.appendChild(form);
		//

		form.submit();
		//}, false);
	})
})