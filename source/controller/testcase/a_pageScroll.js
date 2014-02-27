define([ 'common', 'controller/a_baseAction', 'widget/4Direction', 'widget/orientation' ],//
function($, ACTION, FourDirection, orientation, hashTool) {
	var fourDirection = new FourDirection({
		wrapper : $('div.J_scrollWrapper')
	});
	ACTION.share({
		fourDirection : fourDirection
	})
	ACTION.bind('pageScroll', function(e) {
		fourDirection.init();
		fourDirection.bind('moveTab', function(e) {
			if ($('.J_tabNav .current').index() != e.tabIndex) {
				$('.J_tabNav .current').removeClass('current');
				$('.J_tabNav li').eq(e.tabIndex).addClass('current');
			}
			/*
			 * if (e.tabIndex == 0) { ACTION.fireEvent({ type : 'productInfo' }); } else if (e.tabIndex == 1) { ACTION.fireEvent({ type : 'productModel' });
			 *  } else if (e.tabIndex == 3) { ACTION.fireEvent({ type : 'productComment' }); } else if (e.tabIndex == 2) { ACTION.fireEvent({ type : 'productDetail' }); }
			 */
			if (e.tabIndex == 0) {
				ACTION.fireEvent({
					type : 'productInfo'
				});
			} else if (e.tabIndex == 1) {
				ACTION.fireEvent({
					type : 'productComment'
				});
			}
		})
		/*
		 * fourDirection.bind([ 'scrollY', 'scrollAccelerationYEnd' ], function(e) { var me = this; if (me.scrollYDomIndex == 2) { ACTION.fireEvent('productDetailScrollY'); } }); fourDirection.bind('scrollAccelerationYStart', function(e) { var me = this; if (me.scrollYDomIndex == 2) {
		 * ACTION.fireEvent('productDetailScrollAccelerationYStart'); } });
		 */
		fourDirection.bind('overLeftEnd', function() {
			ACTION.fireEvent('scrollOverLeftEnd');
		})
		fourDirection.bind('scrollY', function() {
			if (fourDirection.movedDistance.y < 0 && (fourDirection.startPos.y < fourDirection.nowPos.y)) {
				$('.J_bottomBtn_goTop').show();
			} else {
				$('.J_bottomBtn_goTop').hide();
			}
		});
		fourDirection.bind('scrollYEnd', function() {
			if (fourDirection.movedDistance.y >= 0) {
				$('.J_bottomBtn_goTop').hide();
			}
		});
		/*
		 * fourDirection.bind('overBottomEnd', function(ev) { if (ev.tabIndex + 1 <= 3) { fourDirection.moveTab(ev.tabIndex + 1); } })
		 */

		fourDirection.bind('overingBottomEnd', function(ev) {
			ACTION.fireEvent('magnetAdsorb');
		})
		var magnetReset = false;
		fourDirection.bind('scrollX', function(ev) {
			if (!magnetReset) {
				ACTION.fireEvent('magnetReset');
				magnetReset = true;
			}
		});
		fourDirection.bind('touchEnd', function(ev) {
			magnetReset = false;

		});

		fourDirection.bind('moveTab', function(ev) {
			if (fourDirection.scrollYDomIndex == 0) {
				ACTION.fireEvent('magnetAdsorb');
			}
		});

		/**
		 * pageScroll
		 */
		function fixScroll() {
			var h = document.documentElement.clientHeight - parseFloat($('.J_scrollWrapper').css('padding-top'));
			$('.J_scrollWrapper').css({
				height : h
			});
			fourDirection.resetPosition();
		}
		fixScroll();
		// $(window).bind('resize', fixScroll)
		orientation.watch(fixScroll);
		ACTION.bind('fixScroll', function() {
			fixScroll();
		})
		//
		$('.J_tabNav').click(function(e) {
			var li = $(e.target);
			if (!li.is('li')) {
				li = li.parent('li').eq(0);
			}
			$('.J_tabNav .current').removeClass('current');
			li.addClass('current');
			if (li.index() != 0) {
				ACTION.fireEvent('magnetReset');
			}
			fourDirection && fourDirection.moveTab(li.index());
			/*
			 * if (magnetDone) { $('.J_magnetBlock').each(function(i, o) { var p = $(o); p.appendTo($(p.attr('data-magnetBed'))); }) magnetDone = false; }
			 */
		});
		ACTION.unbind('pageScroll');

	});
	/*
	 * ACTION.bind('scrollOverLeftEnd', function(ev) { if (ev.backUrl) { location.href = ev.backUrl; } else { history.back(); } })
	 */
})