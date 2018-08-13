'use strict';

import React from 'react';
import Header from './Header.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { account: {  } };
    }

    componentDidMount() {
        $.get('/api/getUserInfo', json => {
            this.setState({ account: json.account });
        });
    }

    render () {
        return (
            <div>
                <Header account={ this.state.account } />
                { this.props.children }
            </div>
        );
    }
}