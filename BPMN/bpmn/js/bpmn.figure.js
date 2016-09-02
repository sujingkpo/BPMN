/******************************图形模版库*******************************/

//矩形
var Rectangle = function (options) {
    var defaultOpt = {
        text: "任务",
        category: "rectangle",
        type: "task",
        x: 0,
        y: 5,
        width: 40,
        height: 40,
        fillWidth: 40,
        fillHeight: 30,
        bgcolor: "#3EB3E4"
    };
    var obj = new Object;
    obj.options = $.extend(defaultOpt, options);
    obj.getCanvas = Rectangle.prototype.getCanvas;
    return obj;
}
Rectangle.prototype.getCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width);
    c.setAttribute("height", opt.height);
    var ctx = c.getContext("2d");
    ctx.fillStyle = opt.bgcolor;
    ctx.fillRect(opt.x, opt.y, opt.fillWidth, opt.fillHeight);
    return c;
}

//圆形
var Circle = function (options) {
    var defaultOpt = {
        text: "开始",
        category: "circle",
        type: "startEvent",
        x: 20,
        y: 20,
        width: 40,
        height: 40,
        radius: 19,
        bgcolor: "#91F7CE"
    };
    var obj = new Object;
    obj.options = $.extend(defaultOpt, options);
    obj.getCanvas = Circle.prototype.getCanvas;
    return obj;
}
Circle.prototype.getCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width);
    c.setAttribute("height", opt.height);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(opt.x, opt.y, opt.radius, 0, 2 * Math.PI);
    ctx.fillStyle = opt.bgcolor;
    ctx.closePath();
    ctx.fill();
    return c;
}

//菱形
var Diamond = function (options) {
    var defaultOpt = {
        text: "网关",
        category: "diamond",
        type: "gateway",
        x: 20,
        y: 20,
        width: 40,
        height: 40,
        radius: 20,
        bgcolor: "#FFAA25"
    };
    var obj = new Object;
    obj.options = $.extend(defaultOpt, options);
    obj.getCanvas = Diamond.prototype.getCanvas;
    return obj;
}
Diamond.prototype.getCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width);
    c.setAttribute("height", opt.height);
    var ctx = c.getContext("2d");
    ctx = drawPath(ctx, opt.x, opt.y, 4, opt.radius)
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    return c;
}

//画多边形方法
function drawPath(context, x, y, n, r) {
    var i, ang;
    ang = Math.PI * 2 / n //旋转的角度
    context.lineWidth = 1;//设置线宽
    context.translate(x, y);//原点移到x,y处，即要画的多边形中心
    context.moveTo(0, -r);//据中心r距离处画点
    context.beginPath();
    for (i = 0; i < n; i++) {
        context.rotate(ang)//旋转
        context.lineTo(0, -r);//据中心r距离处连线
    }
    context.closePath();
    return context;
}