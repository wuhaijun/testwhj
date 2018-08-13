'use strict';

import React, {Component} from 'react';

export default class ErrorPromptCard extends Component {

    render() {
        return (
            <div className="error-prompt-card">
                {
                    this.props.message && <em> { this.props.message } </em>
                }
            </div>
        );
    }

}