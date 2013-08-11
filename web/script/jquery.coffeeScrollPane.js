(function() {
  var CScrollPane, CScrollPaneApi,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CScrollPane = (function() {
    var defaults;

    defaults = {
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
      this.wasAtTop = true;
      this.wasAtLeft = true;
      this.wasAtBottom = false;
      this.wasAtRight = false;
      this.originalElement = elem.clone(false, false).empty();
      this.mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.csp' : 'mousewheel.csp';
      this.originalPadding = "" + (elem.css('paddingTop')) + " " + (elem.css('paddingRight')) + " " + (elem.css('paddingBottom')) + " " + (elem.css('paddingLeft'));
      this.originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) + (parseInt(elem.css('paddingRight'), 10) || 0);
    }

    CScrollPane.prototype.initialise = function(s) {
      var container, contentHeight, contentWidth, hasContainingSpaceChanged, isMaintainingPositon, isScrollableH, isScrollableV, lastContentX, lastContentY, maintainAtBottom, maintainAtRight, originalScrollLeft, originalScrollTop, pane, paneHeight, paneWidth, percentInViewH, percentInViewV, previousContentWidth, reinitialiseInterval, settings;
      maintainAtBottom = false;
      maintainAtRight = false;
      settings = s;
      if (typeof pane === "undefined" || pane === null) {
        originalScrollTop = elem.scrollTop();
        originalScrollLeft = elem.scrollLeft();
        elem.css({
          overflow: 'hidden',
          padding: 0
        });
        paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
        paneHeight = elem.innerHeight();
        elem.width(paneWidth);
        pane = $('<div class="cspPane" />').css('padding', originalPadding).append(elem.children());
        container = $('<div class="cspContainer" />').css({
          'width': paneWidth + 'px',
          'height': paneHeight + 'px'
        }).append(pane).appendTo(elem);
      } else {
        elem.css('width', '');
        maintainAtBottom = settings.stickToBottom && isCloseToBottom();
        maintainAtRight = settings.stickToRight && isCloseToRight();
        hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth !== paneWidth || elem.outerHeight() !== paneHeight;
        if (hasContainingSpaceChanged) {
          paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
          paneHeight = elem.innerHeight();
          container.css({
            width: paneWidth + 'px',
            height: paneHeight + 'px'
          });
        }
        if (!hasContainingSpaceChanged && previousContentWidth === contentWidth && pane.outerHeight() === contentHeight) {
          elem.width(paneWidth);
          return;
        }
        previousContentWidth = contentWidth;
        pane.css('width', '');
        elem.width(paneWidth);
        container.find('>.cspVerticalBar,>.cspHorizontalBar').remove().end();
      }
      pane.css('overflow', 'auto');
      if (s.contentWidth) {
        contentWidth = s.contentWidth;
      } else {
        contentWidth = pane[0].scrollWidth;
      }
      contentHeight = pane[0].scrollHeight;
      pane.css('overflow', '');
      percentInViewH = contentWidth / paneWidth;
      percentInViewV = contentHeight / paneHeight;
      isScrollableV = percentInViewV > 1;
      isScrollableH = percentInViewH > 1;
      if (!(isScrollableH || isScrollableV)) {
        elem.removeClass('cspScrollable');
        pane.css({
          top: 0,
          width: container.width() - originalPaddingTotalWidth
        });
        removeMousewheel();
        removeFocusHandler();
        removeKeyboardNav();
        removeClickOnTrack();
      } else {
        elem.addClass('cspScrollable');
        isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
        if (isMaintainingPositon) {
          lastContentX = contentPositionX();
          lastContentY = contentPositionY();
        }
        initialiseVerticalScroll();
        initialiseHorizontalScroll();
        resizeScrollbars();
        if (isMaintainingPositon) {
          if (maintainAtRight) {
            scrollToX(contentWidth - paneWidth, false);
          } else {
            scrollToX(lastContentX, false);
          }
          if (maintainAtBottom) {
            scrollToY(contentHeight - paneHeight, false);
          } else {
            scrollToY(lastContentY, false);
          }
        }
        initFocusHandler();
        initMousewheel();
        initTouch();
        if (settings.enableKeyboardNavigation) {
          initKeyboardNav();
        }
        if (settings.clickOnTrack) {
          initClickOnTrack();
        }
        observeHash();
        if (settings.hijackInternalLinks) {
          hijackInternalLinks();
        }
      }
      if (settings.autoReinitialise && !reinitialiseInterval) {
        reinitialiseInterval = setInterval(function() {
          return initialise(settings);
        }, settings.autoReinitialiseDelay);
      } else if (!settings.autoReinitialise && reinitialiseInterval) {
        clearInterval(reinitialiseInterval);
      }
      originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
      originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);
      return elem.trigger('csp-initialised', [isScrollableH || isScrollableV]);
    };

    CScrollPane.prototype.initialiseVerticalScroll = function() {
      var arrowDown, arrowUp, verticalBar, verticalDrag, verticalTrack, verticalTrackHeight;
      if (isScrollableV) {
        container.append($('<div class="cspVerticalBar" />').append($('<div class="cspCap cspCapTop" />'), $('<div class="cspTrack" />').append($('<div class="cspDrag" />').append($('<div class="cspDragTop" />'), $('<div class="cspDragBottom" />'))), $('<div class="cspCap cspCapBottom" />')));
        verticalBar = container.find('>.cspVerticalBar');
        verticalTrack = verticalBar.find('>.cspTrack');
        verticalDrag = verticalTrack.find('>.cspDrag');
        if (settings.showArrows) {
          arrowUp = $('<a class="cspArrow cspArrowUp" />').bind('mousedown.csp', getArrowScroll(0, -1)).bind('click.csp', nil);
          arrowDown = $('<a class="cspArrow cspArrowDown" />').bind('mousedown.csp', getArrowScroll(0, 1)).bind('click.csp', nil);
          if (settings.arrowScrollOnHover) {
            arrowUp.bind('mouseover.csp', getArrowScroll(0, -1, arrowUp));
            arrowDown.bind('mouseover.csp', getArrowScroll(0, 1, arrowDown));
          }
          appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
        }
        verticalTrackHeight = paneHeight;
        container.find('>.cspVerticalBar>.cspCap:visible,>.cspVerticalBar>.cspArrow').each(function() {
          return verticalTrackHeight -= $(this).outerHeight();
        });
        verticalDrag.hover(function() {
          return verticalDrag.addClass('cspHover');
        }, function() {
          return verticalDrag.removeClass('cspHover');
        }).bind('mousedown.csp', function(e) {
          var startY;
          $('html').bind('dragstart.csp selectstart.csp', nil);
          verticalDrag.addClass('cspActive');
          startY = e.pageY - verticalDrag.position().top;
          $('html').bind('mousemove.csp', function(e) {
            return positionDragY(e.pageY - startY, false);
          }).bind('mouseup.csp mouseleave.csp', cancelDrag);
          return false;
        });
        return sizeVerticalScrollbar();
      }
    };

    CScrollPane.prototype.sizeVerticalScrollbar = function() {
      var err, scrollbarWidth, verticalDragPosition;
      verticalTrack.height(verticalTrackHeight + 'px');
      verticalDragPosition = 0;
      scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();
      pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);
      try {
        if (verticalBar.position().left === 0) {
          return pane.css('margin-left', scrollbarWidth + 'px');
        }
      } catch (_error) {
        err = _error;
      }
    };

    CScrollPane.prototype.initialiseHorizontalScroll = function() {
      var arrowLeft, arrowRight, horizontalBar, horizontalDrag, horizontalTrack, horizontalTrackWidth;
      if (isScrollableH) {
        container.append($('<div class="cspHorizontalBar" />').append($('<div class="cspCap cspCapLeft" />'), $('<div class="cspTrack" />').append($('<div class="cspDrag" />').append($('<div class="cspDragLeft" />'), $('<div class="cspDragRight" />'))), $('<div class="cspCap cspCapRight" />')));
        horizontalBar = container.find('>.cspHorizontalBar');
        horizontalTrack = horizontalBar.find('>.cspTrack');
        horizontalDrag = horizontalTrack.find('>.cspDrag');
        if (settings.showArrows) {
          arrowLeft = $('<a class="cspArrow cspArrowLeft" />').bind('mousedown.csp', getArrowScroll(-1, 0)).bind('click.csp', nil);
          arrowRight = $('<a class="cspArrow cspArrowRight" />').bind('mousedown.csp', getArrowScroll(1, 0)).bind('click.csp', nil);
          if (settings.arrowScrollOnHover) {
            arrowLeft.bind('mouseover.csp', getArrowScroll(-1, 0, arrowLeft));
            arrowRight.bind('mouseover.csp', getArrowScroll(1, 0, arrowRight));
          }
          appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
        }
        horizontalDrag.hover(function() {
          return horizontalDrag.addClass('cspHover');
        }, function() {
          return horizontalDrag.removeClass('cspHover');
        }).bind('mousedown.csp', function(e) {
          var startX;
          $('html').bind('dragstart.csp selectstart.csp', nil);
          horizontalDrag.addClass('cspActive');
          startX = e.pageX - horizontalDrag.position().left;
          $('html').bind('mousemove.csp', function(e) {
            return positionDragX(e.pageX - startX, false);
          }).bind('mouseup.csp mouseleave.csp', cancelDrag);
          return false;
        });
        horizontalTrackWidth = container.innerWidth();
        return sizeHorizontalScrollbar();
      }
    };

    CScrollPane.prototype.sizeHorizontalScrollbar = function() {
      var horizontalDragPosition;
      container.find('>.cspHorizontalBar>.cspCap:visible,>.cspHorizontalBar>.cspArrow').each(function() {
        return horizontalTrackWidth -= $(this).outerWidth();
      });
      horizontalTrack.width(horizontalTrackWidth + 'px');
      return horizontalDragPosition = 0;
    };

    CScrollPane.prototype.resizeScrollbars = function() {
      var contentHeight, dragMaxX, dragMaxY, horizontalDragWidth, horizontalTrackHeight, percentInViewV, verticalDragHeight, verticalTrackWidth;
      if (isScrollableH && isScrollableV) {
        horizontalTrackHeight = horizontalTrack.outerHeight();
        verticalTrackWidth = verticalTrack.outerWidth();
        verticalTrackHeight -= horizontalTrackHeight;
        $(horizontalBar).find('>.cspCap:visible,>.cspArrow').each(function() {
          return horizontalTrackWidth += $(this).outerWidth();
        });
        horizontalTrackWidth -= verticalTrackWidth;
        paneHeight -= verticalTrackWidth;
        paneWidth -= horizontalTrackHeight;
        horizontalTrack.parent().append($('<div class="cspCorner" />').css('width', horizontalTrackHeight + 'px'));
        sizeVerticalScrollbar();
        sizeHorizontalScrollbar();
      }
      if (isScrollableH) {
        pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
      }
      contentHeight = pane.outerHeight();
      percentInViewV = contentHeight / paneHeight;
      if (isScrollableH) {
        horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
        if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
          horizontalDragWidth = settings.horizontalDragMaxWidth;
        } else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
          horizontalDragWidth = settings.horizontalDragMinWidth;
        }
        horizontalDrag.width(horizontalDragWidth + 'px');
        dragMaxX = horizontalTrackWidth - horizontalDragWidth;
        _positionDragX(horizontalDragPosition);
      }
      if (isScrollableV) {
        verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
        if (verticalDragHeight > settings.verticalDragMaxHeight) {
          verticalDragHeight = settings.verticalDragMaxHeight;
        } else if (verticalDragHeight < settings.verticalDragMinHeight) {
          verticalDragHeight = settings.verticalDragMinHeight;
        }
        verticalDrag.height(verticalDragHeight + 'px');
        dragMaxY = verticalTrackHeight - verticalDragHeight;
        return _positionDragY(verticalDragPosition);
      }
    };

    CScrollPane.prototype.appendArrows = function(ele, p, a1, a2) {
      var aTemp, p1, p2, _ref;
      p1 = "before";
      p2 = "after";
      if (p === "os") {
        p = (_ref = /Mac/.test(navigator.platform)) != null ? _ref : {
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
          csp.scrollByX(dirX * settings.arrowButtonSpeed);
        }
        if (dirY !== 0) {
          csp.scrollByY(dirY * settings.arrowButtonSpeed);
        }
        if (isFirst) {
          scrollTimeout = setTimeout(doScroll, settings.initialDelay);
        } else {
          scrollTimeout = setTimeout(doScroll, settings.arrowRepeatFreq);
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
      if (isScrollableV) {
        verticalTrack.bind('mousedown.csp', function(e) {
          var cancelClick, clickedTrack, direction, doScroll, isFirst, offset;
          if (e.originalTarget === void 0 || e.originalTarget === e.currentTarget) {
            clickedTrack = $(this);
            offset = clickedTrack.offset();
            direction = e.pageY - offset.top - verticalDragPosition;
            isFirst = true;
            doScroll = function() {
              var contentDragY, dragY, pos, scrollTimeout;
              offset = clickedTrack.offset();
              pos = e.pageY - offset.top - verticalDragHeight / 2;
              contentDragY = paneHeight * settings.scrollPagePercent;
              dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
              if (direction < 0) {
                if (verticalDragPosition - dragY > pos) {
                  csp.scrollByY(-contentDragY);
                } else {
                  positionDragY(pos);
                }
              } else if (direction > 0) {
                if (verticalDragPosition + dragY < pos) {
                  csp.scrollByY(contentDragY);
                } else {
                  positionDragY(pos);
                }
              } else {
                cancelClick();
                return;
              }
              if (isFirst) {
                scrollTimeout = setTimeout(doScroll, settings.initialDelay);
              } else {
                scrollTimeout = setTimeout(doScroll, settings.trackClickRepeatFreq);
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
      if (isScrollableH) {
        return horizontalTrack.bind('mousedown.csp', function(e) {
          var cancelClick, clickedTrack, direction, doScroll, isFirst, offset;
          if (e.originalTarget === void 0 || e.originalTarget === e.currentTarget) {
            clickedTrack = $(this);
            offset = clickedTrack.offset();
            direction = e.pageX - offset.left - horizontalDragPosition;
            isFirst = true;
            doScroll = function() {
              var contentDragX, dragX, pos, scrollTimeout;
              offset = clickedTrack.offset();
              pos = e.pageX - offset.left - horizontalDragWidth / 2;
              contentDragX = paneWidth * settings.scrollPagePercent;
              dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
              if (direction < 0) {
                if (horizontalDragPosition - dragX > pos) {
                  csp.scrollByX(-contentDragX);
                } else {
                  positionDragX(pos);
                }
              } else if (direction > 0) {
                if (horizontalDragPosition + dragX < pos) {
                  csp.scrollByX(contentDragX);
                } else {
                  positionDragX(pos);
                }
              } else {
                cancelClick();
                return;
              }
              if (isFirst) {
                scrollTimeout = setTimeout(doScroll, settings.initialDelay);
              } else {
                scrollTimeout = setTimeout(doScroll, settings.trackClickRepeatFreq);
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
      if (horizontalTrack) {
        horizontalTrack.unbind('mousedown.csp');
      }
      if (verticalTrack) {
        return verticalTrack.unbind('mousedown.csp');
      }
    };

    CScrollPane.prototype.cancelDrag = function() {
      $('html').unbind('dragstart.csp selectstart.csp mousemove.csp mouseup.csp mouseleave.csp');
      if (verticalDrag) {
        verticalDrag.removeClass('cspActive');
      }
      if (horizontalDrag) {
        return horizontalDrag.removeClass('cspActive');
      }
    };

    CScrollPane.prototype.positionDragY = function(destY, animate) {
      if (!isScrollableV) {
        return;
      }
      if (destY < 0) {
        destY = 0;
      } else if (destY > dragMaxY) {
        destY = dragMaxY;
      }
      if (animate === void 0) {
        animate = settings.animateScroll;
      }
      if (animate) {
        return csp.animate(verticalDrag, 'top', destY, _positionDragY);
      } else {
        verticalDrag.css('top', destY);
        return _positionDragY(destY);
      }
    };

    CScrollPane.prototype._positionDragY = function(destY) {
      var destTop, isAtBottom, isAtTop, percentScrolled, verticalDragPosition, wasAtBottom, wasAtTop;
      if (destY === void 0) {
        destY = verticalDrag.position().top;
      }
      container.scrollTop(0);
      verticalDragPosition = destY;
      isAtTop = verticalDragPosition === 0;
      isAtBottom = verticalDragPosition === dragMaxY;
      percentScrolled = destY / dragMaxY;
      destTop = -percentScrolled * (contentHeight - paneHeight);
      if (wasAtTop !== isAtTop || wasAtBottom !== isAtBottom) {
        wasAtTop = isAtTop;
        wasAtBottom = isAtBottom;
        elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
      }
      updateVerticalArrows(isAtTop, isAtBottom);
      pane.css('top', destTop);
      return elem.trigger('csp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
    };

    CScrollPane.prototype.positionDragX = function(destX, animate) {
      if (!isScrollableH) {
        return;
      }
      if (destX < 0) {
        destX = 0;
      } else if (destX > dragMaxX) {
        destX = dragMaxX;
      }
      if (animate === void 0) {
        animate = settings.animateScroll;
      }
      if (animate) {
        return csp.animate(horizontalDrag, 'left', destX, _positionDragX);
      } else {
        horizontalDrag.css('left', destX);
        return _positionDragX(destX);
      }
    };

    CScrollPane.prototype._positionDragX = function(destX) {
      var destLeft, horizontalDragPosition, isAtLeft, isAtRight, percentScrolled, wasAtLeft, wasAtRight;
      if (destX === void 0) {
        destX = horizontalDrag.position().left;
      }
      container.scrollTop(0);
      horizontalDragPosition = destX;
      isAtLeft = horizontalDragPosition === 0;
      isAtRight = horizontalDragPosition === dragMaxX;
      percentScrolled = destX / dragMaxX;
      destLeft = -percentScrolled * (contentWidth - paneWidth);
      if (wasAtLeft !== isAtLeft || wasAtRight !== isAtRight) {
        wasAtLeft = isAtLeft;
        wasAtRight = isAtRight;
        elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
      }
      updateHorizontalArrows(isAtLeft, isAtRight);
      pane.css('left', destLeft);
      return elem.trigger('csp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
    };

    CScrollPane.prototype.updateVerticalArrows = function(isAtTop, isAtBottom) {
      if (settings.showArrows) {
        arrowUp[isAtTop ? 'addClass' : 'removeClass']('cspDisabled');
        return arrowDown[isAtBottom ? 'addClass' : 'removeClass']('cspDisabled');
      }
    };

    CScrollPane.prototype.updateHorizontalArrows = function(isAtLeft, isAtRight) {
      if (settings.showArrows) {
        arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('cspDisabled');
        return arrowRight[isAtRight ? 'addClass' : 'removeClass']('cspDisabled');
      }
    };

    CScrollPane.prototype.scrollToY = function(destY, animate) {
      var percentScrolled;
      percentScrolled = destY / (contentHeight - paneHeight);
      return positionDragY(percentScrolled * dragMaxY, animate);
    };

    CScrollPane.prototype.scrollToX = function(destX, animate) {
      var percentScrolled;
      percentScrolled = destX / (contentWidth - paneWidth);
      return positionDragX(percentScrolled * dragMaxX, animate);
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
      container.scrollTop(0);
      container.scrollLeft(0);
      while (!e.is('.cspPane')) {
        eleTop += e.position().top;
        eleLeft += e.position().left;
        e = e.offsetParent();
        if (/^body|html$/i.test(e[0].nodeName)) {
          return;
        }
      }
      viewportTop = contentPositionY();
      maxVisibleEleTop = viewportTop + paneHeight;
      if (eleTop < viewportTop || stickToTop) {
        destY = eleTop - settings.verticalGutter;
      } else if (eleTop + eleHeight > maxVisibleEleTop) {
        destY = eleTop - paneHeight + eleHeight + settings.verticalGutter;
      }
      if (destY) {
        scrollToY(destY, animate);
      }
      viewportLeft = contentPositionX();
      maxVisibleEleLeft = viewportLeft + paneWidth;
      if (eleLeft < viewportLeft || stickToTop) {
        destX = eleLeft - settings.horizontalGutter;
      } else if (eleLeft + eleWidth > maxVisibleEleLeft) {
        destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
      }
      if (destX) {
        return scrollToX(destX, animate);
      }
    };

    CScrollPane.prototype.contentPositionX = function() {
      return -pane.position().left;
    };

    CScrollPane.prototype.contentPositionY = function() {
      return -pane.position().top;
    };

    CScrollPane.prototype.isCloseToBottom = function() {
      var scrollableHeight;
      scrollableHeight = contentHeight - paneHeight;
      return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
    };

    CScrollPane.prototype.isCloseToRight = function() {
      var scrollableWidth;
      scrollableWidth = contentWidth - paneWidth;
      return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
    };

    CScrollPane.prototype.initMousewheel = function() {
      return container.unbind(mwEvent).bind(mwEvent, function(event, delta, deltaX, deltaY) {
        var dX, dY;
        dX = horizontalDragPosition;
        dY = verticalDragPosition;
        csp.scrollBy(deltaX * settings.mouseWheelSpeed, -deltaY * settings.mouseWheelSpeed, false);
        return dX === horizontalDragPosition && dY === verticalDragPosition;
      });
    };

    CScrollPane.prototype.removeMousewheel = function() {
      return container.unbind(mwEvent);
    };

    CScrollPane.prototype.nil = function() {
      return false;
    };

    CScrollPane.prototype.initFocusHandler = function() {
      return pane.find(':input,a').unbind('focus.csp').bind('focus.csp', function(e) {
        return scrollToElement(e.target, false);
      });
    };

    CScrollPane.prototype.removeFocusHandler = function() {
      return pane.find(':input,a').unbind('focus.csp');
    };

    CScrollPane.prototype.initKeyboardNav = function() {
      var validParents;
      validParents = [];
      isScrollableH && validParents.push(horizontalBar[0]);
      isScrollableV && validParents.push(verticalBar[0]);
      pane.focus(function() {
        return elem.focus();
      });
      elem.attr('tabindex', 0).unbind('keydown.csp keypress.csp').bind('keydown.csp', function(e) {
        var dX, dY, elementHasScrolled, keyDown;
        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)) {
          return;
        }
        dX = horizontalDragPosition;
        dY = verticalDragPosition;
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
            scrollToY(contentHeight - paneHeight);
            keyDown = null;
            break;
          case 36:
            scrollToY(0);
            keyDown = null;
        }
        elementHasScrolled = e.keyCode === keyDown && dX !== horizontalDragPosition || dY !== verticalDragPosition;
        return !elementHasScrolled;
      }).bind('keypress.csp', function(e) {
        if (e.keyCode === keyDown) {
          keyDownHandler();
        }
        return !elementHasScrolled;
      });
      if (settings.hideFocus) {
        elem.css('outline', 'none');
        if ((__indexOf.call(container[0], 'hideFocus') >= 0)) {
          elem.attr('hideFocus', true);
        }
      } else {
        elem.css('outline', '');
        if ((__indexOf.call(container[0], 'hideFocus') >= 0)) {
          elem.attr('hideFocus', false);
        }
      }
      return {
        keyDownHandler: function() {
          var dX, dY, elementHasScrolled;
          dX = horizontalDragPosition;
          dY = verticalDragPosition;
          switch (keyDown) {
            case 40:
              csp.scrollByY(settings.keyboardSpeed, false);
              break;
            case 38:
              csp.scrollByY(-settings.keyboardSpeed, false);
              break;
            case 34:
            case 32:
              csp.scrollByY(paneHeight * settings.scrollPagePercent, false);
              break;
            case 33:
              csp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
              break;
            case 39:
              csp.scrollByX(settings.keyboardSpeed, false);
              break;
            case 37:
              csp.scrollByX(-settings.keyboardSpeed, false);
          }
          elementHasScrolled = dX !== horizontalDragPosition || dY !== verticalDragPosition;
          return elementHasScrolled;
        }
      };
    };

    CScrollPane.prototype.removeKeyboardNav = function() {
      return elem.attr('tabindex', '-1').removeAttr('tabindex').unbind('keydown.csp keypress.csp');
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
        if (e.length && pane.find(hash)) {
          if (container.scrollTop() === 0) {
            return retryInt = setInterval(function() {
              if (container.scrollTop() > 0) {
                scrollToElement(e, true);
                $(document).scrollTop(container.position().top);
                return clearInterval(retryInt);
              }
            }, 50);
          } else {
            scrollToElement(e, true);
            return $(document).scrollTop(container.position().top);
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
        var container, csp, e, element, elementTop, hash, href, locationHref, scrollTop;
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
        container = element.closest('.cspScrollable');
        csp = container.data('csp');
        csp.scrollToElement(element, true);
        if (container[0].scrollIntoView) {
          scrollTop = $(window).scrollTop();
          elementTop = element.offset().top;
          if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
            container[0].scrollIntoView();
          }
        }
        return event.preventDefault();
      });
    };

    CScrollPane.prototype.initTouch = function() {
      var moving;
      moving = false;
      return container.unbind('touchstart.csp touchmove.csp touchend.csp click.csp-touchclick').bind('touchstart.csp', function(e) {
        var moved, startX, startY, touch, touchStartX, touchStartY;
        touch = e.originalEvent.touches[0];
        startX = contentPositionX();
        startY = contentPositionY();
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
        dX = horizontalDragPosition;
        dY = verticalDragPosition;
        csp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);
        moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
        return dX === horizontalDragPosition && dY === verticalDragPosition;
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
      currentY = contentPositionY();
      currentX = contentPositionX();
      elem.removeClass('cspScrollable').unbind('.csp');
      elem.replaceWith(originalElement.append(pane.children()));
      originalElement.scrollTop(currentY);
      originalElement.scrollLeft(currentX);
      if (reinitialiseInterval) {
        return clearInterval(reinitialiseInterval);
      }
    };

    return CScrollPane;

  })();

  CScrollPaneApi = (function() {
    function CScrollPaneApi() {}

    CScrollPaneApi.prototype.reinitialise = function(s) {
      s = $.extend({}, settings, s);
      return initialise(s);
    };

    CScrollPaneApi.prototype.scrollToElement = function(ele, stickToTop, animate) {
      return scrollToElement(ele, stickToTop, animate);
    };

    CScrollPaneApi.prototype.scrollTo = function(destX, destY, animate) {
      scrollToX(destX, animate);
      return scrollToY(destY, animate);
    };

    CScrollPaneApi.prototype.scrollToX = function(destX, animate) {
      return scrollToX(destX, animate);
    };

    CScrollPaneApi.prototype.scrollToY = function(destY, animate) {
      return scrollToY(destY, animate);
    };

    CScrollPaneApi.prototype.scrollToPercentX = function(destPercentX, animate) {
      return scrollToX(destPercentX * (contentWidth - paneWidth), animate);
    };

    CScrollPaneApi.prototype.scrollToPercentY = function(destPercentY, animate) {
      return scrollToY(destPercentY * (contentHeight - paneHeight), animate);
    };

    CScrollPaneApi.prototype.scrollBy = function(deltaX, deltaY, animate) {
      csp.scrollByX(deltaX, animate);
      return csp.scrollByY(deltaY, animate);
    };

    CScrollPaneApi.prototype.scrollByX = function(deltaX, animate) {
      var destX, percentScrolled, _ref;
      destX = contentPositionX() + Math[(_ref = deltaX < 0) != null ? _ref : {
        'floor': 'ceil'
      }](deltaX);
      percentScrolled = destX / (contentWidth - paneWidth);
      return positionDragX(percentScrolled * dragMaxX, animate);
    };

    CScrollPaneApi.prototype.scrollByY = function(deltaY, animate) {
      var destY, percentScrolled, _ref;
      destY = contentPositionY() + Math[(_ref = deltaY < 0) != null ? _ref : {
        'floor': 'ceil'
      }](deltaY);
      percentScrolled = destY / (contentHeight - paneHeight);
      return positionDragY(percentScrolled * dragMaxY, animate);
    };

    CScrollPaneApi.prototype.positionDragX = function(x, animate) {
      return positionDragX(x, animate);
    };

    CScrollPaneApi.prototype.positionDragY = function(y, animate) {
      return positionDragY(y, animate);
    };

    CScrollPaneApi.prototype.animate = function(ele, prop, value, stepCallback) {
      var params;
      params = {};
      params[prop] = value;
      return ele.animate(params, {
        'duration': settings.animateDuration,
        'easing': settings.animateEase,
        'queue': false,
        'step': stepCallback
      });
    };

    CScrollPaneApi.prototype.getContentPositionX = function() {
      return contentPositionX();
    };

    CScrollPaneApi.prototype.getContentPositionY = function() {
      return contentPositionY();
    };

    CScrollPaneApi.prototype.getContentWidth = function() {
      return contentWidth;
    };

    CScrollPaneApi.prototype.getContentHeight = function() {
      return contentHeight;
    };

    CScrollPaneApi.prototype.getPercentScrolledX = function() {
      return contentPositionX() / (contentWidth - paneWidth);
    };

    CScrollPaneApi.prototype.getPercentScrolledY = function() {
      return contentPositionY() / (contentHeight - paneHeight);
    };

    CScrollPaneApi.prototype.getIsScrollableH = function() {
      return isScrollableH;
    };

    CScrollPaneApi.prototype.getIsScrollableV = function() {
      return isScrollableV;
    };

    CScrollPaneApi.prototype.getContentPane = function() {
      return pane;
    };

    CScrollPaneApi.prototype.scrollToBottom = function(animate) {
      return positionDragY(dragMaxY, animate);
    };

    CScrollPaneApi.prototype.hijackInternalLinks = $.noop;

    CScrollPaneApi.prototype.destroy = function() {
      return destroy();
    };

    return CScrollPaneApi;

  })();

  $.fn.cScrollPane = function(settings) {
    settings = $.extend({}, CScrollPane.defaults, settings);
    $.each(['arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
      return settings[this] = settings[this] || settings.speed;
    });
    console.log(this);
    return this.each(function() {
      var cspApi, elem;
      elem = $(this);
      cspApi = elem.data('csp');
      if (cspApi) {
        return cspApi.reinitialise(settings);
      } else {
        $("script", elem).filter('[type="text/javascript"],:not([type])').remove();
        cspApi = new CScrollPane(elem, settings);
        console.log(cspApi);
        return elem.data('csp', cspApi);
      }
    });
  };

}).call(this);
