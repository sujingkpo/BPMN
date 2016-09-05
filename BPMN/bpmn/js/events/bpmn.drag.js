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
            var $this = this;
            var l = oe.clientX - $this.offsetLeft;
            var t = oe.clientY - $this.offsetTop;
            document.onmousemove = function (e) {
                var oe = e || window.event;
                var ol = oe.clientX - l;
                var ot = oe.clientY - t;
                if (ol < 0) ol = 0;
                if (ot < 0) ot = 0;
                if (ot > document.documentElement.clientHeight - $this.offsetHeight) ot = document.documentElement.clientHeight - $this.offsetHeight;
                if (ol > document.documentElement.clientWidth - $this.offsetWidth) ol = document.documentElement.clientWidth - $this.offsetWidth;
                if (ol > minX && ol < maxX) $this.style.left = ol + "px";
                if (ot > minY && ot < maxY)  $this.style.top = ot + "px";
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
        }
    }

    //公开接口
    $.fn.drag = function (options) {
        drawingWrapper = document.getElementById("drawing_wrapper");
        minX = drawingWrapper.offsetLeft;
        minY = drawingWrapper.offsetTop;
        maxX = drawingWrapper.offsetWidth + minX - this[0].offsetWidth;
        maxY = drawingWrapper.offsetHeight + minY - this[0].offsetHeight;
        drag(this[0]);
    }

})(jQuery)