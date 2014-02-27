define('widget/floating', ['common'], function($) {
  var $window = $(window), $document = $(document);
  var scrollTop, windowHeight;

  var bottomTarget, topTarget;
  function fixBar() {
    scrollTop = $window.scrollTop();
    windowHeight = $window.height();
    top();
    bottom();
  }

  function top() {
    if (!topTarget) {
      return;
    }
    topTarget.each(function() {
      var $this = $(this), top = ($this.closest('.J_floating_container').offset() || {}).top || 0;
      if (top > scrollTop) {
        $this.removeClass('action_fixed');
      } else {
        $this.addClass('action_fixed');
      }
    });
  }

  function bottom() {
    if (!bottomTarget) {
      return;
    }
    bottomTarget.each(function() {
      var $this = $(this), top = ($this.closest('.J_floating_container').offset() || {}).top || 0, height = $this.height();
      if (top + height < scrollTop + windowHeight) {
        $this.removeClass('action_fixed');
      } else {
        $this.addClass('action_fixed');
      }
    });
  }

  return (function() {
    $window.on('scroll', fixBar);
    $document.on('touchmove', fixBar);
    return {
      fixedBottom: function(selector) {
        bottomTarget = $(selector);
        fixBar();
      },
      fixedTop: function(selector) {
        topTarget = $(selector);
        fixBar();
      }
    };
  })();

});