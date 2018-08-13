'use strict';

import React, { Component, PropTypes } from 'react';

export default class MsgSpan extends Component {

    render() {
        const { msg, validated } = this.props;
        return (
            <span className="msg" title={msg}>
                {
                    validated && msg &&
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                }
                {
                    validated && !msg &&
                    <i className="fa fa-check-circle" aria-hidden="true"/>
                }
                { msg }
            </span>
        );
    }
};

MsgSpan.propTypes = {
    msg: PropTypes.string,
    validated: PropTypes.bool.isRequired
};