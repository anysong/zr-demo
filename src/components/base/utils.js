Zr.add('./base/utils.js', function (zr, $) {
    let utils = {
        /**
         * 判断字符串是否为空-可自定义过滤字符
         * @param str   传入字符串（自动toSting强转）
         * @param exclude   数组 排除项，全等也判定为空
         * @returns {boolean}
         */
        isEmpty: function (str, exclude) {
            // str = str.toString();
            var arr = ['', undefined, null];
            if (exclude) {
                arr = arr.concat(exclude);
            }

            return $.inArray(str, arr) > -1;
        },
        /**
         * 获取url参数并组织成对象返回
         * @param key 想要调取的参数key
         * @returns {*} 如果存在key，则返回相应值，不存在则返回整个对象
         */
        getParamsByUrl: function (key) {
            var params = {};
            var search = window.location.search.substr(1);
            if (search.length === 0) {
                return null;
            } else {
                var arr = search.split('&');

                $.each(arr, function (index, item) {
                    var keyValue = item.split('=');
                    params[keyValue[0]] = keyValue[1];
                });

                if (params[key]) {
                    return params[key];
                } else {
                    return params;
                }
            }
        },
        /**
         * 获取cookie值
         * @param sName 想要获取的值的key
         * @returns {string}
         */
        getCookie: function (sName) {
            var arr = document.cookie.split('; ');
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].split('=')[0] === sName) {
                    return arr[i].split('=')[1];
                };
            }
        },
        download: function(url, data, method) {
            if (url && data) {
                // data 是 string 或者 array/object
                data = typeof data == 'string' ? data : $.param(data); // 把参数组装成form的input
                // data = decodeURIComponent(data);
                var inputs = '';
                $.each(data.split('&'), function() {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                }); 
                $('<form action="' + url + '" method="' + 'post' + '">' + inputs + '</form>').appendTo('body').submit().remove();
            };
        },
    };

    return utils;
}, {
    requires: ['jquery']
});