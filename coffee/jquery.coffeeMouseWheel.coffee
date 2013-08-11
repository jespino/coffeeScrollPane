# Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
# Licensed under the MIT License (LICENSE.txt).
#
# Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
# Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
# Thanks to: Seamus Leahy for adding deltaX and deltaY
#
# Version: 3.1.3
#
# Requires: 1.2.2+
#

register = (factory) ->
    if ( typeof define == 'function' and define.amd )
        # AMD. Register as an anonymous module.
        define(['jquery'], factory)
    else if (typeof exports == 'object')
        # Node/CommonJS style for Browserify
        module.exports = factory
    else
        # Browser globals
        factory(jQuery)

register ($) ->
    toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll']
    toBind = if 'onwheel' in document or document.documentMode >= 9 then ['wheel'] else ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll']

    if ( $.event.fixHooks )
        for i in [0..toFix.length]
            $.event.fixHooks[ toFix[i] ] = $.event.mouseHooks

    $.event.special.mousewheel = {
        setup: ()->
            if this.addEventListener
                for i in [0..toBind.length]
                    this.addEventListener(toBind[i], handler, false)
            else
                this.onmousewheel = handler
        teardown: () ->
            if this.removeEventListener
                for i in [0..toBind.length]
                    this.removeEventListener(toBind[i], handler, false)
            else
                this.onmousewheel = null
    }

    $.fn.extend {
        mousewheel: (fn) ->
            return if fn then this.bind("mousewheel", fn) else this.trigger("mousewheel")

        unmousewheel: (fn) ->
            return this.unbind("mousewheel", fn)
    }

    handler = (event) ->
        orgEvent = event or window.event
        args = [].slice.call(arguments, 1)
        delta = 0
        deltaX = 0
        deltaY = 0
        absDelta = 0
        absDeltaXY = 0
        event = $.event.fix(orgEvent)
        event.type = "mousewheel"

        # Old school scrollwheel delta
        if orgEvent.wheelDelta then delta = orgEvent.wheelDelta
        if orgEvent.detail then delta = orgEvent.detail * -1

        # New school wheel delta (wheel event)
        if orgEvent.deltaY
            deltaY = orgEvent.deltaY * -1
            delta  = deltaY

        if orgEvent.deltaX
            deltaX = orgEvent.deltaX
            delta  = deltaX * -1

        # Webkit
        if orgEvent.wheelDeltaY? then deltaY = orgEvent.wheelDeltaY
        if orgEvent.wheelDeltaX? then deltaX = orgEvent.wheelDeltaX * -1

        # Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta)
        if (not lowestDelta or absDelta < lowestDelta) then lowestDelta = absDelta
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX))
        if (not lowestDeltaXY or absDeltaXY < lowestDeltaXY) then lowestDeltaXY = absDeltaXY

        # Get a whole value for the deltas
        fn = if delta > 0 then 'floor' else 'ceil'
        delta  = Math[fn](delta / lowestDelta)
        deltaX = Math[fn](deltaX / lowestDeltaXY)
        deltaY = Math[fn](deltaY / lowestDeltaXY)

        # Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY)

        return ($.event.dispatch or $.event.handle).apply(this, args)
