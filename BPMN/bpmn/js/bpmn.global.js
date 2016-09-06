//映射创建形状的方法
var mapArray = new Array();
mapArray["task"] = "Task";
mapArray["startevent"] = "StartEvent";
mapArray["endevent"] = "EndEvent";
mapArray["gateway"] = "Gateway";

//每个图形默认缩放的比例
var figureRateArray = new Array();
figureRateArray["task"] = 2.5;
figureRateArray["startevent"] = 1.5;
figureRateArray["endevent"] = 1.5;
figureRateArray["gateway"] = 1.5;

//形状控制层和画布
var controlDiv, controlCanvas;
//控制缩放的4个端点控件
var p_lt;//左上角的点
var p_lb;//左下角
var p_rt;//右上角
var p_rb;//右下角
//引出线条的4个点
var p_l;
var p_t;
var p_b;
var p_r;

//记录当前被选中的形状
var selectedFigureArray = new Array();

$(function () {
    //画布区高度自适应
    var $bpmn_wrapper = $("#bpmn_wrapper");
    var $drawing_toolbar = $("#drawing_toolbar");//工具栏
    var $figure_panel = $("#figure_panel");//形状面板
    var $drawing_wrapper = $("#drawing_wrapper");
    var bpmn_wrapper_height = $bpmn_wrapper.innerHeight();
    var drawing_toolbar_height = $drawing_toolbar.outerHeight();
    var figure_panel_height = $figure_panel.outerHeight();
    var drawing_wrapper_height = bpmn_wrapper_height - drawing_toolbar_height - figure_panel_height;
    $drawing_wrapper.css("height", drawing_wrapper_height);
    $("#canvas_area").css("height", drawing_wrapper_height);

    //初始化形状控制层
    controlDiv = document.createElement("div");
    controlDiv.id = "control_div";
    document.body.appendChild(controlDiv);
    //controlCanvas = document.createElement("canvas");
    //controlCanvas.id = "control_canvas";
    //controlDiv.appendChild(controlCanvas);
    //控制缩放的控件
    p_lt = document.createElement("div");
    p_lb = document.createElement("div");
    p_rt = document.createElement("div");
    p_rb = document.createElement("div");
    //定义样式
    p_lt.setAttribute("class", "point_scale p_lt");
    p_lb.setAttribute("class", "point_scale p_lb");
    p_rt.setAttribute("class", "point_scale p_rt");
    p_rb.setAttribute("class", "point_scale p_rb");
    //加载到页面
    controlDiv.appendChild(p_lt);
    controlDiv.appendChild(p_lb);
    controlDiv.appendChild(p_rt);
    controlDiv.appendChild(p_rb);

    //初始化画线锚点层
    anchorDiv = document.createElement("div");
    anchorDiv.id = "anchor_div";
    document.body.appendChild(anchorDiv);
    //4个锚点
    p_l = document.createElement("div");
    p_t = document.createElement("div");
    p_r = document.createElement("div");
    p_b = document.createElement("div");
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

    //Delete键删除选中图形
    $(document).keyup(function (event) {
        if (event.keyCode === 46) {
            $(selectedFigureArray).each(function (i, n) {
                var id = selectedFigureArray.pop();
                var el = document.getElementById(id);
                el.parentNode.removeChild(el);
            });
        }
    });

    //鼠标在图形和离开图形时的效果
    var $anchorDiv = $("#anchor_div");
    $(".figure_real").find("canvas").live({
        "mouseover": function (evt) {
            $anchorDiv = $("#anchor_div");
            $anchorDiv.show();
            var x = this.offsetParent.offsetLeft + 4;
            var y = this.offsetParent.offsetTop + 4;
            var width = this.clientWidth - 10;
            var height = this.clientHeight - 10;
            //定位4个锚点
            var posLeft = { x: -3, y: (height / 2) - 3 };
            var posLRight = { x: width - 3, y: (height / 2) - 3 };
            var posTop = { x: (width / 2) - 3, y: -3 };
            var posBottom = { x: (width / 2) - 3, y: height - 3 };
            $(p_l).css({ "left": posLeft.x + "px", "top": posLeft.y + "px" });
            $(p_r).css({ "left": posLRight.x + "px", "top": posLRight.y + "px" });
            $(p_t).css({ "left": posTop.x + "px", "top": posTop.y + "px" });
            $(p_b).css({ "left": posBottom.x + "px", "top": posBottom.y + "px" });
            $anchorDiv.css({ "left": x + "px", "top": y + "px" });
        },
        "mouseout": function (evt) {
            //如果鼠标仍在canvas中，则没有变化
            //获得canvas的范围，结合鼠标的坐标判断是否仍在画布内
           // alert(this.offsetParent.offsetLeft);
            //alert(evt.clientX);
            var range = {
                left: this.offsetParent.offsetLeft,
                right: this.offsetParent.offsetLeft + this.offsetWidth,
                top: this.offsetParent.offsetTop,
                bottom: this.offsetParent.offsetTop + this.offsetHeight
            };
            if (evt.clientX < range.left || evt.clientX > range.right || evt.clientY < range.top || evt.clientY > range.bottom) {
                $anchorDiv.hide();
            }
        }
    });
})