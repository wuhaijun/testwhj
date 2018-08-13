const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const path = require('path');
const rp = require('request-promise');
const IDUtils = require('../../common/IDUtils');
const QiniuFileUtils = require('../../common/QiniuFileUtils');
const ImageUploadFile = require('../../models/image/ImageUploadFile');
const ImageCategory = require('../../models/image/ImageCategory');

const TARGET_DIR = 'upload/image/';
const EDITOR_IMAGE_HOST = 'editor.static.cceato.com';

function * upload(imageFile, categoryId, accountId) {
    let md5FileName = yield QiniuFileUtils.md5(imageFile.path);
    let dir = TARGET_DIR + accountId + '/';
    let key = dir + md5FileName;
    let uploadFile = yield ImageUploadFile.findOne({ account: accountId, key: key });
    if (!uploadFile) {
        let category;
        if(categoryId && categoryId !== 'ALL' && categoryId !== 'NO_CATEGORY') {
            category = yield ImageCategory.findOne({_id: categoryId, account: accountId});
        }

        let result = yield QiniuFileUtils.uploadLocalFile({
            localFilePath: imageFile.path,
            targetDir: dir,
            targetFileName: md5FileName,
            forceUpload: true
        });
        if(result != key) {
            console.error('upload error', result, key);
            return null;
        }
        let stat = yield QiniuFileUtils.stat(key);

        uploadFile = new ImageUploadFile({
            account: accountId,
            name: imageFile.filename,
            category: category && category.id,
            key: key,
            size: stat.fsize,
            mimeType: stat.mimeType
        });
        yield uploadFile.save();
        if(category) {
            yield category.update({$inc: {imageCount: 1}});
        }
    }
    return uploadFile;
}

function * download(url) {
    if(!url) {
        throw Error('download url not found');
    }
    let tempFileName = IDUtils.md5ByString(url);
    let filePath = path.join(os.tmpdir(), tempFileName + '.' + QiniuFileUtils.getFix(url));
    yield new Promise((rl, rj) => {
        let stream = fs.createWriteStream(filePath);
        stream.on('finish',function(){
            rl();
        });
        console.log('image download', url);
        //@TODO 过大的图片不应该下载
        rp.get(url).on('error', function (err) {
            rj(err);
        }).pipe(stream);
    });
    return {
        path: filePath,
        filename: tempFileName
    };
}

function * findImageUploadFile(accountId, url) {
    if(!url || _.trim(url).length == 0) {
        return null;
    }
    let uploadFile;
    let dir = TARGET_DIR + accountId + '/';
    if(url.indexOf(EDITOR_IMAGE_HOST + '/' + dir)) {
        let arr = url.split('/');
        let filename = arr[arr.length - 1];
        let key = dir + filename;
        uploadFile = yield ImageUploadFile.findOne({account: accountId, key: key});
    }

    if(!uploadFile) {
        uploadFile = yield ImageUploadFile.findOne({account: accountId, originUrl: url});
    }

    return uploadFile;
}

module.exports = {
    TARGET_DIR,
    EDITOR_IMAGE_HOST,
    upload,
    download,
    findImageUploadFile
};
