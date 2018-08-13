'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import Modal from './../common/Modal.jsx';
import Spinner from './../common/Spinner.jsx';
import SubscribeContent from './SubscribeContent.jsx';
import TopicCreateCard from '../topic/TopicCreateCard.jsx';
import Icon from './../common/Icon.jsx';
import TopicButton from './TopicButton.jsx';
import { isMobile } from '../../../common/Utils';

export default class SubscribeFollowModal extends Component {

    constructor(props) {
        super(props);
        this.state = { feed: null };
    }

    componentDidMount() {
        let $dialog = $('.subscribe-topic-bar-dialog'),
            $sidebar = $('#boom-sidebar'),
            $header = $('#boom-header');

        if (!isMobile) {
            $dialog.css('margin-left', $sidebar.width() + 'px');
            $dialog.css('margin-top', $header.height() + 'px');
        } else {
            $dialog.css('margin-top', '50%');
        }


        $('#subscribeFollowModal').on('show.bs.modal', event => {
            let target = $(event.relatedTarget);
            let feed = target.data('feed');

            this.setState({ feed: feed });
        });
    }

    handleOnNewTopic(name) {
        this.props.onNewTopic(name, this.state.feed);
    }
    
    subscribeTopic(topic) {
        return () => {
            this.props.onSubscribeTopic(topic._id, this.state.feed);
        }
    }

    render() {
        const { topics } = this.props;
        let feed = this.state.feed;
        return (
            <div className="modal fade" id="subscribeFollowModal" tabIndex="-1" role="dialog" aria-labelledby="subscribeFollowModal" aria-hidden="true">
                <div className="modal-dialog subscribe-topic-bar-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <i className="fa fa-times fa-2x" data-dismiss="modal"/>
                        </div>
                        {
                            feed &&
                            <div className="modal-body">
                                <div className="subscribe-dialog-content">
                                    <div className="subscribe-card-block">
                                        <div className="subscribe-img">
                                            <Icon type={ feed.type } size="fa-2x"/>
                                        </div>
                                        <SubscribeContent feed= { feed } />
                                    </div>
                                </div>
                                <div className="subscribe-dialog-topics">
                                    { _.map(topics, (t, index) =>
                                        <TopicButton key={ index } onClick={ this.subscribeTopic(t) } topic={ t } />
                                    )}
                                </div>

                                <div className="subscribe-dialog-create">
                                    <TopicCreateCard onNewTopic={this.handleOnNewTopic.bind(this)} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

SubscribeFollowModal.propTypes = {
    topics: PropTypes.array.isRequired,
    onNewTopic: PropTypes.func.isRequired,
    onSubscribeTopic: PropTypes.func.isRequired
};