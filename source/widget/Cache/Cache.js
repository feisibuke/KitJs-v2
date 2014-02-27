define('widget/Cache/Cache', function() {
	function Cache() {
		this.store = {};
		this.size = 0;
	}
	Cache.prototype = {
		load : function(k) {
			return this.store[k];
		},
		save : function(k, v) {
			if (!this.has(k)) {
				this.size++;
			}
			this.store[k] = v;

		},
		has : function(k) {
			return k in this.store;
		},
		del : function(k) {
			if (this.has(k)) {
				this.size--;
				delete this.store[k];
			}
		}
	}
	return Cache;
})