/******************************图形可画流程线*******************************/
(function ($) {

    var defaults = {
        canvas: null,
        id: ""
    }

    $.fn.extend({
        flowLine: function (opt) {
            var options = $.extend(defaults, opt);
            var canvas = options.canvas;
            var id = options.id;
            canvas.addEventListener(
                "mouseover", function () {
                    //如果不存在则创建
                    if ($(".anchor_div[match='" + id + "']").length == 0)
                        $.createAnchor(canvas, id);
                }, false);
            canvas.addEventListener(
                "mouseout", function (evt) {
                    //如果画布被选中，不删除锚点
                    if (selectedFigureArray.indexOf(id) == -1)
                        $.removeAnchor(evt, canvas, id);
                }, false);
        }
    });

    $.extend({
        //创建锚点层
        createAnchor: function (canvas, id) {
            var x = canvas.offsetParent.offsetLeft + 4;
            var y = canvas.offsetParent.offsetTop + 4;
            var width = canvas.clientWidth - 10;
            var height = canvas.clientHeight - 10;
            //定位4个锚点
            var posLeft = { x: -3, y: (height / 2) - 3 };
            var posRight = { x: width - 3, y: (height / 2) - 3 };
            var posTop = { x: (width / 2) - 3, y: -3 };
            var posBottom = { x: (width / 2) - 3, y: height - 3 };
            if ($(canvas).attr("category") == "rectangle") {
                posTop.y = posTop.y + canvas.clientHeight / 10;
                posBottom.y = posBottom.y - canvas.clientHeight / 10;
            }
            //初始化画线锚点层
            var anchorDiv = document.createElement("div");
            anchorDiv.setAttribute("class", "anchor_div");
            anchorDiv.setAttribute("match", id);
            document.body.appendChild(anchorDiv);
            //4个锚点
            var p_l = document.createElement("div");
            var p_t = document.createElement("div");
            var p_r = document.createElement("div");
            var p_b = document.createElement("div");
            //定义样式
            p_l.setAttribute("class", "point_anchor p_l");
            p_t.setAttribute("class", "point_anchor p_t");
            p_r.setAttribute("class", "point_anchor p_r");
            p_b.setAttribute("class", "point_anchor p_b");
            //加载到页面
            anchorDiv.appendChild(p_l);
            anchorDiv.appendChild(p_t);
            anchorDiv.appendChild(p_r);
            anchorDiv.appendChild(p_b);

            $(p_l).css({ "left": posLeft.x + "px", "top": posLeft.y + "px" });
            $(p_r).css({ "left": posRight.x + "px", "top": posRight.y + "px" });
            $(p_t).css({ "left": posTop.x + "px", "top": posTop.y + "px" });
            $(p_b).css({ "left": posBottom.x + "px", "top": posBottom.y + "px" });
            $(anchorDiv).css({ "left": x + "px", "top": y + "px" });
            $(anchorDiv).show();

            //绑定画线条方法
            $(".point_anchor").unbind().bind({
                "mousedown": function (e) {
                    //selectedFigureArray.length = 0;
                    //var id = $(this).parent().attr("match");
                    //var c = $(document.getElementById(id)).find("canvas")[0];
                    //$.createScale(c, id);//创建缩放控制层
                    var flagForLine = false;
                    var pointLeft = this.parentNode.offsetLeft + this.offsetLeft;
                    var pointTop = this.parentNode.offsetTop + this.offsetTop;
                    var wrapperId = "";
                    var wrapper, canvas, context;
                    document.onmousemove = function (evt) {
                        var mouseX = evt.clientX;
                        var mouseY = evt.clientY;
                        if (!flagForLine) {
                            flagForLine = true;
                            //var from = $(this).parent().getAttribute("match");
                            wrapperId = $.createLineWrapper(pointLeft, pointTop);
                            wrapper = document.getElementById(wrapperId);
                            canvas = document.getElementById("c" + wrapperId);
                            context = canvas.getContext("2d");
                            $(wrapper).show();
                        }
                        $.drawLine(wrapper, canvas, context, pointLeft, pointTop, mouseX, mouseY);
                    }
                },
                "mouseup": function (e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    if (this.releaseCapture) this.releaseCapture();
                }
            });
        },
        //删除单个锚点层
        removeAnchor: function (event, canvas, id) {
            //获得canvas的范围，结合鼠标的坐标判断是否仍在画布内
            var range = {
                left: parseInt(canvas.offsetParent.offsetLeft),
                right: parseInt(canvas.offsetParent.offsetLeft) + parseInt(canvas.offsetWidth),
                top: parseInt(canvas.offsetParent.offsetTop),
                bottom: parseInt(canvas.offsetParent.offsetTop) + parseInt(canvas.offsetHeight)
            };
            //关键:如果鼠标仍在canvas中，则没有变化，没有这个判断，鼠标移动到锚点上会闪动
            if (event.clientX <= range.left || event.clientX >= range.right || event.clientY <= range.top || event.clientY >= range.bottom) {
                $(".anchor_div[match='" + id + "']").remove();
            }
        },
        //画线
        drawLine: function (wrapper, canvas, context, x1, y1, x2, y2) {
            var w = Math.abs(x1 - x2);
            var h = Math.abs(y1 - y2);
            canvas.setAttribute("width", w + 100);
            canvas.setAttribute("height", 10);
            if (x1 > x2) {//从右向左
                wrapper.style.left = parseInt(x2 + 0) + "px";
                wrapper.style.top = parseInt(y1 - 2) + "px";
            }
            //开始画线
            var line = new Line(x1 - x2, 5, 15, 5);
            line.drawLine(context);
        },
        createLineWrapper: function (x, y) {
            var wrapper = document.createElement("div");
            wrapper.id = $.newId();
            wrapper.setAttribute("class", "line_wrapper");
            var canvas = document.createElement("canvas");
            canvas.id = "c" + wrapper.id;
            wrapper.appendChild(canvas);
            document.body.appendChild(wrapper);
            wrapper.addEventListener(
                "mouseup", function (evt) {
                    document.onmousemove = null;
                    document.onmousedown = null;
                }, false);
            return wrapper.id;
        }
    });

    var Line = function (x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    Line.prototype.drawLine = function (ctx, wrapper) {
        //样式
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 2;

        //画箭头
        var radians = 0;
        var x, y;
        if (this.x1 > this.x2) {
            x = this.x2 - 15;
            y = this.y1;
            radians = -90 * Math.PI / 180;
        }
        else if (this.x1 < this.x2) {
            x = this.x2 + 15;
            y = this.y1;
            radians = 90 * Math.PI / 180;
        }
        else if (this.y1 > this.y2) {
            x = this.x1;
            y = this.y2 - 15;
            radians = 360 * Math.PI / 180;
        }
        else if (this.y1 < this.y2) {
            x = this.x1;
            y = this.y2 + 15;
            radians = Math.PI;
        }
        this.drawArrow(ctx, x, y, radians);

        //画线
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
    Line.prototype.drawArrow = function (ctx, x, y, radians) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 15);
        ctx.lineTo(-5, 15);
        ctx.closePath();
        ctx.restore();
        ctx.fill();
    }
})(jQuery)