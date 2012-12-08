$(function () {
  var Cloud,
      Slider,
      Life,
      Food,
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
      this.minMulti = this.options.minMulti;
      this.maxMulti = this.options.maxMulti;
      
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
        if (this.scrollTop + height > this.max - (height /10)) {
          
          if (offset > this.min) {
            var newTop = offset * SLIDER_MIN_MULTIPLIER < this.start - this.el.height() 
                          ? this.start - this.el.height() : offset * this.minMulti;
            
            this.el.css('top', newTop);
          }
        }
      } else {
            var newTop = offset * SLIDER_MAX_MULTIPLIER > this.start 
                          ? this.start : offset * this.maxMulti;
            
            this.el.css('top', newTop);
      }
      
      this.oldScrollTop = this.scrollTop;
    },
    
    _setSettings: function(options) {
      this.options = options;
    }
  });
  
  Food = function (options) {
    this._setSettings(options || {});
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Food.prototype, {
    initialize : function () {
      _.bindAll(this);
      
      this.el = this.options.el;
      this.max = this.options.max;
      this.minMulti = this.options.minMulti;
      this.maxMulti = this.options.maxMulti;
      
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
        if (this.scrollTop + height > $('#price').offset().top) {
          
          if (offset > this.max) {
            var newTop = offset * this.minMulti < this.max 
                          ? this.max : offset * this.minMulti;
            
            this.el.css('top', newTop - $('#grocery').offset().top);
          }
        }
      } else if (!scrollingDown && this.scrollTop + height > $('#price').offset().top) {
            var newTop = offset * this.maxMulti > this.start 
                          ? this.start : offset * this.maxMulti;
            
            this.el.css('top', newTop - $('#grocery').offset().top);
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
      this.id = this.el.attr('id');
      this.height = $('#price').height();

      $(window).scroll(_.throttle(this.checkPosition, this.options.rate));
    },
    
    checkPosition : function () {
      this.scrollTop = $(window).scrollTop();
      
      var scrollingDown = this.scrollTop > this.oldScrollTop,
          offset = $('#price').offset().top;
      
      if (scrollingDown && this.scrollTop + $(window).height() > offset && this.scrollTop < offset + this.height) {   

          this.animateUp();
      } else if (!scrollingDown && this.scrollTop < offset + this.height && this.scrollTop + $(window).height() > offset){

          
          this.animateDown();
      }
      
      this.oldScrollTop = this.scrollTop;
    },
    
    animateUp : function () {
      // we should be animating
      var newVal = parseInt(this.el.text(), 10) + 1;
      
      newVal = newVal > 9 ? 1 : newVal;
      
      var template = $('<div class="tag animated">' + newVal + '</div>').css({
        top: this.el.height(),
        left: this.el.position().left
      });
      
      this.el.after(template);
      
      template.animate({top: 0}, 200, _.bind(function () {
        this.el.text(newVal);
        template.remove();
      }, this));
    },
    
    animateDown : function () {
        var newVal = parseInt(this.el.text(), 10) - 1;
          
        newVal = newVal < 1 ? 9 : newVal;
        
          var template = $('<div class="tag animated">' + newVal + '</div>').css({
            top: - this.el.height(),
            left: this.el.position().left
          });
               
          
          this.el.before(template);
  
          template.animate({top: 0}, 200, _.bind(function () {
            this.el.text(newVal);
            template.remove();
          }, this));
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
            
      
      if (scrollTop > 0 && scrollTop <= 900) {
              $('#mercury').css({height : '10%'});

      } else if (scrollTop > 900 && scrollTop <= 2000) {
                $('#mercury').css({height : '20%'});

      }  else if (scrollTop > 2000 && scrollTop <= 4000) {
                $('#mercury').css({height : '30%'});

      } else if (scrollTop > 4000 && scrollTop <= 6000) {
                $('#mercury').css({height : '40%'});

      }
       else if (scrollTop > 6000 && scrollTop <= 8000) {
                $('#mercury').css({height : '50%'});

      }
       else if (scrollTop > 8000 && scrollTop <= 10000) {
                $('#mercury').css({height : '60%'});

      } else if (scrollTop > 10000 && scrollTop <= 11000) {
                $('#mercury').css({height : '70%'});

      }
      else if (scrollTop > 11000 && scrollTop <= 12000) {
                $('#mercury').css({height : '80%'});

      }else if (scrollTop > 10000) {
                  $('#mercury').css({height : '90%'});

      }
      
      if (scrollTop > 600 && scrollTop + $(window).height() < $('#wrapper').height() - 1000) {
        $('#thermometer').removeClass().addClass('fixed')
      } else if (scrollTop + $(window).height() > $('#wrapper').height() - 1000) {
                $('#thermometer').removeClass('fixed').addClass('end');

      } else {
        $('#thermometer').removeClass()
      
      }
      
      if (scrollTop > 5794) {
        $('#petri-dish').addClass('active');
      }
      
      
    });
    
    new Slider({
      el : $('#water1'),
      min : waterMin,
      max : waterMax,
      maxMulti : 1.03,
      minMulti : .98
    });   
    
    new Slider({
      el : $('#water2'),
      min : waterMin,
      max : waterMax,
      maxMulti : 1.03,
      minMulti : .98
    });
    
    new Slider({
      el : $('#water3'),
      min : waterMin,
      max : waterMax,
      maxMulti : 1.03,
      minMulti : .98
    });
    
    new Food({
      el : $('#orange'),
      max : $('#grocery').offset().top,
      maxMulti : 1.01,
      minMulti : .99,
      rate : 1000
    });
    
    new Food({
      el : $('#milk'),
      max : $('#grocery').offset().top,
      maxMulti : 1.01,
      minMulti : .99,
    });
    
    new Food({
      el : $('#loaf'),
      max : $('#grocery').offset().top,
      maxMulti : 1.02,
      minMulti : .999
    });
    
    new Food({
      el : $('#steak'),
      max : $('#grocery').offset().top,
      maxMulti : 1.01,
      minMulti : .99
    });
    
    new Food({
      el : $('#eggs'),
      max : $('#grocery').offset().top,
      maxMulti : 1.01,
      minMulti : .99
    });
    
    /*new Food({
      el : $('#loaf1'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf2'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf3'),
      max : $('#grocery').offset().top,
      maxMulti : 1.03,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf4'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf5'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf6'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });
    
    new Food({
      el : $('#loaf7'),
      max : $('#grocery').offset().top,
      maxMulti : 1.022,
      minMulti : .99
    });*/
    
    new Tile({
      el : $('#tag1'),
      rate : 1000
    });
    
    new Tile({
      el : $('#tag2'),
      rate:  500
    });
    
    var tag3 = new Tile({
      el : $('#tag3'),
      rate : 200
    });
    
    var tag4 = new Tile({
      el : $('#tag4'),
      rate : 10
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
      delay : 2200,
      speed: 85 * 1000
    });
    
    new Cloud({
      el : $('#cloud11'),
      delay : 1800,
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
      delay : 800,
      speed: 155 * 1000
    });
  });
});