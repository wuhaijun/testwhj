'use strict';

import React, { Component, PropTypes } from 'react';
import './banner.less';

export default class Slider extends Component {

    handleOnClick = () => {
        this.props.onClick && this.props.onClick();
    };

    render() {
        let { image, onClick } = this.props;
        return (
            <li className={ onClick ? "pointer": "" } key={ image } onClick={ this.handleOnClick }>
                <img src={ image } />
                <div className={ this.props.children ? "inner": "" }>
                    { this.props.children }
                </div>
            </li>
        );
    }
};

Slider.propTypes = {
    image: PropTypes.string.isRequired,
    onClick: PropTypes.func
};