/**
 * @author DYY
 * 该模块仅作为加载其他UI模块，的入口文件使用
 */

Zr.add('./ui/ui.js', function(zr, dropdown){
    var init = function(){
        dropdown.init();  //初始化dropdown
    }
    return {
        init: init
    }
}, {requires: [
    '/ui/dropdown.js'
]})