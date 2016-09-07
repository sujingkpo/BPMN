/******************************图形可画线*******************************/
(function ($) {

    var defaults = {
        canvas: null,
        id: ""
    }

    $.fn.extend({
        drawline: function (opt) {
            var options = $.extend(defaults, opt);
            var canvas = options.canvas;
            var id = options.id;
            canvas.addEventListener(
                "mouseover", function () {
                    //如果不存在则创建
                    if ($(".anchor_div[match='" + id + "']").length == 0)
                        AnchorPoit.CreateAnchor(canvas, id);
                }, false);
            canvas.addEventListener(
                "mouseout", function (evt) {
                    //如果画布被选中，不删除锚点
                    if (selectedFigureArray.indexOf(id) == -1)
                        AnchorPoit.RemoveAnchor(evt, canvas, id);
                }, false);
        }
    });

})(jQuery)