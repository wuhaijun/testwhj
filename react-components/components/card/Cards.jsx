'use strict';

import React, { Component, PropTypes } from 'react';

export default class Cards extends Component {
    componentDidMount() {
        let rowCols = this.props.rowCols;
        if (rowCols) {
            let $this = $(this.refs.__this__);

            let margin_left_right = 0.5;
            let sum_margin = rowCols * 2 * margin_left_right;
            $this.find('.react-component-card').css('width', ((100-sum_margin) / rowCols) + '%');
            $this.find('.react-component-card').css('margin', `10px ${ margin_left_right }%`);
        }
    }

    render() {
        return (
            <div ref="__this__" className="react-component-cards">
                { this.props.children }
            </div>
        );
    }
}

Cards.propTypes = {
    rowCols:PropTypes.oneOf([1, 2, 3, 4, 5, 6])
};