define([ 'common', 'controller/a_baseAction' ],//
function($, ACTION) {
	var magnetDone = true, magnetLock = false;
	ACTION.bind('magnetAdsorb', function(ev) {
		if (!magnetLock) {
			magnetLock = true;
			var c = $(ev.fourDirection.scrollYDom);
			var a = $('.J_magnetBlock');
			var nextOne, nextIndex;
			$.each(a, function(i, o) {
				if (c[0].compareDocumentPosition(o) == 4) {
					nextOne = o;
					nextIndex = i;
					return false;
				}
			});
			if (nextOne) {
				var s = $('.J_magnetStop', c).eq(nextIndex);
				s.append(nextOne);
				s.show();
				if (nextIndex == 0) {
					ACTION.fireEvent({
						type : 'productModel'
					});
				} else if (nextIndex == 1) {
					ACTION.fireEvent({
						type : 'productDetail'
					});
				} else if (nextIndex == 2) {
					ACTION.fireEvent({
						type : 'productComment'
					});
				}
				magnetDone = true;
			}
			setTimeout(function() {
				magnetLock = false;
			}, 1000);
		}
	})
	ACTION.bind('magnetReset', function(ev) {
		if (magnetDone) {
			$('.J_magnetBlock').each(function(i, o) {
				var p = $(o);
				if (p.attr('data-magnetKeep') == 'temp') {
					p.parents('.J_magnetStop').eq(0).hide();
					p.appendTo($(p.attr('data-magnetBed')));

				}
			})
			magnetDone = false;
		}
	})
	ACTION.bind('magnetAdsorbAll', function() {
		var c = $(ev.fourDirection.scrollYDom);
		var a = $('.J_magnetBlock');
		var nextOne, nextIndex;
		$.each(a, function(i, o) {
			if (c[0].compareDocumentPosition(o) == 4) {
				nextOne = o;
				nextIndex = i;
				if (nextOne) {
					var s = $('.J_magnetStop', c).eq(nextIndex);
					s.append(nextOne);
					s.show();
					if (nextIndex == 0) {
						ACTION.fireEvent({
							type : 'productModel'
						});
					} else if (nextIndex == 1) {
						ACTION.fireEvent({
							type : 'productDetail'
						});
					} else if (nextIndex == 2) {
						ACTION.fireEvent({
							type : 'productComment'
						});
					}
				}

			}
		});
	})
});