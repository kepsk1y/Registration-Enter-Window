const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const include = require('gulp-file-include');
const concat = require('gulp-concat');
const prefixer = require('gulp-autoprefixer');

function html() {
   return src('src/*.html')
       .pipe(include({
           prefix: '@@'
       }))
       .pipe(htmlmin({
        collapseWhitespace: true
       }))
       .pipe(dest('build'))
}

function scss() {
    return src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(prefixer())
        .pipe(csso())
        .pipe(concat('main.css'))
        .pipe(dest('build'))
}

function clear() {
    return del('build')
}

function serve() {
    browserSync.init({
        server: './build'
    })
    watch('src/**/*.html', series(html)).on('change', browserSync.reload)
    watch('src/scss/**/*.scss', series(scss)).on('change', browserSync.reload)
}

exports.build = series(clear, scss, html)
exports.clear = clear
exports.serve = series(clear, scss, html, serve)