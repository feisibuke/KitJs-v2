/**
 * 在worker里面self指向的就是WorkerGlobalScope Object
 * http://msdn.microsoft.com/en-us/library/windows/apps/hh453270.aspx
 */
var $ENV = {};
function define(name, deps, fn) {
	if (arguments.length == 2) {
		fn = deps;
		deps = [];
	}
	self._Moudle_Store_ = self._Moudle_Store_ || {};
	self._Moudle_Store_[name] = fn.apply(fn, deps.map(function(o) {
		return self._Moudle_Store_[o]
	}));
}
function require(deps, fn) {
	if (arguments.length == 1) {
		fn = deps;
		deps = [];
	}
	fn.apply(fn, deps.map(function(o) {
		return self._Moudle_Store_[o]
	}));
}
function merge() {
	for (var i = 1; i < arguments.length; i++) {
		if (arguments[i] != null) {
			for ( var p in arguments[i]) {
				arguments[0][p] = arguments[i][p];
			}
		}
	}
}
require([ 'widget/tplFn', 'common/makeUrl', 'widget/mustache' ], function(tplFn, makeUrl, undefined) {
	var me = this;
	me.tplFn = tplFn;
	/*
	 * 给tplFn挂上特别的方法
	 */
	tplFn.makeUrl = makeUrl;
	tplFn.thread = 1;
	/**
	 * 注册回调函数
	 */
	self.onmessage = function(message) {
		var data = message.data;
		//模板渲染
		if (data.cmd && data.cmd == 'tpl') {
			if (data.data) {
				self._DataCache_ = data.data;
				if (data.data._$ENV) {
					merge($ENV, data.data._$ENV);
				}
			} else {
				data.data = self._DataCache_;
			}
			var re = Mustache.render(data.tpl, data.data);
			if (data.tpl.indexOf('{%') > -1 && data.data != null) {
				re = me.tplFn.jtpl(re, data.data);
			}
			self.postMessage({
				id : data.id,
				result : re,
				mission : data.mission,
				step : $ENV.step
			});
		}
	}
})