const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');
const config = require('../../WEB-INF/server.conf');

// 代理
var getProxyList = () => {
    var proxyList = [];
    for (var name in config.proxy) {
        proxyList.push(proxy(name, {
            target: config.proxy[name],
            changeOrigin: true,
        }))
    }
    return proxyList;
}

gulp.task('browser-sync', function () {
    browserSync.init({
        ui: false,
        server: {
            baseDir: "./",
            directory: true,
            middleware: getProxyList()
        },
        files: ["dest/**/*"],
    })
})