'use strict';

const gulp = require('gulp');
const qiniu = require('gulp-qiniu');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev');
const through = require('through2');
const cheerio = require('cheerio');
require('dotenv').config({silent: true});

gulp.task('usemin', function () {
    return gulp.src(['views/*.html', 'views/*/*.html'])
        .pipe(usemin({
            js: [uglify, rev],
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
                        'http://boom-static.static.cceato.com/account/' + src.replace('../', ''));
                });
                // $('link[href]').each(function () {
                //     let $t = $(this);
                //     let href = $t.attr('href');
                //     content = content.replace(href,
                //         'http://boom-static.static.cceato.com/account/' + href.replace('../', ''));
                // });
                file.contents = new Buffer(content);
                callback(null, file);
            })
        )
        .pipe(gulp.dest('public/views'));
});

gulp.task('qiniu', function() {
    console.log(process.env.QINIU_AK);
    console.log(process.env.QINIU_SK);
    if (!process.env.QINIU_AK || !process.env.QINIU_SK) {
        console.log('not found qiniu config');
        return;
    }
    return gulp.src(['./public/build/main-*.js'])
        .pipe(qiniu({
            accessKey: process.env.QINIU_AK,
            secretKey: process.env.QINIU_SK,
            bucket: "static-boom",
            private: false
        }, {
            dir: 'account/build',
            versioning: false,
            concurrent: 1
        }));
})

gulp.task('build', ['usemin']);
gulp.task('cdn', ['qiniu']);
gulp.task('default', ['build']);