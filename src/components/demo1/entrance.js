Zr.add('./demo1/entrance.js', function (zr, $) {
    //开发环境
    if (Zr.global.env === 'dist') {
        //发布环境
        $('head').append('<link rel="stylesheet" href="//storage.360buyimg.com/v1.0.0/zr/css/cdn_zr.min.css">' +
            '<link rel="stylesheet" href="/static/components/demo1/demo1.css">' +
            '<link rel="stylesheet" href="/static/components/ui/ui.css">');
    } else {
        $('head').append('<link rel="stylesheet" href="//storage.360buyimg.com/v1.0.0/zr/css/cdn_zr.min.css">' +
            '<link rel="stylesheet" href="/dest/components/demo1/demo1.css">' +
            '<link rel="stylesheet" href="/dest/components/ui/ui.css">');
    }
    
    var lan_path = './i18n/zh_CN.js';
    //语言
    function getCookie(sName) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split('=')[0] == sName) {
                return arr[i].split('=')[1];
            };
        }
    }
    function getSwtichLang() {
        //1.cookie是否存在  
        if (getCookie("language")) {
            var tmp = getCookie("language");
            if ('en_US' == tmp) {
                lan_path = './i18n/en_US.js';
            } else if ('zh_CN' == tmp) {
                lan_path = './i18n/zh_CN.js';
            } else if ('th_TH' == tmp) {
                lan_path = './i18n/th_TH.js';
            }
        }
    }
    getSwtichLang();
    
    Zr.use(lan_path, function (zr, lan) {
        Zr.use('./base/base.js', './demo1/demo1.js', './ui/ui.js', './demo1/mock.js', function (zr,
            base, demo1, ui, mock) {  
            if (Zr.global.env !== 'dist') {
                mock.init(); //线上环境需注释掉
            }
            base.init(); //基础 包括基础服务
            demo1.init(lan); //搜索模块
            ui.init(); //加载ui组件  
        })
    })
    return {};
}, {
    requires: ['jquery']
})