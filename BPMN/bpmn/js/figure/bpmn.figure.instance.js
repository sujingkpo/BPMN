/**********************图形实例*********************/
//任务
var Task = function (opt) {
    var _options = $.extend({ text: "任务", type: "task" }, opt);
    $.extend(this.options, _options);
}
Task.prototype = new Rectangle(this.options);//继承矩形

//开始事件
var StartEvent = function (opt) {
    var _options = $.extend({ text: "开始", type: "startevent" }, opt);
    $.extend(this.options, _options);
}
StartEvent.prototype = new Circle(this.options);//继承圆形

//结束事件
var EndEvent = function (opt) {
    var _options = $.extend({ text: "结束", type: "endevent", bgcolor: "#FF8F80" }, opt);
    $.extend(this.options, _options);
}
EndEvent.prototype = new Circle(this.options); //继承圆形

//网关
var Gateway = function (opt) {
    var _options = $.extend({ text: "网关", type: "gateway" }, opt);
    $.extend(this.options, _options);
}
Gateway.prototype = new Diamond(this.options);//继承菱形