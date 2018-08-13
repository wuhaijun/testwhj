'use strict';
import upload from '../utils/upload';


export default function(categoryId, multiple, success = () => {}, error = () => {}) {
    upload({
        name: 'image',
        url: () => ('/upload/image/'),
        multiple: multiple,
        success: (keys, files) => {

            let indexArr = [];
            if(keys.indexOf('error') != -1){
                keys.forEach((key,index) => {
                    if(key == "error"){
                        indexArr.push(index);
                    }
                });
                indexArr.forEach((key,index) => {
                    //files[key].originFilename;
                });
                this.message.warn('有'+indexArr.length+'张图片上传失败!');
            }

            success(keys);
        },
        error: () => {
            this.message.warn('图片上传失败!');
            error();
        }
    }).click({ categoryId: categoryId });
}