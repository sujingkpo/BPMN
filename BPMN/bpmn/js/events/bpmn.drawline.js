/******************************图形可画线*******************************/
(function ($) {

    var defaults = {
        canvas: null,
        id: ""
    }

    $.fn.extend({
        drawline: function (opt) {
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
        },
        //删除单个锚点层
        removeAnchor: function (event, canvas, id) {
            //如果鼠标仍在canvas中，则没有变化
            //获得canvas的范围，结合鼠标的坐标判断是否仍在画布内
            var range = {
                left: parseInt(canvas.offsetParent.offsetLeft),
                right: parseInt(canvas.offsetParent.offsetLeft) + parseInt(canvas.offsetWidth),
                top: parseInt(canvas.offsetParent.offsetTop),
                bottom: parseInt(canvas.offsetParent.offsetTop) + parseInt(canvas.offsetHeight)
            };
            if (event.clientX <= range.left || event.clientX >= range.right || event.clientY <= range.top || event.clientY >= range.bottom) {
                $(".anchor_div[match='" + id + "']").remove();
            }
        }
    });

})(jQuery)