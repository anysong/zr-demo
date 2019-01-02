const gulp = require('gulp');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cleanCss = require('gulp-clean-css');
const rev = require('gulp-rev');
/**
 * js内部有模块依赖关系，rev不好用
 */

gulp.task('uglify-files', () => {
    return gulp.src(['./dest/**/*.js', './dest/**/*.css'])
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cleanCss()))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('uglify', ['uglify-files'], () => {
    //TODO mini html 

})