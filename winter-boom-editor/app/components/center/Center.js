'use strict';
import Component from '../Component';
import CenterHeader from './CenterHeader';
import CenterList from './CenterList';
import Header from '../Header';

export default class extends Component {

    constructor(props) {
        super(props);
        this.centerHeader = null;
        this.centerList = null;
        this.rendered();
    }

    up(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).stop().animate({
            scrollTop: $(this).offset().top
        }, 500);
        return false;
    }

    rendered() {
        let $comp = this;
        this.prepend(new Header());
        this.find('.center-bottom').hide();
        this.centerHeader = new CenterHeader({ parent: this });
        this.find('.gather').append(this.centerHeader);

        this.centerList = new CenterList({ parent: this });
        this.find('.cards').append(this.centerList);

        this.find('.scroll-up').on('click', (e) => {
            this.up(e);
        });

        $comp.height($(window).height());
        $(window).resize(function() {
            $comp.height($(this).height());
        });
        this.__scrollRequestMore__();
    }


    __scrollRequestMore__() {
        let $comp = this;
        let $centerList = this.centerList;
        let $cards = this.find('.cards');
        this.scroll(function () {
            let scrollTop = Math.ceil($(this).scrollTop());
            let scrollHeight = $cards.height();
            let windowHeight = $(window).height();
            if ((scrollHeight - 240) < (scrollTop + windowHeight) ) {
                if ($centerList.total <= $centerList.skip) {
                    $comp.find('.center-bottom').show();
                    return;
                }
                if ($centerList.canScroll) {
                    $centerList.loadStyle({
                        type: $comp.centerHeader.type,
                        keywords: $comp.centerHeader.keywords,
                        skip: $centerList.skip,
                        limit: $centerList.limit
                    }, false);
                    $centerList.skip += $centerList.limit
                }
            }
        });
    }

    render() {
        return $(`
            <div style="overflow:scroll">
                <div class="gather">
                </div>
                <section class="cards">
                </section>
                <div class="center-bottom">______________你，发现了样式的尽头______________</div>
                <div class="center-fixed-tools">
                <a class="scroll-up" href="javascript:;">
                    <i class="fa fa-chevron-up"/>
                </a>
                </div>
                <!--<div class="search-result"></div>-->
            </div>
        `);
    }
}