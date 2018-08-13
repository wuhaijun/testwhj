'use strict';
import React, { Component, PropTypes } from 'react';
import ErrorPromptCard from './ErrorPromptCard.jsx';

import _ from 'lodash';
import $ from 'jquery';

export default class TopicCreateCard extends Component {

    constructor(props) {
        super(props);
        this.state = {message: '', value: ''};
    }

    handleChange(e) {
        let value = e.target.value;
        //if (value && value.trim())
            this.setState({message: '', value: value});
    }

    handleOnNewTopic() {
        let value = this.state.value;
        if (value && value.trim()) {
            this.props.onNewTopic(value);
            this.setState({value: '', message: ''});
            $(this.refs.closeBtn).click();
        } else
            this.setState({message: 'topic名称不能为空!'});
    }

    render() {
        return (
            <div className="card card-topic card-topic-create">
                <div className="card-header">
                    创建新的分类
                </div>
                <div className="card-block">
                    <input value={ this.state.value } onChange={ this.handleChange.bind(this) }/>
                    <button ref="closeBtn" type="button" className="hidden" data-dismiss="modal">X</button>
                    <button type="button" className="btn btn-sm" onClick={this.handleOnNewTopic.bind(this)}>
                        新 建
                    </button>
                </div>
                <ErrorPromptCard message={ this.state.message } />
            </div>
        )
    }
}

TopicCreateCard.propTypes = {
    onNewTopic: PropTypes.func.isRequired
};