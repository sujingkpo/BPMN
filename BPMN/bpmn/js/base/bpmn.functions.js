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
    CreateAnchor: function (canvas, id) {
        var x = canvas.offsetParent.offsetLeft + 4;
        var y = canvas.offsetParent.offsetTop + 4;
        var width = canvas.clientWidth - 10;
        var height = canvas.clientHeight - 10;
        //定位4个锚点
        var posLeft = { x: -3, y: (height / 2) - 3 };
        var posRight = { x: width - 3, y: (height / 2) - 3 };
        var posTop = { x: (width / 2) - 3, y: -3 };
        var posBottom = { x: (width / 2) - 3, y: height - 3 };
        if ($(canvas).attr("category") == "rectangle") {
            posTop.y = posTop.y + canvas.clientHeight / 10;
            posBottom.y = posBottom.y - canvas.clientHeight / 10;
        }
        AnchorPoit.CreateAnchorElement(id, posLeft, posRight, posTop, posBottom, x, y);
    },
    RemoveAnchor: function (event, canvas, id) {
        //如果鼠标仍在canvas中，则没有变化
        //获得canvas的范围，结合鼠标的坐标判断是否仍在画布内
        var range = {
            left: parseInt(canvas.offsetParent.offsetLeft),
            right: parseInt(canvas.offsetParent.offsetLeft) + parseInt(canvas.offsetWidth),
            top: parseInt(canvas.offsetParent.offsetTop),
            bottom: parseInt(canvas.offsetParent.offsetTop) + parseInt(canvas.offsetHeight)
        };
        if (event.clientX <= range.left || event.clientX >= range.right || event.clientY <= range.top || event.clientY >= range.bottom) {
            $(".anchor_div[match='" + id + "']").remove();
        }
    },
    CreateAnchorElement: function (id, posLeft, posRight, posTop, posBottom, x, y) {
        //初始化画线锚点层
        var anchorDiv = document.createElement("div");
        anchorDiv.setAttribute("class", "anchor_div");
        anchorDiv.setAttribute("match", id);
        document.body.appendChild(anchorDiv);
        //4个锚点
        var p_l = document.createElement("div");
        var p_t = document.createElement("div");
        var p_r = document.createElement("div");
        var p_b = document.createElement("div");
        //定义样式
        p_l.setAttribute("class", "point_anchor p_l");
        p_t.setAttribute("class", "point_anchor p_t");
        p_r.setAttribute("class", "point_anchor p_r");
        p_b.setAttribute("class", "point_anchor p_b");
        //加载到页面
        anchorDiv.appendChild(p_l);
        anchorDiv.appendChild(p_t);
        anchorDiv.appendChild(p_r);
        anchorDiv.appendChild(p_b);

        $(p_l).css({ "left": posLeft.x + "px", "top": posLeft.y + "px" });
        $(p_r).css({ "left": posRight.x + "px", "top": posRight.y + "px" });
        $(p_t).css({ "left": posTop.x + "px", "top": posTop.y + "px" });
        $(p_b).css({ "left": posBottom.x + "px", "top": posBottom.y + "px" });
        $(anchorDiv).css({ "left": x + "px", "top": y + "px" });
        $(anchorDiv).show();
    }
}

//缩放类
var Scale = {
    CreateScale: function (canvas, id) {
        var x = canvas.offsetParent.offsetLeft + 4;
        var y = canvas.offsetParent.offsetTop + 4;
        var width = canvas.clientWidth - 10;
        var height = canvas.clientHeight - 10;

        if ($(canvas).attr("category") == "rectangle") {
            y = y + canvas.clientHeight / 10;
            height = height - canvas.clientHeight / 5;
        }
        //定位4个顶点
        var posLT = { x: -4, y: -4 };
        var posLB = { x: -4, y: height - 4 };
        var posRT = { x: width - 4, y: -4 };
        var posRB = { x: width - 4, y: height - 4 };

        $(".scale_div").remove();//删除缩放控制
        $(".anchor_div").remove();//删除锚点控制
        var scaleDiv = Scale.CreateScaleElement(id, posLT, posLB, posRT, posRB, x, y, height, width);
        selectedFigureArray.length = 0;//清空数组
        selectedFigureArray.push(id);//追加当前被选中元素ID
        AnchorPoit.CreateAnchor(canvas, id);
        return scaleDiv;
    },
    RemoveScale: function (event, canvas, id) {
        $(".scale_div[match='" + id + "']").remove();
    },
    CreateScaleElement: function (id, posLT, posLB, posRT, posRB, x, y, height, width) {
        //初始化画线锚点层
        var scaleDiv = document.createElement("div");
        scaleDiv.setAttribute("class", "scale_div");
        scaleDiv.setAttribute("match", id);
        document.body.appendChild(scaleDiv);
        //4个顶点
        p_lt = document.createElement("div");
        p_lb = document.createElement("div");
        p_rt = document.createElement("div");
        p_rb = document.createElement("div");
        //定义样式
        p_lt.setAttribute("class", "point_scale p_lt");
        p_lb.setAttribute("class", "point_scale p_lb");
        p_rt.setAttribute("class", "point_scale p_rt");
        p_rb.setAttribute("class", "point_scale p_rb");
        //加载到页面
        scaleDiv.appendChild(p_lt);
        scaleDiv.appendChild(p_lb);
        scaleDiv.appendChild(p_rt);
        scaleDiv.appendChild(p_rb);

        $(p_lt).css({ "left": posLT.x + "px", "top": posLT.y + "px" });
        $(p_lb).css({ "left": posLB.x + "px", "top": posLB.y + "px" });
        $(p_rt).css({ "left": posRT.x + "px", "top": posRT.y + "px" });
        $(p_rb).css({ "left": posRB.x + "px", "top": posRB.y + "px" });
        $(scaleDiv).css({ "left": x + "px", "top": y + "px", "width": width + "px", "height": height + "px" });
        $(scaleDiv).show();
        return scaleDiv;
    }
}