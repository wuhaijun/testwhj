'use strict';

import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import { browserHistory, Link } from 'react-router';
import { Card, Tips, Tip } from 'react-components-cce';
import _ from 'lodash';
import FileUrlUtil from '../../../common/FileUrlUtil';
import { format } from '../../../common/Utils';
import moment from 'moment';
import LazyImage from './LazyImage.jsx';

export default class ChannelInstagramPhoto extends Component {

    render() {
        const { key, project, path, feed, subT} = this.props;
        let projectTipStyle  = {
            fontSize: "12px",
            float: 'right',
            padding: '0 0 10px'
        };

        let TipsComponent = (
            <Tips gap="4px">
                <Tip className="fa fa-calendar-plus-o" style={ projectTipStyle } tip={ format((project.datePublished || project.dateImported || project.dateCreated || new Date())) } />
            </Tips>
        );
        return (
            //<div key={'project'+project._id} className="project-col col-sm-4">
            //    <div className="card bg-white card-simple project-card thumbnail">
            //        <LazyImage url={FileUrlUtil.coverUrlObj(project)}/>
            //        <div className="card-block">
            //            <p title={project.desc}
            //               className="card-text content-desc content-desc-notitle">
            //                {project.desc}</p>
            //        </div>
            //    </div>
            //</div>
            <Card   key={ key }
                    style={ this.props.style }
                    cover={ FileUrlUtil.coverUrlObj(project) }
                    LazyImageComponent={ LazyImage }
                    title={   feed ? feed.name + ' # ' + project.desc : subT ? subT + '#' + project.desc : '' }
                    desc={ project.desc || '' }
                    author=""
                    TipsComponent={ TipsComponent }
                    onClick={ () => { browserHistory.push( path + '/' + project._id) } }/>
        )
    }
}

ChannelInstagramPhoto.propTypes = {
    project: PropTypes.object.isRequired,
    path: PropTypes.string
};