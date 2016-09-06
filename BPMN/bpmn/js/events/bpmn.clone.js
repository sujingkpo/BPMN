(function ($) {

    //公开接口
    $.fn.clone = function (options) {
        clone();
    }

    //基本配置
    var config = {
        CloneElement: null,
        MouseX: 0,
        MouseY: 0,
        X: 0,
        Y: 0
    };

    //注册事件
    $(document).on({
        "mousemove": MousMove,
        "mouseup": function () {
            config = {
                CloneElement: null,
                MouseX: 0,
                MouseY: 0,
                X: 0,
                Y: 0
            }

        }
    });

    //鼠标移动
    function MousMove(event) {
        if (config.CloneElement != null) {
            var currentX = parseInt(event.clientX - config.MouseX + config.X);
            var currentY = parseInt(event.clientY - config.MouseY + config.Y);
            config.CloneElement.style.left = currentX + "px";
            config.CloneElement.style.top = currentY + "px";

            //当鼠标移动到画图区时，生成放大的图形

            ////限制可拖拽的有效区域
            //var figurePanel = document.getElementById("figure_panel");
            //var drawingWrapper = document.getElementById("drawing_wrapper");
            //var minX = figurePanel.offsetLeft;
            //var minY = figurePanel.offsetTop;
            //var maxX = drawingWrapper.offsetWidth + minX;
            //var maxY = drawingWrapper.offsetHeight + minY;

            //var currentX = parseInt(event.clientX - config.MouseX + config.X);
            //var currentY = parseInt(event.clientY - config.MouseY + config.Y);
            //if (currentX > minX && currentX < maxX - document.getElementById("clone_canvas").offsetWidth)
            //    config.CloneElement.style.left = currentX + "px";

            //if (currentY > minY && currentY < maxY)
            //    config.CloneElement.style.top = currentY + "px";
        }
    }

    function clone() {
        $(".figure_box").live({
            "mousedown": function (event) {
                //保存当前鼠标坐标
                config.MouseX = event.clientX;
                config.MouseY = event.clientY;
                var canvasType = $(this).attr("name");
                var clonediv = document.getElementById("clone_div");
                $(clonediv).css("display", "block");
                var canvas = document.getElementById("clone_canvas");
                var ctx = canvas.getContext("2d");
                var _canvas = $(this).find("canvas");
                var category = _canvas[0].getAttribute("category");
                var offset;
                if (_canvas.length > 0) {
                    ctx.drawImage(_canvas[0], 0, 0);//复制效果context.drawImage(img,x,y);
                    offset = $(_canvas[0]).offset();
                    canvas.style.left = offset.left + "px";
                    canvas.style.top = offset.top + "px";
                    config.X = offset.left;
                    config.Y = offset.top;
                }
                config.CloneElement = canvas;
                document.onmouseup = function (evt) {
                    //识别画图区，如果形状没有被拖拽到画图区则还原，否则在画图区创建一个形状
                    var drawingarea = document.getElementById("canvas_area");
                    var x = canvas.offsetLeft;
                    var y = canvas.offsetTop;
                    var drawingarea_x1 = drawingarea.offsetLeft;
                    var drawingarea_y1 = drawingarea.offsetTop;
                    var drawingarea_x2 = drawingarea.offsetLeft + drawingarea.offsetWidth;
                    var drawingarea_y2 = drawingarea.offsetTop + drawingarea.offsetHeight;
                    if (x < drawingarea_x1 || x > drawingarea_x2 || y < drawingarea_y1 || y > drawingarea_y2) {
                    }
                    else {
                        //如果在画板内，则创建一个形状实例
                        var figureWidth = _canvas[0].getAttribute("width");
                        var figureHeight = _canvas[0].getAttribute("height");
                        var divCanvasWrapper = document.createElement("div");
                        var rate = figureRateArray[canvasType];
                        divCanvasWrapper.id = guid();
                        divCanvasWrapper.style.display = "block";
                        divCanvasWrapper.style.left = (x * 1 - figureWidth * (rate - 1) / 2) + "px";
                        divCanvasWrapper.style.top = (y * 1 - figureHeight * (rate - 1) / 2) + "px";
                        divCanvasWrapper.setAttribute("class", "figure_real");

                        var className = mapArray[canvasType];
                        var obj = eval("new " + className + "({rate: " + rate + ",category:'" + category + "',lineWidth:2})");
                        var canvasReal = obj.createCanvas();
                        divCanvasWrapper.appendChild(canvasReal);
                        document.getElementById("drawing_wrapper").appendChild(divCanvasWrapper);
                        $(divCanvasWrapper).drag();//绑定拖拽属性
                        //$(divCanvasWrapper).drawline();//绑定画线属性
                        selectedFigureArray.length = 0;
                        selectedFigureArray.push(divCanvasWrapper.id);
                    }
                    ctx.clearRect(0, 0, _canvas[0].width, _canvas[0].height);
                    $("#clone_div").hide();
                }
            }
        });
    }
})(jQuery)