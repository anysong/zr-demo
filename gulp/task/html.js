const gulp = require('gulp');

gulp.task('move-html-dest', () => {
    gulp.src('./src/views/*.html')
        .pipe(gulp.dest('./dest/views'))
})

//暂时不做额外操作
gulp.task('move-html-dist', () => {
    gulp.src('./src/views/*.html')
        .pipe(gulp.dest('./dist/views'))
})