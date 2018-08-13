'use strict';

import React, { Component, PropTypes } from 'react'
import MsgSpan from './MsgSpan.jsx';

export default class RowSubmit extends Component {

    constructor(props) {
        super(props);
        this.state = { validated: false };
    }

    handleClick = e => {
        let name = '';
        let $this = $(e.target);
        this.props.onSubmit(() => {

            name = $this.html();
            let loadingText = $this.attr('data-loading-text');
            $this.html(loadingText);
            $this.attr('disabled', true);

        }, () => {
            $this.removeAttr('disabled');
            $this.html(name);
        });

        this.setState({ validated: true });
    };

    render() {
        return (
            <div className="row submit">
                <div className={ this.props.btnClassName || "col-sm-3" }>
                    <button type="button" className="btn btn-primary btn-block user-btn-register"
                            onClick={ this.handleClick }
                            disabled={ !this.props.argeed }
                            data-loading-text={'<i class="fa fa-spinner fa-spin" />    ' + (this.props.loadingName || this.props.name )}>{ this.props.name }</button>
                </div>
                <MsgSpan msg={ this.props.msg } validated={ this.state.validated } />

            </div>
        );
    }
};

RowSubmit.propTypes = {
    msg: PropTypes.string,
    name: PropTypes.string.isRequired,
    loadingName: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};