//常规方法类
var CommonMethod = {
    //生成guid
    guid: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    //画正多边形方法
    drawPath: function (context, x, y, n, r) {
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
    },
    //获取鼠标在图形内的位置
    getMousePos: function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left * (canvas.width / rect.width),
            y: evt.clientY - rect.top * (canvas.height / rect.height)
        }
    }
}

//锚点类
var AnchorPoit = {
    DrawAnchor: function (canvas) {
        $anchorDiv = $("#anchor_div");
        $anchorDiv.show();
        var x = canvas.offsetParent.offsetLeft + 4;
        var y = canvas.offsetParent.offsetTop + 4;
        var width = canvas.clientWidth - 10;
        var height = canvas.clientHeight - 10;
        //定位4个锚点
        var posLeft = { x: -3, y: (height / 2) - 3 };
        var posLRight = { x: width - 3, y: (height / 2) - 3 };
        var posTop = { x: (width / 2) - 3, y: -3 };
        var posBottom = { x: (width / 2) - 3, y: height - 3 };
        if ($(canvas).attr("category") == "rectangle")
        {
            posTop.y = posTop.y + 10;
            posBottom.y = posBottom.y - 10;
        }
        $(p_l).css({ "left": posLeft.x + "px", "top": posLeft.y + "px" });
        $(p_r).css({ "left": posLRight.x + "px", "top": posLRight.y + "px" });
        $(p_t).css({ "left": posTop.x + "px", "top": posTop.y + "px" });
        $(p_b).css({ "left": posBottom.x + "px", "top": posBottom.y + "px" });
        $anchorDiv.css({ "left": x + "px", "top": y + "px" });
    },
    RemoveAnchor: function (canvas, event) {
        //如果鼠标仍在canvas中，则没有变化
        //获得canvas的范围，结合鼠标的坐标判断是否仍在画布内
        var range = {
            left: parseInt(canvas.offsetParent.offsetLeft),
            right: parseInt(canvas.offsetParent.offsetLeft) + parseInt(canvas.offsetWidth),
            top: parseInt(canvas.offsetParent.offsetTop),
            bottom: parseInt(canvas.offsetParent.offsetTop) + parseInt(canvas.offsetHeight)
        };
        if (event.clientX <= range.left || event.clientX >= range.right || event.clientY <= range.top || event.clientY >= range.bottom) {
            $anchorDiv.hide();
        }
    }
}

//缩放类
var Resizable = {

}