self.GLOBAL_CONFIG = {
	baseUrl : '/touch_v2/source/',
	version : 2013122301,
	workerVersion : 2013122301,
	cacheCanUse : false,
	cacheTotalLimit : 40,
	expires : 60 * 60 * 2
}
require.config({
	waitSeconds : 2000,
	baseUrl : GLOBAL_CONFIG.baseUrl,
	paths : {

	},
	urlArgs : 'version=' + GLOBAL_CONFIG.version
});