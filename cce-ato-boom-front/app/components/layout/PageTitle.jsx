'use strict';

import React, { Component, PropTypes} from 'react';

export default class PageTitle extends Component {

    __isString__ = val => {
        return Object.prototype.toString.call(val) === '[object String]';
    };

    render() {
        let title = this.props.title;
        return(
            <div className="page-title">
                <div className="title">{ this.__isString__(title) ? title: title.join(', ') }</div>
            </div>
        );
    }

}

PageTitle.propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired
};