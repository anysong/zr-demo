const gulp = require("gulp");
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const config = require('../config');

// 单独编译js文件
var components = config.components,
    baseName = 'babel-',
    srcDir = './src/components/',
    destDir = './dest/components/';
    
var taskList = components.map((i) => {
    return baseName + i;
})

var compileScss = (src, dest) => {
    gulp.src(src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(gulp.dest(dest))
}

var createTask = (arr) => {
    arr.map((i) => {
        gulp.task(baseName + i, () => {
            compileScss(srcDir + i + '/*.js', destDir + i)
        })
    })
}
// 批量创建task
createTask(components);
// 初始化watch执行
gulp.task("babel", taskList);