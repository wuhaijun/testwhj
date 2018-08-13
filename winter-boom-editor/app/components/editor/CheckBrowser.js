'use strict';

import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);
        if(window.screen.width > 700) {
            this.rendered();
        }
    }

    rendered = () => {
        this.find(".closeBtn").click(() => {
            this.parent.modal.close();
        });

    };

    render() {
        return $(`
            <div class="alert-warp">

                 <div class="alert-head">
                        <span>温馨提示</span>
                        <i class="closeBtn fa fa-times"></i>
                 </div>

                 <div class="alert-body">
                        <p class="text-tips">
                            很抱歉，脑洞编辑器在此浏览器下存在部分兼容问题，为保证您正常的使用体验，建议使用Chrome（谷歌）浏览器。
                        </p>
                        <div class="text">
                                <img class="img" src="../../../static/images/Google_logo.jpg" alt="">
                                <p class="">下载Chrome浏览器</p>

                        </div>
                        <ul>
                            <li>
                                <a target="view_window" href="http://sw.bos.baidu.com/sw-search-sp/software/fc14f1545b7/ChromeStandalone_51.0.2704.106_Setup.exe ">
                                    <img src="../../../static/images/windows_logo.png" alt="">
                                    <p>下载windows版本</p>
                                </a>
                            </li>

                            <li>
                                <a target="view_window" href="http://sw.bos.baidu.com/sw-search-sp/software/441142fc7c4/googlechrome_mac_50.0.2661.102.dmg">
                                     <img src="../../../static/images/mac_logo.png " alt="">
                                     <p>下载Mac版本</p>
                                </a>
                            </li>
                        </ul>
                        
                 </div>

            </div>
        `);
    }
}
