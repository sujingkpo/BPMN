﻿//映射创建形状的方法
var mapArray = new Array();
mapArray["task"] = "Task";
mapArray["startevent"] = "StartEvent";
mapArray["endevent"] = "EndEvent";
mapArray["gateway"] = "Gateway";
mapArray["horizonlane"] = "HLane";

//每个图形默认缩放的比例
var figureRateArray = new Array();
figureRateArray["task"] = 2.5;
figureRateArray["startevent"] = 1.5;
figureRateArray["endevent"] = 1.5;
figureRateArray["gateway"] = 1.5;
figureRateArray["horizonlane"] = 5;

//记录当前被选中的形状
var selectedFigureArray = new Array();

//画线标记，避免重复创建画线层
var flagForLine = false;

//流程线的外层DIV
var linkWrapper = null;

//流程线的Canvas元素
var linkCanvas = null;

$(function () {
    //画布区高度自适应
    var $bpmn_wrapper = $("#bpmn_wrapper");
    var $drawing_toolbar = $("#drawing_toolbar");//工具栏
    var $figure_panel = $("#figure_panel");//形状面板
    var $drawing_wrapper = $("#drawing_wrapper");
    var bpmn_wrapper_height = $bpmn_wrapper.innerHeight();
    var drawing_toolbar_height = $drawing_toolbar.outerHeight();
    var figure_panel_height = $figure_panel.outerHeight();
    var drawing_wrapper_height = bpmn_wrapper_height - drawing_toolbar_height - figure_panel_height;
    $drawing_wrapper.css("height", drawing_wrapper_height);
    $("#canvas_area").css("height", drawing_wrapper_height);

    //Delete键删除选中图形
    $(document).keyup(function (event) {
        if (event.keyCode === 46) {
            $(selectedFigureArray).each(function (i, n) {
                var id = selectedFigureArray.pop();
                var el = document.getElementById(id);
                el.parentNode.removeChild(el);
                $(".scale_div[match='" + id + "']").remove();
                $(".anchor_div[match='" + id + "']").remove();
            });
        }
    });

    //实时监听锚点事件
    //$(".point_anchor").live(
    //    {
    //        "mousedown": function (e) {
    //            flagForLine = true;
    //            var x1 = e.clientX;
    //            var y1 = e.clientY;
    //            document.onmousemove = function (evt) {
    //                var x2 = evt.clientX;
    //                var y2 = evt.clientY;
    //                if (!flagForLine) {
    //                    $.createLineWrapper(x2, y2);
    //                }
    //                //$.drawLine(evt);
    //            }
    //        },
    //        "mouseup": function (e) {
    //            flagForLine = false;
    //        }
    //    });

    //实时监听缩放事件
    $(".point_scale").live(
        {
            "mousedown": function (e) {
                var id = this.parentNode.getAttribute("match");
                var category = $("#" + id).find("canvas")[0].getAttribute("name");
                var className = mapArray[category];
                switch ($(this).attr("position")) {
                    case "lt":
                        //var obj = eval("new " + className + "({rate: " + rate + ",category:'" + category + "',lineWidth:2,titleWidth: 40})");
                        //var canvasReal = obj.createCanvas();
                        break;
                    case "lb":
                        break;
                    case "rt":
                        break;
                    case "rb":
                        break;
                }
            }
        });
    $(".scale_div").live("dblclick", function (e) {
        var guid = $(this).attr("match");
        var canvasDiv = $("#" + guid);
        var options = canvasDiv.attr("data-attribute");
        var show = $(".figure_real_tips[match='" + guid + "']");
        show.css("display", "none");
        var editTip = "<div class='scale_div_Edit_tips' match='" + guid + "'><input type='text' value=''></div>";
        var tip = $(".scale_div_Edit_tips[match='" + guid + "']");
        if (tip === undefined || tip === null||tip.length===0) {
            $(this).append(editTip);
            tip = $(".scale_div_Edit_tips[match='" + guid + "']");
        }
        var texttip = $(tip + "input[type='text']");
        tip.css("width", $(this).width()).css("height", "30px").css("left", "0").css("bottom", "-30px");
        texttip.css("width", $(this).width()-3).css("height","30px").css("line-height","30px");
        options = $.parseJSON(options);
        texttip.focus(function() { this.select(); }).select();
        texttip.blur(function () {
            options.text = $(this).val();
            canvasDiv.attr("data-attribute", JSON.stringify(options));
            show.text(options.text);
            show.css("display", "");
        });
        texttip.live("keypress", keyDownTipChange);
        texttip.val(options.text);
        
    });

    function keyDownTipChange(e) {
        var keycode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (keycode === 13) {
            this.blur();
            $("#bpmn_wrapper").click();
        }
    }
    $("#bpmn_wrapper").bind("click", function (e) {
        $(".anchor_div").remove();
        $(".scale_div").remove();
        selectedFigureArray.length = 0;
    });
})