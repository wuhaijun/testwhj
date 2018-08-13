'use strict';

import React, { Component, PropTypes } from 'react';
import './row-input.less';

const defaultValidateRegex = {
    'email': {
        regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        msg: '邮箱格式不正确!'
    },
    'url': {
        regex: /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
        msg: '链接格式不正确!'
    },
    'phone': {
        regex: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
        msg: '电话号码格式不正确, 形如: 13333333333; 021-00000000, 0851-0000000'
    },
    'password': {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[\d\D]{6,}$/,
        msg: '密码格式不正确, 至少包含一个数字和一个字母, 且长度不少于6位'
    }
};

const MsgSpan = class extends Component {
    render() {
        const { msg, validated } = this.props;
        return (
            <span>
                {
                    validated && msg &&
                    <i className="fa fa-times-circle" aria-hidden="true"/>
                }
                {
                    validated && !msg &&
                    <i className="fa fa-check-circle" aria-hidden="true"/>
                }
                { msg }
            </span>
        );
    }
};

export default class RowInput extends Component {
    constructor(props) {
        super(props);
        this.state = { msg: '', validated: false };

        let name = props.name;
        this.__defineGetter__('val', () => {
            return this.refs[name].value;
        });
    }

    validate = () => {
        let value = this.refs[this.props.name].value;
        value = (value && value.trim()) || '';

        this.setState({ validated: true });

        const {
            isEquals,
            isRequired,
            validateRegex,
            isEmail,
            isUrl,
            isPhone,
            isPassword,
            validateMsg } = this.props;

        // 1. is equals
        if (isEquals !== null &&
            isEquals !== undefined &&
            isEquals !== '' &&
            isEquals !== value) {

            let msg = validateMsg || '字段值不正确!';
            this.setState({ msg: msg });
            return false;
        }

        // 2. is required
        let msg_prefix =
            isEmail === true ? '邮箱地址' :
                isUrl === true ? '链接地址' :
                    isPhone === true ? '电话号码' :
                        isPassword === true ? '密码' : '该字段';
        if (isRequired === true && value === '') {
            let msg = validateMsg || ( msg_prefix + '不能为空!');
            this.setState({ msg: msg });
            return false;
        }

        // 3. regex
        if (validateRegex !== null
            && validateRegex !== undefined
            && validateRegex !== '') {

            let regex = validateRegex instanceof RegExp ? validateRegex : new RegExp(validateRegex);
            if (value !== '' && !regex.test(value)) {
                let msg = validateMsg || '该字段格式不正确!';
                this.setState({ msg: msg });
                return false;
            }
        }

        // 4. is a default regex
        let default_regex =
            isEmail ? 'email' :
                isUrl ? 'url' :
                    isPhone ? 'phone' :
                        isPassword ? 'password' : '';

        if (default_regex !== '') {
            let regex = defaultValidateRegex[default_regex];
            if (value !== '' && !regex['regex'].test(value)) {
                let msg = validateMsg || regex['msg'];
                this.setState({ msg: msg });
                return false;
            }
        }

        this.setState({ msg: '' });
        return true;
    };

    __handleBlur__ = e => {
        if (this.props.ignoreValidate !== true) {
            this.validate();
        }
    };

    __handleChange__ = e => {

    };

    handleEvent = (name, defaultFunc) => {
        return e => {

            // 1. execute default func
            if (defaultFunc && typeof defaultFunc === 'function') {
                defaultFunc(e);
            }

            // 2. execute props's bound event
            let onEvent = this.props[name];
            if (onEvent && typeof onEvent === 'function') {
                onEvent(e);
            }
        };
    };

    render() {

        const {
            name,
            value,
            type,
            label,
            labelClassName,
            inputClassName,
            placeholder } = this.props;

        return (
            <div className="react-component-input row">
                {
                    label &&
                    <label
                        className={ 'control-label col-xs-3 col-sm-3 col-md-2 col-lg-1 ' + (labelClassName || '') }>{ label }</label>
                }
                <div className={ 'col-xs-8 col-sm-8 col-md-6 col-lg-4 ' + (inputClassName || '')}>
                    { this.props.children }
                    <input name={ name }
                           ref={ name }
                           value={ value }
                           onBlur={ this.handleEvent('onBlur', this.__handleBlur__) }
                           onChange={ this.handleEvent('onChange', this.__handleChange__) }
                           type={ type || 'text' }
                           placeholder={ placeholder } />
                </div>
                <div className="msg ">
                    <MsgSpan msg={ this.state.msg } validated={ this.state.validated }/>
                </div>
            </div>
        );
    }
};

RowInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,

    isRequired: PropTypes.bool,
    isEmail: PropTypes.bool,
    isPhone: PropTypes.bool,
    isUrl: PropTypes.bool,
    isPassword: PropTypes.bool,
    isEquals: PropTypes.string,
    validateRegex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp)
    ]),
    validateMsg: PropTypes.string,
    ignoreValidate: PropTypes.bool,

    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

MsgSpan.propTypes = {
    msg: PropTypes.string,
    validated: PropTypes.bool.isRequired
};