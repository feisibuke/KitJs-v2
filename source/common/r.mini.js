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