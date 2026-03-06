'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const uglify       = require('gulp-uglify');
const rename       = require('gulp-rename');
var pipeline       = require('readable-stream').pipeline;
const browserSync  = require('browser-sync').create();
var reload         = browserSync.reload;

exports.serve = () => {
  browserSync.init({
    proxy: 'http://localhost:10044/',
    host : '192.168.100.96', //CURRENT IP
    open: false,
    // ghostMode: false,
    notify: false
  })
  gulp.watch('./sass/framework/*.scss', buildStyles)
  gulp.watch('./sass/main/*.scss', buildStyles)
  gulp.watch('./sass/main/modules/*.scss', buildStyles)
  gulp.watch('./sass/*.scss', buildStyles)
  gulp.watch('./js/main.js', buildScripts)
  gulp.watch("**/*.php").on("change", reload);
}

const buildStyles = () => gulp.src('./sass/*.scss')
  .pipe(sass.sync({ outputStyle: 'compressed' }))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream())
  
  
const buildScripts = () => pipeline(
    gulp.src('./js/main.js'),
    uglify(),
    rename({ extname: '.min.js' }),
    gulp.dest('./js/')
  ).pipe(browserSync.stream())




