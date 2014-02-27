define('widget/Cache/L2Cache', [ 'common', 'widget/Cache/Cache' ], function($, Cache) {
	var L2Cache = $.inherit(Cache);
	$.merge(L2Cache.prototype, {
		constructor : function(config) {
			this.config = $.mix({
				maxSize : GLOBAL_CONFIG.cacheTotalLimit || 40,
				localStorageKeyPrefix : 'L2Cache_',
				localStorageKey_storeMap : 'MAP_L2Cache',
				expires : GLOBAL_CONFIG.expires || 60 * 60 * 2
			}, config);
			L2Cache.superClass.apply(this);
			this.hotUsed = {}
			try {
				var o = localStorage.getItem(this.config.localStorageKey_storeMap);
				if (o != null) {
					var backup = JSON.parse(o);
					if (backup) {
						this.size = backup.size;
						this.store = backup.store;
						this.hotUsed = backup.hotUsed;
					}
				} else {
					this.size = 0;
					this.store = {};
					this.hotUsed = {};
				}
			} catch (e) {
				//Logger.error(e);
				this.size = 0;
				this.store = {};
				this.hotUsed = {};
			}

		},
		CONSTANTS : {
			STORE_TYPE_VARIABLE : 1,
			STORE_TYPE_CURRENT_LOCALSTORAGE : 2,
			LOCALSTORAGE_KEY : 'lsk',
			EXPIRES_TIME : 'ep',
			STORE_TYPE : 'st'
		},
		load : function(k, then) {
			if (!GLOBAL_CONFIG.cacheCanUse) {
				typeof (then) == 'function' && then.call(this, null);
				return null;
			} else {
				var me = this, v = null;
				try {
					me.refreshStatus();
					if (me.has(k)) {
						var map = me.store[k];
						if (map[me.CONSTANTS.EXPIRES_TIME] == null) {
							map[me.CONSTANTS.EXPIRES_TIME] = Date.now() + me.config.expires * 1000;
						}
						if (map[me.CONSTANTS.EXPIRES_TIME] && map[me.CONSTANTS.EXPIRES_TIME] >= Date.now()) {
							v = localStorage.getItem(me.config.localStorageKeyPrefix + map[me.CONSTANTS.LOCALSTORAGE_KEY]);
							me.hotUsed[k].used++;
							me.hotUsed[k].updateTime = Date.now();
						} else {
							localStorage.removeItem(me.config.localStorageKeyPrefix + map[me.CONSTANTS.LOCALSTORAGE_KEY]);
							v = null;
							delete me.store[k];
							delete me.hotUsed[k];
							me.size--;
						}
						//
						me.saveStatus();
						typeof (then) == 'function' && then.call(this, v);
					}
				} catch (e) {
					me.reset();
					typeof (then) == 'function' && then.call(this, v);
					Logger.error(e);
				}
				return v;
			}
		},
		save : function(k, v, exp, then) {
			if (!GLOBAL_CONFIG.cacheCanUse) {
				typeof (then) == 'function' && then.call(this, null);
			} else {
				var me = this;
				try {
					me.refreshStatus();
					if (arguments.length <= 3) {
						then = exp;
						exp = me.config.expires;
					}
					if (me.has(k)) {
						var map = me.store[k];
						localStorage.setItem((me.config.localStorageKeyPrefix + map[me.CONSTANTS.LOCALSTORAGE_KEY]), v);
						me.hotUsed[k].updateTime = Date.now();
						if (map.storeType == me.CONSTANTS.STORE_TYPE_VARIABLE) {
							map.value = v;
						}
					} else {
						if (me.size >= me.config.maxSize) {
							var epAry = [];
							var minP;
							for ( var p in me.hotUsed) {
								minP = minP || p;
								if (minP != p) {
									if (me.hotUsed[minP].used > me.hotUsed[p].used) {
										minP = p;
									} else if (me.hotUsed[minP].used == me.hotUsed[p].used && me.hotUsed[minP].updateTime > me.hotUsed[p].updateTime) {
										minP = p;
									}
								}
								if (me.store[p][me.CONSTANTS.EXPIRES_TIME] < Date.now()) {
									epAry.push({
										k : p
									})
								}
							}
							/*
							a.sort(function(a, b) {
								return (a.used - b.used) || (a.updateTime - b.updateTime);
							});
							*/
							var delAry = epAry.length ? epAry : (function() {
								if (minP) {
									epAry.push({
										k : minP
									});
								}
								return epAry;
							})();
							//var delAry = a.splice(0, (me.storeSize() - me.config.maxSize + 1));

							for (var i = 0; i < delAry.length; i++) {
								localStorage.removeItem(me.config.localStorageKeyPrefix + delAry[i].k);
								delete me.store[delAry[i].k];
								delete me.hotUsed[delAry[i].k];
								me.size--;
							}

						}
						me.store[k] = {
							k : k,
							lsk : k,
							ep : Date.now() + exp * 1000
						}
						me.store[k][me.CONSTANTS.STORE_TYPE] = me.CONSTANTS.STORE_TYPE_CURRENT_LOCALSTORAGE;
						localStorage.setItem((me.config.localStorageKeyPrefix + k), v);
						me.size++;
						me.hotUsed[k] = {
							used : 0,
							updateTime : Date.now()
						}
					}
					me.saveStatus();
					typeof (then) == 'function' && then.call(this, true);
				} catch (e) {
					me.reset();
					typeof (then) == 'function' && then.call(this, false);
					Logger.error(e);
				}
			}
		},
		del : function(k, then) {
			if (!GLOBAL_CONFIG.cacheCanUse) {
				typeof (then) == 'function' && then.call(this, null);
			} else {
				var me = this;
				try {
					me.refreshStatus();
					delete me.store[k];
					me.size--;
					localStorage.removeItem(me.config.localStorageKeyPrefix + k);
					me.saveStatus();
					typeof (then) == 'function' && then.call(this, true);
				} catch (e) {
					me.reset();
					typeof (then) == 'function' && then.call(this, false);
					Logger.error(e);
				}
			}
		},
		has : function(k) {
			if (!GLOBAL_CONFIG.cacheCanUse) {
				return false;
			}
			//this.refreshStatus();
			return k in this.store;
		},
		refreshStatus : function() {
			var me = this;
			try {
				var o = localStorage.getItem(me.config.localStorageKey_storeMap);
				if (o != null) {
					var backup = JSON.parse(o);
					if (backup) {
						this.size = backup.size;
						this.store = backup.store;
						this.hotUsed = backup.hotUsed;
					}
				} else {
					this.size = 0;
					this.store = {};
					this.hotUsed = {};
				}
			} catch (e) {
				//Logger.error(e);
			}
		},
		saveStatus : function() {
			var me = this;
			localStorage.setItem(me.config.localStorageKey_storeMap, JSON.stringify({
				store : me.store,
				size : me.size,
				hotUsed : me.hotUsed
			}));
		},
		storeSize : function(n) {
			var me = this;
			var json = localStorage.getItem(me.config.localStorageKey_storeMap);
			if (json != null && json != '') {
				json = JSON.parse(json);
				if (n == null) {
					return json.size;
				} else {
					json.size += n;
					localStorage.setItem(me.config.localStorageKey_storeMap, json);
				}
			}
			return 0;
		},
		reset : function() {
			var me = this;
			me.size = 0;
			me.store = {};
			me.hotUsed = {};
			try {
				localStorage.clear();
			} catch (e) {
				//
			}
		}
	})
	return L2Cache;
})
