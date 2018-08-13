'use strict';

import React, {Component, PropTypes} from 'react';
import Subscribe from './Subscribe.jsx';
import _ from 'lodash';

export default class SubscribeList extends Component {
    render() {
        const { feeds, topics, onUnFollow } = this.props;

        let feedTopicMap = {};
        _.each(topics, t => {
            _.each(t.subList, s => {
                feedTopicMap[s._id] = t._id;
            });
        });

        let rowList = [];
        for (let i = 0; i < feeds.length; i++) {
            let feed = feeds[i];
            let topicId = feedTopicMap[feed._id];

            rowList.push(
                <Subscribe clazzName="col-sm-4 subscribe-sm"
                                  feed={ feed }
                                  onUnFollow={ () => { onUnFollow(topicId, feed._id) } }
                                  isFollowed={ topicId ? true: false }
                                  key={'source' + feed._id} />
            );
        }

        return (
            <div className="content-list scrollable" style={{paddingLeft:'10%',paddingRight:'10%',marginLeft:'0',marginRight:'0'}}>
                <div className="row">{ rowList }</div>
            </div>
        )
    }
}

SubscribeList.propTypes = {
    feeds: PropTypes.array,
    topics: PropTypes.array,
    onUnFollow: PropTypes.func.isRequired
};
