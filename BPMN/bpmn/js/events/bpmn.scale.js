/******************************图形缩放事件*******************************/
(function ($) {

    $.fn.extend({
        scale: function (options) {
            $(this).bind("click", function () {
                selectedFigureArray.length = 0;
                selectedFigureArray.push(this.id);
                //将控制层附加到选中的图形上
                var $canvas = $(this).find("canvas");
                var category = $canvas.attr("category");
                var canvasWidth = parseInt($canvas.attr("width"));
                var canvasHeight = parseInt($canvas.attr("height"));
                var canvasX = parseInt($canvas.offset().left);
                var canvasY = parseInt($canvas.offset().top);
                if (category == "rectangle") {

                }
            });
        }
    });

})(jQuery)