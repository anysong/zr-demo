const gulp = require("gulp");
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const autoPreFixer = require("gulp-autoprefixer");
const config = require('../config');
const cleanCss = require('gulp-clean-css');

// 单独编译scss文件
var components = config.components,
    baseName = 'sass-',
    baseNamePro = 'sass-pro-',
    srcDir = './src/components/',
    destDir = './dest/components/';
    
var taskList = components.map((i) => {
    return baseName + i;
})

var compileScss = (src, dest) => {
    gulp.src(src)
        .pipe(sass())
        .pipe(cleanCss())
        .on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(autoPreFixer({
            browsers: ["last 2 versions"], //主流浏览器的2个版本
            cascade: true //是否美化属性值
        }))
        .pipe(gulp.dest(dest))
}

var createTask = (arr) => {
    arr.map((i) => {
        gulp.task(baseName + i, () => {
            compileScss(srcDir + i + '/*.scss', destDir + i)
        })
    })
}
// 批量创建task
createTask(components);
// 初始化watch执行
gulp.task("sass", taskList);

/**
 * 生产环境
 */

var taskListPro = components.map((i) => {
    return baseNamePro + i;
})
var compileScssPro = (src, dest) => {
    gulp.src(src)
        .pipe(sass())
        .on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(autoPreFixer({
            browsers: ["last 2 versions"], //主流浏览器的2个版本
            cascade: true //是否美化属性值
        }))
        .pipe(gulp.dest(dest))
}
var createTaskPro = (arr) => {
    arr.map((i) => {
        gulp.task(baseNamePro + i, () => {
            compileScssPro(srcDir + i + '/*.scss', destDir + i)
        })
    })
}
createTaskPro(components);
gulp.task("sass-pro", taskListPro);