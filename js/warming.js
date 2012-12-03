$(function () {
  var Cloud,
      Slider,
      Life,
      SLIDER_MIN_MULTIPLIER = .98,
      SLIDER_MAX_MULTIPLIER = 1.03;
      
  Cloud = function (options) {
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
      
      this.animate();
    },
    
    animate : function () {
      var offset = this.el.width();
      
      this.el.animate({
        left: - offset
      }, this.speed, this.reset);
    },
    
    reset : function () {
      this.el.css('left', '100%');
      
      this.animate();
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  Slider = function (options) {
    this._setSettings(options || {});
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Slider.prototype, {
    initialize : function () {
      _.bindAll(this);
      
      this.el = this.options.el;
      this.max = this.options.max;
      this.min = this.options.min;
      this.start = this.el.offset().top;
          
      $(window).scroll(this.checkPosition);
    },
    
    checkPosition : function () {
      this.scrollTop = $(window).scrollTop();
      
      var scrollingDown = this.scrollTop > this.oldScrollTop,
          height = $(window).height(),
          offset = this.el.offset().top;
      
      if (scrollingDown) {

        // we should be animating
        if (this.scrollTop + height > this.max) {
          
          if (offset > this.min) {
            var newTop = offset * SLIDER_MIN_MULTIPLIER < this.start - this.el.height() 
                          ? this.start - this.el.height() : offset * SLIDER_MIN_MULTIPLIER;
            
            this.el.css('top', newTop);
          }
        }
      } else {
            var newTop = offset * SLIDER_MAX_MULTIPLIER > this.start 
                          ? this.start : offset * SLIDER_MAX_MULTIPLIER;
            
            this.el.css('top', newTop);
      }
      
      this.oldScrollTop = this.scrollTop;
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  Life = function (options) {
    this._setSettings(options || {});
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Life.prototype, {
    initialize : function () {
      _.bindAll(this);
      
      this.el = this.options.el;
      this.offset = this.el.offset().top;
          
      $(window).scroll(_.throttle(this.checkPosition, 50));
    },
    
    checkPosition : function () {
      this.scrollTop = $(window).scrollTop();
      
      var scrollingDown = this.scrollTop > this.oldScrollTop,
          height = $(window).height(),
          offset = this.el.offset().top;
      
      if (scrollingDown) {

        // we should be animating
        if (this.scrollTop + (height / 4) > this.offset) {
          
          this.el.addClass('pop').fadeOut(400);
        }
      } else {
         if (this.scrollTop < $('#ocean').offset().top) {
          
           this.el.removeClass('pop').show();
         }
      }
      
      this.oldScrollTop = this.scrollTop;
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  var Tile = function (options) {
    this._setSettings(options || {});
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Tile.prototype, {
    initialize : function () {
      _.bindAll(this);
      
      this.el = this.options.el;
          
      $(window).scroll(_.throttle(this.checkPosition, 200));
    },
    
    checkPosition : function () {
      this.scrollTop = $(window).scrollTop();
      
      var scrollingDown = this.scrollTop > this.oldScrollTop,
          offset = $('#price').offset().top;
      
      if (scrollingDown && this.scrollTop + $(window).height > offset) {

        // we should be animating
          var newVal = parseInt(this.el.text(), 10) + 1;
          
          newVal = newVal > 9 ? 9 : newVal;
          this.el.text(newVal);
      } else {
        var newVal = parseInt(this.el.text(), 10) - 1;
          
        newVal = newVal < 0 ? 9 : newVal;
        
        this.el.text(newVal);
      }
      
      this.oldScrollTop = this.scrollTop;
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  $(document).ready(function () {
    var waterMax = $('#water1').offset().top,
        waterMin = waterMax - $('#water1').height();
        
    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();
      
      if (scrollTop > 4600 && scrollTop <= 4900) {
        $('#virus13,#virus14,#virus15,#virus16,#virus17,#virus18,#virus19,#virus20,#virus25,#bacteria21,#bacteria22,#bacteria23,#bacteria24,#bacteria25,#bacteria26,#bacteria27,#bacteria28,#bacteria29,#bacteria30,#bacteria13,#bacteria14,#bacteria15,#bacteria16,#bacteria17').fadeIn();
      } else if (scrollTop > 4900 && scrollTop <= 5100) {
        $('#virus13,#virus14,#virus15,#virus16,#virus17,#virus18,#virus19,#virus20,#virus25').fadeIn();
        $('#virus21,#virus22,#virus23,#virus24,#virus26,#virus27,#virus28,#virus30,#virus31,#bacteria18,#bacteria19,#bacteria20,#bacteria31,#bacteria32,#bacteria33,#bacteria34,#bacteria35,#bacteria36,#bacteria46,#bacteria40').fadeIn();
      } else if (scrollTop > 5100) {
        $('.virus').fadeIn();
        $('.bacteria').fadeIn();
      } else {
        $('#virus29,#virus32,#virus33,#virus34,#virus35,#virus36').fadeOut();
        $('#bacteria37,#bacteria38,#bacteria39,#bacteria41,#bacteria42,#bacteria43,#bacteria44,#bacteria45,#bacteria47').fadeOut();
        $('#virus13,#virus14,#virus15,#virus16,#virus17,#virus18,#virus19,#virus20,#virus25,#bacteria21,#bacteria22,#bacteria23,#bacteria24,#bacteria25,#bacteria26,#bacteria27,#bacteria28,#bacteria29,#bacteria30,#bacteria13,#bacteria14,#bacteria15,#bacteria16,#bacteria17').fadeOut();
$('#virus21,#virus22,#virus23,#virus24,#virus26,#virus27,#virus28,#virus30,#virus31,#bacteria18,#bacteria19,#bacteria20,#bacteria31,#bacteria32,#bacteria33,#bacteria34,#bacteria35,#bacteria36,#bacteria46,#bacteria40').fadeOut();
      }
    });
    
    new Slider({
      el : $('#water1'),
      min : waterMin,
      max : waterMax
    });   
    
    new Slider({
      el : $('#water2'),
      min : waterMin,
      max : waterMax
    });
    
    new Slider({
      el : $('#water3'),
      min : waterMin,
      max : waterMax
    });
    
    new Tile({
      el : $('#tag1')
    });
    
    new Tile({
      el : $('#tag2')
    });
    
    new Tile({
      el : $('#tag3')
    });
    
    new Tile({
      el : $('#tag4')
    });
    
    _.each($('.life'), function (animal) {
      new Life({
        el : $(animal)
      });
    });
  
    new Cloud({
      el : $('#cloud1'),
      delay : 1200,
      speed: 60 * 1000
    });
    new Cloud({
      el : $('#cloud2'),
      delay : 0,
      speed: 90 * 1000
    });
    
    new Cloud({
      el : $('#cloud3'),
      delay : 300,
      speed: 75 * 1000
    });
    
    new Cloud({
      el : $('#cloud4'),
      delay : 2000,
      speed: 80 * 1000
    });
    
    new Cloud({
      el : $('#cloud5'),
      delay : 500,
      speed: 90 * 1000
    });
    
    new Cloud({
      el : $('#cloud6'),
      delay : 1200,
      speed: 95 * 1000
    });
    
    new Cloud({
      el : $('#cloud7'),
      delay : 2400,
      speed: 80 * 1000
    });
    
    new Cloud({
      el : $('#cloud8'),
      delay : 1000,
      speed: 85 * 1000
    });
    
    new Cloud({
      el : $('#cloud9'),
      delay : 1000,
      speed: 85 * 1000
    });
    
    new Cloud({
      el : $('#cloud10'),
      delay : 3400,
      speed: 85 * 1000
    });
    
    new Cloud({
      el : $('#cloud11'),
      delay : 2400,
      speed: 165 * 1000
    });
    
    new Cloud({
      el : $('#cloud12'),
      delay : 1200,
      speed: 180 * 1000
    });
    
    new Cloud({
      el : $('#cloud13'),
      delay : 1000,
      speed: 135 * 1000
    });
    
    new Cloud({
      el : $('#cloud14'),
      delay : 700,
      speed: 170 * 1000
    });
    
    new Cloud({
      el : $('#cloud15'),
      delay : 1900,
      speed: 155 * 1000
    });
  });
});