const gulp = require('gulp');

/**
 * TODO image 压缩
 */

gulp.task('imagemin-dev', () => {
    return gulp.src('./src/components/*/i/**')
        .pipe(gulp.dest('./dest/components/'))
})

gulp.task('imagemin-production', () => {
    return gulp.src('./src/components/*/i/**')
        .pipe(gulp.dest('./dist/components/'))
})