'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Icon from './../common/Icon.jsx';
import SubscribeOperator from './SubscribeOperator.jsx';

export default class PreviewFeedDetail extends Component {

    render() {
        const { feed, isFollowed, onUnFollow } = this.props;
        return (
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
                                       isFollowed={ isFollowed }
                                       onUnFollow={ onUnFollow }/>
                </div>
            </div>
        );
    }
}

PreviewFeedDetail.propTypes = {
    feed: PropTypes.object.isRequired,
    isFollowed: PropTypes.bool.isRequired,
    onUnFollow: PropTypes.func.isRequired
};