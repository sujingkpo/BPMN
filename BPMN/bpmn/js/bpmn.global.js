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

    p_lt.setAttribute("class", "point_scale p_lt");
    p_lb.setAttribute("class", "point_scale p_lb");
    p_rt.setAttribute("class", "point_scale p_rt");
    p_rb.setAttribute("class", "point_scale p_rb");

    controlDiv.appendChild(p_lt);
    controlDiv.appendChild(p_lb);
    controlDiv.appendChild(p_rt);
    controlDiv.appendChild(p_rb);

    //引出线条的控件
    p_l = document.createElement("div");
    p_t = document.createElement("div");
    p_r = document.createElement("div");
    p_b = document.createElement("div");

    p_l.setAttribute("class", "point_circle p_l");
    p_t.setAttribute("class", "point_circle p_t");
    p_r.setAttribute("class", "point_circle p_r");
    p_b.setAttribute("class", "point_circle p_b");

    controlDiv.appendChild(p_l);
    controlDiv.appendChild(p_t);
    controlDiv.appendChild(p_r);
    controlDiv.appendChild(p_b);


    $(document).keyup(function (event) {
        if (event.keyCode === 46) {
            $(selectedFigureArray).each(function (i, n) {
                var id = selectedFigureArray.pop();
                var el = document.getElementById(id);
                el.parentNode.removeChild(el);
                
            });
        }
    });
})