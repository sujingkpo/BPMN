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
            //定义位置标识
            p_l.setAttribute("pos", "left");
            p_t.setAttribute("pos", "top");
            p_r.setAttribute("pos", "right");
            p_b.setAttribute("pos", "bottom");
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
                    var flagForLine = false;
                    var pointLeft = this.parentNode.offsetLeft + this.offsetLeft + 4;
                    var pointTop = this.parentNode.offsetTop + this.offsetTop + 4;
                    var wrapperId, context;
                    var posAnchor = this.getAttribute("pos");
                    document.onmousemove = function (evt) {
                        var mouseX = evt.clientX;
                        var mouseY = evt.clientY;
                        if (!flagForLine) {
                            flagForLine = true;
                            //var from = $(this).parent().getAttribute("match");
                            wrapperId = $.createLineWrapper(pointLeft, pointTop);
                            linkWrapper = document.getElementById(wrapperId);
                            linkCanvas = document.getElementById("c" + wrapperId);
                            context = linkCanvas.getContext("2d");
                            $(linkWrapper).show();
                        }
                        $.drawLine(posAnchor, linkWrapper, linkCanvas, context, pointLeft, pointTop, mouseX, mouseY);
                    }
                    document.onmouseup = function (evt) {
                        if ((posAnchor == "left" || posAnchor == "right")
                            || (posAnchor == "top" || posAnchor == "bottom")) {
                            if (Math.abs(pointLeft - evt.clientX) < 10 && Math.abs(pointTop - evt.clientY) < 10) {
                                $(linkWrapper).remove();
                                $(linkCanvas).remove();
                            }
                            else {
                                var strpath = $(linkWrapper).attr("pos");
                                var path = jQuery.parseJSON(strpath);
                                var line = new Line(path, linkWrapper);
                                line.drawLine(context);
                            }
                        }
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                },
                "mouseup": function (e) {
                    $(linkWrapper).remove();
                    $(linkCanvas).remove();
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
        drawLine: function (posAnchor, wrapper, canvas, context, x1, y1, x2, y2) {
            var w = Math.abs(x1 - x2);
            var h = Math.abs(y1 - y2);

            if (posAnchor == "left") {//从左锚点画线
                if (x1 > x2) {
                    wrapper.style.left = parseInt(x2 - 5) + "px";
                    wrapper.style.top = parseInt(y1 - 10) + "px";
                    wrapper.style.width = (w + 5) + "px";
                    wrapper.style.height = "20px";
                    canvas.setAttribute("width", w + 5);
                    canvas.setAttribute("height", 20);
                    if (h < 6) {//水平线
                        var path = new Array();
                        path.push({ x: w + 5, y: 10 });
                        path.push({ x: 0, y: 10 });
                        var line = new Line(path, wrapper);
                        line.drawLine(context);
                    }
                    else {
                        if (w > h) {//双折线
                            canvas.setAttribute("width", w + 5);
                            canvas.setAttribute("height", h + 15);
                            wrapper.style.width = (w + 5) + "px";
                            wrapper.style.height = (h + 15) + "px";
                            if (y1 > y2) {//向上折
                                wrapper.style.left = parseInt(x2 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 10) + "px";
                                var path = new Array();
                                path.push({ x: w + 5, y: h + 10 });
                                path.push({ x: w / 2 + 5, y: h + 10 });
                                path.push({ x: w / 2 + 5, y: 10 });
                                path.push({ x: 0, y: 10 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//向下折
                                wrapper.style.left = parseInt(x2 - 5) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";
                                var path = new Array();
                                path.push({ x: w + 5, y: 5 });
                                path.push({ x: w / 2 + 5, y: 5 });
                                path.push({ x: w / 2 + 5, y: h + 5 });
                                path.push({ x: 0, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                        else {//单折线
                            canvas.setAttribute("width", w + 10);
                            canvas.setAttribute("height", h + 10);
                            wrapper.style.width = (w + 10) + "px";
                            wrapper.style.height = (h + 10) + "px";
                            if (y1 > y2) {//箭头朝上
                                wrapper.style.left = parseInt(x2 - 10) + "px";
                                wrapper.style.top = parseInt(y2 - 5) + "px";
                                var path = new Array();
                                path.push({ x: w + 10, y: h + 5 });
                                path.push({ x: 10, y: h + 5 });
                                path.push({ x: 10, y: 0 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                                line.drawArrow(context);
                            }
                            else {//箭头朝下
                                wrapper.style.left = parseInt(x2 - 10) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";
                                var path = new Array();
                                path.push({ x: w + 10, y: 5 });
                                path.push({ x: 10, y: 5 });
                                path.push({ x: 10, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                                line.drawArrow(context);
                            }
                        }
                    }
                }
                else {
                    //wrapper.style.left = parseInt(x1 - 30) + "px";
                    //wrapper.style.top = parseInt(y1 - 10) + "px";
                    //wrapper.style.width = (w + 5) + "px";
                    //wrapper.style.height = "20px";
                    //canvas.setAttribute("width", w + 5);
                    //canvas.setAttribute("height", 20);
                }
            }
            else if (posAnchor == "right") {//从右锚点画线
                if (x1 < x2) {
                    wrapper.style.left = parseInt(x1) + "px";
                    wrapper.style.top = parseInt(y1 - 10) + "px";
                    wrapper.style.width = (w + 5) + "px";
                    wrapper.style.height = "20px";
                    canvas.setAttribute("width", w + 5);
                    canvas.setAttribute("height", 20);
                    if (Math.abs(y1 - y2) < 6) {//水平线
                        var path = new Array();
                        path.push({ x: 0, y: 10 });
                        path.push({ x: w + 5, y: 10 });
                        var line = new Line(path, wrapper);
                        line.drawLine(context);
                    }
                    else {
                        if (w > h) {//双折线
                            canvas.setAttribute("width", w + 5);
                            canvas.setAttribute("height", h + 15);
                            wrapper.style.width = (w + 5) + "px";
                            wrapper.style.height = (h + 15) + "px";
                            if (y1 > y2) {//向上折
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y2 - 10) + "px";
                                var path = new Array();
                                path.push({ x: 0, y: h + 10 });
                                path.push({ x: w / 2, y: h + 10 });
                                path.push({ x: w / 2, y: 10 });
                                path.push({ x: w + 5, y: 10 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//向下折
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";
                                var path = new Array();
                                path.push({ x: 0, y: 5 });
                                path.push({ x: w / 2, y: 5 });
                                path.push({ x: w / 2, y: h + 5 });
                                path.push({ x: w + 5, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                        else {//单折线
                            canvas.setAttribute("width", w + 10);
                            canvas.setAttribute("height", h + 10);
                            wrapper.style.width = (w + 10) + "px";
                            wrapper.style.height = (h + 10) + "px";
                            if (y1 > y2) {//箭头朝上
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y2 - 5) + "px";
                                var path = new Array();
                                path.push({ x: 0, y: h + 5 });
                                path.push({ x: w, y: h + 5 });
                                path.push({ x: w, y: 0 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//箭头朝下
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";
                                var path = new Array();
                                path.push({ x: 0, y: 5 });
                                path.push({ x: w, y: 5 });
                                path.push({ x: w, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                    }
                }
            }
            else if (posAnchor == "top") {//从顶部锚点画线
                if (y1 > y2) {
                    wrapper.style.left = parseInt(x1 - 10) + "px";
                    wrapper.style.top = parseInt(y2 - 5) + "px";
                    wrapper.style.width = "20px";
                    wrapper.style.height = (h + 5) + "px";
                    canvas.setAttribute("width", 20);
                    canvas.setAttribute("height", h + 5);
                    if (w < 6) {//垂直线
                        var path = new Array();
                        path.push({ x: 10, y: h + 5 });
                        path.push({ x: 10, y: 0 });
                        var line = new Line(path, wrapper);
                        line.drawLine(context);
                    }
                    else {
                        if (h > w) {//双折线
                            canvas.setAttribute("width", w + 15);
                            canvas.setAttribute("height", h + 5);
                            wrapper.style.width = (w + 15) + "px";
                            wrapper.style.height = (h + 5) + "px";
                            if (x1 > x2) {//向左折
                                wrapper.style.left = parseInt(x2 - 10) + "px";
                                wrapper.style.top = parseInt(y2 - 5) + "px";
                                var path = new Array();
                                path.push({ x: w + 10, y: h + 5 });
                                path.push({ x: w + 10, y: h / 2 + 5 });
                                path.push({ x: 10, y: h / 2 + 5 });
                                path.push({ x: 10, y: 0 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//向右折
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 5) + "px";
                                var path = new Array();
                                path.push({ x: 5, y: h + 5 });
                                path.push({ x: 5, y: h / 2 + 5 });
                                path.push({ x: w + 5, y: h / 2 + 5 });
                                path.push({ x: w + 5, y: 0 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                        else {//单折线
                            canvas.setAttribute("width", w + 10);
                            canvas.setAttribute("height", h + 10);
                            wrapper.style.width = (w + 10) + "px";
                            wrapper.style.height = (h + 10) + "px";
                            if (x1 > x2) {//箭头朝左
                                wrapper.style.left = parseInt(x2 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 10) + "px";
                                var path = new Array();
                                path.push({ x: w + 5, y: h + 10 });
                                path.push({ x: w + 5, y: 10 });
                                path.push({ x: 0, y: 10 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//箭头朝右
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 10) + "px";
                                var path = new Array();
                                path.push({ x: 5, y: h + 10 });
                                path.push({ x: 5, y: 10 });
                                path.push({ x: w + 10, y: 10 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                    }
                }
            }
            else if (posAnchor == "bottom") {//从下锚点画线
                if (y1 < y2) {
                    wrapper.style.left = parseInt(x1 - 10) + "px";
                    wrapper.style.top = parseInt(y1) + "px";
                    wrapper.style.width = "20px";
                    wrapper.style.height = (h + 5) + "px";
                    canvas.setAttribute("width", 20);
                    canvas.setAttribute("height", h + 5);
                    if (w < 6) {//垂直线
                        var path = new Array();
                        path.push({ x: 10, y: 0 });
                        path.push({ x: 10, y: h + 5 });
                        var line = new Line(path, wrapper);
                        line.drawLine(context);
                    }
                    else {
                        if (h > w) {//双折线
                            canvas.setAttribute("width", w + 15);
                            canvas.setAttribute("height", h + 5);
                            wrapper.style.width = (w + 15) + "px";
                            wrapper.style.height = (h + 5) + "px";
                            if (x1 > x2) {//向左折
                                wrapper.style.left = parseInt(x2 - 10) + "px";
                                wrapper.style.top = parseInt(y1) + "px";
                                var path = new Array();
                                path.push({ x: w + 10, y: 0 });
                                path.push({ x: w + 10, y: h / 2 });
                                path.push({ x: 10, y: h / 2 });
                                path.push({ x: 10, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//向右折
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y1) + "px";
                                var path = new Array();
                                path.push({ x: 5, y: 0 });
                                path.push({ x: 5, y: h / 2 });
                                path.push({ x: w + 5, y: h / 2 });
                                path.push({ x: w + 5, y: h + 5 });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                        else {//单折线
                            canvas.setAttribute("width", w + 10);
                            canvas.setAttribute("height", h + 10);
                            wrapper.style.width = (w + 10) + "px";
                            wrapper.style.height = (h + 10) + "px";
                            if (x1 > x2) {//箭头朝左
                                wrapper.style.left = parseInt(x2 - 5) + "px";
                                wrapper.style.top = parseInt(y1) + "px";
                                var path = new Array();
                                path.push({ x: w + 5, y: 0 });
                                path.push({ x: w + 5, y: h });
                                path.push({ x: 0, y: h });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                            else {//箭头朝右
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y1) + "px";
                                var path = new Array();
                                path.push({ x: 5, y: 0 });
                                path.push({ x: 5, y: h });
                                path.push({ x: w + 10, y: h });
                                var line = new Line(path, wrapper);
                                line.drawLine(context);
                            }
                        }
                    }
                }
            }
        },
        createLineWrapper: function (x, y) {//创建线条的外层和画布
            var wrapper = document.createElement("div");
            wrapper.id = $.newId();
            wrapper.setAttribute("class", "line_wrapper");
            var canvas = document.createElement("canvas");
            canvas.id = "c" + wrapper.id;
            wrapper.appendChild(canvas);
            var context = canvas.getContext("2d");
            document.body.appendChild(wrapper);
            //判断鼠标是否在路径上
            wrapper.addEventListener(
                "mousemove", function (evt) {
                    var posX = evt.clientX - wrapper.offsetLeft;
                    var posY = evt.clientY - wrapper.offsetTop;
                    if (context.isPointInPath(posX, posY)) {
                        wrapper.style.cursor = "pointer";
                    }
                    else {
                        wrapper.style.cursor = "default";
                    }
                }, false);
            wrapper.addEventListener(
                "mousedown", function (evt) {
                    var posX = evt.clientX - wrapper.offsetLeft;
                    var posY = evt.clientY - wrapper.offsetTop;
                    if (context.isPointInPath(posX, posY)) {
                        var exist = false;
                        $(selectedLineArray).each(function (i) {
                            var id = selectedLineArray[i].id;
                            if (wrapper.id == id) {
                                exist = true;
                                return false;
                            }
                        });
                        if (!exist) {
                            var strpath = $(this).attr("pos");
                            var path = jQuery.parseJSON(strpath);
                            selectedLineArray.push({ "id": wrapper.id, "context": context, "path": path });
                            var line = new Line(path, wrapper, "#940606");
                            line.drawLine(context);
                        }

                    }
                }, false);
            wrapper.addEventListener(
                "mouseup", function (evt) {
                    document.onmousemove = null;
                    document.onmousedown = null;
                }, false);
            return wrapper.id;
        }
    });
})(jQuery)