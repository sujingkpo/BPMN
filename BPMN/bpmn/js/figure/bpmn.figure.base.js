/******************************图形模版基类*******************************/

//矩形
var Rectangle = function (options) {
    var defaultOpt = {
        text: "矩形",
        category: "rectangle",
        type: "rectangle",
        width: 50,
        height: 50,
        rate: 1,
        bgcolor: "#3EB3E4",
        lineWidth: 1,
        strokeStyle: "#000000"
    };
    this.options = $.extend(defaultOpt, options);
}
Rectangle.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    c.setAttribute("category", opt.category);
    var x = 5, y = 5;
    var fillWidth = opt.width * opt.rate - 2 * x;
    var fillHeight = opt.height * opt.rate - 2 * y - 10 * opt.rate;
    y = 5 + 5 * opt.rate;
    var ctx = c.getContext("2d");
    ctx.rect(x, y, fillWidth, fillHeight);
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.strokeStyle = opt.strokeStyle;
    }
    ctx.stroke();
    return c;
}

//圆形系列开始
var Circle = function (options) {
    var defaultOpt = {
        text: "圆形",
        category: "circle",
        type: "circle",
        width: 50,
        height: 50,
        rate: 1,
        bgcolor: "#91F7CE",
        lineWidth: 2,
        strokeStyle: "#000000"
    };
    this.options = $.extend(defaultOpt, options);
}
Circle.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    c.setAttribute("category", opt.category);
    var radius = (opt.width * opt.rate - 10) / 2;
    var ctx = c.getContext("2d");
    ctx.arc(opt.width * opt.rate / 2, opt.height * opt.rate / 2, radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.strokeStyle = opt.strokeStyle;
    }
    ctx.stroke();
    return c;
}

//菱形
var Diamond = function (options) {
    var defaultOpt = {
        text: "菱形",
        category: "diamond",
        type: "diamond",
        width: 50,
        height: 50,
        rate: 1,
        bgcolor: "#FFAA25",
        lineWidth: 2,
        strokeStyle: "#000000"
    };
    this.options = $.extend(defaultOpt, options);
}
Diamond.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    c.setAttribute("category", opt.category);
    var radius = (opt.width * opt.rate - 10) / 2;
    var ctx = c.getContext("2d");
    ctx = $.drawPath(ctx, opt.width * opt.rate / 2, opt.height * opt.rate / 2, 4, radius)
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    if (opt.lineWidth > 0) {
        ctx.lineWidth = opt.lineWidth;
        ctx.strokeStyle = opt.strokeStyle;
    }
    ctx.stroke();
    return c;
}

//水平泳道
var HorizonLane = function (options) {
    var defaultOpt = {
        text: "泳道",
        category: "horizonlane",
        type: "horizonlane",
        width: 100,
        height: 50,
        rate: 1,
        bgcolor: "goldenrod",
        lineWidth: 2,
        strokeStyle: "#323232",
        titleWidth: 20
    };
    this.options = $.extend(defaultOpt, options);
}
HorizonLane.prototype.createCanvas = function () {
    var opt = this.options;
    var c = document.createElement("Canvas");
    c.setAttribute("width", opt.width * opt.rate);
    c.setAttribute("height", opt.height * opt.rate);
    c.setAttribute("name", opt.type);
    c.setAttribute("category", opt.category);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(5, 5, opt.titleWidth, opt.rate * opt.height - 10);
    ctx.fillStyle = opt.bgcolor;
    ctx.fill();
    ctx.lineWidth = opt.lineWidth;
    ctx.strokeStyle = opt.strokeStyle;
    ctx.moveTo(opt.titleWidth + 5, 5);
    ctx.lineTo(opt.rate * opt.width - 5, 5);
    ctx.lineTo(opt.rate * opt.width - 5, opt.rate * opt.height - 5);
    ctx.lineTo(opt.titleWidth + 5, opt.rate * opt.height - 5);
    ctx.closePath();
    ctx.stroke();
    return c;
}

//垂直泳道
var VerticalLane = function (options) {

}
VerticalLane.prototype.createCanvas = function () {

}

//流程线
var Line = function (pathArray, wrapper, strokeStyle) {
    this.pathLength = pathArray.length;
    this.pathArray = pathArray;
    this.strokeStyle = strokeStyle == null ? "black" : strokeStyle;
    $(wrapper).attr("pos", JSON.stringify(pathArray));//记录下线条的完整路径
}

Line.prototype.drawLine = function (ctx) {
    ctx.clearRect(0,0,1000,1000);
    //样式
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.strokeStyle;
    ctx.lineWidth = 2;

    //画线
    ctx.moveTo(this.pathArray[0].x, this.pathArray[0].y);
    for (var i = 1; i < this.pathLength; i++) {
        ctx.lineTo(this.pathArray[i].x, this.pathArray[i].y);
    }
    ctx.stroke();
    this.drawArrow(ctx);
}
Line.prototype.drawArrow = function (ctx) {
    var length = this.pathLength;
    //画箭头
    var radians = 0;
    var x, y;
    if (this.pathArray[length - 2].x > this.pathArray[length - 1].x) {//从右向左
        x = this.pathArray[length - 1].x;
        y = this.pathArray[length - 2].y;
        radians = -90 * Math.PI / 180;
    }
    else if (this.pathArray[length - 2].x < this.pathArray[length - 1].x) {//从左向右
        x = this.pathArray[length - 1].x;
        y = this.pathArray[length - 2].y;
        radians = 90 * Math.PI / 180;
    }
    else if (this.pathArray[length - 2].y > this.pathArray[length - 1].y) {//从下向上
        x = this.pathArray[length - 2].x;
        y = this.pathArray[length - 1].y;
        radians = 360 * Math.PI / 180;
    }
    else if (this.pathArray[length - 2].y < this.pathArray[length - 1].y) {//从上向下
        x = this.pathArray[length - 2].x;
        y = this.pathArray[length - 1].y;
        radians = Math.PI;
    }
    else {
        return false;
    }
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.moveTo(0, 0);
    ctx.lineTo(5, 15);
    ctx.lineTo(-5, 15);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}