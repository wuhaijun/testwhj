'use strict';

import React, { Component } from 'react';
import RowLogo from './../common/RowLogo';

export default class UserContainer extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="column user-container">
                <RowLogo />
                { this.props.children }
            </div>
        );
    }
}
