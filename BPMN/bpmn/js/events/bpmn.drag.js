/******************************拖拽插件*******************************/
(function ($) {
    var drawingWrapper = null;
    var minX = 0;
    var minY = 0;
    var maxX = 0;
    var maxY = 0;

    function drag(obj) {
        obj.onmousedown = function (e) {
            var oe = e || window.event;
            //如果是四个顶点，则拖拽失效
            if (oe.target.getAttribute("class").indexOf("scale_div") == -1) {
                return false;
            }
            var id = $(this).attr("match");
            var $this = this;
            var l = oe.clientX - $this.offsetLeft;
            var t = oe.clientY - $this.offsetTop;
            var canvaswrapper = $("#" + id)[0];
            var l_canvaswrapper = oe.clientX - canvaswrapper.offsetLeft;
            var t_canvaswrapper = oe.clientY - canvaswrapper.offsetTop;
            var canvas = $("#" + id).find("canvas")[0];
            var ctx = canvas.getContext("2d");
            //判断鼠标是否在填充区内，拖拽失效
            if (!ctx.isPointInPath(l_canvaswrapper, t_canvaswrapper)) {
                return false;
            }
            var anchor = $this;
            if ($(".anchor_div[match='" + id + "']").length > 0) {
                anchor = $(".anchor_div[match='" + id + "']")[0];
            }
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
                if(ot > minY && ot < maxY)
                {
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
        },
         obj.onmousemove = function (e) {
             var oe = e || window.event;
             var id = $(this).attr("match");
             var canvaswrapper = $("#" + id)[0];
             var x = oe.clientX - canvaswrapper.offsetLeft;
             var y = oe.clientY - canvaswrapper.offsetTop;
             var canvas = $("#" + id).find("canvas")[0];
             var ctx = canvas.getContext("2d");
             //判断鼠标是否在填充区内，修改鼠标样式
             if (!ctx.isPointInPath(x, y)) {
                 $(this).css("cursor", "pointer");
             }
             else {
                 $(this).css("cursor", "move");
             }
         }
    }

    //公开接口
    $.fn.drag = function (options) {
        drawingWrapper = document.getElementById("drawing_wrapper");
        minX = drawingWrapper.offsetLeft + 5;
        minY = drawingWrapper.offsetTop + 5;
        maxX = drawingWrapper.offsetWidth + minX - this[0].offsetWidth - 10;
        maxY = drawingWrapper.offsetHeight + minY - this[0].offsetHeight - 10;
        drag(this[0]);
    }

})(jQuery)