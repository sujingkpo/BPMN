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
    var figureArray = new Array();//存储形状实例
    figureArray.push(new Rectangle());//推入任务模型
    figureArray.push(new Circle());//推入开始事件模型
    figureArray.push(new Diamond());//推入网关模型
    figureArray.push(new Circle({ text: "结束", type: "endEvent", bgcolor: "#FF8F80" }));//推入结束事件模型
    var figure_panel = document.getElementsByClassName("figure_panel")[0];//形状面板

    //装载形状模型到面板中，canvas绘制
    for (var item in figureArray) {
        var o = document.createElement("div");
        o.setAttribute("class", "figure_box");
        o.setAttribute("name", figureArray[item].options.type);
        var s = document.createElement("span");
        s.innerText = figureArray[item].options.text;
        o.appendChild(figureArray[item].getCanvas());
        o.appendChild(s);
        figure_panel.appendChild(o);
    }

    //绑定鼠标事件
    $(".figure_box").mouseover(function () {
        $(this).removeClass("figure_box_over").addClass("figure_box_over");
    }).mouseout(function () {
        $(this).removeClass("figure_box_over");
    }).mousedown(function () {
        $(".figure_box").removeClass("figure_box_down")
        $(this).addClass("figure_box_down");
    });
}