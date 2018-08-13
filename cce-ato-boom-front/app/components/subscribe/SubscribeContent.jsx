'use strict';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class SubscribeContent extends Component {

    render() {
        let feed = this.props.feed;
        let fName = feed.name ? feed.name : '';
        fName = fName.length > 15 ? fName.substring(0, 15) + '...': fName;

        let fDesc = feed.desc ? feed.desc : '';
        fDesc = fDesc.length > 15 ? fDesc.substring(0, 15) + '...': fDesc;

        return (
            <div className="subscribe-content">

                    <span className="subscribe-name">{ fName }</span>
                    <p className="subscribe-desc">{ fDesc }</p>

            </div>
        );
    }
}

SubscribeContent.propTypes = {
    feed: PropTypes.object.isRequired
};