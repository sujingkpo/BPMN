/******************************矩形图模版*******************************/
var Rectangle = function (options) {
    var opt = $.extend(Rectangle.defaults, options);
    var rect = document.createElement("div");
    rect.style.position = "relative";
    rect.style.left = opt.x + "px";
    rect.style.top = opt.y + "px";
    rect.style.height = opt.height + "px";
    rect.style.width = opt.width + "px";
    rect.style.backgroundColor = opt.bgcolor;
    return rect;
}

Rectangle.defaults = { text: "矩形", x: 10, y: 0, width: 100, height: 60, bgcolor: "#5B9BD5" };