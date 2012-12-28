$(function () {
  var ParallaxView,
      WaterView,
      LifeView,
      FoodView,
      CellView,
      GunView,
      TagView,
      PlayButtonView,
      ProgressView,
      WarmingState,
      AnimationState,
      EffectView,
      checkforMobile = function () {
        return $(window).width() < 768;
      },
      SCROLL_THROTTLE = 10,
      WATER_TOP_OFFSET = 800,
      WATER_VIEW_START = 11000,
      WATER_VIEW_INCREMENT = .98,
      GUN_VIEW_ACTIVATE_PERCENTAGE = 0.6,
      GUN_SHOT_DELAY = 50,
      FOOD_VIEW_START = 5618,
      FOOD_VIEW_END = 7898,
      FOOD_MAX = 0,
      LIFE_FADE_SPEED = 200,
      LIFE_FADE_MULTIPLIER = 0.4,
      CELL_FADE_MULTIPLIER = 0.8,
      TAG_ANIMATION_SPEED = 200,
      SCROLL_SPEED = 1400,
      HOUSE_URL = 'http://house.gov/htbin/findrep?ZIP=';
        
  WarmingState = Backbone.Model.extend({
    defaults : {
      scrollTop : 0
    },
    
    initialize : function () {
      _.bindAll(this);

      this.windowObject = window;
      
      $(this.windowObject).scroll(_.throttle(this.onScroll, SCROLL_THROTTLE));
    
      this._setScrollTop();    
    },
    
    onScroll : function () {
      this._setScrollTop();
      
      this.trigger('scroll');
    },
    
    _setScrollTop : function () {
      var scrollTop = $(this.windowObject).scrollTop();
      this.set('scrollTop', scrollTop);
    }
  });
  
  AnimationState = Backbone.Model.extend({
    defaults : {
      left : 0
    },
    
    initialize : function () {
      _.bindAll(this);

      this.windowObject = window;
      this.increment = false;
    },
    
    oceanAnimate : function () {
      this.increment = true;
      var width = $(this.windowObject).width(),
          diff = width / (60)
          increment = _.bind(function () {
            var left = this.get('left');
            
            this.set('left', left += diff);
            
            if (this.increment) {
              _.delay(increment, 100);
            } else {
               this.set('left', 0);

            }
          }, this);  
          
        increment();
    },
    
    restore : function () {
      this.increment = false;
    }
  });
  
  EffectView = Backbone.View.extend({
    animateView : $.noop
  });
  
  PlayButtonView = Backbone.View.extend({
    events : {
      'click' : 'onClick'
    },
    initialize : function () {
      _.bindAll(this);
      
      this.parent = this.$el.parent();
    },
    
    onClick : function (ev) {
      ev.preventDefault();
      
      this.parent.addClass('active');
      
      this.$el.hide();
      
      this.trigger('timer:start');
    },
    
    onTimerEnd : function () {
      this.parent.removeClass('active');    
      this.$el.show();
    }
  });
  
  ProgressView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this);
    },
    
    startTimer : function () {
      this.$el.show();
      
      this.$el.animate({
        'width':'100%'
      }, 10 * 1000, this.hide);
    },
    
    hide : function () {
      this.trigger('timer:end');

      this.$el.hide().css('width', '0%');
    }
  });
  
  ParallaxView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this);
      
      this.offset = this.$el.offset().top;
       
      if (!checkforMobile()) {  
        this.model.on('change', this.checkPosition);
      }
    },
    
    /**
     * ParallaxView will always call onScroll even if not implemented
     * This is useful for writing custom scroll code
    */
    checkPosition : function () {
      this.scrollTop = this.model.get('scrollTop');
      this.scrollingDown = this.scrollTop > this.oldScrollTop;

      this.onScroll();
      
      this.oldScrollTop = this.scrollTop;
    },
    
    onScroll : $.noop
  });
  
  WaterView = ParallaxView.extend({
    initialize : function () {
      ParallaxView.prototype.initialize.call(this);

      this.max = this.$el.position().top - WATER_TOP_OFFSET;
      this.min = this.$el.position().top;
      this.parentOffset = $('#cityscape').offset().top;
    },
    
    onScroll : function () {
      var offset = this.$el.position().top;
      
      if (this.scrollingDown) {
        if (this.scrollTop > WATER_VIEW_START) {
          offset = offset > this.max ? offset * WATER_VIEW_INCREMENT : this.max;

          this.$el.css('top', offset);
        }
      }
    }
  });
    
  GunView = ParallaxView.extend({
    onScroll : function () {
      if (this.scrollTop + ($(window).height() * GUN_VIEW_ACTIVATE_PERCENTAGE) > this.offset) {
        if (!this.$el.hasClass('shot')) {
          var flash = this.$el.find('.flash'),
              flag = this.$el.find('.flagpole');
          
          flash.show();
          
          var afterShow = _.bind(function () {
            flash.hide();
            flag.show();
            this.$el.addClass('shot');
          }, this);
          
          _.delay(afterShow, GUN_SHOT_DELAY);
        }
      } else {
        this.reset();
      }
    },
    
    reset : function () {
      this.$el.removeClass('shot');
      this.$('.flash:first').hide();
      this.$('.flagpole:first').hide();
    }
  });
  
  FoodView = ParallaxView.extend({
    initialize : function () {
      ParallaxView.prototype.initialize.call(this);
      
      this.setData();
      
      // assume we may be refreshed down the page
      this.checkPosition();
    },
    
    setData : function () {
      this.scale        = this.options.scale;
      this.max          = FOOD_MAX;
      this.start        = this.$el.position().top;
      this.parentOffset = $('#grocery').offset().top;      
    },
    
    onScroll : function () {      
      var offset = this.$el.position().top;

      if (this.scrollTop < FOOD_VIEW_START) {
        this.$el.css('top', this.start);
        return;
      }

      if (this.scrollingDown) {
        if (this.scrollTop > FOOD_VIEW_START && this.scrollTop < FOOD_VIEW_END) {
          var newPos = this.start - (this.scrollTop - this.parentOffset);
            
          if (newPos < this.max) {
            newPos = this.max;
          }  
          
          this.$el.css('top', newPos);
        }
      } else {
        if (this.scrollTop > FOOD_VIEW_START && this.scrollTop < FOOD_VIEW_END) {
          var newPos = offset + (this.oldScrollTop - this.scrollTop);
            
          if (newPos > this.start) {
            newPos = this.start;
          }  
          
          this.$el.css('top', newPos);
        }
      }
    }
  });
  
  LifeView = ParallaxView.extend({
    initialize : function () {
      ParallaxView.prototype.initialize.call(this);
      
      $(window).resize(this.onResize);
      
      this.parentOffset = $('#ocean').offset().top;
      
      if (this.options.state) {
        this.options.state.on('change', this.onAnimate)
      }
      this.onResize();
    },
    
    onResize : function () {
      this.windowHeight = $(window).height();
    },
    
    onScroll : function () {      
      if (this.scrollingDown) {
        if (this.scrollTop + (this.windowHeight * LIFE_FADE_MULTIPLIER) > this.offset) {
          
          this.$el.fadeOut(LIFE_FADE_SPEED);
        }
      } else {
         if (this.scrollTop < this.parentOffset) {
          
           this.$el.show();
         }
      }
    },
    
    onAnimate : function () {
      if (this.options.state.get('left') > this.$el.offset().left) {
        this.$el.fadeOut(LIFE_FADE_SPEED);
      } else {
        this.$el.show();
      }
    }
  });
  
  CellView = LifeView.extend({
    initialize : function () {
      LifeView.prototype.initialize.call(this);        

      this.parentOffset = $('#petri-dish').offset().top;

      this.$el.hide();
    },
    
    onScroll : function () {      
      var scrollingDown = this.scrollTop > this.oldScrollTop,
          height = $(window).height();
      
      if (scrollingDown) {
        if (this.scrollTop + (height * CELL_FADE_MULTIPLIER) > this.offset) {         
          this.$el.show();
        }
      } else {
         if (this.scrollTop + height < this.parentOffset) {
           this.$el.hide();
         }
      }
    }
  });
  
  TagView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this);
      
      this.id     = this.$el.attr('id');
      this.height = $('#price').height();
      this.offset = $('#price').offset().top;
      
      this.onResize();
      
      $(window).scroll(_.throttle(this.checkPosition, this.options.rate));
      $(window).resize(this.onResize);
    },
    
    onResize : function () {
      this.windowHeight = $(window).height();
    },
        
    checkPosition : function () {
      this.scrollTop = this.model.get('scrollTop');
      
      var scrollingDown = this.scrollTop > this.oldScrollTop;

      this.oldScrollTop = this.scrollTop;
          
      if (this.scrollTop + this.windowHeight < this.offset || this.scrollTop > this.offset + this.height) {
        return;
      }
      
      if (scrollingDown) {   
        this.animateUp();
      } else {
        this.animateDown();
      }
    },
    
    animateUp : function () {
      var newVal = parseInt(this.$el.text(), 10) + 1,
          template;
      
      newVal = newVal > 9 ? 1 : newVal;
      
      template = $('<div class="tag animated">' + newVal + '</div>').css({
        top: this.$el.height(),
        left: this.$el.position().left
      });
      
      this.$el.after(template);
      
      template.animate({top: 0}, TAG_ANIMATION_SPEED, _.bind(function () {
        this.$el.text(newVal);
        template.remove();
      }, this));
    },
    
    animateDown : function () {
      var newVal = parseInt(this.$el.text(), 10) - 1,
          template;
      
      newVal = newVal < 1 ? 9 : newVal;
      
      template = $('<div class="tag animated">' + newVal + '</div>').css({
        top: - this.$el.height(),
        left: this.$el.position().left
      });
       
      this.$el.before(template);
      
      template.animate({top: 0}, TAG_ANIMATION_SPEED, _.bind(function () {
        this.$el.text(newVal);
        template.remove();
      }, this));
    }
  });
  
  $(document).ready(function () {    
    var warmingState = new WarmingState(),
        animationState = new AnimationState();
        
    warmingState.on('change', function () {
      var scrollTop = warmingState.get('scrollTop'),
          resetToolbar = function () {
            $('#toolbar a').removeClass('active');
          },
          hideToolbar = function () {
            $('#toolbar').css({
              top : - $('#toolbar').outerHeight()
            });
          },
          showToolbar = function () {
            $('#toolbar').css({
              top : 0
            });
          },
          isMobile = checkforMobile();

      
      resetToolbar();
      
      if (isMobile) {
        if (scrollTop > 1085 &&  scrollTop < 1703) {
          $('#storms').addClass('active');
        } else if (scrollTop > 1703 && scrollTop < 2389) {
          $('#extinction').addClass('active');
        } else if (scrollTop > 2389 && scrollTop < 3347) {
          $('#diseases').addClass('active');
        } else if (scrollTop > 3347 && scrollTop < 4362) {
          $('#shortages').addClass('active');
        } else if (scrollTop > 4362 && scrollTop < 5665) {
          $('#global-violence').addClass('active');
        } else if (scrollTop > 5665 && scrollTop < 6599) {
          $('#oceans').addClass('active');
        }
      } else {
        if (scrollTop > 775 &&  scrollTop < 2500) {
          $('#storms, #cloudscape').addClass('active');
        } else if (scrollTop > 2500 && scrollTop < 3775) {
          $('#extinction').addClass('active');
        } else if (scrollTop > 3775 && scrollTop < 6165) {
          $('#diseases').addClass('active');
        } else if (scrollTop > 6165 && scrollTop < 7539) {
          $('#shortages').addClass('active');
        } else if (scrollTop > 7539 && scrollTop < 10447) {
          $('#global-violence').addClass('active');
        } else if (scrollTop > 10447 && scrollTop < 12000) {
          $('#oceans').addClass('active');
        }
      }
    });
    
      
    $('#toolbar a').click(function (ev) {
      ev.preventDefault();
      
      var el = $(ev.target)[0].tagName === "A" ? $(ev.target) : $(ev.target).parents('a'),
          href = el.attr('href'),
          isMobile = checkforMobile(),
          offset;
          
      if (href) {
        var offsetValuesDefault = {
            '#cloudscape' : 930,
            '#ocean'      : 2800,
            '#petri-dish' : 4275,
            '#grocery'    : 6725,
            '#violence'   : 8012,
            '#cityscape'  : 10890
          },
          offsetValuesMobile = {
            '#cloudscape' : 1110,
            '#ocean'      : 1843,
            '#petri-dish' : 2674,
            '#grocery'    : 3492,
            '#violence'   : 4546,
            '#cityscape'  : 5983
          };
        
        offset = isMobile ? offsetValuesMobile[href] : offsetValuesDefault[href]
        
        $('body').animate({scrollTop : offset}, SCROLL_SPEED);
      }
    });
    
    $('#submit').click(function (ev) {
      ev.preventDefault();
      
      var val = $('#zipcode').val();
      
      if (val.length !== 5 || isNaN(val)) {
        return;
      }
      
      window.location = HOUSE_URL + val;
    });
    
    if (checkforMobile()) {
                  
      var playButtonView1 = new PlayButtonView({
        el : $('#cloudscape .play-btn')
      });
      
      var playButtonView2 = new PlayButtonView({
        el : $('#ocean .play-btn')
      });
          
      var progressView = new ProgressView({
        el : $('#progressbar')
      });
      
      var oceanView = new EffectView({
        model: warmingState,
        start : 1700,
        end : 2200
      });
      
      playButtonView1.on('timer:start', progressView.startTimer);
      progressView.on('timer:end', playButtonView1.onTimerEnd);

      playButtonView2.on('timer:start', function () {
        progressView.startTimer();
        animationState.oceanAnimate();
      });
            
      progressView.on('timer:end', function () {
        playButtonView2.onTimerEnd();
        animationState.restore();
      });
    }
    
    new WaterView({
      el : $('#water1'),
      model : warmingState
    });   
    
    new WaterView({
      el : $('#water2'),
      model : warmingState
    });
    
    new WaterView({
      el : $('#water3'),
      model : warmingState
    });
        
    new TagView({
      el : $('#tag1'),
      rate : 1000,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag2'),
      rate:  500,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag3'),
      rate : 200,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag4'),
      rate : 50,
      model : warmingState
    });
    
    new FoodView({
      el : $('#orange'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#milk'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#steak'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#eggs'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf'),
      model : warmingState
    });

    new FoodView({
      el : $('#loaf1'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf2'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf3'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf5'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf6'),
      model : warmingState
    });
    
    new FoodView({
      el : $('#loaf7'),
      model : warmingState
    });

    _.each($('.gun'), function (gun) {
      new GunView({
        el : $(gun),
        model : warmingState
      });
    });
    
          _.each($('.life'), function (animal) {
        new LifeView({
          el : $(animal),
          state : animationState,
          model : warmingState
        });
      });
    
    _.each($('#virus1, #virus3,#virus4,#virus5,#virus7,#virus9,#virus10,#virus11,#virus12,#virus13,#virus15,#virus27,#virus18,#virus20,#virus27,#virus29,#virus30,#virus31,#virus32,#virus33,#virus34,#virus35,#bacteria1,#bacteria2,#bacteria3,#bacteria4,#bacteria5,#bacteria6,#bacteria9,#bacteria12,#bacteria16,#bacteria17,#bacteria18,#bacteria19,#bacteria20,#bacteria21,#bacteria24,#bacteria26,#bacteria27,#bacteria29,#bacteria30,#bacteria31,#bacteria32,#bacteria34,#bacteria35,#bacteria36,#bacteria37,#bacteria38,#bacteria39,#bacteria40'), function (cell) {
      new CellView({
        el : $(cell),
        model : warmingState
      });
    });

  });
});