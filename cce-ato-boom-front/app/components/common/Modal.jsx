'use strict';

import Spinner from './Spinner.jsx';
import React, {Component} from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class Modal extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let props = this.props;
        if(!props.show || props.show != 'none') {
            $('body').addClass('modal-open');
        }
    }

    componentWillUnmount() {
        $('body').removeClass('modal-open');
    }

    goBack(event) {
        if(event.target == event.currentTarget) {
            let props = this.props;
            if(props.goBackUrl) {
                this.refs.closeModalBtn.handleClick(event);
            }else {
                props.goBackCall();
            }
        }
    }

    render() {
        let props = this.props;
        let isRight = props.side !== 'left';
        let sideClass = isRight?'closeOnLeft':'closeOnRight';
        let closeBtn = <button className={"closeBtn " + sideClass} type="button" onClick={props.goBackCall}>×</button>;
        if(props.goBackUrl) {
            closeBtn = (
                <Link ref='closeModalBtn' to={props.goBackUrl}>
                    {closeBtn}
                </Link>
            );
        }

        let style = {};

        let loading = props.loading || false;

        return (
            <div className="modal" style={{display:props.show?props.show:'block',height:'100%'}} onClick={this.goBack.bind(this)}>
                <div ref="dialog" className={'modal-dialog boom-modal ' + (props.dialogClass? props.dialogClass:'')} style={style} onClick={this.goBack.bind(this)}>
                    {
                        props.closable && closeBtn
                    }
                    <div ref="content" className={"modal-content scrollable modal-content-" + (isRight?'right':'left')}>
                        {loading? <Spinner/> : props.children}
                    </div>
                </div>
            </div>
        );
    }
}

