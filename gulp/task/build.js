const gulp = require('gulp');
const sequence = require('gulp-sequence');

/**
 * 模块动态加载没法合并 useref
 * 初始化
 * 压缩
 */

gulp.task('build', () => {
    sequence(['uglify', 'move-html-dist', 'imagemin-production'], () => {
        console.log('打包完成');
    });
})