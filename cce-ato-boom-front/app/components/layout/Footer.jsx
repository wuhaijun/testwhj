'use strict';
const React = require('react');
const {event, CATEGORYS, ACTIONS} = require('../../../common/TrackUtils');

class Footer extends React.Component {

    up(e) {
        event(CATEGORYS.BUTTONS, ACTIONS.SCROLL_UP, 'footer right', $('html').scrollTop());
        e.preventDefault();
        e.stopPropagation();
        $('html,body').stop().animate({
            scrollTop: $('body').offset().top
        }, 500);
        $('.content-list-scroll-top').animate({
            scrollTop: $('.content-list-scroll-top').offset().top - 100
        }, 500);
        return false;
    }

    feedback() {
        event(CATEGORYS.BUTTONS, ACTIONS.FEEDBACK, 'footer right');
    }

    render() {
        return (
            <div className="fixed-tools">
                <a className="scroll-up" onClick={this.up} href="javascript:;">
                    <i className="fa fa-chevron-up"/>
                </a>

                <a className="to-feedback" onClick={this.feedback} href="/feedback/brainboom" target="_blank">
                    <i className="fa fa-commenting"/>
                </a>
            </div>
        )
    }
}

module.exports = Footer;