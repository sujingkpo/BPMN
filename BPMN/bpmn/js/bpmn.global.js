//映射创建形状的方法
var mapArray = new Array();
mapArray["task"] = "Task";
mapArray["startevent"] = "StartEvent";
mapArray["endevent"] = "EndEvent";
mapArray["gateway"] = "Gateway";
mapArray["horizonlane"] = "HLane";

//每个图形默认缩放的比例
var figureRateArray = new Array();
figureRateArray["task"] = 2.5;
figureRateArray["startevent"] = 1.5;
figureRateArray["endevent"] = 1.5;
figureRateArray["gateway"] = 1.5;
figureRateArray["horizonlane"] = 5;

//是否按下来Ctrl键
var CtrlKey = false;

//记录当前被选中的形状
var selectedFigureArray = new Array();

//记录当前被选中的线条
var selectedLineArray = new Array();

//画线标记，避免重复创建画线层
var flagForLine = false;

//流程线的外层DIV
var linkWrapper = null;

//流程线的Canvas元素
var linkCanvas = null;

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

    //监听键盘按下事件
    $(document).keydown(function (event) {
        CtrlKey = event.ctrlKey;
    });

    //Delete键删除选中图形
    $(document).keyup(function (event) {
        if (event.keyCode === 46) {
            //删除选中的图形
            $(selectedFigureArray).each(function (i, n) {
                var id = selectedFigureArray.pop();
                var el = document.getElementById(id);
                el.parentNode.removeChild(el);
                $(".scale_div[match='" + id + "']").remove();
                $(".anchor_div[match='" + id + "']").remove();
            });

            //删除选中的线条
            $(selectedLineArray).each(function (i, n) {
                var id = selectedLineArray.pop().id;
                var el = document.getElementById(id);
                el.parentNode.removeChild(el);
            });
        }
        CtrlKey = event.ctrlKey;
    });

    //实时监听缩放事件
    $(".point_scale").live(
        {
            "mousedown": function (e) {
                var id = this.parentNode.getAttribute("match");
                var category = $("#" + id).find("canvas")[0].getAttribute("name");
                var className = mapArray[category];
                switch ($(this).attr("position")) {
                    case "lt":
                        //var obj = eval("new " + className + "({rate: " + rate + ",category:'" + category + "',lineWidth:2,titleWidth: 40})");
                        //var canvasReal = obj.createCanvas();
                        break;
                    case "lb":
                        break;
                    case "rt":
                        break;
                    case "rb":
                        break;
                }
            }
        });

    //单选
    var SelectSingleDom = function (evt, wrapperId) {
        $(".anchor_div").remove();
        $(".scale_div").remove();
        selectedFigureArray.length = 0;
        var arrtmp = new Array();
        $(selectedLineArray).each(function (i) {
            var id = selectedLineArray[i].id;
            var context = selectedLineArray[i].context;
            var wrapper = document.getElementById(id);
            if (wrapperId == id) {
                var posX = evt.clientX - wrapper.offsetLeft;
                var posY = evt.clientY - wrapper.offsetTop;
                if (context.isPointInPath(posX, posY)) {
                    arrtmp.push(selectedLineArray[i]);
                    return true;
                }
            }
            var path = selectedLineArray[i].path;
            var line = new Line(path, wrapper);
            line.drawLine(context);
        });
        selectedLineArray.length = 0;
        selectedLineArray = arrtmp.slice(0);//复制数组
        arrtmp.length = 0;
    }

    //多选
    var SelectMultiDom = function (evt, wrapperId) {
        $(".anchor_div").remove();
        $(".scale_div").remove();
        selectedFigureArray.length = 0;
        var exist = false;
        //遍历数组，查询待选择的线条是否已经是选中状态
        $(selectedLineArray).each(function (i) {
            var id = selectedLineArray[i].id;
            if (wrapperId == id) {
                exist = true;
                return false;
            }
        });
    }

    $("#bpmn_wrapper").bind("click", function (e) {
        SelectSingleDom(e);
    });
    $(".line_wrapper").live({
        "click": function (e) {
            if (CtrlKey) {
                //按住ctrl多选
                SelectMultiDom(e, this.id);
            }
            else {
                SelectSingleDom(e, this.id);
            }
        }
    });
})