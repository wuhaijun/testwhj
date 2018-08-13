'use strict';
import React, {Component, PropTypes} from 'react';
import FileUrlUtil from '../../../common/FileUrlUtil';
import { format } from '../../../common/Utils';
import _ from 'lodash';
import LazyImage from './LazyImage.jsx';
import Icon from '../common/Icon.jsx';
import { browserHistory, Link } from 'react-router';
import { Card, Tips, Tip } from 'react-components-cce';
import ProjectReadLike from '../project/ProjectReadLike.jsx';

export default class ChannelSimpleProject extends Component {

    render() {
        const { project, path, key, params, feed } = this.props;
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

        // 默认显示project的origin
        let origin = project.origin;
        let descComp;
        if (origin) {
            descComp = (
                <span>
                    <Icon type={ origin.type } icon={ origin.icon } style={{ color: 'rgb(158, 158, 158)' }} />
                    <span style={{marginLeft:'5px'}}>{ origin.pname ? origin.pname + ', ' + origin.name : origin.name  }</span>
                </span>
            )
        }

        // 根据具体的页面判断是否显示描述
        let isOnlyOneFeedList = params && params.feedId && params.feedId != 'subscribe' && params.feedId.indexOf('t_') == -1;
        let isSubChannel = params && params.channelId && params.channelId.indexOf('_') != -1;
        let hasFeed = feed ? true : false;

        if (isOnlyOneFeedList || hasFeed || isSubChannel || origin.originType == 'channel') {
            descComp = project.desc;
        }

        return (
            <Card  key={ key }
                   style={ this.props.style }
                   cover={ FileUrlUtil.coverUrlObj(project) }
                   LazyImageComponent={ LazyImage }
                   title={ project.title }
                   desc={ descComp }
                   author=""
                   TipsComponent={ TipsComponent }
                   onClick={ () => { browserHistory.push( path + '/' + project._id) } } />
        )
    }
}

ChannelSimpleProject.propTypes = {
    project: PropTypes.object.isRequired
};