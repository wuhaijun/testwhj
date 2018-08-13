import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        const divStyle = {
            margin:'30%',
            marginTop:'10%',
            textAlign:'left'
        };

        return (
                <div style={divStyle} >
                    <div>若没有收到校验邮件，可<a href="javascript:void(0);" onClick={this.props.handleSendRegisterEmail}>重新发送验证邮件</a>。</div>
                    {/*<div>2.验证完成，<a href="/user/login">登录</a>。</div>*/}
                </div>
        )
    }
}
