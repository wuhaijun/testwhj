'use strict';

import React, { Component, PropTypes } from 'react'
import { Cards } from 'react-components-cce';

import _ from 'lodash';
import { get } from '../../../common/UrlStack';
import ChannelSimpleProject from './../channel/ChannelSimpleProject.jsx';
import { ProjectItemLinkWrapper } from '../../components/channel/ProjectItemLinkWrapper.jsx';

export default class ProjectLikeProjects extends Component {

    render() {
        const { parentUrl, likeProjects } = this.props;
        let _likeP = [];
        _.each(likeProjects, lp => {
            //@TODO likeProject 不能只支持一种类型 而且path的方式尽量自动化生成
            _likeP.push(
                (<ChannelSimpleProject key={'like-'+lp._id}
                                       project={ lp } clazzName='col-md-4'
                                       path={ parentUrl } />)
            );
        });

        return (
            _likeP && _likeP.length?
                <div className="boom-content-suggest">
                    <span className="header">类似案例</span>
                    <div className="row list">
                        <Cards marginLeftRight={ 0.8 } rowCols="auto">
                            {_likeP}
                        </Cards>
                    </div>
                </div>:null
        );
    }
}

ProjectLikeProjects.propTypes = {
    likeProjects: PropTypes.array,
    parentUrl: PropTypes.string
};