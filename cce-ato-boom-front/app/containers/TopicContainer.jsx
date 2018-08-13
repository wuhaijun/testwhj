'use strict';

import React, {Component, ProTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, browserHistory } from 'react-router';
import _ from 'lodash';

import * as SubscribeActions from '../actions/subscribe';
import * as CommonActions from '../actions/common';

import Topic from './../components/topic/Topic.jsx';
import TopicCreateCard from './../components/topic/TopicCreateCard.jsx';

class TopicContainer extends Component {

    componentDidUpdate(nextProps, nextState) {
        this.bindDnDEvent(this);
    }

    componentDidMount() {
        this.bindDnDEvent(this);
    }

    bindDnDEvent(comp) {
        let $container = $(comp.refs.topicContainer);
        $('li', $container).draggable({
            revert: "invalid",
            containment: "document",
            helper: "clone",
            cursor: "move"
        });

        $('.connectedSortable', $container).droppable({
            accept: "li",
            classes: {
                "ui-droppable-active": "ui-state-highlight"
            },
            over: function (event, ui ) {
                $(event.target).parent().addClass('bg-default-light');
            },
            out: function (event, ui ) {
                $(event.target).parent().removeClass('bg-default-light');
            },
            drop: function(event, ui ) {
                let target = $(event.target);
                target.parent().removeClass('bg-default-light');
                comp.moveSubscribe(ui.draggable, target);
            }
        });
    }

    findTopic(feedId) {
        const {topics} = this.props;
        let topic = _.find(topics, t => {
            return t.subList && _.find(t.subList, s => {return s._id == feedId});
        });
        return topic._id;
    }

    moveSubscribe(draggable, target) {
        let topicId = target.attr('rel');
        let feedId = draggable.attr('rel');
        let type = draggable.attr('type');
        let feedName = draggable.attr('name');
        let oldTopicId = this.findTopic(feedId);
        if(oldTopicId == topicId) return;

        this.props.actions.moveSubscribe(oldTopicId, topicId, {_id: feedId, name: feedName, type});

    }

    handleDeleteSubscribe(topic, feed) {
        this.props.actions.deleteTopicSubscribe(topic._id, feed._id);
    }

    handleDeleteTopic(topic) {
        this.props.actions.deleteTopic(topic._id);
    }

    handleUpdateTopic(topicId, name) {
        this.props.actions.updateTopic(topicId, name);
    }

    handleUpdateFeed(topicId, feedId, name) {
        this.props.actions.updateTopicFeed(topicId, feedId, name);
    }

    handleOnNewTopic(name) {
        if(this.props.loading['subscribeNewTopic']) return;
        this.props.actions.createTopic(name);
    }

    render() {
        const {topics} = this.props;

        let topicComps = _.map(topics, t => (
            <Topic topic={t} key={t._id}
                   onDeleteSubscribe={this.handleDeleteSubscribe.bind(this)}
                   onUpdateTopic={this.handleUpdateTopic.bind(this)}
                   onUpdateFeed={this.handleUpdateFeed.bind(this)}
                   onDeleteTopic={this.handleDeleteTopic.bind(this)} />
        ));

        return(
            <div id="edit-topics" className="edit-topics-content">
                <div ref="topicContainer" className="row">
                    {topicComps}
                    <div ref="createTopic" className="col-sm-4">
                        <TopicCreateCard onNewTopic={this.handleOnNewTopic.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        topics: state.menus.topics,
        loading: state.loading
    }
};

const mapDispatchToProps = dispath => {
    return {
        actions: bindActionCreators(Object.assign({}, SubscribeActions, CommonActions), dispath)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(TopicContainer));

