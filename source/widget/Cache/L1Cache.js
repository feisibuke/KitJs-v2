define('widget/Cache/L1Cache', [ 'common', 'widget/Cache/Cache' ], function($, Cache) {
	var L1Cache = $.inherit(Cache);
	$.merge(L1Cache.prototype, {
		constructor : function(config) {
			this.config = $.mix({
				maxSize : 10
			}, config)
			L1Cache.superClass.apply(this);
			this.hotUsed = []
		},
		load : function(k) {
			L1Cache.superClass.prototype.get.call(this);
			this.hotUsed[k].used++;
			this.hotUsed[k].updateTime = Date.now();
		},
		save : function(k, v) {
			if (this.has(k)) {
				L1Cache.superClass.prototype.set.call(this);
				this.hotUsed[k].updateTime = Date.now();
			} else {
				if (this.size >= this.config.maxSize) {
					var a = [];
					for ( var k in this.hotUsed) {
						a.push({
							k : k,
							used : this.hotUsed[k].used,
							updateTime : this.hotUsed[k].updateTime
						});
					}
					a.sort(function(a, b) {
						return (a.used - b.used) || (a.updateTime - b.updateTime);
					});
					var delAry = a.splice(0, (this.size - this.config.maxSize + 1));
					for (var i = 0; i < delAry.length; i++) {
						delete this.store[delAry[i].k];
						this.size--;
					}
				}
				L1Cache.superClass.prototype.set.call(this);
				this.hotUsed[k] = {
					used : 0,
					updateTime : Date.now()
				}
			}
		},
		isFull : function() {
			return this.size >= this.config.maxSize
		}
	})
	return L1Cache;
})