'use strict';

const gulp = require('gulp');
const qiniu = require('gulp-qiniu');
const uglify = require('gulp-uglify');
const usemin = require('gulp-usemin');
const through = require('through2');
const rev = require('gulp-rev');
const del = require('del');
const fs = require('fs');
const co = require('co');
const path = require('path');

const QiniuFileUtils = require('./common/QiniuFileUtils');

require('dotenv').config({silent: true});

function html_usemin() {
    return gulp.src(['views/*.html', 'views/*/*.html'])
        .pipe(
            through.obj(function (file, enc, callback) {
                let content = String(file.contents);
                content = content.replace('/static/bundle/bundle.min.js', '/public/bundle/bundle.min.js');
                content = content.replace('/static/summernote/summernote.js', '/public/summernote/summernote.js');
                content = content.replace('/static/js/masonry.pkgd.min.js', '/public/js/masonry.pkgd.min.js');
                content = content.replace('/static/cropper/cropper.min.js','/public/cropper/cropper.min.js');
                content = content.replace('/static/cropper/jquery-cropper.min.js','/public/cropper/jquery-cropper.min.js');
                content = content.replace('/static/js/imagesloaded.pkgd.min.js','/public/js/imagesloaded.pkgd.min.js');
                content = content.replace('/static/highlight/highlight.pack.js','/public//highlight/highlight.pack.js');
                file.contents = new Buffer(content)
                callback(null, file);
            })
        )
        .pipe(usemin({
            js: [uglify, rev],
        }))
        .pipe(
            through.obj(function (file, enc, callback) {
                let content = String(file.contents);
                content = content.replace('../build/main-', 'http://boom-static.static.cceato.com/editor/build/main-');
                file.contents = new Buffer(content)
                callback(null, file);
            })
        )
        .pipe(gulp.dest('public/views'));
};

function cdn(cb) {
    if (!process.env.QINIU_AK || !process.env.QINIU_SK) {
        console.log('not found qiniu config');
        return;
    }

    co(function * () {
        QiniuFileUtils.init(
            process.env.QINIU_AK,
            process.env.QINIU_SK,
            'static-boom'
        );

        let dir = 'public/build';
        let jsFiles = fs.readdirSync(dir);
        for(let file of jsFiles) {
            yield QiniuFileUtils.uploadLocalFile({
                localFilePath: path.join(dir, file),
                targetDir: 'editor/build',
                targetFileName: file
            });
        }
    }).then(() => {
        console.log('Upload main.js to qiniu cdn.');
        cb();
    });

}


function clean(cb) {
    del(['public/build/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
}

gulp.task('usemin', html_usemin);
gulp.task(cdn);
gulp.task(clean);

gulp.task('build', gulp.series(clean, html_usemin, cdn));
