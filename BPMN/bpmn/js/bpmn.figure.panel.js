/******************************初始化左边形状面板和右边按钮工具栏*******************************/

$(function () {
    //var $bpmn_wrapper = $(".bpmn_wrapper:first");
    //var $figure_panel = $(".figure_panel:first");//形状面板
    //var $drawing_wrapper = $(".drawing_wrapper:first");
    ////右侧画布区宽度自适应
    //var bpmn_wrapper_width = $bpmn_wrapper.innerWidth();
    //var figure_panel_width = $figure_panel.outerWidth();
    //var drawing_wrapper_width = bpmn_wrapper_width - figure_panel_width;
    //$drawing_wrapper.css("width", drawing_wrapper_width);

    //初始化形状面板，只需要加载一次
    InitFigurePanel();
})

//初始化形状面板
function InitFigurePanel() {
    //克隆时用的画板层
    var cloneDiv = document.createElement("div");
    cloneDiv.id = "clone_div";
    document.body.appendChild(cloneDiv);
    $(cloneDiv).hide();
    var cloneCanvas = document.createElement("canvas");
    cloneCanvas.id = "clone_canvas";
    cloneCanvas.setAttribute("width", 40);
    cloneCanvas.setAttribute("height", 40);
    cloneCanvas.style.position = "absolute";
    cloneDiv.appendChild(cloneCanvas);

    //创建形状实例数组
    var figureArray = new Array();//存储形状实例
    figureArray.push(new Task());//推入任务模型
    figureArray.push(new StartEvent());//推入开始事件模型
    figureArray.push(new Gateway());//推入网关模型
    figureArray.push(new EndEvent());//推入结束事件模型
    var figure_panel = document.getElementsByClassName("figure_panel")[0];//形状面板

    //装载形状模型到面板中
    for (var item in figureArray) {
        var o = document.createElement("div");
        o.setAttribute("class", "figure_box");
        o.setAttribute("name", figureArray[item].options.type);
        var s = document.createElement("span");
        s.innerText = figureArray[item].options.text;
        var canvas = figureArray[item].createCanvas();
        o.appendChild(canvas);
        o.appendChild(s);
        figure_panel.appendChild(o);
        //赋予克隆特性
        $(o).clone();
    }

    //控制形状模型的背景色
    $("body").bind("mousedown", function (e) {
        var target = $(e.target);
        if (!target.hasClass("figure_box") && !target.parent().hasClass("figure_box")) {
            $(".figure_box").removeClass("figure_box_down")
        }
    });
    $(".figure_box").mouseover(function () {
        $(this).removeClass("figure_box_over").addClass("figure_box_over");
    }).mouseout(function () {
        $(this).removeClass("figure_box_over");
    }).mousedown(function () {
        $(".figure_box").removeClass("figure_box_down");
        $(this).addClass("figure_box_down");
    });
}