/**
 * 倒计时
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 * @example
 *
 * countdown.start({
 * 	end: '' //字符串的时间 
 * 	name : '.J_countdown' // 指定的倒计时区域
 * })
 */
define('widget/countdown', ['common'], function($) {

  function start(countdownInfo, callback) {
    var end = Date.parse(countdownInfo.end.replace(/-/g, "/"));

    function cb() {
      var args = arguments;
      callback && $.isFunction(callback) && setTimeout(function() {
        callback.apply(null, args);
      }, 0);
    }

    if (!end) {
      cb({errno:1, msg:'结束时间格式不正确'});
    }

    var offset = 0;
    var countdownTimer;
    var $wrapper;

    if (countdownInfo.name && countdownInfo.name != '') {
      $wrapper = $(countdownInfo.name);
    } else {
      $wrapper = $(document.body);
    }

    var
      $sec1 = $wrapper.find('.J_sec_1'),
      $sec2 = $wrapper.find('.J_sec_2'),
      $sec = $wrapper.find('.J_sec'),
      $min1 = $wrapper.find('.J_min_1'),
      $min2 = $wrapper.find('.J_min_2'),
      $min = $wrapper.find('.J_min'),
      $hour1 = $wrapper.find('.J_hour_1'),
      $hour2 = $wrapper.find('.J_hour_2'),
      $hour = $wrapper.find('.J_hour'),
      $hours = $wrapper.find('.J_hours'),
      $day1 = $wrapper.find('.J_day_1'),
      $day2 = $wrapper.find('.J_day_2'),
      $day = $wrapper.find('.J_day');

    //如果已经结束，所有倒计时设置为0。
    function finish() {
      $sec1.html('0');
      $sec2.html('0');
      $sec.html('00');
      $min1.html('0');
      $min2.html('0');
      $min.html('00');
      $hour1.html('0');
      $hour2.html('0');
      $hour.html('00');
      $hours.html('00');
      $day1.html('0');
      $day2.html('0');
      $day.html('00');

      cb({errno:2, msg:'倒计时结束'});
    }

    function _timer() {
      try {
        var ret = {}, now = self.now = new Date().getTime() - offset, distance = parseInt(end - now, 10);

        if (distance <= 0) {
          countdownTimer && clearInterval(countdownTimer);
          finish();
          return;
        }
        var _time_config = ['mill', 'second', 'minute', 'hour'];
        for (var i = 0, len = _time_config.length; i < len; i++) {
          var unit = (i == 0 ? 1000 : (i == 3 ? 24 : 60));
          var value = distance % unit;
          distance = parseInt(distance / unit, 10);
          var time = value.toString();
          if (i == 1) {
            if (time.length > 1) {
              $sec1.html(time.substr(0, 1));
              $sec2.html(time.substr(1, 1));
              $sec.html(time);
            } else {
              $sec1.html(0);
              $sec2.html(time.substr(0, 1));
              $sec.html('0' + time);
            }
          } else if (i == 2) {
            if (time.length > 1) {
              $min1.html(time.substr(0, 1));
              $min2.html(time.substr(1, 1));
              $min.html(time);
            } else {
              $min1.html(0);
              $min2.html(time.substr(0, 1));
              $min.html('0' + time);
            }
          } else if (i == 3) {
            time = (value + (distance * 24));
            time = time > 99 ? 99 : time;
            time = time.toString();
            if (time.length > 1) {
              $hour1.html(time.substr(0, 1));
              $hour2.html(time.substr(1, 1));
              $hour.html(time);
            } else {
              $hour1.html(0);
              $hour2.html(time.substr(0, 1));
              $hour.html('0' + time);
            }
            $hours.html((value + (distance * 24)).toString());
          }
        }
        distance = distance.toString();
        if (distance.length > 1) {
          $day1.html(distance.substr(0, 1));
          $day2.html(distance.substr(1, 1));
          $day.html(distance);
        } else {
          $day1.html(distance.substr(0, 1));
          $day2.html(distance.substr(1, 1));
          $day.html('0' + distance);
        }
      } catch (e1) {
        Logger.error(e1);
        Logger.send();
        throw e1;
      }
    }
    _timer();
    countdownTimer = setInterval(_timer, 1000);
    return countdownTimer;
  }
  return {
    start: start
  }
})