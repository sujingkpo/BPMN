/******************************图形可画线*******************************/
(function ($) {

    var defaults = {
        canvas: null
    }

    $.fn.extend({
        drawline: function (opt) {
            var options = $.extend(defaults, opt);
            var canvas = options.canvas;
            canvas.addEventListener(
                "mouseover", function () {
                    AnchorPoit.DrawAnchor(canvas);
                }, false);
            canvas.addEventListener(
                "mouseout", function (evt) {
                    AnchorPoit.RemoveAnchor(canvas, evt);
                }, false);

            //canvas.onclick = function (evt) {
            //    var mousePos = CommonMethod.getMousePos(canvas, evt);
            //    var ctx = canvas.getContext("2d");
            //    if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
            //        alert(11111)
            //       // $controlDiv.show();
            //        flagControlDisplay = true;
            //        var x = canvas.offsetParent.offsetLeft - 1;
            //        var y = canvas.offsetParent.offsetTop - 1;
            //        var width = canvas.clientWidth;
            //        var height = canvas.clientHeight;
            //        //$controlDiv.css({ "left": x + "px", "top": y + "px", "width": width + "px", "height": height + "px" });
            //    }
            //    else {
            //        //$controlDiv.hide();
            //       // $controlDiv.css({ "left": "0px", "top": "0px", "width": "10px", "height": "10px" });
            //    }
            //}
        }
    });

})(jQuery)