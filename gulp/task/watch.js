const gulp = require('gulp');
const watch = require('gulp-watch');
const config = require('../config');
const sequence = require('gulp-sequence')

var componentsDir = './src/components/',
    components = config.components,
    sassName = 'sass-';
    babelName = 'babel-';

var createWatch = () => {
    components.map((i)=>{
        watch(componentsDir + i +'/*.scss', () => {
            if(i === 'base'){
                components.map((item)=>{
                    gulp.start(sassName + item);
                }) 
            }else {
                gulp.start(sassName + i);
            }
            gulp.start('move-html-dest');
        })
    })

    components.map((i)=>{
        watch(componentsDir + i +'/*.js', () => {
            gulp.start(babelName + i);
            gulp.start('move-html-dest');
        })
    })
}
gulp.task('watch', () => {
    sequence('init-dev', ['sass', 'babel', 'move-html-dest'], 'imagemin', () => {
        createWatch();
        watch('./src/views/*.html', () => {
            gulp.start('move-html-dest');
        })
    })
})