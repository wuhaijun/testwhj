'use strict';
import Component from './Component';

export default class extends Component {

    constructor(props) {
        super(props);
        this.rendered();



    }

    __loadTypes__ = callback => {
        $.getJSON('/wechat/list', json => {
            if (json.status) {
                window.account = json.account;
                let results = json.results;
                callback(results);
            }
        });
    };

    rendered() {
        let $ul = this.find(".menu").children('ul');
        this.__loadTypes__(results => {
            results.forEach(it => {
                let $li_1 = $(`<li><a href="javascript:void(0);"><span>${ it.name }</span></a></li>`).appendTo($ul);
                $li_1.children('a').click((e) => {
                    e.stopPropagation();
                    $li_1.children('ul').slideToggle();
                });

                if (it.brands && it.brands.length != 0) {
                    let $subUl = $('<ul></ul>').appendTo($li_1);
                    it.brands.forEach(brand => {
                        if (brand && brand._id) {
                            let $li_2 = $(`<li><a href="#${ it._id }"><span>${brand.name}</span></a></li>`).appendTo($subUl);
                            $li_2.children('a').click((e) => {
                                e.stopPropagation();
                                $li_2.children('ul').slideToggle();
                            });
                            if (brand.wechatAccounts && brand.wechatAccounts.length != 0) {
                                let $thirdUl = $('<ul></ul>').appendTo($li_2);
                                brand.wechatAccounts.forEach(wechatAccount => {
                                    let $li_3 = $(`<li><a href="javascript:void(0);"><i class="fa fa-weixin"></i><span class="wechat-name">${ wechatAccount.name }</span><i class="icon-right fa fa-angle-double-right"></i></a></li>`).appendTo($thirdUl);
                                    $li_3.click(() => {
                                        $li_3.children('a').addClass("active").parent().siblings().children("a").removeClass("active");
                                        $li_3.parent().parent().siblings().children("ul").children("li").children("a").removeClass("active");
                                        window.router.go('/' + wechatAccount._id);
                                    });
                                });
                            }
                        }
                    });
                }
            });
        });
/*
            setTimeout(()=>{
                $(".menu").children().children().children("ul").children("li").first().children("ul").children("li").first().click();
            },10);*/

    }

    render() {
        return $(`
        <div class="left-side-bar">
            <div class="brand">
                <a id="brand-logo" class="brand-logo" href="javascript:void(0);">
                    <img src="http://boom-static.static.cceato.com/boom/imgs/sidebar-logo-white.png">
                </a>
                <i class="beta">beta 2.0</i>
            </div>
            <div class="tool-name">排期工具</div>
            <div class="navigation">
                 <div class="company">
                    <div class="menu">
                        <ul>
                        </ul>
                    </div>
                 </div>
            </div>
        </div>`);
    }
}