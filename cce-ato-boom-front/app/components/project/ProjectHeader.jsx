'use strict';

import * as projectTypes from '../../constants/ProjectTypes';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import ProjectReadLike from './ProjectReadLike.jsx';

export default class ProjectHeader extends Component {

    supplyTitle() {
        const { project } = this.props;

        switch(project.type) {
            case projectTypes.INSTAGRAM:
            case projectTypes.TWITTER:
            case projectTypes.FACEBOOK:
                return project.origin && project.origin.name + ' # ' + project.desc;
        }
        return project.title;
    }

    origin() {
        const { project, topics } = this.props;
        let origin = project.origin;
        if (origin) {
            let type = origin.type;
            let name = origin.name;
            name = type ? type + '/' + name : name;

            if (origin.originType == 'channel') {
                return <Link to={ `/channel/${ origin._id }` }>{ name }</Link>
            } else {
                let subs = [].concat.apply([], topics.map(topic => topic.subList));
                let index = subs.findIndex(sub => sub._id == origin._id);
                if (index != -1) {
                    return <Link to={ `/feed/${ origin._id }` }>{ name }</Link>
                } else {
                    return <Link to={ `/subscribe/follow/${ origin._id }` }>{ name }</Link>
                }
            }
        } else {
            return project.origin && project.origin.name || project.type;
        }
    }

    render() {
        const {project, views, likes} = this.props;

        return (
            <div className="boom-content-header">
                <div className="title-box col-xs-9">
                    <div className="title">
                        {this.supplyTitle()}
                    </div>
                    <div className="extend">
                        {project.datePublished ? moment(project.datePublished).format('YYYY-MM-DD'):''}
                        {project.originUrl && <a target="_blank" href={project.originUrl}>阅读原文</a>}
                        <span className="origin">来源:{ this.origin() }</span>
                        <ProjectReadLike project={ project }/>
                    </div>
                    {project.brand && (<div className="extend">
                        <span>Brand: </span>
                        {project.brand.name}
                    </div>)}
                    {project.team && (<div className="extend">
                        <span>By: </span>
                        {project.team.name}
                    </div>)}
                </div>
                <div className="views-box col-xs-3 row">
                    <div className="views col-sm-6">
                        <span className="number">{views}</span>
                        Views
                    </div>
                    <div className="views col-sm-6">
                        <span className="number">{likes}</span>
                        Likes
                    </div>
                </div>
                <div style={{clear:'both'}}></div>
            </div>
        );
    }
}

ProjectHeader.propTypes = {
    project: PropTypes.object.isRequired,
    views: PropTypes.number,
    topics: PropTypes.array,
    likes: PropTypes.number
};