(function() {
  var CScrollPane, HorizontalScroll, Scroll, VerticalScroll, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Scroll = (function() {
    function Scroll() {}

    Scroll.prototype.construct = function(settings) {
      return this.settings = settings;
    };

    return Scroll;

  })();

  VerticalScroll = (function(_super) {
    __extends(VerticalScroll, _super);

    function VerticalScroll() {
      _ref = VerticalScroll.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    VerticalScroll.prototype.bar = null;

    VerticalScroll.prototype.track = null;

    VerticalScroll.prototype.drag = null;

    VerticalScroll.prototype.trackHeight = 0;

    VerticalScroll.prototype.initialise = function(container, pane) {
      var arrowDown, arrowUp;
      container.append($('<div class="cspVerticalBar" />').append($('<div class="cspCap cspCapTop" />'), $('<div class="cspTrack" />').append($('<div class="cspDrag" />').append($('<div class="cspDragTop" />'), $('<div class="cspDragBottom" />'))), $('<div class="cspCap cspCapBottom" />')));
      this.bar = container.find('>.cspVerticalBar');
      this.track = bar.find('>.cspTrack');
      this.drag = track.find('>.cspDrag');
      if (this.settings.showArrows) {
        arrowUp = $('<a class="cspArrow cspArrowUp" />').bind('mousedown.csp', getArrowScroll(0, -1)).bind('click.csp', nil);
        arrowDown = $('<a class="cspArrow cspArrowDown" />').bind('mousedown.csp', getArrowScroll(0, 1)).bind('click.csp', nil);
        if (this.settings.arrowScrollOnHover) {
          arrowUp.bind('mouseover.csp', getArrowScroll(0, -1, arrowUp));
          arrowDown.bind('mouseover.csp', getArrowScroll(0, 1, arrowDown));
        }
        appendArrows(this.track, this.settings.verticalArrowPositions, arrowUp, arrowDown);
      }
      this.trackHeight = pane.height;
      container.find('>.cspVerticalBar>.cspCap:visible,>.cspVerticalBar>.cspArrow').each(function() {
        return this.trackHeight -= $(this).outerHeight();
      });
      this.drag.hover(function() {
        return this.drag.addClass('cspHover');
      }, function() {
        return this.drag.removeClass('cspHover');
      }).bind('mousedown.csp', function(e) {
        var startY;
        $('html').bind('dragstart.csp selectstart.csp', nil);
        this.drag.addClass('cspActive');
        startY = e.pageY - this.drag.position().top;
        $('html').bind('mousemove.csp', function(e) {
          return positionDragY(e.pageY - startY, false);
        }).bind('mouseup.csp mouseleave.csp', cancelDrag);
        return false;
      });
      return this.barSize();
    };

    VerticalScroll.prototype.barSize = function() {
      var err, scrollbarWidth;
      this.track.height(this.trackHeight + 'px');
      this.dragPosition = 0;
      scrollbarWidth = this.settings.verticalGutter + this.track.outerWidth();
      this.pane.width(this.paneWidth - scrollbarWidth - this.originalPaddingTotalWidth);
      try {
        if (this.verticalBar.position().left === 0) {
          return this.pane.css('margin-left', scrollbarWidth + 'px');
        }
      } catch (_error) {
        err = _error;
      }
    };

    return VerticalScroll;

  })(Scroll);

  HorizontalScroll = (function(_super) {
    __extends(HorizontalScroll, _super);

    function HorizontalScroll() {
      _ref1 = HorizontalScroll.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    HorizontalScroll.prototype.initialise = container()(function() {
      var arrowLeft, arrowRight;
      container.append($('<div class="cspHorizontalBar" />').append($('<div class="cspCap cspCapLeft" />'), $('<div class="cspTrack" />').append($('<div class="cspDrag" />').append($('<div class="cspDragLeft" />'), $('<div class="cspDragRight" />'))), $('<div class="cspCap cspCapRight" />')));
      this.horizontalBar = this.container.find('>.cspHorizontalBar');
      this.horizontalTrack = this.horizontalBar.find('>.cspTrack');
      this.horizontalDrag = this.horizontalTrack.find('>.cspDrag');
      if (this.settings.showArrows) {
        arrowLeft = $('<a class="cspArrow cspArrowLeft" />').bind('mousedown.csp', getArrowScroll(-1, 0)).bind('click.csp', nil);
        arrowRight = $('<a class="cspArrow cspArrowRight" />').bind('mousedown.csp', getArrowScroll(1, 0)).bind('click.csp', nil);
        if (this.settings.arrowScrollOnHover) {
          arrowLeft.bind('mouseover.csp', getArrowScroll(-1, 0, arrowLeft));
          arrowRight.bind('mouseover.csp', getArrowScroll(1, 0, arrowRight));
        }
        appendArrows(this.horizontalTrack, this.settings.horizontalArrowPositions, arrowLeft, arrowRight);
      }
      this.horizontalDrag.hover(function() {
        return this.horizontalDrag.addClass('cspHover');
      }, function() {
        return this.horizontalDrag.removeClass('cspHover');
      }).bind('mousedown.csp', function(e) {
        var startX;
        $('html').bind('dragstart.csp selectstart.csp', nil);
        this.horizontalDrag.addClass('cspActive');
        startX = e.pageX - this.horizontalDrag.position().left;
        $('html').bind('mousemove.csp', function(e) {
          return positionDragX(e.pageX - startX, false);
        }).bind('mouseup.csp mouseleave.csp', cancelDrag);
        return false;
      });
      this.horizontalTrackWidth = this.container.innerWidth();
      return this.sizeHorizontalScrollbar();
    });

    HorizontalScroll.prototype.barSize = function() {
      this.container.find('>.cspHorizontalBar>.cspCap:visible,>.cspHorizontalBar>.cspArrow').each(function() {
        return this.horizontalTrackWidth -= $(this).outerWidth();
      });
      this.horizontalTrack.width(this.horizontalTrackWidth + 'px');
      return this.horizontalDragPosition = 0;
    };

    return HorizontalScroll;

  })(Scroll);

  CScrollPane = (function() {
    CScrollPane.prototype.defaults = {
      showArrows: false,
      maintainPosition: true,
      stickToBottom: false,
      stickToRight: false,
      clickOnTrack: true,
      autoReinitialise: false,
      autoReinitialiseDelay: 500,
      verticalDragMinHeight: 0,
      verticalDragMaxHeight: 99999,
      horizontalDragMinWidth: 0,
      horizontalDragMaxWidth: 99999,
      contentWidth: void 0,
      animateScroll: false,
      animateDuration: 300,
      animateEase: 'linear',
      hijackInternalLinks: false,
      verticalGutter: 4,
      horizontalGutter: 4,
      mouseWheelSpeed: 3,
      arrowButtonSpeed: 0,
      arrowRepeatFreq: 50,
      arrowScrollOnHover: false,
      trackClickSpeed: 0,
      trackClickRepeatFreq: 70,
      verticalArrowPositions: 'split',
      horizontalArrowPositions: 'split',
      enableKeyboardNavigation: true,
      hideFocus: false,
      keyboardSpeed: 0,
      initialDelay: 300,
      speed: 30,
      scrollPagePercent: .8
    };

    function CScrollPane(elem, s) {
      this.csp = this;
      this.elem = elem;
      this.wasAtTop = true;
      this.wasAtLeft = true;
      this.wasAtBottom = false;
      this.wasAtRight = false;
      this.originalElement = this.elem.clone(false, false).empty();
      this.mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.csp' : 'mousewheel.csp';
      this.originalPadding = "" + (this.elem.css('paddingTop')) + " " + (this.elem.css('paddingRight')) + " " + (this.elem.css('paddingBottom')) + " " + (this.elem.css('paddingLeft'));
      this.originalPaddingTotalWidth = (parseInt(this.elem.css('paddingLeft'), 10) || 0) + (parseInt(this.elem.css('paddingRight'), 10) || 0);
    }

    CScrollPane.prototype.initialise = function(s) {
      var hasContainingSpaceChanged, isMaintainingPositon, lastContentX, lastContentY, maintainAtBottom, maintainAtRight, originalScrollLeft, originalScrollTop, previousContentWidth, reinitialiseInterval;
      maintainAtBottom = false;
      maintainAtRight = false;
      this.settings = s;
      if (typeof pane === "undefined" || pane === null) {
        originalScrollTop = this.elem.scrollTop();
        originalScrollLeft = this.elem.scrollLeft();
        this.elem.css({
          overflow: 'hidden',
          padding: 0
        });
        this.paneWidth = this.elem.innerWidth() + this.originalPaddingTotalWidth;
        this.paneHeight = this.elem.innerHeight();
        this.elem.width(this.paneWidth);
        this.pane = $('<div class="cspPane" />').css('padding', this.originalPadding).append(this.elem.children());
        this.container = $('<div class="cspContainer" />').css({
          'width': this.paneWidth + 'px',
          'height': this.paneHeight + 'px'
        }).append(this.pane).appendTo(this.elem);
      } else {
        this.elem.css('width', '');
        maintainAtBottom = this.settings.stickToBottom && isCloseToBottom();
        maintainAtRight = this.settings.stickToRight && isCloseToRight();
        hasContainingSpaceChanged = this.elem.innerWidth() + this.originalPaddingTotalWidth !== this.paneWidth || this.elem.outerHeight() !== this.paneHeight;
        if (hasContainingSpaceChanged) {
          this.paneWidth = this.elem.innerWidth() + this.originalPaddingTotalWidth;
          this.paneHeight = this.elem.innerHeight();
          this.container.css({
            width: this.paneWidth + 'px',
            height: this.paneHeight + 'px'
          });
        }
        if (!hasContainingSpaceChanged && previousContentWidth === this.contentWidth && this.pane.outerHeight() === this.contentHeight) {
          this.elem.width(this.paneWidth);
          return;
        }
        previousContentWidth = this.contentWidth;
        this.pane.css('width', '');
        this.elem.width(this.paneWidth);
        this.container.find('>.cspVerticalBar,>.cspHorizontalBar').remove().end();
      }
      this.pane.css('overflow', 'auto');
      if (s.contentWidth) {
        this.contentWidth = s.contentWidth;
      } else {
        this.contentWidth = this.pane[0].scrollWidth;
      }
      this.contentHeight = this.pane[0].scrollHeight;
      this.pane.css('overflow', '');
      this.percentInViewH = this.contentWidth / this.paneWidth;
      this.percentInViewV = this.contentHeight / this.paneHeight;
      this.isScrollableV = this.percentInViewV > 1;
      this.isScrollableH = this.percentInViewH > 1;
      if (!(this.isScrollableH || this.isScrollableV)) {
        this.elem.removeClass('cspScrollable');
        this.pane.css({
          top: 0,
          width: this.container.width() - this.originalPaddingTotalWidth
        });
        removeMousewheel();
        removeFocusHandler();
        removeKeyboardNav();
        removeClickOnTrack();
      } else {
        this.elem.addClass('cspScrollable');
        isMaintainingPositon = this.settings.maintainPosition && (this.verticalDragPosition || this.horizontalDragPosition);
        if (isMaintainingPositon) {
          lastContentX = this.contentPositionX();
          lastContentY = this.contentPositionY();
        }
        this.verticalScroll = new VerticalScroll();
        if (this.isScrollableV) {
          this.verticalScroll.initialise(this.container);
        }
        this.horizontalScroll = new HorizontalScroll();
        if (this.isScrollableH) {
          this.horizontalScroll.initialise(this.container);
        }
        this.resizeScrollbars();
        if (isMaintainingPositon) {
          if (maintainAtRight) {
            scrollToX(this.contentWidth - this.paneWidth, false);
          } else {
            scrollToX(lastContentX, false);
          }
          if (maintainAtBottom) {
            scrollToY(this.contentHeight - this.paneHeight, false);
          } else {
            scrollToY(lastContentY, false);
          }
        }
        this.initFocusHandler();
        this.initMousewheel();
        this.initTouch();
        if (this.settings.enableKeyboardNavigation) {
          this.initKeyboardNav();
        }
        if (this.settings.clickOnTrack) {
          this.initClickOnTrack();
        }
        this.observeHash();
        if (this.settings.hijackInternalLinks) {
          this.hijackInternalLinks();
        }
      }
      if (this.settings.autoReinitialise && !reinitialiseInterval) {
        reinitialiseInterval = setInterval(function() {
          return this.initialise(this.settings);
        }, this.settings.autoReinitialiseDelay);
      } else if (!this.settings.autoReinitialise && reinitialiseInterval) {
        clearInterval(reinitialiseInterval);
      }
      originalScrollTop && this.elem.scrollTop(0) && scrollToY(originalScrollTop, false);
      originalScrollLeft && this.elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);
      return this.elem.trigger('csp-initialised', [this.isScrollableH || this.isScrollableV]);
    };

    CScrollPane.prototype.resizeScrollbars = function() {
      var horizontalDragWidth, verticalDragHeight;
      if (this.isScrollableH && this.isScrollableV) {
        this.horizontalTrackHeight = this.horizontalTrack.outerHeight();
        this.verticalTrackWidth = this.verticalTrack.outerWidth();
        this.verticalTrackHeight -= this.horizontalTrackHeight;
        $(this.horizontalBar).find('>.cspCap:visible,>.cspArrow').each(function() {
          return this.horizontalTrackWidth += $(this).outerWidth();
        });
        this.horizontalTrackWidth -= this.verticalTrackWidth;
        this.paneHeight -= this.verticalTrackWidth;
        this.paneWidth -= this.horizontalTrackHeight;
        this.horizontalTrack.parent().append($('<div class="cspCorner" />').css('width', this.horizontalTrackHeight + 'px'));
        this.sizeVerticalScrollbar();
        this.sizeHorizontalScrollbar();
      }
      if (this.isScrollableH) {
        this.pane.width((this.container.outerWidth() - this.originalPaddingTotalWidth) + 'px');
      }
      this.contentHeight = this.pane.outerHeight();
      this.percentInViewV = this.contentHeight / this.paneHeight;
      if (this.isScrollableH) {
        horizontalDragWidth = Math.ceil(1 / this.percentInViewH * this.horizontalTrackWidth);
        if (horizontalDragWidth > this.settings.horizontalDragMaxWidth) {
          horizontalDragWidth = this.settings.horizontalDragMaxWidth;
        } else if (horizontalDragWidth < this.settings.horizontalDragMinWidth) {
          horizontalDragWidth = this.settings.horizontalDragMinWidth;
        }
        this.horizontalDrag.width(horizontalDragWidth + 'px');
        this.dragMaxX = this.horizontalTrackWidth - horizontalDragWidth;
        this._positionDragX(this.horizontalDragPosition);
      }
      if (this.isScrollableV) {
        verticalDragHeight = Math.ceil(1 / this.percentInViewV * this.verticalTrackHeight);
        if (verticalDragHeight > this.settings.verticalDragMaxHeight) {
          verticalDragHeight = this.settings.verticalDragMaxHeight;
        } else if (verticalDragHeight < this.settings.verticalDragMinHeight) {
          verticalDragHeight = this.settings.verticalDragMinHeight;
        }
        this.verticalDrag.height(verticalDragHeight + 'px');
        this.dragMaxY = this.verticalTrackHeight - verticalDragHeight;
        return this._positionDragY(this.verticalDragPosition);
      }
    };

    CScrollPane.prototype.appendArrows = function(ele, p, a1, a2) {
      var aTemp, p1, p2, _ref2;
      p1 = "before";
      p2 = "after";
      if (p === "os") {
        p = (_ref2 = /Mac/.test(navigator.platform)) != null ? _ref2 : {
          "after": "split"
        };
      }
      if (p === p1) {
        p2 = p;
      } else if (p === p2) {
        p1 = p;
        aTemp = a1;
        a1 = a2;
        a2 = aTemp;
      }
      return ele[p1](a1)[p2](a2);
    };

    CScrollPane.prototype.getArrowScroll = function(dirX, dirY, ele) {
      return function() {
        arrowScroll(dirX, dirY, this, ele);
        this.blur();
        return false;
      };
    };

    CScrollPane.prototype.arrowScroll = function(dirX, dirY, arrow, ele) {
      var doScroll, eve, isFirst;
      arrow = $(arrow).addClass('cspActive');
      isFirst = true;
      doScroll = function() {
        var scrollTimeout;
        if (dirX !== 0) {
          this.scrollByX(dirX * this.settings.arrowButtonSpeed);
        }
        if (dirY !== 0) {
          this.scrollByY(dirY * this.settings.arrowButtonSpeed);
        }
        if (isFirst) {
          scrollTimeout = setTimeout(doScroll, this.settings.initialDelay);
        } else {
          scrollTimeout = setTimeout(doScroll, this.settings.arrowRepeatFreq);
        }
        return isFirst = false;
      };
      doScroll();
      eve = ele ? 'mouseout.csp' : 'mouseup.csp';
      ele = ele || $('html');
      return ele.bind(eve, function() {
        var scrollTimeout;
        arrow.removeClass('cspActive');
        scrollTimeout && clearTimeout(scrollTimeout);
        scrollTimeout = null;
        return ele.unbind(eve);
      });
    };

    CScrollPane.prototype.initClickOnTrack = function() {
      removeClickOnTrack();
      if (this.isScrollableV) {
        this.verticalTrack.bind('mousedown.csp', function(e) {
          var cancelClick, clickedTrack, direction, doScroll, isFirst, offset;
          if (e.originalTarget === void 0 || e.originalTarget === e.currentTarget) {
            clickedTrack = $(this);
            offset = clickedTrack.offset();
            direction = e.pageY - offset.top - this.verticalDragPosition;
            isFirst = true;
            doScroll = function() {
              var contentDragY, dragY, pos, scrollTimeout;
              offset = clickedTrack.offset();
              pos = e.pageY - offset.top - verticalDragHeight / 2;
              contentDragY = this.paneHeight * this.settings.scrollPagePercent;
              dragY = this.dragMaxY * contentDragY / (this.contentHeight - this.paneHeight);
              if (direction < 0) {
                if (this.verticalDragPosition - dragY > pos) {
                  this.scrollByY(-contentDragY);
                } else {
                  positionDragY(pos);
                }
              } else if (direction > 0) {
                if (this.verticalDragPosition + dragY < pos) {
                  this.scrollByY(contentDragY);
                } else {
                  positionDragY(pos);
                }
              } else {
                cancelClick();
                return;
              }
              if (isFirst) {
                scrollTimeout = setTimeout(doScroll, this.settings.initialDelay);
              } else {
                scrollTimeout = setTimeout(doScroll, this.settings.trackClickRepeatFreq);
              }
              return isFirst = false;
            };
            cancelClick = function() {
              var scrollTimeout;
              scrollTimeout && clearTimeout(scrollTimeout);
              scrollTimeout = null;
              return $(document).unbind('mouseup.csp', cancelClick);
            };
            doScroll();
            $(document).bind('mouseup.csp', cancelClick);
            return false;
          }
        });
      }
      if (this.isScrollableH) {
        return this.horizontalTrack.bind('mousedown.csp', function(e) {
          var cancelClick, clickedTrack, direction, doScroll, isFirst, offset;
          if (e.originalTarget === void 0 || e.originalTarget === e.currentTarget) {
            clickedTrack = $(this);
            offset = clickedTrack.offset();
            direction = e.pageX - offset.left - this.horizontalDragPosition;
            isFirst = true;
            doScroll = function() {
              var contentDragX, dragX, pos, scrollTimeout;
              offset = clickedTrack.offset();
              pos = e.pageX - offset.left - horizontalDragWidth / 2;
              contentDragX = this.paneWidth * this.settings.scrollPagePercent;
              dragX = this.dragMaxX * contentDragX / (this.contentWidth - this.paneWidth);
              if (direction < 0) {
                if (this.horizontalDragPosition - dragX > pos) {
                  this.scrollByX(-contentDragX);
                } else {
                  positionDragX(pos);
                }
              } else if (direction > 0) {
                if (this.horizontalDragPosition + dragX < pos) {
                  this.scrollByX(contentDragX);
                } else {
                  positionDragX(pos);
                }
              } else {
                cancelClick();
                return;
              }
              if (isFirst) {
                scrollTimeout = setTimeout(doScroll, this.settings.initialDelay);
              } else {
                scrollTimeout = setTimeout(doScroll, this.settings.trackClickRepeatFreq);
              }
              return isFirst = false;
            };
            cancelClick = function() {
              var scrollTimeout;
              scrollTimeout && clearTimeout(scrollTimeout);
              scrollTimeout = null;
              return $(document).unbind('mouseup.csp', cancelClick);
            };
            doScroll();
            $(document).bind('mouseup.csp', cancelClick);
            return false;
          }
        });
      }
    };

    CScrollPane.prototype.removeClickOnTrack = function() {
      if (this.horizontalTrack) {
        this.horizontalTrack.unbind('mousedown.csp');
      }
      if (this.verticalTrack) {
        return this.verticalTrack.unbind('mousedown.csp');
      }
    };

    CScrollPane.prototype.cancelDrag = function() {
      $('html').unbind('dragstart.csp selectstart.csp mousemove.csp mouseup.csp mouseleave.csp');
      if (this.verticalDrag) {
        this.verticalDrag.removeClass('cspActive');
      }
      if (this.horizontalDrag) {
        return this.horizontalDrag.removeClass('cspActive');
      }
    };

    CScrollPane.prototype.positionDragY = function(destY, animate) {
      if (!this.isScrollableV) {
        return;
      }
      if (destY < 0) {
        destY = 0;
      } else if (destY > this.dragMaxY) {
        destY = this.dragMaxY;
      }
      if (animate === void 0) {
        animate = this.settings.animateScroll;
      }
      if (animate) {
        return this.animate(this.verticalDrag, 'top', destY, this._positionDragY);
      } else {
        this.verticalDrag.css('top', destY);
        return this._positionDragY(destY);
      }
    };

    CScrollPane.prototype._positionDragY = function(destY) {
      var destTop, isAtBottom, isAtTop, percentScrolled, wasAtBottom, wasAtTop;
      if (destY === void 0) {
        destY = this.verticalDrag.position().top;
      }
      this.container.scrollTop(0);
      this.verticalDragPosition = destY;
      isAtTop = this.verticalDragPosition === 0;
      isAtBottom = this.verticalDragPosition === this.dragMaxY;
      percentScrolled = destY / this.dragMaxY;
      destTop = -percentScrolled * (this.contentHeight - this.paneHeight);
      if (wasAtTop !== isAtTop || wasAtBottom !== isAtBottom) {
        wasAtTop = isAtTop;
        wasAtBottom = isAtBottom;
        this.elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, this.wasAtLeft, this.wasAtRight]);
      }
      this.updateVerticalArrows(isAtTop, isAtBottom);
      this.pane.css('top', destTop);
      return this.elem.trigger('csp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
    };

    CScrollPane.prototype.positionDragX = function(destX, animate) {
      if (!this.isScrollableH) {
        return;
      }
      if (destX < 0) {
        destX = 0;
      } else if (destX > this.dragMaxX) {
        destX = this.dragMaxX;
      }
      if (animate === void 0) {
        animate = this.settings.animateScroll;
      }
      if (animate) {
        return this.animate(this.horizontalDrag, 'left', destX, _positionDragX);
      } else {
        this.horizontalDrag.css('left', destX);
        return _positionDragX(destX);
      }
    };

    CScrollPane.prototype._positionDragX = function(destX) {
      var destLeft, isAtLeft, isAtRight, percentScrolled;
      if (destX === void 0) {
        destX = this.horizontalDrag.position().left;
      }
      this.container.scrollTop(0);
      this.horizontalDragPosition = destX;
      isAtLeft = this.horizontalDragPosition === 0;
      isAtRight = this.horizontalDragPosition === this.dragMaxX;
      percentScrolled = destX / this.dragMaxX;
      destLeft = -percentScrolled * (this.contentWidth - this.paneWidth);
      if (this.wasAtLeft !== isAtLeft || this.wasAtRight !== isAtRight) {
        this.wasAtLeft = isAtLeft;
        this.wasAtRight = isAtRight;
        this.elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, this.wasAtLeft, this.wasAtRight]);
      }
      this.updateHorizontalArrows(isAtLeft, isAtRight);
      this.pane.css('left', destLeft);
      return this.elem.trigger('csp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
    };

    CScrollPane.prototype.updateVerticalArrows = function(isAtTop, isAtBottom) {
      if (this.settings.showArrows) {
        arrowUp[isAtTop ? 'addClass' : 'removeClass']('cspDisabled');
        return arrowDown[isAtBottom ? 'addClass' : 'removeClass']('cspDisabled');
      }
    };

    CScrollPane.prototype.updateHorizontalArrows = function(isAtLeft, isAtRight) {
      if (this.settings.showArrows) {
        arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('cspDisabled');
        return arrowRight[isAtRight ? 'addClass' : 'removeClass']('cspDisabled');
      }
    };

    CScrollPane.prototype.scrollToY = function(destY, animate) {
      var percentScrolled;
      percentScrolled = destY / (this.contentHeight - this.paneHeight);
      return positionDragY(percentScrolled * this.dragMaxY, animate);
    };

    CScrollPane.prototype.scrollToX = function(destX, animate) {
      var percentScrolled;
      percentScrolled = destX / (this.contentWidth - this.paneWidth);
      return positionDragX(percentScrolled * this.dragMaxX, animate);
    };

    CScrollPane.prototype.scrollToElement = function(ele, stickToTop, animate) {
      var destX, destY, e, eleHeight, eleLeft, eleTop, eleWidth, err, maxVisibleEleLeft, maxVisibleEleTop, viewportLeft, viewportTop;
      eleTop = 0;
      eleLeft = 0;
      try {
        e = $(ele);
      } catch (_error) {
        err = _error;
        return;
      }
      eleHeight = e.outerHeight();
      eleWidth = e.outerWidth();
      this.container.scrollTop(0);
      this.container.scrollLeft(0);
      while (!e.is('.cspPane')) {
        eleTop += e.position().top;
        eleLeft += e.position().left;
        e = e.offsetParent();
        if (/^body|html$/i.test(e[0].nodeName)) {
          return;
        }
      }
      viewportTop = this.contentPositionY();
      maxVisibleEleTop = viewportTop + this.paneHeight;
      if (eleTop < viewportTop || stickToTop) {
        destY = eleTop - this.settings.verticalGutter;
      } else if (eleTop + eleHeight > maxVisibleEleTop) {
        destY = eleTop - this.paneHeight + eleHeight + this.settings.verticalGutter;
      }
      if (destY) {
        scrollToY(destY, animate);
      }
      viewportLeft = this.contentPositionX();
      maxVisibleEleLeft = viewportLeft + this.paneWidth;
      if (eleLeft < viewportLeft || stickToTop) {
        destX = eleLeft - this.settings.horizontalGutter;
      } else if (eleLeft + eleWidth > maxVisibleEleLeft) {
        destX = eleLeft - this.paneWidth + eleWidth + this.settings.horizontalGutter;
      }
      if (destX) {
        return scrollToX(destX, animate);
      }
    };

    CScrollPane.prototype.contentPositionX = function() {
      return -this.pane.position().left;
    };

    CScrollPane.prototype.contentPositionY = function() {
      return -this.pane.position().top;
    };

    CScrollPane.prototype.isCloseToBottom = function() {
      var scrollableHeight;
      scrollableHeight = this.contentHeight - this.paneHeight;
      return (scrollableHeight > 20) && (scrollableHeight - this.contentPositionY() < 10);
    };

    CScrollPane.prototype.isCloseToRight = function() {
      var scrollableWidth;
      scrollableWidth = this.contentWidth - this.paneWidth;
      return (scrollableWidth > 20) && (scrollableWidth - this.contentPositionX() < 10);
    };

    CScrollPane.prototype.initMousewheel = function() {
      var _this = this;
      return this.container.unbind(this.mwEvent).bind(this.mwEvent, function(event, delta, deltaX, deltaY) {
        var dX, dY;
        dX = _this.horizontalDragPosition;
        dY = _this.verticalDragPosition;
        _this.scrollBy(deltaX * _this.settings.mouseWheelSpeed, -deltaY * _this.settings.mouseWheelSpeed, false);
        return dX === _this.horizontalDragPosition && dY === _this.verticalDragPosition;
      });
    };

    CScrollPane.prototype.removeMousewheel = function() {
      return this.container.unbind(this.mwEvent);
    };

    CScrollPane.prototype.nil = function() {
      return false;
    };

    CScrollPane.prototype.initFocusHandler = function() {
      return this.pane.find(':input,a').unbind('focus.csp').bind('focus.csp', function(e) {
        return scrollToElement(e.target, false);
      });
    };

    CScrollPane.prototype.removeFocusHandler = function() {
      return this.pane.find(':input,a').unbind('focus.csp');
    };

    CScrollPane.prototype.initKeyboardNav = function() {
      var validParents;
      validParents = [];
      this.isScrollableH && validParents.push(this.horizontalBar[0]);
      this.isScrollableV && validParents.push(this.verticalBar[0]);
      this.pane.focus(function() {
        return this.elem.focus();
      });
      this.elem.attr('tabindex', 0).unbind('keydown.csp keypress.csp').bind('keydown.csp', function(e) {
        var dX, dY, elementHasScrolled, keyDown;
        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)) {
          return;
        }
        dX = this.horizontalDragPosition;
        dY = this.verticalDragPosition;
        switch (e.keyCode) {
          case 40:
          case 38:
          case 34:
          case 32:
          case 33:
          case 39:
          case 37:
            keyDown = e.keyCode;
            keyDownHandler();
            break;
          case 35:
            scrollToY(this.contentHeight - this.paneHeight);
            keyDown = null;
            break;
          case 36:
            scrollToY(0);
            keyDown = null;
        }
        elementHasScrolled = e.keyCode === keyDown && dX !== this.horizontalDragPosition || dY !== this.verticalDragPosition;
        return !elementHasScrolled;
      }).bind('keypress.csp', function(e) {
        if (e.keyCode === keyDown) {
          keyDownHandler();
        }
        return !elementHasScrolled;
      });
      if (this.settings.hideFocus) {
        this.elem.css('outline', 'none');
        if ((__indexOf.call(this.container[0], 'hideFocus') >= 0)) {
          this.elem.attr('hideFocus', true);
        }
      } else {
        this.elem.css('outline', '');
        if ((__indexOf.call(this.container[0], 'hideFocus') >= 0)) {
          this.elem.attr('hideFocus', false);
        }
      }
      return {
        keyDownHandler: function() {
          var dX, dY, elementHasScrolled;
          dX = this.horizontalDragPosition;
          dY = this.verticalDragPosition;
          switch (keyDown) {
            case 40:
              this.scrollByY(this.settings.keyboardSpeed, false);
              break;
            case 38:
              this.scrollByY(-this.settings.keyboardSpeed, false);
              break;
            case 34:
            case 32:
              this.scrollByY(this.paneHeight * this.settings.scrollPagePercent, false);
              break;
            case 33:
              this.scrollByY(-this.paneHeight * this.settings.scrollPagePercent, false);
              break;
            case 39:
              this.scrollByX(this.settings.keyboardSpeed, false);
              break;
            case 37:
              this.scrollByX(-this.settings.keyboardSpeed, false);
          }
          elementHasScrolled = dX !== this.horizontalDragPosition || dY !== this.verticalDragPosition;
          return elementHasScrolled;
        }
      };
    };

    CScrollPane.prototype.removeKeyboardNav = function() {
      return this.elem.attr('tabindex', '-1').removeAttr('tabindex').unbind('keydown.csp keypress.csp');
    };

    CScrollPane.prototype.observeHash = function() {
      var e, err, hash, retryInt;
      if (location.hash && location.hash.length > 1) {
        hash = escape(location.hash.substr(1));
        try {
          e = $('#' + hash + ', a[name="' + hash + '"]');
        } catch (_error) {
          err = _error;
          return;
        }
        if (e.length && this.pane.find(hash)) {
          if (this.container.scrollTop() === 0) {
            return retryInt = setInterval(function() {
              if (this.container.scrollTop() > 0) {
                scrollToElement(e, true);
                $(document).scrollTop(this.container.position().top);
                return clearInterval(retryInt);
              }
            }, 50);
          } else {
            scrollToElement(e, true);
            return $(document).scrollTop(this.container.position().top);
          }
        }
      }
    };

    CScrollPane.prototype.hijackInternalLinks = function() {
      if ($(document.body).data('cspHijack')) {
        return;
      }
      $(document.body).data('cspHijack', true);
      return $(document.body).delegate('a[href*=#]', 'click', function(event) {
        var csp, e, element, elementTop, hash, href, locationHref, scrollTop;
        href = this.href.substr(0, this.href.indexOf('#'));
        locationHref = location.href;
        if (location.href.indexOf('#') !== -1) {
          locationHref = location.href.substr(0, location.href.indexOf('#'));
        }
        if (href !== locationHref) {
          return;
        }
        hash = escape(this.href.substr(this.href.indexOf('#') + 1));
        element;
        try {
          element = $('#' + hash + ', a[name="' + hash + '"]');
        } catch (_error) {
          e = _error;
          return;
        }
        if (!element.length) {
          return;
        }
        this.container = element.closest('.cspScrollable');
        csp = this.container.data('csp');
        this.scrollToElement(element, true);
        if (this.container[0].scrollIntoView) {
          scrollTop = $(window).scrollTop();
          elementTop = element.offset().top;
          if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
            this.container[0].scrollIntoView();
          }
        }
        return event.preventDefault();
      });
    };

    CScrollPane.prototype.initTouch = function() {
      var moving;
      moving = false;
      return this.container.unbind('touchstart.csp touchmove.csp touchend.csp click.csp-touchclick').bind('touchstart.csp', function(e) {
        var moved, startX, startY, touch, touchStartX, touchStartY;
        touch = e.originalEvent.touches[0];
        startX = this.contentPositionX();
        startY = this.contentPositionY();
        touchStartX = touch.pageX;
        touchStartY = touch.pageY;
        moved = false;
        return moving = true;
      }).bind('touchmove.csp', function(ev) {
        var dX, dY, moved, touchPos;
        if (!moving) {
          return;
        }
        touchPos = ev.originalEvent.touches[0];
        dX = this.horizontalDragPosition;
        dY = this.verticalDragPosition;
        this.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);
        moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
        return dX === this.horizontalDragPosition && dY === this.verticalDragPosition;
      }).bind('touchend.csp', function(e) {
        return moving = false;
      }).bind('click.csp-touchclick', function(e) {
        var moved;
        if (moved) {
          moved = false;
          return false;
        }
      });
    };

    CScrollPane.prototype.destroy = function() {
      var currentX, currentY;
      currentY = this.contentPositionY();
      currentX = this.contentPositionX();
      this.elem.removeClass('cspScrollable').unbind('.csp');
      this.elem.replaceWith(originalElement.append(this.pane.children()));
      originalElement.scrollTop(currentY);
      originalElement.scrollLeft(currentX);
      if (reinitialiseInterval) {
        return clearInterval(reinitialiseInterval);
      }
    };

    CScrollPane.prototype.reinitialise = function(s) {
      s = $.extend({}, this.settings, s);
      return this.initialise(s);
    };

    CScrollPane.prototype.scrollTo = function(destX, destY, animate) {
      this.scrollToX(destX, animate);
      return this.scrollToY(destY, animate);
    };

    CScrollPane.prototype.scrollToPercentX = function(destPercentX, animate) {
      return this.scrollToX(destPercentX * (this.contentWidth - this.paneWidth), animate);
    };

    CScrollPane.prototype.scrollToPercentY = function(destPercentY, animate) {
      return this.scrollToY(destPercentY * (this.contentHeight - this.paneHeight), animate);
    };

    CScrollPane.prototype.scrollBy = function(deltaX, deltaY, animate) {
      this.scrollByX(deltaX, animate);
      return this.scrollByY(deltaY, animate);
    };

    CScrollPane.prototype.scrollByX = function(deltaX, animate) {
      var destX, percentScrolled;
      destX = this.contentPositionX() + Math[deltaX < 0 ? 'floor' : 'ceil'](deltaX);
      percentScrolled = destX / (this.contentWidth - this.paneWidth);
      return this.positionDragX(percentScrolled * this.dragMaxX, animate);
    };

    CScrollPane.prototype.scrollByY = function(deltaY, animate) {
      var destY, percentScrolled;
      destY = this.contentPositionY() + Math[deltaY < 0 ? 'floor' : 'ceil'](deltaY);
      percentScrolled = destY / (this.contentHeight - this.paneHeight);
      return this.positionDragY(percentScrolled * this.dragMaxY, animate);
    };

    CScrollPane.prototype.animate = function(ele, prop, value, stepCallback) {
      var params;
      params = {};
      params[prop] = value;
      return ele.animate(params, {
        'duration': this.settings.animateDuration,
        'easing': this.settings.animateEase,
        'queue': false,
        'step': stepCallback
      });
    };

    CScrollPane.prototype.getContentPositionX = function() {
      return this.contentPositionX();
    };

    CScrollPane.prototype.getContentPositionY = function() {
      return this.contentPositionY();
    };

    CScrollPane.prototype.getContentWidth = function() {
      return this.contentWidth;
    };

    CScrollPane.prototype.getContentHeight = function() {
      return this.contentHeight;
    };

    CScrollPane.prototype.getPercentScrolledX = function() {
      return this.contentPositionX() / (this.contentWidth - this.paneWidth);
    };

    CScrollPane.prototype.getPercentScrolledY = function() {
      return this.contentPositionY() / (this.contentHeight - this.paneHeight);
    };

    CScrollPane.prototype.getIsScrollableH = function() {
      return this.isScrollableH;
    };

    CScrollPane.prototype.getIsScrollableV = function() {
      return this.isScrollableV;
    };

    CScrollPane.prototype.getContentPane = function() {
      return this.pane;
    };

    CScrollPane.prototype.scrollToBottom = function(animate) {
      return this.positionDragY(this.dragMaxY, animate);
    };

    CScrollPane.prototype.hijackInternalLinks = $.noop;

    return CScrollPane;

  })();

  $.fn.cScrollPane = function(settings) {
    settings = $.extend({}, CScrollPane.defaults, settings);
    $.each(['arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
      return settings[this] = settings[this] || settings.speed;
    });
    return this.each(function() {
      var cspApi, elem;
      elem = $(this);
      cspApi = elem.data('csp');
      if (cspApi) {
        return cspApi.reinitialise(settings);
      } else {
        $("script", elem).filter('[type="text/javascript"],:not([type])').remove();
        cspApi = new CScrollPane(elem, settings);
        elem.data('csp', cspApi);
        return cspApi.initialise(settings);
      }
    });
  };

}).call(this);
