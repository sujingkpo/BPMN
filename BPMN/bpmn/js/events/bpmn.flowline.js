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
                    var flagForLine = false;
                    var pointLeft = this.parentNode.offsetLeft + this.offsetLeft + 4;
                    var pointTop = this.parentNode.offsetTop + this.offsetTop + 4;
                    var wrapperId, context;
                    var anchorClass = this.getAttribute("class");
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
                        $.drawLine(anchorClass, linkWrapper, linkCanvas, context, pointLeft, pointTop, mouseX, mouseY);
                    }
                    document.onmouseup = function (evt) {
                        if (((anchorClass.indexOf("p_l") > -1 || anchorClass.indexOf("p_r") > -1) && Math.abs(pointLeft - evt.clientX) < 10)
                            || ((anchorClass.indexOf("p_t") > -1 || anchorClass.indexOf("p_b") > -1) && Math.abs(pointTop - evt.clientY) < 15)) {
                            $(linkWrapper).remove();
                            $(linkCanvas).remove();
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
        drawLine: function (anchorClass, wrapper, canvas, context, x1, y1, x2, y2) {
            var w = Math.abs(x1 - x2);
            var h = Math.abs(y1 - y2);

            if (anchorClass.indexOf("p_l") > -1) {//从左锚点画线
                if (x1 > x2) {
                    wrapper.style.left = parseInt(x2 - 5) + "px";
                    wrapper.style.top = parseInt(y1 - 10) + "px";
                    wrapper.style.width = (w + 5) + "px";
                    wrapper.style.height = "20px";
                    canvas.setAttribute("width", w + 5);
                    canvas.setAttribute("height", 20);
                    if (h < 6) {//水平线
                        var line = new Line(w + 5, 10, 0, 10);
                        line.drawLine(context);
                        line.drawArrow(context);
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

                                var line = new Line(w + 5, h + 10, w / 2 + 4, h + 10);
                                line.drawLine(context);
                                var line2 = new Line(w / 2 + 5, h + 10, w / 2 + 5, 9);
                                line2.drawLine(context);
                                var line3 = new Line(w / 2 + 5, 10, 0, 10);
                                line3.drawLine(context);
                                line3.drawArrow(context);
                            }
                            else {//向下折
                                wrapper.style.left = parseInt(x2 - 5) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";

                                var line = new Line(w + 5, 5, w / 2 + 4, 5);
                                line.drawLine(context);
                                var line2 = new Line(w / 2 + 5, 5, w / 2 + 5, h + 6);
                                line2.drawLine(context);
                                var line3 = new Line(w / 2 + 5, h + 5, 0, h + 5);
                                line3.drawLine(context);
                                line3.drawArrow(context);
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

                                var line = new Line(w + 10, h + 5, 10, h + 5);
                                line.drawLine(context);
                                var line2 = new Line(10, h + 5, 10, 0);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                            else {//箭头朝下
                                wrapper.style.left = parseInt(x2 - 10) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";

                                var line = new Line(w + 10, 5, 10, 5);
                                line.drawLine(context);
                                var line2 = new Line(10, 5, 10, h + 5);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                        }
                    }
                }
            }
            else if (anchorClass.indexOf("p_r") > -1) {//从右锚点画线
                if (x1 < x2) {
                    wrapper.style.left = parseInt(x1) + "px";
                    wrapper.style.top = parseInt(y1 - 10) + "px";
                    wrapper.style.width = (w + 5) + "px";
                    wrapper.style.height = "20px";
                    canvas.setAttribute("width", w + 5);
                    canvas.setAttribute("height", 20);
                    if (Math.abs(y1 - y2) < 6) {//水平线
                        var line = new Line(0, 10, w + 5, 10);
                        line.drawLine(context);
                        line.drawArrow(context);
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

                                var line = new Line(0, h + 10, w / 2, h + 10);
                                line.drawLine(context);
                                var line2 = new Line(w / 2, h + 10, w / 2, 9);
                                line2.drawLine(context);
                                var line3 = new Line(w / 2, 10, w + 5, 10);
                                line3.drawLine(context);
                                line3.drawArrow(context);
                            }
                            else {//向下折
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";

                                var line = new Line(0, 5, w / 2, 5);
                                line.drawLine(context);
                                var line2 = new Line(w / 2, 5, w / 2, h + 6);
                                line2.drawLine(context);
                                var line3 = new Line(w / 2, h + 5, w + 5, h + 5);
                                line3.drawLine(context);
                                line3.drawArrow(context);
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

                                var line = new Line(0, h + 5, w, h + 5);
                                line.drawLine(context);
                                var line2 = new Line(w, h + 5, w, 0);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                            else {//箭头朝下
                                wrapper.style.left = parseInt(x1) + "px";
                                wrapper.style.top = parseInt(y1 - 5) + "px";

                                var line = new Line(0, 5, w, 5);
                                line.drawLine(context);
                                var line2 = new Line(w, 5, w, h + 5);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                        }
                    }
                }
            }
            else if (anchorClass.indexOf("p_t") > -1) {//从上锚点画线
                if (y1 > y2) {
                    wrapper.style.left = parseInt(x1 - 10) + "px";
                    wrapper.style.top = parseInt(y2 - 5) + "px";
                    wrapper.style.width = "20px";
                    wrapper.style.height = (h + 5) + "px";
                    canvas.setAttribute("width", 20);
                    canvas.setAttribute("height", h + 5);
                    if (w < 6) {//垂直线
                        var line = new Line(10, h + 5, 10, 0);
                        line.drawLine(context);
                        line.drawArrow(context);
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

                                var line = new Line(w + 10, h + 5, w + 10, h / 2 + 5);
                                line.drawLine(context);
                                var line2 = new Line(w + 10, h / 2 + 5, 10, h / 2 + 5);
                                line2.drawLine(context);
                                var line3 = new Line(10, h / 2 + 5, 10, 0);
                                line3.drawLine(context);
                                line3.drawArrow(context);
                            }
                            else {//向右折
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 5) + "px";

                                var line = new Line(5, h + 5, 5, h / 2 + 5);
                                line.drawLine(context);
                                var line2 = new Line(5, h / 2 + 5, w + 5, h / 2 + 5);
                                line2.drawLine(context);
                                var line3 = new Line(w + 5, h / 2 + 5, w + 5, 0);
                                line3.drawLine(context);
                                line3.drawArrow(context);
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

                                var line = new Line(w + 5, h + 10, w + 5, 10);
                                line.drawLine(context);
                                var line2 = new Line(w + 5, 10, 0, 10);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                            else {//箭头朝右
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y2 - 10) + "px";

                                var line = new Line(5, h + 10, 5, 10);
                                line.drawLine(context);
                                var line2 = new Line(5, 10, w + 10, 10);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                        }
                    }
                }
            }
            else if (anchorClass.indexOf("p_b") > -1) {//从下锚点画线
                if (y1 < y2) {
                    wrapper.style.left = parseInt(x1 - 10) + "px";
                    wrapper.style.top = parseInt(y1) + "px";
                    wrapper.style.width = "20px";
                    wrapper.style.height = (h + 5) + "px";
                    canvas.setAttribute("width", 20);
                    canvas.setAttribute("height", h + 5);
                    if (w < 6) {//垂直线
                        var line = new Line(10, 0, 10, h + 5);
                        line.drawLine(context);
                        line.drawArrow(context);
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

                                var line = new Line(w + 10, 0, w + 10, h / 2);
                                line.drawLine(context);
                                var line2 = new Line(w + 10, h / 2, 10, h / 2);
                                line2.drawLine(context);
                                var line3 = new Line(10, h / 2, 10, h + 5);
                                line3.drawLine(context);
                                line3.drawArrow(context);
                            }
                            else {//向右折
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y1) + "px";

                                var line = new Line(5, 0, 5, h / 2);
                                line.drawLine(context);
                                var line2 = new Line(5, h / 2, w + 5, h / 2);
                                line2.drawLine(context);
                                var line3 = new Line(w + 5, h / 2, w + 5, h + 5);
                                line3.drawLine(context);
                                line3.drawArrow(context);
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

                                var line = new Line(w + 5, 0, w + 5, h);
                                line.drawLine(context);
                                var line2 = new Line(w + 5, h, 0, h);
                                line2.drawLine(context);
                                line2.drawArrow(context);
                            }
                            else {//箭头朝右
                                wrapper.style.left = parseInt(x1 - 5) + "px";
                                wrapper.style.top = parseInt(y1) + "px";

                                var line = new Line(5, 0, 5, h);
                                line.drawLine(context);
                                var line2 = new Line(5, h, w + 10, h);
                                line2.drawLine(context);
                                line2.drawArrow(context);
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
            document.body.appendChild(wrapper);
            wrapper.addEventListener(
                "mouseup", function (evt) {
                    document.onmousemove = null;
                    document.onmousedown = null;
                }, false);
            return wrapper.id;
        }
    });
})(jQuery)