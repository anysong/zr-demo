Zr.add('./base/api.js', function (zr) {
    var API = {
        TRUNK: {},
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