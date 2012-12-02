$(function () {
  var Cloud = function (options) {
    this._setSettings(options || {});
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Cloud.prototype, {
    initialize : function () {
      _.bindAll(this);
            
      _.defaults(this.options, {
        delay : 0,
        speed : 45 * 1000
      });
      
      this.el = this.options.el;
      this.delay = this.options.delay;
      this.speed = this.options.speed;
      
      _.delay(this.animate, this.delay);
    },
    
    animate : function () {
      var offset = this.el.width();
      
      this.el.animate({
        left: - offset
      }, this.speed, this.reset);
    },
    
    reset : function () {
      this.el.css('left', '100%');
      
      _.delay(this.animate, this.delay);
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  $(document).ready(function () {
    var start = $('#water1').offset().top,
        start2 = $('#water2').offset().top,
        start3 = $('#water3').offset().top,
      old,
                height = $(window).height();
    
    $(window).scroll(_.throttle(function () {
      var scrollTop = $(window).scrollTop(),
          offset = $('#water1').offset().top,
          offset2 = $('#water2').offset().top,
          offset3 = $('#water3').offset().top,
          multiplier = scrollTop > old ? .99 : 1,
          position = scrollTop + height;
      
      if (position > start && scrollTop < offset) {
        $('#water1').css('top', offset * multiplier);
        $('#water2').css('top', offset2 * multiplier);
        $('#water3').css('top', offset3 * multiplier);
      }
      
      old = scrollTop;
    
    }, 10));
    /**
     * Create all of our clouds
     */
    new Cloud({
      el : $('#cloud1'),
      delay : 1200,
      speed: 100 * 1000
    });
    new Cloud({
      el : $('#cloud2'),
      delay : 0,
      speed: 90 * 1000
    });
  });
});