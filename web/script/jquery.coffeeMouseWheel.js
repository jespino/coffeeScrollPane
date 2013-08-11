(function() {
  var register,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  register = function(factory) {
    if (typeof define === 'function' && define.amd) {
      return define(['jquery'], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory;
    } else {
      return factory(jQuery);
    }
  };

  register(function($) {
    var handler, i, toBind, toFix, _i, _ref;
    toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    toBind = __indexOf.call(document, 'onwheel') >= 0 || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    if ($.event.fixHooks) {
      for (i = _i = 0, _ref = toFix.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        $.event.fixHooks[toFix[i]] = $.event.mouseHooks;
      }
    }
    $.event.special.mousewheel = {
      setup: function() {
        var _j, _ref1, _results;
        if (this.addEventListener) {
          _results = [];
          for (i = _j = 0, _ref1 = toBind.length; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            _results.push(this.addEventListener(toBind[i], handler, false));
          }
          return _results;
        } else {
          return this.onmousewheel = handler;
        }
      },
      teardown: function() {
        var _j, _ref1, _results;
        if (this.removeEventListener) {
          _results = [];
          for (i = _j = 0, _ref1 = toBind.length; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            _results.push(this.removeEventListener(toBind[i], handler, false));
          }
          return _results;
        } else {
          return this.onmousewheel = null;
        }
      }
    };
    $.fn.extend({
      mousewheel: function(fn) {
        if (fn) {
          return this.bind("mousewheel", fn);
        } else {
          return this.trigger("mousewheel");
        }
      },
      unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
      }
    });
    return handler = function(event) {
      var absDelta, absDeltaXY, args, delta, deltaX, deltaY, fn, lowestDelta, lowestDeltaXY, orgEvent;
      orgEvent = event || window.event;
      args = [].slice.call(arguments, 1);
      delta = 0;
      deltaX = 0;
      deltaY = 0;
      absDelta = 0;
      absDeltaXY = 0;
      event = $.event.fix(orgEvent);
      event.type = "mousewheel";
      if (orgEvent.wheelDelta) {
        delta = orgEvent.wheelDelta;
      }
      if (orgEvent.detail) {
        delta = orgEvent.detail * -1;
      }
      if (orgEvent.deltaY) {
        deltaY = orgEvent.deltaY * -1;
        delta = deltaY;
      }
      if (orgEvent.deltaX) {
        deltaX = orgEvent.deltaX;
        delta = deltaX * -1;
      }
      if (orgEvent.wheelDeltaY != null) {
        deltaY = orgEvent.wheelDeltaY;
      }
      if (orgEvent.wheelDeltaX != null) {
        deltaX = orgEvent.wheelDeltaX * -1;
      }
      absDelta = Math.abs(delta);
      if (!lowestDelta || absDelta < lowestDelta) {
        lowestDelta = absDelta;
      }
      absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
      if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
        lowestDeltaXY = absDeltaXY;
      }
      fn = delta > 0 ? 'floor' : 'ceil';
      delta = Math[fn](delta / lowestDelta);
      deltaX = Math[fn](deltaX / lowestDeltaXY);
      deltaY = Math[fn](deltaY / lowestDeltaXY);
      args.unshift(event, delta, deltaX, deltaY);
      return ($.event.dispatch || $.event.handle).apply(this, args);
    };
  });

}).call(this);
