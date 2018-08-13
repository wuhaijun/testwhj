'use strict';

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import _ from 'lodash';
import $ from 'jquery';
import ProjectCollectAndLike from './ProjectCollectAndLike.jsx'
import {event, ACTIONS, CATEGORYS} from '../../../common/TrackUtils';

export default class ProjectTags extends Component {

    tag() {
        event(CATEGORYS.BUTTONS, ACTIONS.PROJECT_TAG, 'default');
    }

    render() {
        const { tags } = this.props;
        return (
            <div className="boom-content-tags">
                <div className="boom-content-btn">
                    { tags && tags.map(tag => {
                        return <button key={'tag-'+tag} onClick={this.tag} className="tag">{tag}</button>;
                    }) }
                </div>
                <div className="boom-content-all">
                    <ProjectCollectAndLike
                        trackLabel="project header"
                        onLike={ this.props.onLike }
                        isLike={ this.props.isLike }
                        project={this.props.project}
                        account={this.props.account}
                        onSaveCollectionTags={this.props.onSaveCollectionTags}
                        onToggleCollect={this.props.onToggleCollect} />
                </div>


            </div>
        );
    }
}

ProjectTags.propTypes = {
    tags: PropTypes.array,
    project: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    onToggleCollect: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onSaveCollectionTags: PropTypes.func.isRequired,
    isLike: PropTypes.bool
};