Zr.add('./demo1/mock.js', function (zr, Mock) {

    var init = function () {

        //查询干线规则 list
        Mock.mock(RegExp('/order/list' + '.*'), function () {
            var res = {
                "data": {
                    "totalRecords": 2,
                    "aaData": [{
                        "sendCompleteDate": 1544578978000,
                        "creator": "aa",
                        "exportType": 1,
                        "id": 1,
                        "skuSum": "skuSum",
                        "storeFrom": '上海',
                        "storeTo": '北京',
                        "state": 1,
                        "stockType": "1",
                        "updateTime": 1544578979000,
                        "createTime": 1544578979000,
                        "receiveCompleteDate": 1544578979000,
                        "units": 10,
                        "yn": 2
                    }, {
                        "sendCompleteDate": 1544578978000,
                        "creator": "aa",
                        "exportType": 1,
                        "id": 22,
                        "skuSum": "skuSum",
                        "storeFrom": '北京',
                        "storeTo": '上海',
                        "state": 1,
                        "stockType": "1",
                        "updateTime": 1544578979000,
                        "createTime": 1544578979000,
                        "receiveCompleteDate": 1544578979000,
                        "units": 10,
                        "yn": 3
                    }]
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        //按钮权限
        Mock.mock(RegExp('/permission' + '.*'), function () {
            var ret = {
                "data": [1000000031, 1000000032],
                "errCode": "",
                "errMsg": "",
                "success": true
            }
            return ret;
        })
        //获取单据状态
        Mock.mock(RegExp('/yn' + '.*'), function () {
            var ret = {
                "data": [1, 2, 3, 4],
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return ret;
        })
        //获取生产状态
        Mock.mock(RegExp('/state' + '.*'), function () {
            var ret = {
                "data": [1, 0, 21, 22, 31, 32, 41, 42, 43],
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return ret;
        })
        //获取类型
        Mock.mock(RegExp('/exporttype' + '.*'), function () {
            var ret = {
                "data": [1, 2],
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return ret;
        })
        //获取入库库房信息
        Mock.mock(RegExp('/wareHouse/list' + '.*'), function () {
            var res = {
                "data": {
                    "1": "青龙",
                    "2": "白虎",
                    "3": "朱雀",
                    "4": "玄武"
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        //取消
        Mock.mock(RegExp('/cancel' + '.*'), function () {
            var res = {
                "data": {},
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        //批量审核/审核/驳回
        Mock.mock(RegExp('/approve' + '.*'), function () {
            var res = {
                "data": {},
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        //导出
        Mock.mock(RegExp('/export' + '.*'), function () {
            var res = {
                "data": {
                    "item": 'http://jd.com'
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        //导出详情
        Mock.mock(RegExp('/exportdetail' + '.*'), function () {
            var res = {
                "data": {
                    "item": 'http://jd.com'
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
    }
    return {
        init: init
    }
}, {
    requires: ['mock']
})