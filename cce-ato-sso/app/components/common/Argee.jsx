'use strict';

import React, { Component, PropTypes } from 'react';
const {event, CATEGORYS, ACTIONS} = require('../../../common/TrackUtils.js');


export default class Argee extends Component {
    constructor(props) {
        super(props);
    }
    handleClick () {
        this.props.onArgee(!this.props.argeed);
    };

   
    render () {
        return (
            <div className="row uesr-register-argee">
                <div className="col-sm-3 uesr-register-argee-div">
                    <input type="checkbox" checked={ this.props.argeed } onClick={this.handleClick.bind(this)}/>
                    <p className="uesr-register-argee-p">
                        我已阅读并同意脑洞
                        <a className="uesr-register-argee-span" 
                            href="/public/views/agree.html" 
                            target="_blank">用户协议和版权申明
                        </a>
                    </p>
                </div>
            </div>
        )
    }
}



