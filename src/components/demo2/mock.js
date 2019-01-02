Zr.add('./demo2/mock.js', function (zr, Mock) {
   
    var init = function () {
        Mock.mock(RegExp('/trunk/list' + '.*'), function () {
            var res = {
                "data": {
                    "totalRecords": 1,
                    "aaData": [{
                        "createTime": 1544578978000,
                        "creator": "aa",
                        "exportType": "1",
                        "id": 1,
                        "orgFromStr": 'A',
                        "orgToStr": 'hh',
                        "orgFrom": 1,
                        "orgTo": 2,
                        "site": 0,
                        "status": 1,
                        "stockType": "1",
                        "trunkStatus": 1,
                        "updateTime": 1544578979000,
                        "updater": "ss",
                        "yn": 0
                    },{
                        "createTime": 1544578978000,
                        "creator": "aa",
                        "exportType": "1",
                        "id": 1,
                        "orgFromStr": 'B',
                        "orgToStr": 'jj',
                        "orgFrom": 1,
                        "orgTo": 2,
                        "site": 0,
                        "status": 1,
                        "stockType": "1",
                        "trunkStatus": 1,
                        "updateTime": 1544578979000,
                        "updater": "ss",
                        "yn": 0
                    }]
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        Mock.mock(RegExp('/trunk/exporttype' + '.*'), function () {
            var res = {
                "data": [1, 2],
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        Mock.mock(RegExp('/trunk/trunkstatus' + '.*'), function () {
            var res = {
                "data": [1, 2],
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        Mock.mock(RegExp('/save' + '.*'), function () {
            return {
                success: true
            };
        })
        Mock.mock(RegExp('/wareHouse/list' + '.*'), function () {
            var res = {
                "data": {
                    "1": "item1",
                    "2": "item2",
                    "3": "item3",
                    "4": "item4"
                },
                "errCode": "0",
                "errMsg": "",
                "success": true
            }
            return res;
        })
        Mock.mock(RegExp('/modifyState' + '.*'), function () {
            return {
                success: true
            };
        })
    }
    return {
        init: init
    }
}, {
    requires: ['mock']
})