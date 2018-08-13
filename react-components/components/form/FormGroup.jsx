'use strict';
import React, { Component, PropTypes } from 'react';

export default class FormGroup extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '' };
    }

    validate = () => {
        React.Children.map(this.props.children, child => {
            console.log(child.ref);
            console.log(this.refs);
            console.log(child.props.name, this.refs[child.ref].val);
        });
    };

    render() {
        return (
            <div className="container-fluid form-group">
                { this.props.children }
                <a href="javascript:;" onClick={ this.validate } >XXOO</a>
            </div>
        );
    }
};

FormGroup.propTypes = {

};