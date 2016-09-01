(function ($) {

    var $document = $(document);

    //拖拽元素类
    function CloneElement(node) {
        this.target = node;
        node.onselectstart = function () {
            //防止拖拽对象内的文字被选中
            return false;
        }
    }

    CloneElement.prototype = {
        constructor: CloneElement,
        setXY: function (x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this;
        },
        setTargetCss: function (css) {
            $(this.target).css(css);
            return this;
        }
    }
    //end

    //鼠标元素
    function Mouse() {
        this.x = 0;
        this.y = 0;
    }

    Mouse.prototype.setXY = function (x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }
    //end

    //拖拽配置
    var cloneConfig = {
        zIndex: 1,
        cloneElement: null,
        mouse: new Mouse()
    };

    //拖拽样式
    var cloneStyle = {
        dragging: {
            cursor: "move"
        },
        defaults: {
            cursor: "default"
        }
    }

    //获取元素的纵坐标 
    function getTop(e) {
        var offset = e.offsetTop;
        if (e.offsetParent != null) offset += getTop(e.offsetParent);
        return offset;
    }
    //获取元素的横坐标 
    function getLeft(e) {
        var offset = e.offsetLeft;
        if (e.offsetParent != null) offset += getLeft(e.offsetParent);
        return offset;
    }

    //拖拽方法
    function clone($dragNode) {
        $dragNode.on({
            "mousedown": function (event) {
                var dragNode = $(this).get(0);
                //创建一个副本模型dom元素
                var cloneObj = document.createElement("div");
                //将原始模型的样式全部赋给副本模型
                $.extend(cloneObj.style, dragNode.style);
                //副本模型显现时的坐标
                cloneObj.style.top = getTop(dragNode) + 10 + "px";
                cloneObj.style.left = getLeft(dragNode) + 10 + "px";
                //将副本模型改为半透明
                cloneObj.setAttribute("class", "clone");
                //将副本模型装载到工具栏中
                document.getElementById("activity").appendChild(cloneObj);
                //new一个副本元素对象
                var cloneElement = cloneConfig.cloneElement = new CloneElement(cloneObj);
                //获取当前鼠标坐标
                cloneConfig.mouse.setXY(event.clientX, event.clientY);
                //将副本元素的坐标赋值给副本对象
                cloneConfig.cloneElement
                    .setXY(cloneElement.target.style.left, cloneElement.target.style.top)
                    .setTargetCss({
                        "zIndex": cloneConfig.zIndex++,
                        "position": "absolute"
                    });
                //松开鼠标
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    //判断副本元素是否落在指定画布区域内
                    var drawingAreaTop = getTop(document.getElementById("drawingarea"));
                    if (cloneObj.style.top < drawingAreaTop) {

                    }
                    else {
                        cloneObj.style.opacity = "1";
                        cloneObj.style.filter = "alpha(opacity=100)";
                        $(cloneObj).drag();//令副本元素可拖拽
                    }
                };
            },
            "mouseover": function () {
                $(this).css(cloneStyle.dragging);
            },
            "mouseout": function () {
                $(this).css(cloneStyle.defaults);
            }
        })
    }

    //监控鼠标移动
    function move(event) {
        if (cloneConfig.cloneElement) {
            var mouse = cloneConfig.mouse,
                cloneElement = cloneConfig.cloneElement;
            cloneElement.setTargetCss({
                "left": parseInt(event.clientX - mouse.x + cloneElement.x) + "px",
                "top": parseInt(event.clientY - mouse.y + cloneElement.y) + "px"
            });

            $document.off("mousemove", move);
            setTimeout(function () {
                $document.on("mousemove", move);
            }, 25);
        }
    }

    //注册事件
    $document.on({
        "mousemove": move,
        "mouseup": function () {
            cloneConfig.cloneElement = null;
        }
    });

    //公开接口
    $.fn.clone = function (options) {
        clone(this);
    }

})(jQuery)