'use strict';

import ProgressBar from './../progress_bar/ProgressBar.jsx';
import React from 'react';

const steps = ['发送验证邮件', '填写新密码', '完成'];

export default class RowProgressBar extends React.Component {
    render() {
        return (
            <div className="row progress-bar">
                <div className="col-sm-9">
                    <ProgressBar steps={ steps } current={ this.props.current }/>
                </div>
            </div>
        );
    }
};