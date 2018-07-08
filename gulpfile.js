var gulp = require('gulp');

var server = require('gulp-webserver');

var url = require('url');

var path = require('path');

var fs = require('fs');

var scss = require('gulp-sass');

var concat = require('gulp-concat');

var mincss = require('gulp-clean-css');

var autoprefixer = require('gulp-autoprefixer');

var uglify = require('gulp-uglify');

gulp.task('server', ['scss'], function() {
    gulp.src('src')
        .pipe(server({
            port: 8080,
            liverload: true, //自动刷新
            open: true, // 自动打开浏览器
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return;
                }
                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
            }
        }))
})

// 编译scss
gulp.task('scss', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(gulp.dest('src/css'))
})

//gulp watch 监听

gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', ['scss'])
})

/// 开发环境
gulp.task('default', ['server', 'watch'])

//线上环境 scss
gulp.task('buildScss', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scss())
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >=4.0']
        }))
        .pipe(mincss())
        .pipe(gulp.dest('build/css'))
})

//线上环境 js
gulp.task('buildJs', function() {
    gulp.src('./src/js/style.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/js'))
})
gulp.task('copyHtml', function() {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('build'))
})

/// 开发环境
gulp.task('build', ['buildScss', 'buildJs', 'copyHtml'])