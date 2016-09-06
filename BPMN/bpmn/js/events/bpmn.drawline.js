/******************************图形可画线*******************************/
(function ($) {
    $.fn.extend({
        drawline: function (options) {          
            var canvas = $(this).find("canvas")[0];
            $controlDiv = $("#control_div");
            //canvas.onmouseover = function (e) {
            //    if (!e) e = window.event;
            //    var reltg = e.relatedTarget ? e.relatedTarget : e.fromElement;
            //    while (reltg && reltg != this) reltg = reltg.parentNode;
            //    if (reltg != this) {
            //        alert(1111);
            //        // 这里可以编写 onmouseenter 事件的处理代码
            //        $controlDiv.show();
            //        ////flagControlDisplay = true;
            //        //var x = canvas.offsetParent.offsetLeft - 1;
            //        //var y = canvas.offsetParent.offsetTop - 1;
            //        //var width = canvas.clientWidth;
            //        //var height = canvas.clientHeight;
            //        //$controlDiv.css({ "left": x + "px", "top": y + "px", "width": width + "px", "height": height + "px" });
            //    }
            //}
            //canvas.onmouseout = function (e) {
            //    if (!e) e = window.event;
            //    var reltg = e.relatedTarget ? e.relatedTarget : e.toElement;
            //    while (reltg && reltg != this) reltg = reltg.parentNode;
            //    if (reltg != this) {
            //        // 这里可以编写 onmouseleave 事件的处理代码
            //        alert(2222);
            //        $controlDiv.hide();
            //        //$controlDiv.css({ "left": "0px", "top": "0px", "width": "10px", "height": "10px" });
            //    }
            //}

            canvas.onclick = function (evt) {
                var mousePos = getMousePos(canvas, evt);
                var ctx = canvas.getContext("2d");
                if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
                    alert(11111)
                   // $controlDiv.show();
                    flagControlDisplay = true;
                    var x = canvas.offsetParent.offsetLeft - 1;
                    var y = canvas.offsetParent.offsetTop - 1;
                    var width = canvas.clientWidth;
                    var height = canvas.clientHeight;
                    //$controlDiv.css({ "left": x + "px", "top": y + "px", "width": width + "px", "height": height + "px" });
                }
                else {
                    //$controlDiv.hide();
                   // $controlDiv.css({ "left": "0px", "top": "0px", "width": "10px", "height": "10px" });
                }
            }
        }
    });

})(jQuery)