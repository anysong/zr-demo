Zr.add('./base/api.js', function (zr) {
    var API = {
        TRUNK: {
            "list": "/trunk/list",
            "save": "/trunk/save",
            "getExportType": "/trunk/exporttype",
            "getTrunkStatus": "/trunk/trunkstatus",
            "getStoreList": "/wareHouse/list",
            "modifyStateToStart": "/trunk/start",
            "modifyStateToStop": "/trunk/stop"
        },
        ORDER: {
            "list": "/order/list",
            "detail": "/order/detail",
            "exportOrder": "/order/export",
            "exportOrderDetail": "/order/exportdetail",
            "getYn": "/order/yn",
            "getOrderType": "/order/state",
            "approveOrder": "/order/approve",
            "cancelOrder": "/order/cancel",
            "buttonPermission": "/permission",
        },
        DETAIL: {}
    }

    return API;
}, {
    requires: []
});