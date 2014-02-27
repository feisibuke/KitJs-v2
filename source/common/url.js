/**
 * url tool
 */
define('common/url', function() {
	function Url(url) {
		this._fields = {
			'Username' : 4,
			'Password' : 5,
			'Port' : 7,
			'Protocol' : 2,
			'Host' : 6,
			'Pathname' : 8,
			'URL' : 0,
			'Querystring' : 9,
			'Fragment' : 10
		};
		this._values = {};
		this._regex = null;
		this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

		for ( var f in this._fields) {
			this['get' + f] = this._makeGetter(f);
			if (typeof url != 'undefined') {
				this.parse(url);
			}
		}
	}
	Url.prototype = {
		/**
		 * 通过解析url，返回包含用户名，密码，端口，协议，路径名，请求参数的map对象
		 * @param {String}
		 * @return {Map}
		 */
		parse : function(url) {
			this.url = url;
			for ( var f in this._fields) {
				this._values[f] = '';
			}
			var r = this._regex.exec(url);
			if (!r)
				throw "URLParser::_parse -> Invalid URL"
			for ( var f in this._fields)
				if (typeof r[this._fields[f]] != 'undefined') {
					this._values[f] = r[this._fields[f]];
				}
			if (this._values['Querystring'].length) {
				var queryString = this._values['Querystring'];
				var params = {};
				var a = queryString.split('&');
				for (var i = 0; i < a.length; i++) {
					var o = a[i];
					var a1 = o.split('=');
					var k = a1[0];
					var v = decodeURIComponent(a1[1]);
					if (k in params) {
						if (/array/i.test(Object.prototype.toString.call(params[k]))) {
							//
						} else {
							var old = params[k];
							params[k] = [];
							params[k].push(old);
						}
						params[k].push(v);
					} else {
						params[k] = v;
					}
				}
				this._values.Params = params;
			}
			return this._values;
		},
		_makeGetter : function(field) {
			this.refresh();
			return function() {
				return this._values[field];
			}
		},
		getParam : function(key) {
			this.refresh();
			var re = this.getParamObject(key);
			return /array/i.test(Object.prototype.toString.call(re)) ? re[re.length - 1] : re;
		},
		getParamObject : function(key) {
			this.refresh();
			if (this._values.Params) {
				/*
				return this._values.Params[key] ? (/array/i.test(Object.prototype.toString.call(this._values.Params[key])) ? this._values.Params[key].map(function(o) {
					return decodeURIComponent(o);
				}) : decodeURIComponent(this._values.Params[key])) : this._values.Params[key];
				*/
				return this._values.Params[key];
			}
			return null;
		},
		getHash : function() {
			this.refresh();
			return location.hash;
		},
		setHash : function(hash) {
			this.refresh();
			if (("pushState" in history) && (hash == '' || hash == null || (hash.length && hash.trim() == ''))) {
				history.pushState('', document.title, location.pathname + location.search);
			} else {
				location.hash = hash;
			}
		},
		replaceHash : function(hash) {
			this.refresh();
			if ("replaceState" in history) {
				history.replaceState('', document.title, location.pathname + location.search + (hash == '' ? '' : '#' + hash));
			} else {
				location.hash = hash;
			}
		},
		getDomainUrl : function() {
			this.refresh();
			return this.getProtocol() + "://" + this.getHost();
		},
		getTouchBaseUrl : function() {
			this.refresh();
			return this.getDomainUrl() + '/t/';
		},
		refresh : function() {
			if (this.url != location.href) {
				this.parse(location.href);
			}
		},
		redirect : function(url) {
			setTimeout(function() {
				location.href = url;
			}, 0);
		}
	}
	return new Url(location.href);
})