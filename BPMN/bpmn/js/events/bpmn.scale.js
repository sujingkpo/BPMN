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
            var minX = drawingWrapper.offsetLeft + 5;
            var minY = drawingWrapper.offsetTop + 5;
            var maxX = drawingWrapper.offsetWidth + minX - this[0].offsetWidth - 10;
            var maxY = drawingWrapper.offsetHeight + minY - this[0].offsetHeight - 10;
            $(this).bind("mousedown", function (e) {
                var canvaswrapper = $("#" + id)[0];
                var scaleDiv = $.createScale(canvas, id);
                //如果是泳道图将其zindex调低
                if ($(canvas).attr("category") == "horizonlane")
                {
                    canvaswrapper.style.zIndex = 3;
                    scaleDiv.style.zIndex = 4;
                }
                $(scaleDiv).drag();
                var oe = e || window.event;
                var $this = scaleDiv;
                var l = oe.clientX - $this.offsetLeft;
                var t = oe.clientY - $this.offsetTop;
                
                var l_canvaswrapper = oe.clientX - canvaswrapper.offsetLeft;
                var t_canvaswrapper = oe.clientY - canvaswrapper.offsetTop;
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
            });
        }
    });

    $.extend({
        //创建缩放层和控制点
        createScale: function (canvas, id) {
            var x = canvas.offsetParent.offsetLeft + 4;
            var y = canvas.offsetParent.offsetTop + 4;
            var width = canvas.clientWidth - 10;
            var height = canvas.clientHeight - 10;

            if ($(canvas).attr("category") == "rectangle") {
                y = y + canvas.clientHeight / 10;
                height = height - canvas.clientHeight / 5;
            }
            //定位4个顶点
            var posLT = { x: -4, y: -4 };
            var posLB = { x: -4, y: height - 4 };
            var posRT = { x: width - 4, y: -4 };
            var posRB = { x: width - 4, y: height - 4 };

            $(".scale_div").remove();//删除缩放控制
            $(".anchor_div").remove();//删除锚点控制
            //初始化画线锚点层
            var scaleDiv = document.createElement("div");
            scaleDiv.setAttribute("class", "scale_div");
            scaleDiv.setAttribute("match", id);
            document.body.appendChild(scaleDiv);
            //4个顶点
            p_lt = document.createElement("div");
            p_lb = document.createElement("div");
            p_rt = document.createElement("div");
            p_rb = document.createElement("div");
            //定义样式
            $(p_lt).attr({ "class": "point_scale p_lt", "position": "lt" });
            $(p_lb).attr({ "class": "point_scale p_lb", "position": "lb" });
            $(p_rt).attr({ "class": "point_scale p_rt", "position": "rt" });
            $(p_rb).attr({ "class": "point_scale p_rb", "position": "rb" });
            //加载到页面
            scaleDiv.appendChild(p_lt);
            scaleDiv.appendChild(p_lb);
            scaleDiv.appendChild(p_rt);
            scaleDiv.appendChild(p_rb);

            $(p_lt).css({ "left": posLT.x + "px", "top": posLT.y + "px" });
            $(p_lb).css({ "left": posLB.x + "px", "top": posLB.y + "px" });
            $(p_rt).css({ "left": posRT.x + "px", "top": posRT.y + "px" });
            $(p_rb).css({ "left": posRB.x + "px", "top": posRB.y + "px" });
            $(scaleDiv).css({ "left": x + "px", "top": y + "px", "width": width + "px", "height": height + "px" });
            $(scaleDiv).show();
            selectedFigureArray.length = 0;//清空数组
            selectedFigureArray.push(id);//追加当前被选中元素ID
            if ($(canvas).attr("category") != "horizonlane")
                $.createAnchor(canvas, id);
            return scaleDiv;
        },
        //删除单个缩放层和控制点
        removeScale: function (id) {
            $(".scale_div[match='" + id + "']").remove();
        }
    });

})(jQuery)