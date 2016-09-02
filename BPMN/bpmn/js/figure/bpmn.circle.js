/******************************矩形图模版*******************************/
var Circle = function (options) {
    var opt = $.extend(Circle.defaults, options);
    var circle = document.createElement("div");
    circle.style.position = "relative";
    circle.style.left = opt.x + "px";
    circle.style.top = opt.y + "px";
    circle.style.height = opt.height + "px";
    circle.style.width = opt.width + "px";
    circle.style.borderRadius = "75px";
    circle.style.backgroundColor = opt.bgcolor;
    return circle;
}

Circle.defaults = { text: "圆形", x: 150, y: -70, width: 80, height: 80, bgcolor: "#5B9BD5" };