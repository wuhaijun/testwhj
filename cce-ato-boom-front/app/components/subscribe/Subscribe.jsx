'use strict';
import React, { Component, PropTypes } from 'react';
import SubscribeContent from './SubscribeContent.jsx';
import SubscribeOperator from './SubscribeOperator.jsx';
import Icon from './../common/Icon.jsx';

export default class Subscribe extends Component {
    render() {
        const { feed, isFollowed, onUnFollow } = this.props;
        return (
            <div key={'feed' + feed._id} className={this.props.clazzName}>
                <div className="subscribe-card card bg-white">
                    <div className="subscribe-img">
                        <Icon type={ feed.type } size="fa-2x"/>
                    </div>
                    <SubscribeContent feed={ feed } />
                    <SubscribeOperator feed={ feed }
                                       isFollowed={ isFollowed }
                                       onUnFollow={ onUnFollow }
                                       isShow="true" />
                </div>
            </div>
        )
    }
}

Subscribe.propTypes = {
    feed: PropTypes.object.isRequired,
    isFollowed: PropTypes.bool.isRequired,
    onUnFollow: PropTypes.func,
    clazzName: PropTypes.string
};