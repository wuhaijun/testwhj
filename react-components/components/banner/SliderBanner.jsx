'use strict';

import React, { Component, PropTypes } from 'react';
import Slider from './Slider.jsx';

import '../../public/vendor/unslider/dist/js/unslider-min.js';
import '../../public/vendor/unslider/dist/css/unslider.css';
import '../../public/vendor/unslider/dist/css/unslider-dots.css';
import './banner.less';

export default class SliderBanner extends Component {

    __set__ = (name, value) => {
        let _this_ = this.refs._this_;
        if (value != undefined && value != '' && value.trim() != '') {
            $(_this_).parent('.unslider').css(name, value);
        }
    };

    componentDidMount() {
        let _this_ = this.refs._this_;
        $(_this_).unslider({
            autoplay: true,
            fluid: true,
            dots: true,
            delay: 5000,
            speed: 1000,
            arrows: {
                prev: '<a class="unslider-arrow prev"><i class="fa fa-chevron-left fa-2x" /></a>',
                next: '<a class="unslider-arrow next"><i class="fa fa-chevron-right fa-2x" /></a>'
            }
        });
        let { width, height } = this.props;
        this.__set__('width', width);
        this.__set__('height', height);
    }

    render() {
        return (
            <div ref="_this_" className="react-component-banner">
                <ul>{ this.props.children }</ul>
            </div>
        );
    }
};

SliderBanner.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string
};