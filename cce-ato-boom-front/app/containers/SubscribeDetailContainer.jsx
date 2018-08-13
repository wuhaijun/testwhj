'use strict';
import React, {Component, ProTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { withRouter, browserHistory } from 'react-router';
import $ from 'jquery';
import _ from 'lodash';

import * as SubscribeActions from '../actions/subscribe';
import * as CommonActions from '../actions/common';

import Icon from './../components/common/Icon.jsx';
import Spinner from './../components/common/Spinner.jsx';
import SubscribeOperator from './../components/subscribe/SubscribeOperator.jsx';
import ProjectListWrapperLink from './../components/project/ProjectListWrapperLink.jsx';
import SubscribeFollowModal from './../components/subscribe/SubscribeFollowModal.jsx';

class SubscribeDetailContainer extends Component {

    constructor(props) {
        super(props);
        this.handleUnFollow = this.handleUnFollow.bind(this);
        this.handleSubscribeTopic = this.handleSubscribeTopic.bind(this);
        this.handleNewTopic = this.handleNewTopic.bind(this);
    }

    componentDidMount() {
        const { actions, params } = this.props;
        actions.listPreviewFeedProjects(params.feedId);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.params.feedId != this.props.params.feedId) {
            const { actions } = this.props;
            actions.listPreviewFeedProjects(newProps.params.feedId);
        }
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

    getLoadingState() {
        return this.props.loading && this.props.loading['listPreviewFeedProjects'];
    }

    render() {
        const { projects, feed, topics, params } = this.props;
        let projectsComp;
        let projectListClassName = 'preview-project-list scrollable' + (this.props.children? ' modal-open' : '');
        if (projects && projects.length != 0) {
            projectsComp = (
                <div className={projectListClassName}>
                    <ProjectListWrapperLink params={ params }
                                            projects={ projects }
                                            feed={ feed }
                                            path={ location.pathname + location.search }/>
                </div>
            );
        } else {
            projectsComp = (
                <div className={projectListClassName}>
                    暂无内容
                </div>
            );
        }

        let topicId = null;
        if (feed) {
            _.each(topics, t=> {
                if (t.subList && _.some(t.subList, sub=> {
                        return sub._id == feed._id;
                    })) {
                    topicId = t._id;
                    return false;
                }
            });
        }

        return (
            <div className="feeds">
                {
                    feed &&
                    <div>
                        <div className="preview-feed-detail">
                            <div className="subscribe-card card bg-white">
                                <div className="subscribe-img">
                                    <Icon type={ feed.type } size="fa-2x"/>
                                </div>
                                <div className="subscribe-content" >
                                    <span className="subscribe-name">{ feed.name }</span>
                                    <p className="subscribe-desc">{ feed.desc }</p>
                                </div>
                                <SubscribeOperator feed={ feed }
                                                   isFollowed={ topicId ? true: false }
                                                   onUnFollow={ ()=> this.handleUnFollow(topicId, feed._id) }/>
                            </div>
                        </div>
                        <SubscribeFollowModal
                            topics={ topics }
                            onSubscribeTopic={ this.handleSubscribeTopic }
                            onNewTopic={ this.handleNewTopic } />
                    </div>
                }

                {this.getLoadingState() ? <Spinner/> : projectsComp}

                {this.props.children}

                <div className="to-subscribes animated fadeInDown">
                    <Link to={{pathname:"/subscribe/follow",query:this.props.location.state}}>
                        <button type="button" className="btn btn-info">
                            <br/>
                            返<br/>回<br/>订<br/>阅<br/>列<br/>表
                            <br/>
                            <br/>
                            <i className="icon-arrow-left"/>
                            <br/>
                            <br/>
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        projects: state.previewFeedProjects.list,
        feed: state.previewFeedProjects.feed,
        topics: state.menus.topics,
        loading: state.loading
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
)(withRouter(SubscribeDetailContainer));

