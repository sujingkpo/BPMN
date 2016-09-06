
//生成guid
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//画正多边形方法
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

//获取鼠标在图形内的位置
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left * (canvas.width / rect.width),
        y: evt.clientY - rect.top * (canvas.height / rect.height)
    }
}