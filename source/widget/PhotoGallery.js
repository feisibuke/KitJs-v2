define('widget/PhotoGallery',//
[ 'common', 'widget/HorizontalMoveAndScale', 'widget/mustache', 'widget/orientation', 'widget/Base' ],//
function($, HorizontalMove, mustache, orientation, Base) {
	function PhotoGallery(config) {
		var me = this;
		me.config = $.mix({
			tpl : '<div class="photo_gallery"><div class="J_showNo"><span class="J_currentNum"></span>/<span class="J_totoalNum"></span></div><div class="scroll_wrapper J_scrollX"></div></div>',
			tplItem : '<div class="scroll_item J_scrollY" style="display:table"><div style="display:table-cell;height:100%;vertical-align:middle;"><img class="J_lazyLoadImg" style="display:none" {{#width}}width="{{width}}"{{/width}} {{#height}}height="{{height}}"{{/height}} data-imgSrc="{{url}}" data-imgErrSrc="{{onerrorurl}}"></div>'
		}, config);
		me.buildDom();
		me.initPageScroll();
		me.buildEvent();
	}
	$.inherit(PhotoGallery, Base);
	$.merge(PhotoGallery.prototype, {
		buildDom : function() {
			var me = this;
			me.wrapper = $(me.config.tpl).appendTo(document.body);
			me.containerDom = $('.scroll_wrapper', me.wrapper);
			for (var i = 0; i < me.config.imgs.length; i++) {
				me.containerDom.append($(mustache.render(me.config.tplItem, me.config.imgs[i])));
			}
			$('.J_currentNum', me.wrapper).html('1');
			$('.J_totoalNum', me.wrapper).html(me.config.imgs.length);
			var imgNode = $('.J_scrollY', me.wrapper).eq(0).find('.J_lazyLoadImg');
			imgNode.show();
			imgNode.css({
				'background' : 'url(http://static.gtimg.com/icson/img/wx/common/loading.gif) center no-repeat'
			});
			imgNode[0].onload = function() {
				imgNode.css({
					'background' : null
				});
			}
			imgNode[0].onerror = function() {
				imgNode.attr('src', imgNode.attr('imgErrSrc'));
				imgNode.css({
					'background' : null
				});
			}
			imgNode[0].src = imgNode.attr('data-imgSrc');
			me.wrapper.css({
				opacity : 0
			});
			me.wrapper.hide();
		},
		initPageScroll : function() {
			var me = this;
			var scroll = new HorizontalMove({
				wrapper : me.wrapper
			});
			scroll.init();
			me.scroll = scroll;
			scroll.bind('touchMove', function(e) {
				me.moveLock = true;
			});
			scroll.bind('touchStart', function(e) {
				me.moveLock = false;
			});
			scroll.bind('moveTab', function(e) {
				$('.J_currentNum', me.wrapper).html(e.tabIndex + 1);
				var imgNode = $('.J_scrollY', me.wrapper).eq(e.tabIndex).find('.J_lazyLoadImg');
				imgNode.show();
				imgNode.css({
					'background' : 'url(http://static.gtimg.com/icson/img/wx/common/loading.gif) center no-repeat'
				});
				imgNode[0].onload = function() {
					imgNode.css({
						'background' : null
					});
				}
				imgNode[0].onerror = function() {
					imgNode.attr('src', imgNode.attr('imgErrSrc'));
					imgNode.css({
						'background' : null
					});
				}
				imgNode[0].src = $('.J_scrollY', me.wrapper).eq(e.tabIndex).find('.J_lazyLoadImg').attr('data-imgSrc');
			});
			orientation.watch(function() {
				scroll.resetPosition();
				var fixedWidth = Math.min(window.innerWidth, window.innerHeight, 800);
				$('img.J_lazyLoadImg', me.wrapper).each(function(i, o) {
					o.setAttribute('width', fixedWidth);
					o.setAttribute('height', fixedWidth);
				});
			});
		},
		buildEvent : function() {
			var me = this;
			me.wrapper.click(function(e) {
				if (me.moveLock) {
					return;
				}
				/*
				 * if ($(e.target).is('img') || $(e.target).parent('img').length) { // } else { }
				 */
				me.hide();
			})
		},
		show : function(then) {
			var me = this;
			me.wrapper.show();
			me.wrapper.animate({
				opacity : 1
			}, 'fast', 'ease-out', function() {
				me.fireEvent('when.show');
			});
		},
		hide : function() {
			var me = this;
			me.fireEvent('when.hide');
			me.wrapper.animate({
				opacity : 0
			}, 'fast', 'ease-out', function() {
				me.wrapper.hide();
			});
		}
	})
	return PhotoGallery;
});