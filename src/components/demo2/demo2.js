/**
 * @author DYY
 * 
 */

Zr.add('./demo2/demo2.js', function (zr, $, datePicker, modal, datatables, message, utils, API, http) {
    var _table,
        $table,
        createRuleModal,
        Language;
    var $statusList,
        $typeList,
        $storeList,
        $storeInList;
    var timeoutTimer = {};
    var $query, $reset, $create;

    var bindListener = function () {
        $query.off('click').on('click', _manager.query);
        $reset.off('click').on('click', _manager.queryReset);
        $('.js-rule-create').off('click').on('click', _manager.createRuleModal);

        $table.on('click', '.js-diable-btn', _manager.disableItem);
        $table.on('click', '.js-enable-btn', _manager.enableItem);
        //编辑按钮
        $table.on('click', '.js-edit-btn', _manager.editItem);
        $table.on('click', '.js-submit-btn', _manager.submitItem);
        $table.on('blur', 'td[contenteditable=true]', _manager.editBlur);
        $('#createRuleModal').on('click', '.js-create-submit', _manager.createRule);
    }
    var initPlugins = function () {
        $table = $('#dt');
        createRuleModal = modal.init("#createRuleModal", {
            top: "20px",
            openCallback: function () {
                //初始化
                _manager.createReset();
            },
            closeCallback: function () {}
        })

        _table = $table.DataTable($.extend(true, {}, CONSTANT.DATA_TABLES.OPTIONS, {
            ajax: function (data, callback, settings) {
                var params = _manager.getQueryCondition(data);
                _manager.disableQueryStyle($query, 'query');
                http.ajax({
                    'url': API.TRUNK.list,
                    'params': params,
                    'success': function (ret) {
                        _manager.enableQueryStyle($query, 'query');
                        if (ret.success) {
                            //返回数据
                            var returnData = {
                                draw: data.draw,
                                recordsTotal: ret.data.totalRecords,
                                recordsFiltered: ret.data.totalRecords,
                                data: ret.data.aaData || []
                            }
                            _manager.dataItems = ret.data.aaData;
                            callback(returnData)
                        } else {
                            message.error(ret.errMsg);
                        }
                    },
                    'error': function () {
                        _manager.enableQueryStyle($query, 'query');
                    }
                });
            },
            columns: _manager.getColumns(),
            pageLength: 10,
            pagingType: 'full_numbers',
            // scrollX: true,  不要开启，开启会拆分两个table
            preDrawCallback: function () {},
            initComplete: function () {},
            rowCallback: function () {},
            stateLoaded: function () {},
            createdRow: function (row, data, index) {
                var $diableBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-diable-btn tg-order-table-btn">' + Language.STATUS.unable + '</a>');
                var $enableBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-enable-btn tg-order-table-btn">' + Language.STATUS.enable + '</a>');
                var $editBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-edit-btn tg-order-table-btn">' + '编辑' + '</a>');
                var $submitBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-submit-btn tg-order-table-btn" style="display:none;">' + '确定' + '</a>');
                
                if (data.trunkStatus == 1) {
                    $(row).find('td').eq(-1).html('').append($diableBtn);
                } else {
                    $(row).find('td').eq(-1).html('').append($enableBtn);
                }
                $(row).find('td').eq(0).html(index + 1);
                // $(row).find('td').eq(-1).html('').append($editBtn).append($submitBtn);
                // $(row).find('td').eq(-2).attr('contenteditable', 'false');
            },
            drawCallback: function () {}
        }));
    }
    var initConfig = function () {
        CONSTANT.DATA_TABLES.OPTIONS.language = {
            "sProcessing": Language.DATATABLE.sprocessing,
            "sLengthMenu": Language.DATATABLE.slengthmenu,
            "sZeroRecords": Language.DATATABLE.szerorecords,
            "sInfo": Language.DATATABLE.sinfo,
            "sInfoEmpty": Language.DATATABLE.sinfoemtpy,
            "sInfoFiltered": Language.DATATABLE.sInfofiltered,
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": Language.DATATABLE.sfirst,
                "sPrevious": Language.DATATABLE.sprevious,
                "sNext": Language.DATATABLE.snext,
                "sLast": Language.DATATABLE.slast,
                "sJump": "跳转"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    }
    var parseDom = function (data) {
        $storeList = $('input[name="orgFrom"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $storeInList = $('input[name="orgTo"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $typeList = $('input[name="exportType"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $statusList = $('input[name="trunkStatus"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');

        $query = $('.js-query'); //查询按钮;
        $reset = $('.js-reset'); //重置按钮;
        $create = $('.js-create-submit'); //创建;
    }
    //初始化函数
    var init = (data) => {
        Language = data; //加载文字
        initConfig();
        parseDom(data); //加载模板
        initPlugins();
        bindListener();

        _manager.getStoreList(); //仓库信息
        _manager.getTypeList(); //type
        _manager.getTrunkStatus(); //status
    }

    // 方法；
    var _manager = {
        currentItem: null,
        dataItems: [],
        queryParams: {},
        $editItem: null,

        //datatable
        //处理表单查询参数
        getQueryCondition: function (data) {
            var params = {
                draw: data.draw,
                pageSize: data.length,
                pageRow: data.start,
                stockType: 1
            };

            params = $.extend(true, {}, params, _manager.queryParams);
            return params;
        },
        //处理表单列
        getColumns: function () {
            var columns = [{
                data: null
            }, {
                data: 'orgFromStr'
            }, {
                data: 'orgToStr'
            }, {
                data: 'exportType',
                render: function (key) {
                    var key = key + '';
                    return Language.PARAMS.type[key] || '';
                }
            }, {
                data: 'trunkStatus',
                render: function (key) {
                    var key = key + '';
                    return Language.PARAMS.status[key] || '';
                }
            }, {
                data: 'updateTime',
                render: function (time) {
                    var retTime = '--';
                    if(time){
                        retTime = zr.tools.format('yyyy-MM-dd hh:mm:ss', time);
                    }
                    return retTime;
                }
            }, {
                data: 'creator'
                // render: function (data){
                //     return '<span contenteditable="false">' + data + '</span>';
                // }
            }, {
                data: null
            }]
            return columns;
        },

        //fn
        disableQueryStyle: function ($selector, fnName) {
            $selector.addClass('zr-btn-disable');
            $selector.children('i').css('display', 'inline-block');
            timeoutTimer[fnName] = setTimeout(function () {
                _manager.enableQueryStyle($selector, fnName);
            }, 20000)
        },
        enableQueryStyle: function ($selector, fnName) {
            setTimeout(function () {
                $selector.removeClass('zr-btn-disable');
                $selector.children('i').css('display', 'none');
                timeoutTimer[fnName] ? clearTimeout(timeoutTimer[fnName]) : "";
            }, 0)
        },
        //查询
        query: function () {
            if ($(this).hasClass('zr-btn-disable')) return;

            var arr = $('.js-form-query').serializeArray(),
                params = {};
            arr.map((i) => {
                params[i.name] = i.value;
            })
            for (var name in params) {
                if (params[name] == '-1' || params[name] == '') {
                    delete params[name];
                } else {
                    params[name] = parseFloat(params[name]);
                }
            }
            _manager.queryParams = params;
            _table.ajax.reload();
        },
        //查询数据重置
        queryReset: function () {
            _manager.queryParams = {};
            $('.js-form-query [data-toggle="value"]').val('');
            $('.js-form-query [data-toggle="dropdown"]').children('.toggle-text').html(Language.STATUS.select);
            $('.js-form-query .zr-dropdown-search-list').children().removeClass('active');
            $('.js-form-query .zr-dropdown-search-list').each(function () {
                $(this).children().eq(0).addClass('active');
            })
        },
        cancelEdit: function(){
            $('[contenteditable]').attr('contenteditable', false);
            $('.js-submit-btn').css('display','none');
            $('.js-edit-btn').css('display','inline-block');
        },
        //编辑
        editItem: function (ev) {
            //清除所有编辑未提交
            _manager.cancelEdit();
            //存储当前编辑项
            _manager.$editItem = $(this).parent().siblings('[contenteditable]');
            _manager.$editItem.attr('contenteditable', true); //可编辑
            $(this).siblings('.js-submit-btn').css('display','inline-block');
            $(this).css('display','none');
            ev.stopPropagation();
        },
        //确定
        submitItem: function (ev){
            if(_manager.$editItem){
                var val = _manager.$editItem.html();
                //ajax发送请求
                _manager.$editItem.attr('contenteditable', false);
                _manager.$editItem = null;
                //清除所有编辑未提交
                _manager.cancelEdit();
                ev.stopPropagation();
            }
        },
        //失焦保存
        editBlur: function (ev){
            var val = $(this).html();
            //ajax发送请求
            //清除所有编辑未提交
            _manager.cancelEdit();
            ev.stopPropagation();
        },
        //停用
        disableItem: function () {
            var index = $(this).attr('data-index');
            http.ajax({
                'url': API.TRUNK.modifyStateToStop,
                'params': {
                    id: _manager.dataItems[index].id
                    // status: 2
                },
                'success': function (ret) {
                    if (ret.success) {
                        message.success(Language.STATUS.save_success);
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {
                   
                }
            })
        },
        //启用
        enableItem: function () {
            var index = $(this).attr('data-index');
            http.ajax({
                'url': API.TRUNK.modifyStateToStart,
                'params': {
                    id: _manager.dataItems[index].id
                    // status: 1
                },
                'success': function (ret) {
                    if (ret.success) {
                        message.success(Language.STATUS.save_success);
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(ret.errMsg);
                    }

                },
                'error': function () {}
            })
        },
        //创建规则commit
        createRule: function () {
            if ($(this).hasClass('zr-btn-disable')) return;

            var arr = $('.js-form-create').serializeArray(),
                params = {};
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].value.length == 0) {
                    message.error(Language.KEY[arr[i].name] + ' ' + Language.STATUS.nodata);
                    return;
                }
                params[arr[i].name] = parseFloat(arr[i].value);
            }
            if (params.orgFrom === params.orgTo) {
                message.error(Language.TEXT.orgFrom_orgTo_same);
                return false;
            }
            params.stockType = 1;
            _manager.disableQueryStyle($create, 'create');
            http.ajax({
                'url': API.TRUNK.save,
                'params': params,
                'success': function (ret) {
                    _manager.enableQueryStyle($create, 'create');
                    if (ret.success) {
                        //创建成功
                        createRuleModal.hide();
                        // message.success(Language.STATUS.success);
                        message.success(ret.errMsg);
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        // message.success(Language.STATUS.fail);
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {
                    _manager.enableQueryStyle($create, 'create');
                }
            });
        },
        //创建规则弹窗
        createRuleModal: function () {
            createRuleModal.show();
        },
        //创建查询数据重置
        createReset: function () {
            $('#createRuleModal [data-toggle="value"]').val('');
            $('#createRuleModal [data-toggle="dropdown"]').children('.toggle-text').html(Language.STATUS.select);
            $('#createRuleModal .zr-dropdown-search-list').children().removeClass('active');
            $('#createRuleModal .zr-dropdown-search-list').each(function () {
                $(this).children().eq(0).addClass('active');
            })
        },
        //获取仓库
        getStoreList: function () {
            http.ajax({
                'url': API.TRUNK.getStoreList,
                'success': function(ret){
                    if (ret.success) {
                        _manager.renderStore($storeList, ret);
                        _manager.renderStore($storeInList, ret);
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function(e){
                    
                },
            });
        },
        //获取类型
        getTypeList: function () {
            http.ajax({
                'url': API.TRUNK.getExportType,
                'success': function(ret){
                    if (ret.success) {
                        _manager.renderType($typeList, ret)
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function(e){
                    
                },
            });
        },
        //获取状态
        getTrunkStatus: function () {
            http.ajax({
                'url': API.TRUNK.getTrunkStatus,
                'success': function(ret){
                    if (ret.success) {
                        _manager.renderStatus($statusList, ret)
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function(e){
                    
                },
            });
        },

        //render
        //渲染仓库列表
        renderStore: function ($target, data) {
            var html = '';
            //TODO 判断语言
            html = '<li class="search-list-item active"><a href="javascript:;" data-val="">' + Language.STATUS.all + '</a></li>'
            var json = data.data;
            for (var name in json) {
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + name + '">' + json[name] + '</a></li>';
            }
            $target.html(html);
        },
        //渲染类型列表
        renderType: function ($target, data) {
            var html = '<li class="search-list-item active"><a href="javascript:;" data-val="">' + Language.STATUS.all + '</a></li>';
            data.data.map(function (cur, i) {
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + cur + '">' + Language.PARAMS.type[cur] + '</a></li>';
            })
            $target.html(html);
        },
        //渲染状态列表
        renderStatus: function ($target, data) {
            var html = '<li class="search-list-item active"><a href="javascript:;" data-val="">' + Language.STATUS.all + '</a></li>';
            data.data.map(function (cur, i) {
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + cur + '">' + Language.PARAMS.status[cur] + '</a></li>';
            })
            $target.html(html);
        }
    }


    var CONSTANT = {
        DATA_TABLES: {
            OPTIONS: {
                serverSide: true,
                autoWidth: true,
                processing: false,
                ordering: false,
                searching: false,
                info: true
            }
        }
    }
    return {
        init: init
    }
}, {
    requires: ['jquery', 'datePicker', 'modal', 'datatables', 'message', '/base/utils.js', '/base/api.js', '/base/http.js']
})