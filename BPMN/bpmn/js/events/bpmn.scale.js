/******************************图形缩放事件*******************************/
(function ($) {

    var defaults = {
        canvas: null,
        id: ""
    }

    $.fn.extend({
        scale: function (opt) {
            var options = $.extend(defaults, opt);
            var canvas = options.canvas;
            var id = options.id;
            var drawingWrapper = document.getElementById("drawing_wrapper");
            var minX = drawingWrapper.offsetLeft;
            var minY = drawingWrapper.offsetTop;
            var maxX = drawingWrapper.offsetWidth + minX - this[0].offsetWidth;
            var maxY = drawingWrapper.offsetHeight + minY - this[0].offsetHeight;
            $(this).bind("mousedown", function (e) {
                var scaleDiv = Scale.CreateScale(canvas, id);
                $(scaleDiv).drag();
                var oe = e || window.event;
                var $this = scaleDiv;
                var l = oe.clientX - $this.offsetLeft;
                var t = oe.clientY - $this.offsetTop;
                var canvaswrapper = $("#" + id)[0];
                var l_canvaswrapper = oe.clientX - canvaswrapper.offsetLeft;
                var t_canvaswrapper = oe.clientY - canvaswrapper.offsetTop;
                var anchor = $(".anchor_div[match='" + id + "']")[0];
                var l_anchor = oe.clientX - anchor.offsetLeft;
                var t_anchor = oe.clientY - anchor.offsetTop;
                document.onmousemove = function (e) {
                    var oe = e || window.event;
                    var ol = oe.clientX - l;
                    var ot = oe.clientY - t;
                    var ol_canvaswrapper = oe.clientX - l_canvaswrapper;
                    var ot_canvaswrapper = oe.clientY - t_canvaswrapper;
                    var ol_anchor = oe.clientX - l_anchor;
                    var ot_anchor = oe.clientY - t_anchor;
                    if (ol < 0) ol = 0;
                    if (ot < 0) ot = 0;
                    if (ot > document.documentElement.clientHeight - $this.offsetHeight) {
                        ot = document.documentElement.clientHeight - $this.offsetHeight;
                        ot_canvaswrapper = document.documentElement.clientHeight - canvaswrapper.offsetHeight;
                        ot_anchor = document.documentElement.clientHeight - anchor.offsetHeight;
                    }
                    if (ol > document.documentElement.clientWidth - $this.offsetWidth) {
                        ol = document.documentElement.clientWidth - $this.offsetWidth;
                        ol_canvaswrapper = document.documentElement.clientWidth - canvaswrapper.offsetWidth;
                        ol_anchor = document.documentElement.clientWidth - anchor.offsetWidth;
                    }
                    if (ol > minX && ol < maxX) {
                        $this.style.left = ol + "px";
                        canvaswrapper.style.left = ol_canvaswrapper + "px";
                        anchor.style.left = ol_anchor + "px";
                    }
                    if (ot > minY && ot < maxY) {
                        $this.style.top = ot + "px";
                        canvaswrapper.style.top = ot_canvaswrapper + "px";
                        anchor.style.top = ot_anchor + "px";
                    }
                }
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    if ($this.releaseCapture) $this.releaseCapture();
                }
                if ($this.setCapture) {
                    $this.setCapture();
                }
                if (oe.preventDefault) oe.preventDefault();
                else oe.returnValue = false;
                return false;
            });
        }
    });

})(jQuery)