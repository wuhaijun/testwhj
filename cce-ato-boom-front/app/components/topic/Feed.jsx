'use strict';
import React, { Component, PropTypes } from 'react';
import Icon from '../common/Icon.jsx';
import { ModalContainerWrapper } from './ModalContainerWrapper.jsx';
import OperatorSpan from './OperatorSpan.jsx';
import OperatorModal from './OperatorModal.jsx';
import {confirm, input} from '../../../common/AlertUtils';

class Feed extends Component {

    constructor() {
        super();
        this.handleDeleteSubscribe = this.handleDeleteSubscribe.bind(this);
        this.handleUpdateFeed = this.handleUpdateFeed.bind(this);
    }

    handleDeleteSubscribe() {
        const { feed, onDeleteSubscribe} = this.props;
        confirm({
            title: "是否确认删除",
            confirmButtonText: "残忍删除",
            cancelButtonText: "还是算了",
            callback: function () {
                swal("成功删除!");
                onDeleteSubscribe(feed);
            }
        });
    }

    handleUpdateFeed() {
        let { feed, onUpdateFeed } = this.props;
        input({
            title: '更新',
            inputValue: feed.name,
            callback: function (inputValue) {
                if (inputValue === false) {
                    return false;
                }
                if (inputValue === '') {
                    swal.showInputError('请输入内容');
                    return false;
                }
                if (inputValue != feed.name) {
                    onUpdateFeed(feed._id, inputValue);
                }
                swal('更新成功');
            }
        });
    }

    render() {
        const { feed, wrapperData } = this.props;
        return (
            <li key={'feed' + feed._id} rel={feed._id} name={feed.name} type={feed.type}
                onMouseEnter={ wrapperData.handleMouseEnter }
                onMouseLeave={ wrapperData.handleMouseLeave } >

                <span className="subscribe-img">
                    <Icon type={ feed.type } size="fa-1x"/>
                </span>
                <span> {feed.name} </span>
                {
                    wrapperData.state.mouseEnter &&
                    <OperatorSpan
                        onEdit={this.handleUpdateFeed}
                        onDel={this.handleDeleteSubscribe}
                    />
                }
            </li>
        )
    }
}

Feed.propTypes = {
    feed: PropTypes.object.isRequired,
    onDeleteSubscribe: PropTypes.func.isRequired,
    onUpdateFeed: PropTypes.func.isRequired
};

export default ModalContainerWrapper(Feed);