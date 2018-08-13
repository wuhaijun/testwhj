'use strict';
import React, {Component, ProTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, browserHistory } from 'react-router';
import _ from 'lodash';

import * as SubscribeActions from '../actions/subscribe';
import * as CommonActions from '../actions/common';

import SubscribeSearchBar from './../components/subscribe/SubscribeSearchBar.jsx';
import PreviewProjectModal from './../components/subscribe/PreviewProjectModal.jsx';
import SubscribeList from './../components/subscribe/SubscribeList.jsx';
import Subscribes from './../components/home/Subscribes.jsx';
import SubscribeFollowModal from './../components/subscribe/SubscribeFollowModal.jsx';

class SubscribeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.handleUnFollow = this.handleUnFollow.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.handleSubscribeTopic = this.handleSubscribeTopic.bind(this);
        this.handleNewTopic = this.handleNewTopic.bind(this);
        this.handlePreviewProject = this.handlePreviewProject.bind(this);
        this.state = {type:null,keyword:null};
    }

    componentDidMount() {
        let keyword = this.props.location.query.keyword;
        let type = this.props.location.query.type;
        if(keyword || type) {
            this.handleQuery(type, keyword);
        }else {
            this.props.actions.listFeedSources();
        }

        this.props.actions.listFeedSourceTypes();
    }

    handleQuery(type, keyword) {
        this.setState({type:type,keyword:keyword})
        this.props.actions.listFeedSources({ type: type, keyword: keyword });
    }

    handleNewTopic(name, feed) {
        this.props.actions.createTopicAndSubscribe(name, feed);
    }

    handleSubscribeTopic(topicId, feed) {
        this.props.actions.subscribeTopic(topicId, feed);
    }

    handleUnFollow(topicId, feedId) {
        this.props.actions.deleteTopicSubscribe(topicId, feedId);
    }

    handlePreviewProject(projectId) {
        this.props.actions.previewProject(projectId);
    }

    render() {

        const { topics, feedSources, feedSourceTypes, location } = this.props;
        return (
            <div>
                <SubscribeFollowModal
                    topics={topics}
                    onSubscribeTopic={ this.handleSubscribeTopic }
                    onNewTopic={ this.handleNewTopic } />
                <div className="subscribes-container">
                    <SubscribeSearchBar feedSourceTypes={ feedSourceTypes }
                                        onQuery={ this.handleQuery }
                                        location={ location }/>

                    <div className="subscribes">
                        <div className="content-list" >
                            <div className="row">

                                <Subscribes feeds={ feedSources }
                                            topics={ topics }
                                            type={this.state.type}
                                            keyword = {this.state.keyword}
                                            onUnTopicSubscribe={ this.handleUnFollow } />
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        );

    }

}

const mapStateToProps = state => {
    return {
        topics: state.menus.topics,
        feedSources: state.feedSources,
        feedSourceTypes: state.feedSourceTypes,
        previewProject: state.previewProject
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Object.assign({}, SubscribeActions, CommonActions), dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SubscribeContainer));

