'use strict';

import React, {Component, PropTypes} from 'react';
import RowInput from '../common/RowInput.jsx';
import RowSubmit from '../common/RowSubmit.jsx';
import AvatarModal from './AvatarModal.jsx';
import Jobs from '../../../common/job.js';
import Address from '../../../common/address.js';

export default class UserCenterInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {msg: '',agreed: true};
    }

    handleChange = e => {
        this.props.onChangeUserInfo(e);
    };

    handleSubmit = (savingCallback, savedCallback) => {
        let nv = this.refs.nickname.validate();
        let jv = true;
        let pv = this.refs.phone.validate();
        let bv = this.refs.birthday.validate();
        let av = true;
        if (!nv || !jv || !pv || !bv || !av) 
            return;
        savingCallback();
        let account = this.props.account;
        console.log(account);
        $.post('/api/userCenter/updateUserInfo', {
            account
        }, json => {
            savedCallback();
            this.setState({msg: json.message});

            if (json.status) {
                location.href = '/userCenter';
            } else {}
        });
    };

    handleSubmitAvatar = url => {
        this.props.onSubmitAvatar(url);
    };

    render() {
        let account = this.props.account;
        let typeJobs = Jobs.map(type => <option key={type._id} value={type.name}>{type.name}</option> );
        let typeAddress = Address.map(type => <option key={type._id} value={type.name}>{type.name}</option> );
        return (
            <div className="main_right">
                <div>
                    <p className="perinfo loginaccount">个人信息</p > 
                </div> 
                < div className = "" ></div>
                <div className="form-horizontal info-group" role="form"></div>
                <div className="form-group row">
                    <label className="control-label col-sm-3 col-lg-2 avatar-label">头像</label>
                    <div className="col-sm-8">
                        <div>
                            <img
                                data-toggle="modal"
                                data-target="#avatarModal"
                                className="img_2 img-circle"
                                src={'http://boom-static.static.cceato.com/boom/imgs/avatars/' + (account.avatar || '01.png')}/>
                            <a href="javascript:;" data-toggle="modal" data-target="#avatarModal">更换头像</a>
                            <AvatarModal onSubmitAvatar={this.handleSubmitAvatar}/>
                        </div>
                    </div>
                </div>

                <RowInput
                    onChange={this.handleChange}
                    ref="nickname"
                    name="nickname"
                    value={account.nickname}
                    label="姓名"
                    inputClassName="col-sm-8"
                    labelClassName="col-sm-3"/> 

                <div className="row job">
                    <label className="control-label col-sm-3">职位</label>
                    <div className="user-pos col-sm-8">
                        <span className="user-triangle"></span>
                        <select className="form-contorl user-select-dropdown " ref="job" name="job" id="" value={account.job} onChange={this.handleChange.bind(this)}>
                            {typeJobs}
                        </select>
                    </div>
                </div>     
                
                <RowInput
                    onChange={this.handleChange}
                    ref="phone"
                    name="phone"
                    value={account.phone}
                    isPhone
                    label="联系电话"
                    inputClassName="col-sm-8"
                    labelClassName="col-sm-3"/>

                <RowInput
                    onChange={this.handleChange}
                    ref="birthday"
                    name="birthday"
                    value={account.birthday}
                    validateRegex="^\d{4}\-(0?[1-9]|1[0-2])(\-(0?[1-9]|[1-2][0-9]|3[0-1]))?$"
                    validateMsg="格式形如: 1988-08-08 或 1988-08"
                    label="生日"
                    inputClassName="col-sm-8"
                    labelClassName="col-sm-3"
                    placeholder="1988-08-08"/>

                <div className="row address">
                    <label className="control-label col-sm-3">所在地</label>
                    <div className="user-pos col-sm-8">
                        <span className="user-triangle"></span>
                        <select className="form-contorl user-select-dropdown user-btn-register" ref="address" name="address" id="" value={account.address} onChange={this.handleChange.bind(this)}>
                            {typeAddress}
                        </select>
                    </div>
                </div>
                
                <RowSubmit
                    btnClassName="btn-classname"
                    onSubmit={this.handleSubmit}
                    name="保存"
                    argeed = { this.state.agreed }
                    msg={this.state.msg}/>
            </div >);
        }
    }

    UserCenterInfo.propTypes = {
        account: PropTypes.object,
        onChangeUserInfo: PropTypes.func,
        onSubmitAvatar: PropTypes.func
    };
