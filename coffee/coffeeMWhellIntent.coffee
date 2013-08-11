#
# @author trixta
# @version 1.2
#

register = ($) ->
    mwheelI = { pos: [-260, -260] }
    minDif 	= 3
    doc 	= document
    root 	= doc.documentElement
    body 	= doc.body

    unsetPos = () ->
        if this == mwheelI.elem
            mwheelI.pos = [-260, -260]
            mwheelI.elem = false
            minDif = 3

    $.event.special.mwheelIntent = {
        setup: () ->
            jElm = $(this).bind('mousewheel', $.event.special.mwheelIntent.handler)
            if this != doc && this != root && this != body
                jElm.bind('mouseleave', unsetPos)
            jElm = null
            return true

        teardown: () ->
            $(this)
                .unbind('mousewheel', $.event.special.mwheelIntent.handler)
                .unbind('mouseleave', unsetPos)
            return true

        handler: (e, d) ->
            pos = [e.clientX, e.clientY]

            if this == mwheelI.elem or Math.abs(mwheelI.pos[0] - pos[0]) > minDif or Math.abs(mwheelI.pos[1] - pos[1]) > minDif
                mwheelI.elem = this
                mwheelI.pos = pos
                minDif = 250

                clearTimeout(shortDelay)
                shortDelay = setTimeout(() ->
                    minDif = 10
                , 200)
                clearTimeout(longDelay)
                longDelay = setTimeout(() ->
                    minDif = 3
                , 1500)
                e = $.extend({}, e, {type: 'mwheelIntent'})
                return ($.event.dispatch or $.event.handle).apply(this, arguments)
    }

    $.fn.extend({
        mwheelIntent: (fn) ->
            return if fn then this.bind("mwheelIntent", fn) else this.trigger("mwheelIntent")

        unmwheelIntent: (fn) ->
            return this.unbind("mwheelIntent", fn)
    })

    $(() ->
        body = doc.body
        # assume that document is always scrollable, doesn't hurt if not
        $(doc).bind('mwheelIntent.mwheelIntentDefault', $.noop)
    )

register(jQuery)
