#
# coffeeScrollPane - v2.0.14 - 2013-05-01
#
# Copyright (c) 2010 Kelvin Luck
# Copyright (c) 2013 Jesús Espino
# Dual licensed under the MIT or GPL licenses.
#

# Script: coffeeScrollPane - cross browser customisable scrollbars
#
# *Version: 2.0.14, Last updated: 2013-05-01*
#
# GitHub       - http://github.com/jespino/coffeeScrollPane
# Source       - http://github.com/jespino/coffeeScrollPane/raw/master/dist/jquery.coffeeScrollPane.js
# (Minified)   - http://github.com/jespino/coffeeScrollPane/raw/master/dist/jquery.coffeeScrollPane.min.js
#
# About: License
#
# Copyright (c) 2013 Kelvin Luck
# Dual licensed under the MIT or GPL Version 2 licenses.
# http://cscrollpane.kelvinluck.com/MIT-LICENSE.txt
# http://cscrollpane.kelvinluck.com/GPL-LICENSE.txt
#
# About: Examples
#
# All examples and demos are available through the cScrollPane example site at:
# http://cscrollpane.kelvinluck.com/
#
# About: Support and Testing
#
# This plugin is tested on the browsers below and has been found to work reliably on them. If you run
# into a problem on one of the supported browsers then please visit the support section on the cScrollPane
# website (http://cscrollpane.kelvinluck.com/) for more information on getting support. You are also
# welcome to fork the project on GitHub if you can contribute a fix for a given issue.
#
# jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
# Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
#
# About: Release History
#
# 2.0.14 - (2013-05-01) Updated to most recent mouse wheel plugin (see #106)
#                       and related changes for sensible scroll speed
# 2.0.13 - (2013-05-01) Switched to semver compatible version name
# 2.0.0beta12 - (2012-09-27) fix for jQuery 1.8+
# 2.0.0beta11 - (2012-05-14)
# 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved
#                            keyboard support, stickToBottom/Left, other small
#                            fixes
# 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard
#                           support for FF/OSX
# 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
# 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
# 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
# 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
# 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
# 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
# 2.0.0beta2 - (2010-08-21) Bug fixes
# 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable
#                           horizontal scrolling, initially hidden elements and
#                           dynamically sized elements.
# 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

class Scroll
    construct: (settings) ->
        @settings = settings

class VerticalScroll extends Scroll
    bar: null
    track: null
    drag: null
    trackHeight: 0
    initialise: (container, pane) ->
        container.append(
            $('<div class="cspVerticalBar" />').append(
                $('<div class="cspCap cspCapTop" />'),
                $('<div class="cspTrack" />').append(
                    $('<div class="cspDrag" />').append(
                        $('<div class="cspDragTop" />'),
                        $('<div class="cspDragBottom" />')
                    )
                ),
                $('<div class="cspCap cspCapBottom" />')
            )
        )

        @bar = container.find('>.cspVerticalBar')
        @track = bar.find('>.cspTrack')
        @drag = track.find('>.cspDrag')

        if (@settings.showArrows)
            arrowUp = $('<a class="cspArrow cspArrowUp" />').bind(
                'mousedown.csp', getArrowScroll(0, -1)
            ).bind('click.csp', nil)
            arrowDown = $('<a class="cspArrow cspArrowDown" />').bind(
                'mousedown.csp', getArrowScroll(0, 1)
            ).bind('click.csp', nil)
            if (@settings.arrowScrollOnHover)
                arrowUp.bind('mouseover.csp', getArrowScroll(0, -1, arrowUp))
                arrowDown.bind('mouseover.csp', getArrowScroll(0, 1, arrowDown))

            appendArrows(@track, @settings.verticalArrowPositions, arrowUp, arrowDown)

        @trackHeight = pane.height
        container.find('>.cspVerticalBar>.cspCap:visible,>.cspVerticalBar>.cspArrow').each () ->
            @trackHeight -= $(this).outerHeight()

        @drag.hover(() ->
            @drag.addClass('cspHover')
        , () ->
            @drag.removeClass('cspHover')
        ).bind('mousedown.csp', (e) ->
            # Stop IE from allowing text selection
            $('html').bind('dragstart.csp selectstart.csp', nil)

            @drag.addClass('cspActive')

            startY = e.pageY - @drag.position().top

            $('html').bind('mousemove.csp', (e) ->
                positionDragY(e.pageY - startY, false)
            ).bind('mouseup.csp mouseleave.csp', cancelDrag)
            return false
        )
        @barSize()

    barSize: () ->
        @track.height(@trackHeight + 'px')
        @dragPosition = 0
        scrollbarWidth = @settings.verticalGutter + @track.outerWidth()

        # Make the pane thinner to allow for the vertical scrollbar
        @pane.width(@paneWidth - scrollbarWidth - @originalPaddingTotalWidth)

        # Add margin to the left of the pane if scrollbars are on that side (to position
        # the scrollbar on the left or right set it's left or right property in CSS)
        try
            if @verticalBar.position().left == 0
                @pane.css('margin-left', scrollbarWidth + 'px')
        catch err

class HorizontalScroll extends Scroll
    initialise: container() ->
        container.append(
            $('<div class="cspHorizontalBar" />').append(
                $('<div class="cspCap cspCapLeft" />'),
                $('<div class="cspTrack" />').append(
                    $('<div class="cspDrag" />').append(
                        $('<div class="cspDragLeft" />'),
                        $('<div class="cspDragRight" />')
                    )
                ),
                $('<div class="cspCap cspCapRight" />')
            )
        )

        @horizontalBar = @container.find('>.cspHorizontalBar')
        @horizontalTrack = @horizontalBar.find('>.cspTrack')
        @horizontalDrag = @horizontalTrack.find('>.cspDrag')

        if (@settings.showArrows)
            arrowLeft = $('<a class="cspArrow cspArrowLeft" />').bind(
                'mousedown.csp', getArrowScroll(-1, 0)
            ).bind('click.csp', nil)
            arrowRight = $('<a class="cspArrow cspArrowRight" />').bind(
                'mousedown.csp', getArrowScroll(1, 0)
            ).bind('click.csp', nil)
            if (@settings.arrowScrollOnHover)
                arrowLeft.bind('mouseover.csp', getArrowScroll(-1, 0, arrowLeft))
                arrowRight.bind('mouseover.csp', getArrowScroll(1, 0, arrowRight))
            appendArrows(@horizontalTrack, @settings.horizontalArrowPositions, arrowLeft, arrowRight)

        @horizontalDrag.hover(() ->
                @horizontalDrag.addClass('cspHover')
            , () ->
                @horizontalDrag.removeClass('cspHover')
        ).bind('mousedown.csp', (e) ->
            # Stop IE from allowing text selection
            $('html').bind('dragstart.csp selectstart.csp', nil)

            @horizontalDrag.addClass('cspActive')

            startX = e.pageX - @horizontalDrag.position().left

            $('html').bind('mousemove.csp', (e) ->
                positionDragX(e.pageX - startX, false)
            ).bind('mouseup.csp mouseleave.csp', cancelDrag)
            return false
        )
        @horizontalTrackWidth = @container.innerWidth()
        @sizeHorizontalScrollbar()

    barSize: () ->
        @container.find('>.cspHorizontalBar>.cspCap:visible,>.cspHorizontalBar>.cspArrow').each () ->
            @horizontalTrackWidth -= $(this).outerWidth()

        @horizontalTrack.width(@horizontalTrackWidth + 'px')
        @horizontalDragPosition = 0


class CScrollPane
    defaults: {
        showArrows: false
        maintainPosition: true
        stickToBottom: false
        stickToRight: false
        clickOnTrack: true
        autoReinitialise: false
        autoReinitialiseDelay: 500
        verticalDragMinHeight: 0
        verticalDragMaxHeight: 99999
        horizontalDragMinWidth: 0
        horizontalDragMaxWidth: 99999
        contentWidth: undefined
        animateScroll: false
        animateDuration: 300
        animateEase: 'linear'
        hijackInternalLinks: false
        verticalGutter: 4
        horizontalGutter: 4
        mouseWheelSpeed: 3
        arrowButtonSpeed: 0
        arrowRepeatFreq: 50
        arrowScrollOnHover: false
        trackClickSpeed: 0
        trackClickRepeatFreq: 70
        verticalArrowPositions: 'split'
        horizontalArrowPositions: 'split'
        enableKeyboardNavigation: true
        hideFocus: false
        keyboardSpeed: 0
        initialDelay: 300  # Delay before starting repeating
        speed: 30  # Default speed when others falsey
        scrollPagePercent: .8  # Percent of visible area scrolled when pageUp/Down or track area pressed
    }

    constructor: (elem, s) ->
        @csp = @
        @elem = elem
        @wasAtTop = true
        @wasAtLeft = true
        @wasAtBottom = false
        @wasAtRight = false
        @originalElement = @elem.clone(false, false).empty()
        @mwEvent = if $.fn.mwheelIntent then 'mwheelIntent.csp' else 'mousewheel.csp'

        @originalPadding = "#{@elem.css('paddingTop')} #{@elem.css('paddingRight')} #{@elem.css('paddingBottom')} #{@elem.css('paddingLeft')}"
        @originalPaddingTotalWidth = (parseInt(@elem.css('paddingLeft'), 10) or 0) +
                                    (parseInt(@elem.css('paddingRight'), 10) or 0)


    initialise: (s) ->
        maintainAtBottom = false
        maintainAtRight = false
        @settings = s

        if not pane?
            originalScrollTop = @elem.scrollTop()
            originalScrollLeft = @elem.scrollLeft()

            @elem.css {
                overflow: 'hidden'
                padding: 0
            }

            # TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
            # come back to it later and check once it is unhidden...
            @paneWidth = @elem.innerWidth() + @originalPaddingTotalWidth
            @paneHeight = @elem.innerHeight()

            @elem.width(@paneWidth)

            @pane = $('<div class="cspPane" />').css('padding', @originalPadding).append(@elem.children())
            @container = $('<div class="cspContainer" />')
                .css({
                    'width': @paneWidth + 'px',
                    'height': @paneHeight + 'px'
                }
            ).append(@pane).appendTo(@elem)

            # Move any margins from the first and last children up to the container so they can still
            # collapse with neighbouring elements as they would before cScrollPane
            #firstChild = pane.find(':first-child');
            #lastChild = pane.find(':last-child');
            #elem.css(
            #    {
            #        'margin-top': firstChild.css('margin-top'),
            #        'margin-bottom': lastChild.css('margin-bottom')
            #    }
            #);
            #firstChild.css('margin-top', 0);
            #lastChild.css('margin-bottom', 0);
        else
            @elem.css('width', '')

            maintainAtBottom = @settings.stickToBottom and isCloseToBottom()
            maintainAtRight  = @settings.stickToRight  and isCloseToRight()

            hasContainingSpaceChanged = @elem.innerWidth() + @originalPaddingTotalWidth != @paneWidth or @elem.outerHeight() != @paneHeight

            if (hasContainingSpaceChanged)
                @paneWidth = @elem.innerWidth() + @originalPaddingTotalWidth
                @paneHeight = @elem.innerHeight()
                @container.css {
                    width: @paneWidth + 'px',
                    height: @paneHeight + 'px'
                }

            # If nothing changed since last check...
            if (!hasContainingSpaceChanged and previousContentWidth == @contentWidth and @pane.outerHeight() == @contentHeight)
                @elem.width(@paneWidth)
                return

            previousContentWidth = @contentWidth

            @pane.css('width', '')
            @elem.width(@paneWidth)

            @container.find('>.cspVerticalBar,>.cspHorizontalBar').remove().end()

        @pane.css('overflow', 'auto')
        if (s.contentWidth)
            @contentWidth = s.contentWidth
        else
            @contentWidth = @pane[0].scrollWidth

        @contentHeight = @pane[0].scrollHeight

        @pane.css('overflow', '')

        @percentInViewH = @contentWidth / @paneWidth
        @percentInViewV = @contentHeight / @paneHeight
        @isScrollableV = @percentInViewV > 1

        @isScrollableH = @percentInViewH > 1

        if (!(@isScrollableH or @isScrollableV))
            @elem.removeClass('cspScrollable')
            @pane.css {
                top: 0,
                width: @container.width() - @originalPaddingTotalWidth
            }
            removeMousewheel()
            removeFocusHandler()
            removeKeyboardNav()
            removeClickOnTrack()
        else
            @elem.addClass('cspScrollable')

            isMaintainingPositon = @settings.maintainPosition and (@verticalDragPosition or @horizontalDragPosition)
            if (isMaintainingPositon)
                lastContentX = @contentPositionX()
                lastContentY = @contentPositionY()

            @verticalScroll = new VerticalScroll()
            if @isScrollableV
                @verticalScroll.initialise(@container)
            @horizontalScroll = new HorizontalScroll()
            if @isScrollableH
                @horizontalScroll.initialise(@container)

            @resizeScrollbars()

            if (isMaintainingPositon)
                if maintainAtRight
                    scrollToX(@contentWidth  - @paneWidth, false)
                else
                    scrollToX(lastContentX, false)

                if maintainAtBottom
                    scrollToY(@contentHeight - @paneHeight, false)
                else
                    scrollToY(lastContentY, false)

            @initFocusHandler()
            @initMousewheel()
            @initTouch()

            if (@settings.enableKeyboardNavigation)
                @initKeyboardNav()

            if (@settings.clickOnTrack)
                @initClickOnTrack()

            @observeHash()
            if (@settings.hijackInternalLinks)
                @hijackInternalLinks()

        if (@settings.autoReinitialise and !reinitialiseInterval)
            reinitialiseInterval = setInterval(() ->
                @initialise(@settings)
            ,
                @settings.autoReinitialiseDelay
            )
        else if (!@settings.autoReinitialise and reinitialiseInterval)
            clearInterval(reinitialiseInterval)

        originalScrollTop and @elem.scrollTop(0) and scrollToY(originalScrollTop, false)
        originalScrollLeft and @elem.scrollLeft(0) and scrollToX(originalScrollLeft, false)

        @elem.trigger('csp-initialised', [@isScrollableH or @isScrollableV])

    # TODO: Review the above methods to remove duplication
    resizeScrollbars: () ->
        if (@isScrollableH and @isScrollableV)
            @horizontalTrackHeight = @horizontalTrack.outerHeight()
            @verticalTrackWidth = @verticalTrack.outerWidth()

            @verticalTrackHeight -= @horizontalTrackHeight
            $(@horizontalBar).find('>.cspCap:visible,>.cspArrow').each () ->
                @horizontalTrackWidth += $(this).outerWidth()

            @horizontalTrackWidth -= @verticalTrackWidth
            @paneHeight -= @verticalTrackWidth
            @paneWidth -= @horizontalTrackHeight
            @horizontalTrack.parent().append(
                $('<div class="cspCorner" />').css('width', @horizontalTrackHeight + 'px')
            )
            @sizeVerticalScrollbar()
            @sizeHorizontalScrollbar()

        # reflow content
        if (@isScrollableH)
            @pane.width((@container.outerWidth() - @originalPaddingTotalWidth) + 'px')

        @contentHeight = @pane.outerHeight()
        @percentInViewV = @contentHeight / @paneHeight

        if (@isScrollableH)
            horizontalDragWidth = Math.ceil(1 / @percentInViewH * @horizontalTrackWidth)
            if (horizontalDragWidth > @settings.horizontalDragMaxWidth)
                horizontalDragWidth = @settings.horizontalDragMaxWidth
            else if (horizontalDragWidth < @settings.horizontalDragMinWidth)
                horizontalDragWidth = @settings.horizontalDragMinWidth

            @horizontalDrag.width(horizontalDragWidth + 'px')
            @dragMaxX = @horizontalTrackWidth - horizontalDragWidth
            @_positionDragX(@horizontalDragPosition); # To update the state for the arrow buttons

        if (@isScrollableV)
            verticalDragHeight = Math.ceil(1 / @percentInViewV * @verticalTrackHeight)
            if (verticalDragHeight > @settings.verticalDragMaxHeight)
                verticalDragHeight = @settings.verticalDragMaxHeight
            else if (verticalDragHeight < @settings.verticalDragMinHeight)
                verticalDragHeight = @settings.verticalDragMinHeight

            @verticalDrag.height(verticalDragHeight + 'px')
            @dragMaxY = @verticalTrackHeight - verticalDragHeight
            @_positionDragY(@verticalDragPosition); # To update the state for the arrow buttons

    appendArrows: (ele, p, a1, a2) ->
        p1 = "before"
        p2 = "after"

        # Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
        # at the top or the bottom of the bar?
        if (p == "os")
            p = /Mac/.test(navigator.platform) ? "after" : "split"

        if (p == p1)
            p2 = p
        else if (p == p2)
            p1 = p
            aTemp = a1
            a1 = a2
            a2 = aTemp

        ele[p1](a1)[p2](a2)

    getArrowScroll: (dirX, dirY, ele) ->
        return () ->
            arrowScroll(dirX, dirY, this, ele)
            this.blur()
            return false

    arrowScroll: (dirX, dirY, arrow, ele) ->
        arrow = $(arrow).addClass('cspActive')

        isFirst = true
        doScroll = () ->
            if (dirX != 0)
                @scrollByX(dirX * @settings.arrowButtonSpeed)
            if (dirY != 0)
                @scrollByY(dirY * @settings.arrowButtonSpeed)

            if isFirst
                scrollTimeout = setTimeout(doScroll, @settings.initialDelay)
            else
                scrollTimeout = setTimeout(doScroll, @settings.arrowRepeatFreq)

            isFirst = false

        doScroll()

        eve = if ele then 'mouseout.csp' else 'mouseup.csp'
        ele = ele or $('html')
        ele.bind(eve, () ->
            arrow.removeClass('cspActive')
            scrollTimeout and clearTimeout(scrollTimeout)
            scrollTimeout = null
            ele.unbind(eve)
        )

    initClickOnTrack: () ->
        removeClickOnTrack()
        if (@isScrollableV)
            @verticalTrack.bind 'mousedown.csp', (e) ->
                if (e.originalTarget == undefined or e.originalTarget == e.currentTarget)
                    clickedTrack = $(this)
                    offset = clickedTrack.offset()
                    direction = e.pageY - offset.top - @verticalDragPosition
                    isFirst = true
                    doScroll = () ->
                        offset = clickedTrack.offset()
                        pos = e.pageY - offset.top - verticalDragHeight / 2
                        contentDragY = @paneHeight * @settings.scrollPagePercent
                        dragY = @dragMaxY * contentDragY / (@contentHeight - @paneHeight)

                        if (direction < 0)
                            if (@verticalDragPosition - dragY > pos)
                                @scrollByY(-contentDragY)
                            else
                                positionDragY(pos)
                        else if (direction > 0)
                            if (@verticalDragPosition + dragY < pos)
                                @scrollByY(contentDragY)
                            else
                                positionDragY(pos)
                        else
                            cancelClick()
                            return

                        if isFirst
                            scrollTimeout = setTimeout(doScroll, @settings.initialDelay)
                        else
                            scrollTimeout = setTimeout(doScroll, @settings.trackClickRepeatFreq)

                        isFirst = false

                    cancelClick = () ->
                        scrollTimeout and clearTimeout(scrollTimeout)
                        scrollTimeout = null
                        $(document).unbind('mouseup.csp', cancelClick)

                    doScroll()
                    $(document).bind('mouseup.csp', cancelClick)
                    return false

        if (@isScrollableH)
            @horizontalTrack.bind 'mousedown.csp', (e) ->
                if (e.originalTarget == undefined or e.originalTarget == e.currentTarget)
                    clickedTrack = $(this)
                    offset = clickedTrack.offset()
                    direction = e.pageX - offset.left - @horizontalDragPosition
                    isFirst = true

                    doScroll = () ->
                        offset = clickedTrack.offset()
                        pos = e.pageX - offset.left - horizontalDragWidth / 2
                        contentDragX = @paneWidth * @settings.scrollPagePercent
                        dragX = @dragMaxX * contentDragX / (@contentWidth - @paneWidth)

                        if (direction < 0)
                            if (@horizontalDragPosition - dragX > pos)
                                @scrollByX(-contentDragX)
                            else
                                positionDragX(pos)
                        else if (direction > 0)
                            if (@horizontalDragPosition + dragX < pos)
                                @scrollByX(contentDragX)
                            else
                                positionDragX(pos)
                        else
                            cancelClick()
                            return

                        if isFirst
                            scrollTimeout = setTimeout(doScroll, @settings.initialDelay)
                        else
                            scrollTimeout = setTimeout(doScroll, @settings.trackClickRepeatFreq)

                        isFirst = false

                    cancelClick = () ->
                        scrollTimeout and clearTimeout(scrollTimeout)
                        scrollTimeout = null
                        $(document).unbind('mouseup.csp', cancelClick)

                    doScroll()
                    $(document).bind('mouseup.csp', cancelClick)
                    return false

    removeClickOnTrack: () ->
        if (@horizontalTrack)
            @horizontalTrack.unbind('mousedown.csp')

        if (@verticalTrack)
            @verticalTrack.unbind('mousedown.csp')

    cancelDrag: () ->
        $('html').unbind('dragstart.csp selectstart.csp mousemove.csp mouseup.csp mouseleave.csp')

        if (@verticalDrag)
            @verticalDrag.removeClass('cspActive')

        if (@horizontalDrag)
            @horizontalDrag.removeClass('cspActive')

    # Positions the vertical drag at the specified y position (and updates the viewport to reflect
    # this). animate is optional and if not passed then the value of animateScroll from the settings
    # object this cScrollPane was initialised with is used.
    positionDragY: (destY, animate) ->
        if (!@isScrollableV)
            return

        if (destY < 0)
            destY = 0
        else if (destY > @dragMaxY)
            destY = @dragMaxY

        # can't just check if(animate) because false is a valid value that could be passed in...
        if (animate == undefined)
            animate = @settings.animateScroll

        if (animate)
            @animate(@verticalDrag, 'top', destY,    @_positionDragY)
        else
            @verticalDrag.css('top', destY)
            @_positionDragY(destY)

    _positionDragY: (destY) ->
        if (destY == undefined)
            destY = @verticalDrag.position().top

        @container.scrollTop(0)
        @verticalDragPosition = destY

        isAtTop = @verticalDragPosition == 0
        isAtBottom = @verticalDragPosition == @dragMaxY
        percentScrolled = destY/ @dragMaxY
        destTop = -percentScrolled * (@contentHeight - @paneHeight)

        if (wasAtTop != isAtTop or wasAtBottom != isAtBottom)
            wasAtTop = isAtTop
            wasAtBottom = isAtBottom
            @elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, @wasAtLeft, @wasAtRight])

        @updateVerticalArrows(isAtTop, isAtBottom)
        @pane.css('top', destTop)
        @elem.trigger('csp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll')

    # Positions the horizontal drag at the specified x position (and updates the viewport to reflect
    # this). animate is optional and if not passed then the value of animateScroll from the settings
    # object this cScrollPane was initialised with is used.
    positionDragX: (destX, animate) ->
        if (!@isScrollableH)
            return

        if (destX < 0)
            destX = 0
        else if (destX > @dragMaxX)
            destX = @dragMaxX

        if (animate == undefined)
            animate = @settings.animateScroll

        if (animate)
            @animate(@horizontalDrag, 'left', destX,    _positionDragX)
        else
            @horizontalDrag.css('left', destX)
            _positionDragX(destX)

    _positionDragX: (destX) ->
        if (destX == undefined)
            destX = @horizontalDrag.position().left

        @container.scrollTop(0)
        @horizontalDragPosition = destX

        isAtLeft = @horizontalDragPosition == 0
        isAtRight = @horizontalDragPosition == @dragMaxX
        percentScrolled = destX / @dragMaxX
        destLeft = -percentScrolled * (@contentWidth - @paneWidth)

        if (@wasAtLeft != isAtLeft or @wasAtRight != isAtRight)
            @wasAtLeft = isAtLeft
            @wasAtRight = isAtRight
            @elem.trigger('csp-arrow-change', [wasAtTop, wasAtBottom, @wasAtLeft, @wasAtRight])

        @updateHorizontalArrows(isAtLeft, isAtRight)
        @pane.css('left', destLeft)
        @elem.trigger('csp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll')

    updateVerticalArrows: (isAtTop, isAtBottom) ->
        if (@settings.showArrows)
            arrowUp[if isAtTop then 'addClass' else 'removeClass']('cspDisabled')
            arrowDown[if isAtBottom then 'addClass' else 'removeClass']('cspDisabled')

    updateHorizontalArrows: (isAtLeft, isAtRight) ->
        if (@settings.showArrows)
            arrowLeft[if isAtLeft then 'addClass' else 'removeClass']('cspDisabled')
            arrowRight[if isAtRight then 'addClass' else 'removeClass']('cspDisabled')

    # Scrolls the pane so that the specified co-ordinate within the content is at the top of the
    # viewport. animate is optional and if not passed then the value of animateScroll from the settings
    # object this cScrollPane was initialised with is used.
    scrollToY: (destY, animate) ->
        percentScrolled = destY / (@contentHeight - @paneHeight)
        positionDragY(percentScrolled * @dragMaxY, animate)

    # Scrolls the pane so that the specified co-ordinate within the content is at the left of the
    # viewport. animate is optional and if not passed then the value of animateScroll from the settings
    # object this cScrollPane was initialised with is used.
    scrollToX: (destX, animate) ->
        percentScrolled = destX / (@contentWidth - @paneWidth)
        positionDragX(percentScrolled * @dragMaxX, animate)

    # Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
    # that it can be seen within the viewport. If stickToTop is true then the element will appear at
    # the top of the viewport, if it is false then the viewport will scroll as little as possible to
    # show the element. You can also specify if you want animation to occur. If you don't provide this
    # argument then the animateScroll value from the settings object is used instead.
    scrollToElement: (ele, stickToTop, animate) ->
        eleTop = 0
        eleLeft = 0

        # Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
        # errors from the lookup...
        try
            e = $(ele)
        catch err
            return

        eleHeight = e.outerHeight()
        eleWidth= e.outerWidth()

        @container.scrollTop(0)
        @container.scrollLeft(0)

        # loop through parents adding the offset top of any elements that are relatively positioned between
        # the focused element and the cspPane so we can get the true distance from the top
        # of the focused element to the top of the scrollpane...
        while (!e.is('.cspPane'))
            eleTop += e.position().top
            eleLeft += e.position().left
            e = e.offsetParent()
            if (/^body|html$/i.test(e[0].nodeName))
                # we ended up too high in the document structure. Quit!
                return

        viewportTop = @contentPositionY()
        maxVisibleEleTop = viewportTop + @paneHeight
        if (eleTop < viewportTop or stickToTop) # element is above viewport
            destY = eleTop - @settings.verticalGutter
        else if (eleTop + eleHeight > maxVisibleEleTop) # element is below viewport
            destY = eleTop - @paneHeight + eleHeight + @settings.verticalGutter

        if (destY)
            scrollToY(destY, animate)

        viewportLeft = @contentPositionX()
        maxVisibleEleLeft = viewportLeft + @paneWidth
        if (eleLeft < viewportLeft or stickToTop) # element is to the left of viewport
            destX = eleLeft - @settings.horizontalGutter
        else if (eleLeft + eleWidth > maxVisibleEleLeft) # element is to the right viewport
            destX = eleLeft - @paneWidth + eleWidth + @settings.horizontalGutter

        if (destX)
            scrollToX(destX, animate)

    contentPositionX: () ->
        return -@pane.position().left

    contentPositionY: () ->
        return -@pane.position().top

    isCloseToBottom: () ->
        scrollableHeight = @contentHeight - @paneHeight
        return (scrollableHeight > 20) and (scrollableHeight - @contentPositionY() < 10)

    isCloseToRight: () ->
        scrollableWidth = @contentWidth - @paneWidth
        return (scrollableWidth > 20) and (scrollableWidth - @contentPositionX() < 10)

    initMousewheel: () ->
        @container.unbind(@mwEvent).bind @mwEvent, (event, delta, deltaX, deltaY) =>
            dX = @horizontalDragPosition
            dY = @verticalDragPosition
            @scrollBy(deltaX * @settings.mouseWheelSpeed, -deltaY * @settings.mouseWheelSpeed, false)
            # return true if there was no movement so rest of screen can scroll
            return dX == @horizontalDragPosition and dY == @verticalDragPosition

    removeMousewheel: () ->
        @container.unbind(@mwEvent)

    nil: () ->
        return false

    initFocusHandler: () ->
        @pane.find(':input,a').unbind('focus.csp'
        ).bind('focus.csp', (e) ->
            scrollToElement(e.target, false)
        )

    removeFocusHandler: () ->
        @pane.find(':input,a').unbind('focus.csp')

    initKeyboardNav: () ->
        validParents = []
        @isScrollableH and validParents.push(@horizontalBar[0])
        @isScrollableV and validParents.push(@verticalBar[0])

        # IE also focuses elements that don't have tabindex set.
        @pane.focus () ->
            @elem.focus()

        @elem.attr('tabindex', 0)
            .unbind('keydown.csp keypress.csp')
            .bind('keydown.csp', (e) ->
                if (e.target != this and !(validParents.length and $(e.target).closest(validParents).length))
                    return

                dX = @horizontalDragPosition
                dY = @verticalDragPosition

                switch e.keyCode
                    when 40, 38, 34, 32, 33, 39, 37
                        keyDown = e.keyCode
                        keyDownHandler()
                    when 35 # end
                        scrollToY(@contentHeight - @paneHeight)
                        keyDown = null
                    when 36 # home
                        scrollToY(0)
                        keyDown = null

                elementHasScrolled = e.keyCode == keyDown and dX != @horizontalDragPosition or dY != @verticalDragPosition
                return !elementHasScrolled
            ).bind('keypress.csp', # For FF/ OSX so that we can cancel the repeat key presses if the CSP scrolls...
                (e) ->
                    if (e.keyCode == keyDown)
                        keyDownHandler()
                    return !elementHasScrolled
            )

        if (@settings.hideFocus)
            @elem.css('outline', 'none')
            if ('hideFocus' in @container[0])
                @elem.attr('hideFocus', true)
        else
            @elem.css('outline', '')
            if ('hideFocus' in @container[0])
                @elem.attr('hideFocus', false)

        keyDownHandler: () ->
            dX = @horizontalDragPosition
            dY = @verticalDragPosition
            switch keyDown
                when 40 then @scrollByY(@settings.keyboardSpeed, false) # down
                when 38 then @scrollByY(-@settings.keyboardSpeed, false) # up
                when 34, 32 then @scrollByY(@paneHeight * @settings.scrollPagePercent, false) # page down, space
                when 33 then @scrollByY(-@paneHeight * @settings.scrollPagePercent, false) # page up
                when 39 then @scrollByX(@settings.keyboardSpeed, false)  # right
                when 37 then @scrollByX(-@settings.keyboardSpeed, false)  # left

            elementHasScrolled = dX != @horizontalDragPosition or dY != @verticalDragPosition
            return elementHasScrolled

    removeKeyboardNav: () ->
        @elem.attr('tabindex', '-1')
            .removeAttr('tabindex')
            .unbind('keydown.csp keypress.csp')

    observeHash: () ->
        if location.hash and location.hash.length > 1
            hash = escape(location.hash.substr(1)) # hash must be escaped to prevent XSS

            try
                e = $('#' + hash + ', a[name="' + hash + '"]')
            catch err
                return

            if e.length and @pane.find(hash)
                # nasty workaround but it appears to take a little while before the hash has done its thing
                # to the rendered page so we just wait until the container's scrollTop has been messed up.
                if (@container.scrollTop() == 0)
                    retryInt = setInterval(() ->
                        if (@container.scrollTop() > 0)
                            scrollToElement(e, true)
                            $(document).scrollTop(@container.position().top)
                            clearInterval(retryInt)
                    , 50
                    )
                else
                    scrollToElement(e, true)
                    $(document).scrollTop(@container.position().top)

    hijackInternalLinks: () ->
        # only register the link handler once
        if $(document.body).data('cspHijack')
            return

        # remember that the handler was bound
        $(document.body).data('cspHijack', true)

        # use live handler to also capture newly created links
        $(document.body).delegate 'a[href*=#]', 'click', (event) ->
            # does the link point to the same page?
            # this also takes care of cases with a <base>-Tag or Links not starting with the hash #
            # e.g. <a href="index.html#test"> when the current url already is index.html
            href = this.href.substr(0, this.href.indexOf('#'))
            locationHref = location.href

            if location.href.indexOf('#') != -1
                locationHref = location.href.substr(0, location.href.indexOf('#'))

            if href != locationHref
                # the link points to another page
                return

            # check if cScrollPane should handle this click event
            hash = escape(this.href.substr(this.href.indexOf('#') + 1))

            # find the element on the page
            element
            try
                element = $('#' + hash + ', a[name="' + hash + '"]')
            catch e
                # hash is not a valid jQuery identifier
                return

            if not element.length
                # this link does not point to an element on this page
                return

            @container = element.closest('.cspScrollable')
            csp = @container.data('csp')

            # csp might be another csp instance than the one, that bound this event
            # remember: this event is only bound once for all instances.
            @scrollToElement(element, true)

            if @container[0].scrollIntoView
                # also scroll to the top of the container (if it is not visible)
                scrollTop = $(window).scrollTop()
                elementTop = element.offset().top
                if (elementTop < scrollTop or elementTop > scrollTop + $(window).height())
                    @container[0].scrollIntoView()

            # csp handled this event, prevent the browser default (scrolling :P)
            event.preventDefault()

    # Init touch on iPad, iPhone, iPod, Android
    initTouch: () ->
        moving = false

        @container.unbind('touchstart.csp touchmove.csp touchend.csp click.csp-touchclick'
        ).bind('touchstart.csp', (e) ->
            touch = e.originalEvent.touches[0]
            startX = @contentPositionX()
            startY = @contentPositionY()
            touchStartX = touch.pageX
            touchStartY = touch.pageY
            moved = false
            moving = true
        ).bind('touchmove.csp', (ev) ->
            if not moving
                return

            touchPos = ev.originalEvent.touches[0]
            dX = @horizontalDragPosition
            dY = @verticalDragPosition

            @scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY)

            moved = moved or Math.abs(touchStartX - touchPos.pageX) > 5 or Math.abs(touchStartY - touchPos.pageY) > 5

            # return true if there was no movement so rest of screen can scroll
            return dX == @horizontalDragPosition and dY == @verticalDragPosition
        ).bind('touchend.csp', (e) ->
            moving = false
            #if(moved) {
            #    return false;
            #}
        ).bind('click.csp-touchclick', (e) ->
            if(moved)
                moved = false
                return false
        )

    # Removes the cScrollPane and returns the page to the state it was in before cScrollPane was
    # initialised.
    destroy: () ->
        currentY = @contentPositionY()
        currentX = @contentPositionX()

        @elem.removeClass('cspScrollable').unbind('.csp')
        @elem.replaceWith(originalElement.append(@pane.children()))
        originalElement.scrollTop(currentY)
        originalElement.scrollLeft(currentX)

        # clear reinitialize timer if active
        if (reinitialiseInterval)
            clearInterval(reinitialiseInterval)

    # Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
    # was initialised). The settings object which is passed in will override any settings from the
    # previous time it was initialised - if you don't pass any settings then the ones from the previous
    # initialisation will be used.
    reinitialise: (s) ->
        s = $.extend({}, @settings, s)
        @initialise(s)

    # Scrolls the pane so that the specified co-ordinates within the content are at the top left
    # of the viewport. animate is optional and if not passed then the value of animateScroll from
    # the settings object this cScrollPane was initialised with is used.
    scrollTo: (destX, destY, animate) ->
        @scrollToX(destX, animate)
        @scrollToY(destY, animate)

    # Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
    # is optional and if not passed then the value of animateScroll from the settings object this
    # cScrollPane was initialised with is used.
    scrollToPercentX: (destPercentX, animate) ->
        @scrollToX(destPercentX * (@contentWidth - @paneWidth), animate)

    # Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
    # is optional and if not passed then the value of animateScroll from the settings object this
    # cScrollPane was initialised with is used.
    scrollToPercentY: (destPercentY, animate) ->
        @scrollToY(destPercentY * (@contentHeight - @paneHeight), animate)

    # Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
    # the value of animateScroll from the settings object this cScrollPane was initialised with is used.
    scrollBy: (deltaX, deltaY, animate) ->
        @scrollByX(deltaX, animate)
        @scrollByY(deltaY, animate)

    # Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
    # the value of animateScroll from the settings object this cScrollPane was initialised with is used.
    scrollByX: (deltaX, animate) ->
        destX = @contentPositionX() + Math[if deltaX<0 then 'floor' else 'ceil'](deltaX)
        percentScrolled = destX / (@contentWidth - @paneWidth)
        @positionDragX(percentScrolled * @dragMaxX, animate)

    # Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
    # the value of animateScroll from the settings object this cScrollPane was initialised with is used.
    scrollByY: (deltaY, animate) ->
        destY = @contentPositionY() + Math[if deltaY<0 then 'floor' else 'ceil'](deltaY)
        percentScrolled = destY / (@contentHeight - @paneHeight)
        @positionDragY(percentScrolled * @dragMaxY, animate)

    # This method is called when cScrollPane is trying to animate to a new position. You can override
    # it if you want to provide advanced animation functionality. It is passed the following arguments:
    #  * ele          - the element whose position is being animated
    #  * prop         - the property that is being animated
    #  * value        - the value it's being animated to
    #  * stepCallback - a function that you must execute each time you update the value of the property
    # You can use the default implementation (below) as a starting point for your own implementation.
    animate: (ele, prop, value, stepCallback) ->
        params = {}
        params[prop] = value
        ele.animate params, {
            'duration': @settings.animateDuration
            'easing': @settings.animateEase
            'queue': false
            'step': stepCallback
        }

    # Returns the current x position of the viewport with regards to the content pane.
    getContentPositionX: () ->
        return @contentPositionX()

    # Returns the current y position of the viewport with regards to the content pane.
    getContentPositionY: () ->
        return @contentPositionY()

    # Returns the width of the content within the scroll pane.
    getContentWidth: () ->
        return @contentWidth

    # Returns the height of the content within the scroll pane.
    getContentHeight: () ->
        return @contentHeight

    # Returns the horizontal position of the viewport within the pane content.
    getPercentScrolledX: () ->
        return @contentPositionX() / (@contentWidth - @paneWidth)

    # Returns the vertical position of the viewport within the pane content.
    getPercentScrolledY: () ->
        return @contentPositionY() / (@contentHeight - @paneHeight)

    # Returns whether or not this scrollpane has a horizontal scrollbar.
    getIsScrollableH: () ->
        return @isScrollableH

    # Returns whether or not this scrollpane has a vertical scrollbar.
    getIsScrollableV: () ->
        return @isScrollableV

    # Gets a reference to the content pane. It is important that you use this method if you want to
    # edit the content of your cScrollPane as if you access the element directly then you may have some
    # problems (as your original element has had additional elements for the scrollbars etc added into
    # it).
    getContentPane: () ->
        return @pane

    # Scrolls this cScrollPane down as far as it can currently scroll. If animate isn't passed then the
    # animateScroll value from settings is used instead.
    scrollToBottom: (animate) ->
        @positionDragY(@dragMaxY, animate)

    # Hijacks the links on the page which link to content inside the scrollpane. If you have changed
    # the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
    # contents of your scroll pane will work then call this function.
    hijackInternalLinks: $.noop,

# Plugin register
$.fn.cScrollPane = (settings) ->
    settings = $.extend({}, CScrollPane.defaults, settings)

    # Apply default speed
    $.each ['arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], () ->
        settings[this] = settings[this] or settings.speed

    return @each () ->
        elem = $(@)
        cspApi = elem.data('csp')
        if (cspApi)
            cspApi.reinitialise(settings)
        else
            $("script",elem).filter('[type="text/javascript"],:not([type])').remove()
            cspApi = new CScrollPane(elem, settings)
            elem.data('csp', cspApi)
            cspApi.initialise(settings)
