const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('init-dev', () => {
    console.log('初始化');
    return gulp.src('./dest')
    .pipe(clean());
})

gulp.task('init-production', () => {
    return gulp.src('./dist')
    .pipe(clean());
})