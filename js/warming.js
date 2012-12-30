$(function () {
  var ParallaxView,
      WaterView,
      GunView,
      TagView,
      WarmingState,
      checkforMobile = function() {
        var isMobile = (/iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i.test(navigator.userAgent.toLowerCase())),
        isTablet = (/ipad|android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i.test(navigator.userAgent.toLowerCase())),
        windowWidth = $(window).width();

        if (windowWidth < 768 || isMobile || isTablet) {
          return false;
        } else {
          return true;
        }
      },
      IS_WIDE = $(window).width() >= 768,
      IS_DESKTOP_CAPABLE = checkforMobile(),
      SCROLL_THROTTLE = 10,
      WATER_TOP_OFFSET = 600,
      WATER_VIEW_START = 12370,
      WATER_VIEW_INCREMENT = .98,
      GUN_VIEW_ACTIVATE_PERCENTAGE = 0.6,
      GUN_SHOT_DELAY = 50,
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
      
      $(this.windowObject)
        .scroll(_.throttle(this.onScroll, SCROLL_THROTTLE));
    
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
  
  ParallaxView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this);
      
      this.offset = this.$el.offset().top;
       
      if (IS_DESKTOP_CAPABLE) {  
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


      this.start = this.$el.position().top;
      this.checkPosition();
    },
    
    onScroll : function () {
      var offset = this.$el.position().top;
      
      if (this.scrollingDown) {
        if (this.scrollTop > WATER_VIEW_START) {
          offset = this.start - (this.scrollTop - WATER_VIEW_START);

          offset = offset < this.max ? this.max : offset;

          this.$el.css('top', offset);
        }
      } else {
        if (this.scrollTop > WATER_VIEW_START) {
          offset = this.start - (this.scrollTop - WATER_VIEW_START);

          offset = offset > this.start ? this.start : offset;

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
  
  TagView = Backbone.View.extend({
    initialize : function () {
      _.bindAll(this);
      
      this.id     = this.$el.attr('id');
      this.height = $('#price').height();
      this.offset = $('#price').offset().top;
      this.helper = this.$('.animating-tag:first');
      this.tag    = this.$('.fixed-tag:first');
      this.start  = parseInt(this.tag.text(), 10);

      $(window).resize(this.onResize);

      this.onResize();
      this.setPrices();
    },

    setPrices : function () {
      if (this.checkPosition()) {
        this.animateUp();
      }

      _.delay(this.setPrices, this.options.rate);
    },
    
    onResize : function () {
      this.windowHeight = $(window).height();
    },
        
    checkPosition : function () {
      this.scrollTop = this.model.get('scrollTop');
          
      if (this.scrollTop + this.windowHeight < this.offset || this.scrollTop > this.offset + this.height) {
        return false;
      }

      return true;
    },
    
    animateUp : function () {
      this.start += 1;
      
      this.start = this.start > 9 ? 1 : this.start;
      
      this.helper.text(this.start);

      this.helper.animate({top: 0}, TAG_ANIMATION_SPEED, _.bind(function () {
        this.tag.text(this.start);
        this.helper.css('top', '100%');
      }, this));
    }
  });
  
  $(document).ready(function () {    
    var warmingState = new WarmingState();
        
    warmingState.on('change', function () {
      var scrollTop = warmingState.get('scrollTop'),
          resetToolbar = function () {
            $('#toolbar a').removeClass('active');
          },
          isMobile = checkforMobile();

      
      resetToolbar();
      
      if (!IS_WIDE) {
        if (scrollTop > 1011 &&  scrollTop < 1845) {
          $('#storms').addClass('active');
        } else if (scrollTop > 1845 && scrollTop < 2523) {
          $('#extinction').addClass('active');
        } else if (scrollTop > 2523 && scrollTop < 4272) {
          $('#diseases').addClass('active');
        } else if (scrollTop > 4272 && scrollTop < 5452) {
          $('#shortages').addClass('active');
        } else if (scrollTop > 5452 && scrollTop < 6997) {
          $('#global-violence').addClass('active');
        } else if (scrollTop > 6997 && scrollTop < 7786) {
          $('#oceans').addClass('active');
        }
      } else {
        if (scrollTop > 526 &&  scrollTop < 2362) {
          $('#storms, #cloudscape').addClass('active');
        } else if (scrollTop > 2362 && scrollTop < 3638) {
          $('#extinction').addClass('active');
        } else if (scrollTop > 3638 && scrollTop < 6679) {
          $('#diseases').addClass('active');
        } else if (scrollTop > 6679 && scrollTop < 8832) {
          $('#shortages').addClass('active');
        } else if (scrollTop > 8832 && scrollTop < 11624) {
          $('#global-violence').addClass('active');
        } else if (scrollTop > 11624 && scrollTop < 13048) {
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
            '#cloudscape' : 649,
            '#ocean'      : 2610,
            '#petri-dish' : 3905,
            '#grocery'    : 7697,
            '#violence'   : 9195,
            '#cityscape'  : 12289
          },
          offsetValuesMobile = {
            '#cloudscape' : 1193,
            '#ocean'      : 1938,
            '#petri-dish' : 2795,
            '#grocery'    : 4404,
            '#violence'   : 5733,
            '#cityscape'  : 7180
          };
        
        offset = !IS_WIDE ? offsetValuesMobile[href] : offsetValuesDefault[href]
        
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
      rate : 10000,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag2'),
      rate:  5000,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag3'),
      rate : 1000,
      model : warmingState
    });
    
    new TagView({
      el : $('#tag4'),
      rate : 200,
      model : warmingState
    });

    _.each($('.gun'), function (gun) {
      new GunView({
        el : $(gun),
        model : warmingState
      });
    });
  });
});