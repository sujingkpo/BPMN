/******************************BPMN业务流程管理启动类*******************************/
(function ($) {

    //构建LOVEM图
    $.fn.extend({
        LOVEM: function (options) {
            var container = this[0];
            //构造图形模型工具条
            CreateDrawingBoard(container);
            //加载流程图
            Load(options);
        }
    });

    //构造图形模型工具条
    function CreateDrawingBoard(container) {

        //1. 创建模型栏容器
        var barContainer = document.createElement("div");
        barContainer.id = "activity";
        barContainer.setAttribute("class", "activity");
        //创建矩形模型
        var rect = new Rectangle();
        $(rect).clone();
        barContainer.appendChild(rect);
        //创建圆形模型
        var circle = new Circle();
        $(circle).clone();
        barContainer.appendChild(circle);
        //装载整个模型工具栏
        container.appendChild(barContainer);

        //2. 创建绘制区域
        var drawingarea = document.createElement("div");
        //自适应高度
        var areaHeight = container.clientHeight - barContainer.clientHeight;
        drawingarea.id = "drawingarea";
        drawingarea.setAttribute("class", "drawingarea");
        drawingarea.style.height = areaHeight + "px";
        //装载绘制区域
        container.appendChild(drawingarea);
    }

    //加载流程图
    function Load(options) {
    }
})(jQuery)