'use strict';

import React, { Component } from 'react';

const styles = {
    modaldialog: {
        minHeight: '100%',
        minWidth: '98%',
        height: '100%',
        margin: '10px'
    },
    modalcontent: {
        minHeight: '100%',
        minWidth: '100%'
    },
    modalbody: {
        height: '100%'
    },
    iframestyle: {
        minHeight: '100%',
        minWidth: '100%',
        frameborder: '0',
        border: '0'
    },
    closeBtn: {
        display: 'block',
        paddingRight: '10px'
    }
};

export default class UserCenterBindWeChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wechatUrl: '',
            iFrameHeight: '700px',
            bindUserInfo: []
        };
    }

    componentDidMount() {
        this.getGrantList();
    }

    getGrantList() {
        $.get('/wechat/grant/list', json => {
            this.setState({bindUserInfo: json});
        });
    }

    deleteUserInfo(id) {
        if(confirm('是否确认删除授权的公众号?')){
            $.get('/wechat/grant/remove/' + id, json => {
                if (json.status) {
                    this.getGrantList();
                }
            });
        }
    }


    closeModle() {
        $.get('/wechat/prebind').done(json => {
            if (!!json.url) {
                this.setState({wechatUrl: json.url});
                $('#bindModal').modal('show');
            } else {
                $('#bindModal').modal('hide');
                $(".new-wechat").css("background-color", "#999");
                alert(json.errormsg)
            }
        });
    }

    render() {
        return (
            <div className="main_right wechat-main">
                <div  >
                    <p className="loginaccount ">编辑器授权的帐号</p>
                </div>
                <div className="form-horizontal info-group">
                    <div className="row bind-third">
                        <div className="col-sm-12">
                            <a href="javascript:;" className="new-wechat" data-toggle="modal"
                               onClick={this.closeModle.bind(this)}>
                                <i className="fa fa-weixin"></i>
                                <span>微信授权新的公众号</span>
                            </a>

                            <div className="modal fade" id="bindModal" tabIndex="-1" role="dialog"
                                 aria-labelledby="myModalLabel" aria-hidden="true">
                                <div className="modal-dialog" style={ styles.modaldialog }>
                                    <div className="modal-content" style={styles.modalcontent}>
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true"
                                                id="closeBtn" style={styles.closeBtn}>&times;</button>
                                        <div className="modal-body" style={styles.modalbody}>
                                            <iframe height={this.state.iFrameHeight} style={styles.iframestyle}
                                                    src={this.state.wechatUrl}></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <hr/>
                </div>
                <div className="wechat-content form-horizontal info-group">
                    {this.state.bindUserInfo.map((item, index) => {
                        return <div key={index}>
                            <img src={item.head_img}/>
                            <span>{item.nick_name}</span>
                            <i className="fa fa-times" onClick={this.deleteUserInfo.bind(this,item._id)}></i>
                        </div>
                    })}
                </div>
            </div>
        );
    }
}