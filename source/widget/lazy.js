/*
@ author gangzhao
 */
define('widget/lazy', [ 'common' ], function() {
	var obj;
	var timeout = '';

	function lazyLoadImg() {
		obj = $('.J_lazy')
		// 将带lazy样式的 图片，更换为loading
		//obj.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
		var stop = document.documentElement.scrollTop || document.body.scrollTop;
		var sheight = document.documentElement.clientHeight || document.body.clientHeight;

		obj.each(function(index) {
			if (!$(this).hasClass('J_lazyLoading') && $(this).offset().top < stop + sheight * 2 && $(this).offset().top > stop - sheight * 2) {
				$.log(index, 'Loading Img');
				// $(this).removeClass('J_lazy');
				$(this).addClass('J_lazyLoading');
				$(this).css({
					'background' : 'url(http://static.gtimg.com/icson/img/wx/common/loading.gif) center no-repeat'
				});
				// $(this).attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
				$(this).attr('trycount', '0');
				var oldImg = $(this);
				var img = new Image();
				img.onerror = function() {
					//$(this).attr('trycount', parseInt($(this).attr('trycount')) + 1);
					//if (parseInt($(this).attr('trycount')) > 1) {
					//this.onerror = null;
					//} else {
					var newUrl = oldImg.attr('data-backup-src') || oldImg.attr('data-src') || '';
					//$(this).attr('src', newUrl.indexOf('?') > 0 ? newUrl + '&_=' + (+new Date()) : newUrl + '?_=' + (+new Date()));
					var img1 = new Image();
					img1.onload = function() {
						oldImg.replaceWith(this);
					}
					img1.src = newUrl.indexOf('?') > 0 ? newUrl + '&_=' + (+new Date()) : newUrl + '?_=' + (+new Date());
					//}
					// $(this).removeClass('J_lazyLoading');

				}
				img.onload = function() {
					/*
					$(this).removeClass('J_lazyLoading');
					$(this).removeClass('J_lazy');
					$(this).css({
						'background' : null
					});
					*/
					oldImg.replaceWith(this);
				}
				//$(this).attr('src', $(this).attr('data-src'));
				img.src = $(this).attr('data-src');
			}
		})
	}
	//设置默认图片
	$('.J_lazy').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
	$(window).bind('scroll', function() {
		clearTimeout(timeout);
		timeout = setTimeout(lazyLoadImg, 200);
	});
	lazyLoadImg();
	return {
		/*
		 * loadImg : function() { obj = $('.J_lazy') //将带lazy样式的 图片，更换为loading obj.css({ 'background' : 'url(http://img2.icson.com/event/2013/12/15/13870944188710.gif) center no-repeat' }); obj.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
		 * $(window).bind('scroll', function() { clearTimeout(timeout); timeout = setTimeout(lazyLoadImg, 200); }); lazyLoadImg(); }, loadBackgroundImg : function() { window.onscroll = function() { clearTimeout(timeout); timeout = setTimeout(lazyLoadImg, 200); } lazyLoadImg(); },
		 */
		lazyLoadImg : lazyLoadImg
	} // end return
})