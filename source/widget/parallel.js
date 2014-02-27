/**
 * 并发队列，统一回调
 */
define('common/parallel', function() {
	return {
		/**
		 * 保证请求可以并行执行
		 */
		callbackOnce : function(methodArray, callback) {
			window._count_ = 0;
			$.log(methodArray);
			methodArray.forEach(function(o) {
				$.log(o);
				o(function() {
					window._count_++;
				});
			});
			if (window._count_ == methodArray.length) {
				delete window._count_;
				callback && callback();
			}
		}
	}
});