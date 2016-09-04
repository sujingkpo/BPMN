/******************************图形模版基类*******************************/

//矩形
var Rectangle = function (options) {
    var defaultOpt = {
        text: "矩形",
        category: "rectangle",
        type: "rectangle",
        x: 1,
        y: 5,
        width: 40,
        height: 40,
        fillWidth: 38,
        fillHeight: 30,
        rate: 1,
        bgcolor: "#3EB3E4",
        lineWidth: 2
    };
    this.options = $.extend(defaultOpt, options);
}
Rectangle.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    var ctx = c.getContext("2d");
    ctx.fillStyle = opt.bgcolor;
    ctx.fillRect(opt.x * opt.rate, opt.y * opt.rate, opt.fillWidth * opt.rate, opt.fillHeight * opt.rate);
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(opt.x * opt.rate, opt.y * opt.rate, opt.fillWidth * opt.rate, opt.fillHeight * opt.rate);  //填充边框 x y坐标 宽 高
    }
    return c;
}

//圆形系列开始
var Circle = function (options) {
    var defaultOpt = {
        text: "圆形",
        category: "circle",
        type: "circle",
        x: 20,
        y: 20,
        width: 40,
        height: 40,
        radius: 19,
        rate: 1,
        bgcolor: "#91F7CE",
        lineWidth: 2
    };
    this.options = $.extend(defaultOpt, options);
}
Circle.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(opt.x * opt.rate, opt.y * opt.rate, opt.radius * opt.rate, 0, 2 * Math.PI, true);
    ctx.fillStyle = opt.bgcolor;
    ctx.closePath();
    ctx.fill();
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.stroke();
    }
    return c;
}

//菱形
var Diamond = function (options) {
    var defaultOpt = {
        text: "菱形",
        category: "diamond",
        type: "diamond",
        x: 20,
        y: 20,
        width: 40,
        height: 40,
        radius: 19,
        rate: 1,
        bgcolor: "#FFAA25",
        lineWidth: 2
    };
    this.options = $.extend(defaultOpt, options);
}
Diamond.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    var ctx = c.getContext("2d");
    ctx = drawPath(ctx, opt.x * opt.rate, opt.y * opt.rate, 4, opt.radius * opt.rate)
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.stroke();
    }
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