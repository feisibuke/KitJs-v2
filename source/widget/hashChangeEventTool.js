define('widget/hashChangeEventTool', [ 'common' ], function($) {
	var map = {};
	var lastHash;
	var DEFAULT = 'DEFAULT';
	var fieldTime = '_';
	/**
	 * 注册hash事件
	 */
	function regist(key, fn) {
		map[key] = {
			fn : fn
		};
	}
	/**
	 * 给指定key的hash事件传递json对象
	 */
	function setData(key, data) {
		if (map[key]) {
			map[key].data = data;
		}
	}
	/**
	 * 获取指定key的hash事件的json对象
	 */
	function getData(key) {
		if (map[key]) {
			return map[key].data;
		}
		return undefined;
	}
	/**
	 * 删除指定key的hash事件
	 */
	function cancel(key) {
		delete map[key];
	}
	/**
	 * 是否存在
	 */
	function has(key) {
		return key in map;
	}
	/**
	 * 执行指定key的hash事件
	 */
	function excute(key, data) {
		if (map[key]) {
			var fn = map[key].fn;
			if (typeof (fn) == 'function') {
				fn($.mix(map[key].data, data));
			}
		}
	}
	/**
	 * 解析hash的key和data
	 */
	function parse(hash) {
		var key = decodeURIComponent(hash.indexOf('#') == 0 ? hash.substring(1) : hash);
		var json, data;
		if (key.indexOf('(') > 0 && key.indexOf(')') > 0) {
			json = key.match(/\(([^\(\)]+)\)/)[1];
			key = key.substring(0, key.indexOf('('));
			data = $.parseJSON(json);
		}
		return {
			key : key,
			data : data
		}
	}
	/**
	 * 应用新的hash
	 */
	function changeHash(hash) {
		var h = parse(hash);
		var key = h.key, data = h.data;
		if (map[key]) {
			lastHash = location.hash.indexOf('#') == 0 ? location.hash.substring(1) : location.hash;
			$.url.setHash((encodeURIComponent(refreshTime(hash))));
		} else {
			return;
		}
	}
	/**
	 * 获取上一次的hash
	 */
	function getLastHash() {
		return lastHash;
	}
	/**
	 * 判断hash是否改变
	 */
	function isHashChange() {
		if (lastHash == location.hash.substring(1)) {
			return false;
		}
		return true;
	}
	/**
	 * 更新hash上的data的时间
	 */
	function refreshTime(hash) {
		var h = parse(hash || location.hash);
		return stringify(h.key, $.mix(h.data, (function() {
			var re = {};
			re[fieldTime] = +new Date();
			return re;
		})()));
	}
	/**
	 * 序列化
	 */
	function stringify(hash, data) {
		return hash + '(' + JSON.stringify(data) + ')';
	}
	/**
	 * 注册hashchange统一事件
	 */
	window.addEventListener('hashchange', function() {
		if (location.hash) {
			var hash = location.hash;
		} else {

			var hash = ''
		}
		var h = parse(hash);
		var key = h.key, data = h.data;
		key = key || DEFAULT;
		$.log(map, '显示所有的hashChangeEvent已经注册的');
		if (map[key]) {
			var fn = map[key].fn;
			if (typeof (fn) == 'function') {
				fn($.mix(map[key].data, data));
			}
		}
	}, false);
	//
	return {
		DEFAULT : DEFAULT,
		regist : regist,
		setData : setData,
		getData : getData,
		cancel : cancel,
		has : has,
		excute : excute,
		changeHash : changeHash,
		getLastHash : getLastHash,
		isHashChange : isHashChange,
		parse : parse,
		refreshTime : refreshTime,
		stringify : stringify
	}
})