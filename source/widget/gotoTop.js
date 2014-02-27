define('widget/gotoTop', [ 'common', 'widget/fx' ], function($, fx) {
	function goTop() {
		fx.motion({
			effects : [ {
				el : $(document.body),
				from : {
					scrollTop : $(window).scrollTop()
				},
				to : {
					scrollTop : 0
				}
			} ],
			duration : 300,
			fx : 'easeOutQuad',
			then : function() {

			}
		})
	}
	/*
	goTop = (function() {
	function goTop(a, time) {
		a = a || 1;
		time = time || 16;
		var x1 = x2 = x3 = y1 = y2 = y3 = 0;
		if (document.documentElement) {
			x1 = document.documentElement.scrollLeft || 0;
			y1 = document.documentElement.scrollTop || 0;
		}
		if (document.body) {
			x2 = document.body.scrollLeft || 0;
			y2 = document.body.scrollTop || 0;
		}
		var x3 = window.scrollX || 0;
		var y3 = window.scrollY || 0;
		var x = Math.max(x1, Math.max(x2, x3));
		var y = Math.max(y1, Math.max(y2, y3));
		var speed = 1 + a;
		window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
		if (x > 0 || y > 0) {
			var invokeFunction = "goTop(" + a + ", " + time + ")";
			window.setTimeout(invokeFunction, time);
		}
	}
	return goTop;
	})();
	*/
	function init() {
		$('.goTop').click(function() {
			goTop();
		});
	}
	return {
		init : init,
		goTop : goTop
	}
})