define('common/makeUrl', function() {
	return function(service, data) {
		data = data || {};
		var search = '', url = service.url, re = {}, getData = {};
		url = service.url.replace(/{{(\w+)}}/ig, function(all, param) {
			return data[param] || '';
		});
		re.method = 'get';
		if (service.urlEncodeCharset) {
			re.urlEncodeCharset = service.urlEncodeCharset;
		}
		if (service.get) {
			for ( var param in service.get) {
				var k = param, v = service.get[param];
				var hide = false;
				if (k.indexOf('!') == 0) {
					k = k.substring(1);
					hide = true;
				}
				if (hide && data[k] == null) {
					//
				} else {
					var _value = getValue(v, k, data);
					getData[k] = _value;

					/*
					if ($.isNull(_value)) {
						delete getData[k];
					} else {
						getData[k] = _value;
					}
					*/
					//getData[k] = _value;
					//getData[k] = getValue(v, k, data);
					search += ((search.length ? '&' : '') + [ k, getData[k] ].join('='));
				}
			}
		}
		//计算已经存在的searchString
		if (url.indexOf('?') > -1) {
			var _existedSearchStr = url.substring(url.indexOf('?') + 1);
			re.originUrl = url.substring(0, url.indexOf('?'));
			for (var i = 0, a = _existedSearchStr.split('&'); i < a.length; i++) {
				var o = a[i].split('='), _k, _v;
				getData[o[0]] = o[1] || '';
			}
		} else {
			re.originUrl = service.url;
		}
		re.getData = getData;
		if (search.length) {
			if (url.indexOf('?') > -1) {
				if (url.indexOf('?') == url.length - 1) {
					url += search;
				} else {
					url += '&' + search;
				}
			} else {
				url += '?' + search;
			}
		}
		re.url = url;
		if (service.post) {
			var postData = {};
			for ( var param in service.post) {
				var hide = false;
				if (param.indexOf('!') == 0) {
					hide = true;
					param = param.substring(1);
				}
				if (hide && data[param] == null) {
					//
				} else {
					var _value = getValue(service.post[param], param, data);
					//postData[param] = getValue(service.post[param], param, data);
					/*
					if ($.isNull(_value)) {
						delete postData[param];
					} else {
						postData[param] = _value;
					}
					*/
					if (service.post[param] == '?' && _value == null && _value == '') {
						//
					} else {
						postData[param] = _value;
					}
				}
			}
			re.method = 'post';
			re.postData = postData
		}
		//
		function getValue(_v, _k, _d) {
			var v1;
			if (_v == '?') {
				if (_d[_k] === 0) {
					v1 = 0;
				} else {
					v1 = _d[_k] || '';
				}
			} else if (typeof _v == 'function') {
				v1 = _v(_d);
			} else {
				if (_d[_k] === 0) {
					v1 = 0;
				} else {
					v1 = _d[_k] || _v;
				}
			}
			return v1;
		}
		//$.log(re, 'MakeUrl之后处理的接口');
		[ 'way', 'dataType' ].forEach(function(attr) {
			if (service[attr]) {
				re[attr] = service[attr];
			}
		})
		return re;
	}
})