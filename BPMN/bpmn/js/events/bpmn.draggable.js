/******************************实现可拖拽插件*******************************/
(function ($) {
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
                $this.style.left = ol + "px";
                $this.style.top = ot + "px";
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
        drag(this[0]);
    }

})(jQuery)