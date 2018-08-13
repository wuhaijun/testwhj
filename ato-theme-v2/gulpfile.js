'use strict';

const gulp = require('gulp');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const minifyCss = require('gulp-minify-css');
const through = require('through2');
const rev = require('gulp-rev');
const cheerio = require('cheerio');
const uuid = require('uuid/v4');
const cleanCss = require('gulp-clean-css');

const filterNames = ['styles', 'fonts', 'boom', 'scripts', 'vendor'];

gulp.task('usemin', function () {
    process.env.NODE_ENV = 'production';
    let id = uuid().split('-')[4];
    return gulp.src(['views/*.html', 'views/**/*.html'])
        .pipe(
            through.obj(function (file, enc, callback) {
                let content = String(file.contents);
                let $ = cheerio.load(content);
                $('script[src]').each(function () {
                    let $t = $(this);
                    let src = $t.attr('src');
                    content = content.replace(src, src.replace('http://boom-static-dev/', ''));
                });
                $('link[href]').each(function () {
                    let $t = $(this);
                    let href = $t.attr('href');
                    content = content.replace(href, href.replace('http://boom-static-dev/', ''));
                });
                file.contents = new Buffer(content)
                callback(null, file);
            })
        )
        .pipe(usemin({
            css: [minifyCss, rev],
            // js: [uglify],
            js: [rev],
        }))
        .pipe(
            through.obj(function (file, enc, callback) {
                if(!file.path.endsWith('html')) {
                    callback(null, file);
                    return;
                }
                let content = String(file.contents);
                let $ = cheerio.load(content);
                $('script[src]').each(function () {
                    let $t = $(this);
                    let src = $t.attr('src');
                    content = content.replace(src,
                        'http://boom-static.static.cceato.com/' + src.replace('../', ''));
                });
                $('link[href]').each(function () {
                    let $t = $(this);
                    let href = $t.attr('href');
                    content = content.replace(href,
                        'http://boom-static.static.cceato.com/' + href.replace('../', ''));
                });
                file.contents = new Buffer(content);
                callback(null, file);
            })
        )
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['usemin']);

gulp.task('default', ['build']);