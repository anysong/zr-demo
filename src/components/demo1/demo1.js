/**
 * @author DYY
 * 查询
 */

Zr.add('./demo1/demo1.js', function (zr, $, datePicker, modal, datatables, tmpl, message, utils, API, http) {

    var _table,
        $table,
        Language;

    var checkModal,
        rejectModal,
        batchCheckModal;

    var $storeList,
        $storeInList,
        $billStatusList,
        $typeList,
        $ynStatusList;
    var timeoutTimer = {};
    var $query, $reset, $batch, $check, $reject;

    var bindListener = function () {
        $query.off('click').on('click', _manager.query);
        $reset.off('click').on('click', _manager.queryReset);
        $('.js-close-all').off('click').on('click', _manager.closeAll);
        $('.js-batch-check').off('click').on('click', _manager.batchCheckItems);
        $('.js-batch-pass').off('click').on('click', _manager.batchPass);
        $('.js-export-detail').off('click').on('click', _manager.exportDetail);
        $('.js-export-order').off('click').on('click', _manager.exportOrder);
        $('.js-reject-item').off('click').on('click', _manager.rejectItem);
        $('.js-check-item').off('click').on('click', _manager.checkItem);

        $table.on('change', ':checkbox', _manager.checked);
        $table.on('click', '.js-cancel-modal', _manager.cancelItem);
        $table.on('click', '.js-check-modal', _manager.checkModal);
        $table.on('click', '.js-reject-modal', _manager.rejectModal);
    }
    var initPlugins = function () {
        $table = $('#dt');
        datePicker.init({
            target: "#date-1",
            type: "normal",
            format: "YYYY-MM-DD"
        });
        datePicker.init({
            target: "#date-2",
            type: "normal",
            format: "YYYY-MM-DD"
        });
        checkModal = modal.init("#checkModal", {
            top: "20px",
            openCallback: function () {
                $('.js-check-content').val('');
            },
            closeCallback: function () {}
        })
        rejectModal = modal.init("#rejectModal", {
            top: "20px",
            openCallback: function () {
                $('.js-reject-content').val('');
            },
            closeCallback: function () {}
        })
        batchCheckModal = modal.init("#batchCheckModal", {
            top: "20px",
            openCallback: function () {
                $('.js-batch-content').val('');
            },
            closeCallback: function () {}
        })

        _table = $table.DataTable($.extend(true, {}, CONSTANT.DATA_TABLES.OPTIONS, {
            ajax: function (data, callback, settings) {
                var params = _manager.getQueryCondition(data);
                _manager.disableQueryStyle($query, 'query');

                http.ajax({
                    'url': API.ORDER.list,
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
                })
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
                var $cancelBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-cancel-modal" style="margin-right:2px">' + Language.STATUS.cancel + '</a><span>|</span>');
                var $checkRejectBtn = $('<a href="javascript:;" data-index="' + index + '" class="js-check-modal">' + Language.ACTION.examine +
                    '</a><span>|</span><a href="javascript:;" data-index="' + index + '" class="js-reject-modal">' + Language.ACTION.reject + '</a>');
                if (data.yn != 2 || data.yn != 3) {
                    if (data.state == 1) {
                        //出现审核+驳回+取消按钮
                        $(row).find('td').eq(-1).html('').append($cancelBtn).append($checkRejectBtn);
                    } else if (data.state == 21 || data.state == 31) {
                        //出现取消按钮
                        $(row).find('td').eq(-1).html('').append($cancelBtn);
                    }
                }

                //详情
                var $detail = $(
                    '<a href="/todetail/' + data.id + '"' +
                    '" target="_blank" data-index="' + index +
                    '" class="js-detail-item" style="margin-right:2px">' + data.id +
                    '</a>'
                );
                $(row).find('td').eq(1).html('').append($detail);
                $(row).attr('data-index', index);
            },
            drawCallback: function () {
                $table.find('[name="cb-check-all"]').prop('checked', false);
                _manager.updateButton();
            }
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
        $('#search-info-box').replaceWith(tmpl("tmpl-main", data)) //主页面
        $('body').append(tmpl("tmpl-batch-check", data)) //批量
        $('body').append(tmpl("tmpl-check", data)) //审核
        $('body').append(tmpl("tmpl-reject", data)) //驳回

        $storeList = $('input[name="storeFrom"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $storeInList = $('input[name="storeTo"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');

        $billStatusList = $('input[name="state"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $ynStatusList = $('input[name="yn"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');
        $typeList = $('input[name="exportType"]').siblings('.zr-dropdown-search-menu').children('.zr-dropdown-search-list');

        $query = $('.js-query'); //查询按钮;
        $reset = $('.js-reset'); //重置按钮;
        $batch = $('.js-batch-pass'); //批量审核
        $check = $('.js-check-item'); //审核 
        $reject = $('.js-reject-item'); //驳回
    }
    //初始化函数
    var init = (data) => {
        Language = data; //加载文字
        initConfig();
        parseDom(data); //加载模板
        initPlugins();
        bindListener();

        _manager.getStoreList();

        _manager.getTypeList();
        _manager.getOrderType(); //获取单据状态
        _manager.getYnStatus(); //生产状态
        _manager.getButtonPermission(); //按钮权限 buttonPermission
    }

    // 方法；
    var _manager = {
        currentItem: null,
        dataItems: [],
        queryParams: {},
        store: {},
        power: {
            check: false,
            cancel: false,
        },

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
        getColumns: function () {
            var columns = [{
                data: null,
                render: () => '<input type="checkbox" class="iCheck" />'
            }, {
                data: 'id'
            }, {
                data: 'exportType',
                render: function (key) {
                    var key = key + '';
                    return Language.PARAMS.type[key] || '';
                }
            }, {
                data: 'storeFrom',
            }, {
                data: 'storeTo',
            }, {
                data: 'skuSum'
            }, {
                data: 'units'
            }, {
                data: 'state',
                render: function (key) {
                    var key = key + '';
                    return Language.PARAMS.bill[key] || '';
                }
            }, {
                data: 'yn',
                render: function (key) {
                    var key = key + '';
                    return Language.PARAMS.yn[key] || '';
                }
            }, {
                data: 'createTime',
                render: function (time) {
                    var retTime = '--';
                    if (time) {
                        retTime = zr.tools.format('yyyy-MM-dd hh:mm:ss', time);
                    }
                    return retTime;
                }
            }, {
                data: 'sendCompleteDate',
                render: function (time) {
                    var retTime = '--';
                    if (time) {
                        retTime = zr.tools.format('yyyy-MM-dd hh:mm:ss', time);
                    }
                    return retTime;
                }
            }, {
                data: 'receiveCompleteDate',
                render: function (time) {
                    var retTime = '--';
                    if (time) {
                        retTime = zr.tools.format('yyyy-MM-dd hh:mm:ss', time);
                    }
                    return retTime;
                }
            }, {
                data: 'creator'
            }, {
                data: null,
                width: '80px'
            }]
            return columns;
        },
        //校验
        contentComfirm: function (selector) {
            var content = $(selector).val();
            if (content.length == 0) {
                $(selector).focus();
                if (selector.indexOf('check') != -1) {
                    message.error(Language.KEY.check + Language.TEXT.cannot_nodata);
                } else if (selector.indexOf('reject') != -1) {
                    message.error(Language.KEY.reject + Language.TEXT.cannot_nodata);
                } else if (selector.indexOf('batch') != -1) {
                    message.error(Language.KEY.batch_check + Language.TEXT.cannot_nodata);
                }
            } else {
                return true;
            }
            return false;
        },
        //选择
        checked: function () {
            if ($(this).is('[name="cb-check-all"]')) {
                //全选
                $table.find(':checkbox').prop('checked', $(this).prop('checked'));
            } else {
                var checkbox = $table.find('tbody :checkbox');
                var flag = checkbox.length === checkbox.filter(':checked').length;
                $table.find('[name="cb-check-all"]').prop('checked', flag);
            }
        },
        //获取选中id
        getCheckedIds: function () {
            var checkItems = [],
                aIds = [];
            var checkbox = $table.find('tbody :checkbox');
            var list = checkbox.filter(':checked').closest('tr');
            list.each(function (index, item) {
                var i = $(item).attr('data-index');
                checkItems.push(_manager.dataItems[i]);
                aIds.push(_manager.dataItems[i].id);
            })
            return aIds.join(',');
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
        //导出时查询状态
        getExportQuery: function () {
            var arr = $('.js-form-query').serializeArray(),
                params = {};
            arr.map((i) => {
                if (i.name === 'startTime' && i.value != '') {
                    params[i.name] = i.value + ' 00:00:00';
                } else if (i.name === 'endTime' && i.value != '') {
                    params[i.name] = i.value + ' 23:59:59';
                } else {
                    params[i.name] = i.value;
                }
            })
            console.log('params', params);
            return params;
        },
        //查询
        query: function () {
            if ($(this).hasClass('zr-btn-disable')) return;

            var arr = $('.js-form-query').serializeArray(),
                params = {};
            arr.map((i) => {
                if (i.name === 'startTime' && i.value != '') {
                    params[i.name] = i.value + ' 00:00:00';
                } else if (i.name === 'endTime' && i.value != '') {
                    params[i.name] = i.value + ' 23:59:59';
                } else {
                    params[i.name] = i.value;
                }
            })

            //exportType yn state storeFrom storeTo
            var iniList = ['exportType', 'yn', 'state', 'storeFrom', 'storeTo', 'productNo', 'id'];
            for (var i = 0; i < iniList.length; i++) {
                if (params[iniList[i]] == '-1' || params[iniList[i]] == '') {
                    delete params[iniList[i]];
                } else {
                    params[iniList[i]] = parseFloat(params[iniList[i]]);
                }
            }
            if (!_manager.checkDateLegal(params.startTime, params.endTime)) return;
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
            $('.js-form-query input').val('');
        },
        //取消选择
        closeAll: function () {
            $table.find(':checkbox').prop('checked', false);
        },
        //批量审核弹窗
        batchCheckItems: function () {
            batchCheckModal.show();
        },
        //审核弹窗
        checkModal: function () {
            checkModal.show();
            var index = $(this).attr('data-index');
            //更新当前选中
            _manager.currentItem = _manager.dataItems[index];
        },
        //驳回弹窗
        rejectModal: function () {
            rejectModal.show();
            var index = $(this).attr('data-index');
            //更新当前选中
            _manager.currentItem = _manager.dataItems[index];
        },

        //ajax
        //批量通过
        batchPass: function () {
            if ($(this).hasClass('zr-btn-disable')) return;
            if (!_manager.contentComfirm('.js-batch-content')) return;

            var ids = _manager.getCheckedIds();
            var remarkText = $('.js-batch-content').val();

            if (ids.length == 0) {
                message.error(Language.TEXT.must_check);
                return;
            };
            _manager.disableQueryStyle($batch, 'batch');
            http.ajax({
                'url': API.ORDER.approveOrder,
                'params': {
                    ids: ids,
                    state: 21, //审核状态：21-审核 22-驳回
                    remarkText: remarkText
                },
                'success': function (res) {
                    _manager.enableQueryStyle($batch, 'batch');
                    if (res.success) {
                        message.success(Language.STATUS.save_success);
                        batchCheckModal.hide();
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(res.errMsg)
                    }
                },
                'error': function () {
                    _manager.enableQueryStyle($batch, 'batch');
                }
            })
        },
        //取消
        cancelItem: function () {
            var index = $(this).attr('data-index');
            //更新当前选中
            _manager.currentItem = _manager.dataItems[index];
            var id = _manager.currentItem.id;
            http.ajax({
                'url': API.ORDER.cancelOrder,
                'params': {
                    ids: id
                },
                'success': function (ret) {
                    if (ret.success) {
                        message.success(Language.STATUS.save_success);
                        checkModal.hide();
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(ret.errMsg)
                    }
                },
                'error': function () {}
            })
        },
        //审核
        checkItem: function () {
            if ($(this).hasClass('zr-btn-disable')) return;
            if (!_manager.contentComfirm('.js-check-content')) return;

            var id = _manager.currentItem.id;
            var remarkText = $('.js-check-content').val();
            _manager.disableQueryStyle($check, 'check');
            http.ajax({
                'url': API.ORDER.approveOrder,
                'params': {
                    ids: id,
                    state: 21, //审核状态：21-审核 22-驳回
                    remarkText: remarkText
                },
                'success': function (ret) {
                    _manager.enableQueryStyle($check, 'check');
                    if (ret.success) {
                        message.success(Language.STATUS.save_success);
                        checkModal.hide();
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(ret.errMsg)
                    }
                },
                'error': function () {
                    _manager.enableQueryStyle($check, 'check');
                }
            })
        },
        //驳回
        rejectItem: function () {
            if ($(this).hasClass('zr-btn-disable')) return;
            if (!_manager.contentComfirm('.js-reject-content')) return;

            var id = _manager.currentItem.id;
            var remarkText = $('.js-reject-content').val();
            _manager.disableQueryStyle($reject, 'reject');
            http.ajax({
                'url': API.ORDER.approveOrder,
                'params': {
                    ids: id,
                    state: 22, //审核状态：21-审核 22-驳回
                    remarkText: remarkText
                },
                'success': function (ret) {
                    _manager.enableQueryStyle($reject, 'reject');
                    if (ret.success) {
                        message.success(Language.STATUS.save_success);
                        rejectModal.hide();
                        //刷新table数据
                        _table.ajax.reload();
                    } else {
                        message.error(ret.errMsg)
                    }
                },
                'error': function () {
                    _manager.enableQueryStyle($reject, 'reject');
                }
            })
        },
        checkDateLegal: function (startTime, endTime) {
            if (startTime && endTime) {
                var start = new Date(startTime).getTime();
                var end = new Date(endTime).getTime();
                if (start > end) {
                    message.error(Language.TEXT.error_time);
                    return false;
                }
            }
            return true;
        },
        //详情导出
        exportDetail: function () {
            var params = _manager.getExportQuery();
            if (!_manager.checkDateLegal(params.startTime, params.endTime)) return;
            params.stockType = 1;
            utils.download(API.ORDER.exportOrderDetail, params);
        },
        //内配单导出
        exportOrder: function () {
            var params = _manager.getExportQuery();
            if (!_manager.checkDateLegal(params.startTime, params.endTime)) return;
            params.stockType = 1;
            utils.download(API.ORDER.exportOrder, params);
        },
        updateButton: function () {
            if (_manager.power.check) {
                $('.js-batch-check').css('display', 'inline-block');
                $('.js-check-modal').css('display', 'inline-block');
                $('.js-reject-modal').css('display', 'inline-block');
                $('.js-check-modal').siblings('span').css('display', 'inline-block');
            } else {
                $('.js-batch-check').css('display', 'none');
                $('.js-check-modal').css('display', 'none');
                $('.js-reject-modal').css('display', 'none');
                $('.js-check-modal').siblings('span').css('display', 'none');
            }
            if (_manager.power.cancel) {
                $('.js-cancel-modal').css('display', 'inline-block');
            } else {
                $('.js-cancel-modal').css('display', 'none');
            }
        },
        //按钮权限
        getButtonPermission: function () {
            http.ajax({
                'url': API.ORDER.buttonPermission,
                'success': function (ret) {
                    if (ret.success) {
                        var arr = ret.data || [];
                        var code = arr.join(',');
                        if (code.indexOf('1000000031') != -1) {
                            //显示审核、批量审核按钮
                            _manager.power.cancel = true;
                            if (code.indexOf('1000000032') != -1) {
                                //显示取消、批量取消按钮
                                _manager.power.cancel = true;
                                _manager.power.check = true;
                            }
                        }
                        _manager.updateButton();
                    } else {
                        if (ret.errMsg) {
                            message.error(ret.errMsg)
                        }
                    }
                },
                'error': function () {}
            })
        },



        //获取仓库
        getStoreList: function () {
            http.ajax({
                'url': API.TRUNK.getStoreList,
                'success': function (ret) {
                    if (ret.success) {
                        _manager.store = ret.data;
                        _manager.renderStore($storeList, ret);
                        _manager.renderStore($storeInList, ret);
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {}
            })
        },
        //获取类型
        getTypeList: function () {
            http.ajax({
                'url': API.TRUNK.getExportType,
                'success': function (ret) {
                    if (ret.success) {
                        _manager.renderType($typeList, ret)
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {}
            })
        },
        //单据状态
        getYnStatus: function () {
            http.ajax({
                'url': API.ORDER.getYn,
                'success': function (ret) {
                    if (ret.success) {
                        _manager.renderYn($ynStatusList, ret)
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {}
            })
        },
        //获取生产状态
        getOrderType: function () {
            http.ajax({
                'url': API.ORDER.getOrderType,
                'success': function (ret) {
                    if (ret.success) {
                        _manager.renderBill($billStatusList, ret)
                    } else {
                        message.error(ret.errMsg);
                    }
                },
                'error': function () {}
            })
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
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + cur + '">' + Language.PARAMS['type'][cur] + '</a></li>';
            })
            $target.html(html);
        },
        //渲染状态列表
        renderBill: function ($target, data) {
            var html = '<li class="search-list-item active"><a href="javascript:;" data-val="">' + Language.STATUS.all + '</a></li>';
            data.data.map(function (cur, i) {
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + cur + '">' + Language.PARAMS['bill'][cur] + '</a></li>';
            })
            $target.html(html);
        },
        //渲染单据状态
        renderYn: function ($target, data) {
            var html = '<li class="search-list-item active"><a href="javascript:;" data-val="">' + Language.STATUS.all + '</a></li>';
            data.data.map(function (cur, i) {
                html += '<li class="search-list-item"><a href="javascript:;" data-val="' + cur + '">' + Language.PARAMS['yn'][cur] + '</a></li>';
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
    requires: ['jquery', 'datePicker', 'modal', 'datatables', 'tmpl', 'message', '/base/utils.js', '/base/api.js', '/base/http.js']
})