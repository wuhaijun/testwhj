'use strict';

import React, { Component, PropTypes } from 'react';
import Feed from './Feed.jsx';
import DeletePromptModal from './DeletePromptModal.jsx';
import UpdateTopicModal from './UpdateTopicModal.jsx';
import { ModalContainerWrapper } from './ModalContainerWrapper.jsx';
import OperatorSpan from './OperatorSpan.jsx';
import {confirm, input} from '../../../common/AlertUtils';
import OperatorModal from './OperatorModal.jsx';

import _ from 'lodash';

class Topic extends Component {

    constructor() {
        super();
        this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
        this.handleUpdateTopic = this.handleUpdateTopic.bind(this);
        this.handleDeleteSubscribe = this.handleDeleteSubscribe.bind(this);
        this.handleUpdateFeed = this.handleUpdateFeed.bind(this);
    }

    handleDeleteTopic() {
        const { topic, onDeleteTopic} = this.props;
        confirm({
            title: "是否确认删除",
            confirmButtonText: "残忍删除",
            cancelButtonText: "还是算了",
            callback: function () {
                swal("成功删除!");
                onDeleteTopic(topic);
            }
        });
    }

    handleUpdateTopic(name) {
        let { topic, onUpdateTopic} = this.props;
        input({
            title: '更新',
            inputValue: topic.name,
            callback: function (inputValue) {
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === '') {
                    swal.showInputError('请输入内容');
                    return false;
                }
                if (inputValue != topic.name) {
                    onUpdateTopic(topic._id, inputValue);
                }
                swal('更新成功');
            }
        });
    }

    handleUpdateFeed(feedId, name) {
        const { topic, onUpdateFeed } = this.props;
        onUpdateFeed(topic._id, feedId, name);
    }

    handleDeleteSubscribe(feed) {
        const { topic, onDeleteSubscribe} = this.props;
        onDeleteSubscribe(topic, feed);
    }

    render() {
        const { topic, wrapperData } = this.props;

        let subscribes = _.map(topic.subList, f => (
            <Feed feed={f} onUpdateFeed={ this.handleUpdateFeed} onDeleteSubscribe={this.handleDeleteSubscribe} key={f._id}/>
        ));

        return (
            <div key={'topic_' + topic._id} rel={topic._id} className="col-sm-6 topic-sm">
                <div className="card card-topic">
                    <div className="card-header"
                         onMouseEnter={ wrapperData.handleMouseEnter }
                         onMouseLeave={ wrapperData.handleMouseLeave } >
                        {topic.name }
                        {
                            wrapperData.state.mouseEnter &&
                            <OperatorSpan
                                onEdit={this.handleUpdateTopic}
                                onDel={this.handleDeleteTopic}
                            />
                        }
                    </div>
                    <div className="card-block">
                        <ul rel={topic._id} className="sortable-list connectedSortable">
                            { subscribes }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

Topic.propTypes = {
    topic: PropTypes.object.isRequired,
    onDeleteSubscribe: PropTypes.func.isRequired,
    onDeleteTopic: PropTypes.func.isRequired,
    onUpdateTopic: PropTypes.func.isRequired,
    onUpdateFeed: PropTypes.func.isRequired
};

export default ModalContainerWrapper(Topic);
