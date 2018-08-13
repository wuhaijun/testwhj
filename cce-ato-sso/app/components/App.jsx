'use strict';

import React, { Component } from 'react';
import Header from './common/Header.jsx';

export default class App extends Component {
    render () {
        return (
            <div className="container-fluid main">
                <Header />
                { this.props.children }
            </div>
        );
    }
}
