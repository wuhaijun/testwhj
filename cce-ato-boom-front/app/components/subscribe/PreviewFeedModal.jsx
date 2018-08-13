'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Subscribe from './Subscribe.jsx';
import ProjectListWrapperModal from '../project/ProjectListWrapperModal.jsx';
import PreviewFeedDetail from './PreviewFeedDetail.jsx';

export default class PreviewFeedModal extends Component {

    constructor(props) {
        super(props);
        this.state = { feed: null };
    }

    componentDidMount() {
        let $dialog = $('.preview-feed-dialog'),
            $sidebar = $('#boom-sidebar'),
            $header = $('#boom-header');

        $dialog.css('margin-left', $sidebar.width() + 'px');
        $dialog.css('margin-top', $header.height() + 'px');

        $('#viewFeedModal').on('show.bs.modal', event => {
            let target = $(event.relatedTarget);
            let feed = target.data('feed');

            this.setState({ feed: feed });
            this.props.onPreviewFeed(feed._id);
        });
    }

    render() {
        const { previewFeedProjects, topics, onUnFollow } = this.props;
        let body;
        if (previewFeedProjects && previewFeedProjects.length != 0) {
            body = (
                <div className="preview-project-list">
                    <ProjectListWrapperModal projects={ previewFeedProjects } target="#viewProjectModal" />
                </div>
            );
        } else {
            body = (
                <div className="preview-project-list">
                    暂无文章!
                </div>
            );
        }

        let feed = this.state.feed;
        let topicId;
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
            <div className="modal fade" id="viewFeedModal" tabIndex="-1" role="dialog" aria-labelledby="viewFeedModal" aria-hidden="true">
                <div className="modal-dialog preview-feed-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <i className="fa fa-times fa-2x" data-dismiss="modal"/>
                        </div>
                        <div className="modal-body">
                            {
                                feed &&
                                <PreviewFeedDetail
                                    isFollowed={ topicId ? true: false }
                                    feed={ feed }
                                    onUnFollow={ () => { onUnFollow(topicId, feed._id) } }/>
                            }
                            { body }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PreviewFeedModal.propTypes = {
    onPreviewFeed: PropTypes.func.isRequired,
    previewFeedProjects: PropTypes.array.isRequired,
    topics: PropTypes.array,
    onUnFollow: PropTypes.func.isRequired
};