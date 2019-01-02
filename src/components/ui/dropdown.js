 /**
 * 下拉搜索组件
 * zr-dropdown-search
 */

Zr.add('./ui/dropdown.js', function(zr, $){

    var bindListener = function(){
        //base
        $('body').on('click', function(){
            $('[data-toggle="dropdown"]').parents().removeClass('open');
        })
        $('body').on('click', '[data-toggle="dropdown"]', function(ev){
            ev.stopPropagation();
            if($(this).parent().hasClass('open')){
                $('[data-toggle="dropdown"]').parents().removeClass('open');
            }else {
                $('[data-toggle="dropdown"]').parents().removeClass('open');
                $(this).parent().addClass('open');
            }
        })
        $('.zr-dropdown-search-query').on('click', function(ev){
            ev.stopPropagation();
        })

        // toggle
        $('body').on('click','.zr-dropdown-search .search-list-item', function(){
            $(this).addClass('active').siblings().removeClass('active');
            // 赋值 FIXME 文本节点替换
            var text = ($(this).children('a').text()),
                val = $(this).children('a').attr('data-val');
            var $button = $(this).closest('.zr-dropdown-search').children('[data-toggle="dropdown"]'),
                $input = $(this).closest('.zr-dropdown-search').children('[data-toggle="value"]');
            $button.children('.toggle-text').html(text);
            $input.val(val).change();   // 钩子操作放到逻辑执行完之后
            // $button.html(text + '<i class="zricon-arrow-down"></i>');
        })
        $('body').on('keyup','.zr-dropdown-search-query input', function(e){
            var val = e.target.value,
                aLi = $(this).parent().siblings('.zr-dropdown-search-list').children();
            aLi.map(function(i, item){
                if($(item).children().text().indexOf(val) != -1){
                    $(item).css('display','block');
                }else {
                    $(item).css('display','none');
                }
            })
        })
    }
    var init = function(){
        bindListener();
    }
    return {
        init: init
    }
}, {requires:['jquery']})