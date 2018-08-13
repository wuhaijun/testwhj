'use strict';
import Component from './../Component';
import upload from '../../utils/upload';
import loginUtils from '../../utils/loginUtils';
import Modal from '../common/Modal';
import Preview from './Preview';
import SyncManagement from '../article/SyncManagement';


export default class extends Component {
    constructor(props){
        super(props);
        this.syncToolBar = new SyncManagement({ columenEditor : this.parent});
        this.modal = new Modal({id: 'previewModal'});

        this.rendered();
    }

    changeReadTime = (textCount,imageCount,readTime) => {
        this.find('.text-count').text(textCount);
        this.find('.image-count').text(imageCount);
        this.find('.time-count').text(readTime);
    };

    rendered = () => {

        this.find('.save').click(() => {
            if(!loginUtils.checkAlert())return;
            this.parent.save(() => {

            });
        });

        this.find('.preview').click(() => {
            if(!loginUtils.checkAlert())return;
            this.parent.save(() => {
                if(!!this.parent.getCoverImg()){
                    this.modal.$body = new Preview({parent: this});
                    this.modal.open();
                }else{
                    alert('没有封面图');
                }
            });
        });

        this.find('.clear').click(() => {
            this.parent.clear();
        });

        this.find('.new').click(() => {
            this.parent.deepClear();
        });

        this.find('.copy').click(() => {
            this.parent.copy('#copy-all');
            gtag('event','Copy',{
                'event_category':'Article',
                'event_action':'Copy'
            });
        });

        let $SyncBtn = this.find('.sync');
        $SyncBtn.append(this.syncToolBar);

        //let countObject = this.parent.editor.getReadTime();
       // this.changeReadTime(countObject.textCount,countObject.imageCount,countObject.readTime)

    };

    render() {
        return $(`
            <div class="col-editor-operator">
                <span class="btn save">保存</span>
                <span class="btn preview">预览</span>
                <span class="btn sync"></span>
                <span id="copy-all" class="btn copy">全文复制</span>
                <span class="btn new">新建</span>
                <div class="count-wrap">
                        <span class="read-count">
                                 正文共<span class="text-count"></span>字<span class="image-count"></span>图
                        </span>

                        <span class="read-time">
                                 预计阅读<span class="time-count"></span>分钟
                        </span>
                </div>
            </div>`
        );
    }
}