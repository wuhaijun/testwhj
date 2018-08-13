'use strict';

import React, { Component, PropTypes } from 'react'

export default class ProjectReadLike extends Component {

    render() {
        const { project } = this.props;
        let read_num = project.read_num ;
        let like_num = project.like_num ;

        return (
            <div className="project-read-like">
                {
                    read_num != undefined &&
                    <span className="read-num">阅读&nbsp;&nbsp;{ read_num }</span>
                }
                {
                    like_num != undefined &&
                    <span className="like-num">点赞&nbsp;&nbsp;{ like_num }</span>
                }
            </div>
        );
    }
}

ProjectReadLike.propTypes = {
    project: PropTypes.object.isRequired
};