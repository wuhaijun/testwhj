'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, browserHistory, Link } from 'react-router';

import * as HomeActions from '../actions/home';
import * as SubscribeActions from '../actions/subscribe';
import * as ProjectActions from '../actions/project';

import { SearchInput, SubscribeCard, Sliders, Cards, Card, Tips, Tip } from 'react-components-cce';
import Search from '../components/home/Search.jsx';
import Slider from '../components/home/Slider.jsx';
import CardList from '../components/home/CardList.jsx';
import Subscribes from '../components/home/Subscribes.jsx';
import Spinner from './../components/common/Spinner.jsx';
import Icon from '../components/common/Icon.jsx';

import LazyImage from './../components/channel/LazyImage.jsx';
import FileUrlUtil from '../../common/FileUrlUtil';
import { format } from '../../common/Utils';

import ProjectListWrapperLink from './../components/project/ProjectListWrapperLink.jsx';
import SubscribeFollowModal from './../components/subscribe/SubscribeFollowModal.jsx';

class HomeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { recommendProjectsPage: 1, hotFeedSourcesPage: 1, recommendFeedSourcesPage: 1 };
    }

    handleSubscribe = (topicId, feed) => {
        this.props.actions.subscribeTopic(topicId, feed);
    };

    handleUnSubscribe = (topicId, feedId) => {
        this.props.actions.deleteTopicSubscribe(topicId, feedId);
    };

    handleCreateTopicAndSubscribe = (name, feed) => {
        this.props.actions.createTopicAndSubscribe(name, feed);
    };

    handleExchangeHotFeedSources = () => {
        this.props.actions.hotFeedSources(this.state.hotFeedSourcesPage + 1);
        this.setState({ hotFeedSourcesPage: this.state.hotFeedSourcesPage + 1 });
    };

    handleExchangeRecommendFeedSources = () => {
        this.props.actions.recommendFeedSources(this.state.recommendFeedSourcesPage + 1);
        this.setState({ recommendFeedSourcesPage: this.state.recommendFeedSourcesPage + 1 });
    };

    componentDidMount() {
        let $w = $(window);
        this.$w = $w;
        $w.scroll(() => {
            if (this.getLoadingState()) {
                return;
            }
            if (this.state.recommendProjectsPage >= 40) {
                return;
            }
            let $home = $('#home');
            if (($home.offset().top + $home.height()) < ($w.scrollTop() + $w.height())) {
                this.props.actions.recommendProjects(this.state.recommendProjectsPage + 1);
                this.setState({ recommendProjectsPage: this.state.recommendProjectsPage + 1 });
            }
        });
        this.props.actions.listFeedSourceTypes();
        this.props.actions.sliders();

        this.props.actions.hotFeedSources();
        this.props.actions.recommendFeedSources();
        this.props.actions.hotProjects(1, 6);
        this.props.actions.recommendProjects();
    };

    componentWillUnmount() {
        this.$w.unbind('scroll');
    }

    getLoadingState() {
        return this.props.loading && this.props.loading['recommendProjects'];
    }

    render() {
        let { sliders, hotSubscribes, recommendSubscribes, hotProjects, recommendProjects } = this.props.home;
        let topics = this.props.topics;

        return (
            <div className="container-fluid" id="home">
                <SubscribeFollowModal
                    topics={topics}
                    onSubscribeTopic={this.handleSubscribe}
                    onNewTopic={this.handleCreateTopicAndSubscribe} />

                <Slider sliders={sliders} />

                <CardList title="最热订阅" more="/subscribe/follow" >
                    <Subscribes feeds={hotSubscribes}
                        topics={topics}
                        animated
                        onSubscribeTopic={this.handleSubscribe}
                        onUnTopicSubscribe={this.handleUnSubscribe}
                        onNewTopic={this.handleCreateTopicAndSubscribe} />

                    <div className="exchange"><span onClick={this.handleExchangeHotFeedSources}>换一批</span></div>
                </CardList>

                <CardList title="热文推荐">
                    <ProjectListWrapperLink projects={hotProjects} path={'/home/hot/project'} />
                </CardList>


                <CardList title="猜你喜欢">
                    <Subscribes feeds={recommendSubscribes}
                        topics={topics}
                        animated
                        onSubscribeTopic={this.handleSubscribe}
                        onUnTopicSubscribe={this.handleUnSubscribe}
                        onNewTopic={this.handleCreateTopicAndSubscribe} />
                    <div className="exchange"><span onClick={this.handleExchangeRecommendFeedSources}>换一批</span></div>
                    <hr />

                    <ProjectListWrapperLink projects={recommendProjects} path={'/home/recommend/project'} />
                </CardList>

                {this.props.children}
                {this.getLoadingState() ? <Spinner /> : null}
                {
                    this.state.recommendProjectsPage < '40' ?
                        '' : this.getLoadingState() ? '' :
                            <div className="row home-end-tip">
                                <div>想阅读更多内容，请订阅账号</div>
                            </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        home: state.home,
        feedSourceTypes: state.feedSourceTypes,
        topics: state.menus.topics,
        loading: state.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Object.assign({}, HomeActions, SubscribeActions, ProjectActions), dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(HomeContainer));