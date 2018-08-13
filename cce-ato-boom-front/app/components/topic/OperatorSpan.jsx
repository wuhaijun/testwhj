'use strict';
import React, { Component, PropTypes } from 'react';

export default class OperatorSpan extends Component {

    render() {
        return (
            <span className="card-operator pull-right">
                <a><i onClick={this.props.onDel} className="fa fa-minus fa-1x pull-right"/></a>
                <a><i onClick={this.props.onEdit} className="fa fa-pencil fa-1x pull-right"/></a>
            </span>
        )
    }
}

OperatorSpan.propTypes = {
    // onEdit: PropTypes.string.isRequired,
    // onDel: PropTypes.string.isRequired
};