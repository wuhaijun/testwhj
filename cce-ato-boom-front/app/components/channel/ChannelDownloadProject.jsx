'use strict';

import React, { Component, PropTypes } from 'react'
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';
import FileUrlUtil from '../../../common/FileUrlUtil';
import { format } from '../../../common/Utils';
import {event, CATEGORYS, ACTIONS} from '../../../common/TrackUtils';
import moment from 'moment';

export default class ChannelDownloadProject extends Component {

    download() {
        const {project} = this.props;
        FileUrlUtil.downloadProjectFile(project._id);
        event(CATEGORYS.BUTTONS, ACTIONS.DOWNLOAD, 'channel container');
    }

    render() {
        const {project, path} = this.props;
        return (
            <div className="project-col col-sm-4 download-card">
                <div className="card row-equal align-middle bg-white project-card thumbnail">
                    <div className="column p-a relative">
                        <Link to={`${path}/${project._id}`}>
                            <div className="text-center">
                                <h4 className="card-title content-title">{project.title}</h4>
                                <p title={project.desc} className="card-text content-desc">{project.desc}</p>
                            </div>
                        </Link>
                        <div className='download-div'>
                            <button className="btn btn-primary" type="button" onClick={this.download.bind(this)}>Download</button>
                        </div>
                        <div style={{color: '#bcbcbc',fontFamily:'FontAwesome',fontSize:'12px',whiteSpace:'nowrap'}} >
                            { format((project.datePublished || project.dateCreated || ''))   }
                        </div>
                    </div>
                    <div className="column cover" style={{background: 'url('+FileUrlUtil.coverUrl(project)+') no-repeat','backgroundSize': 'cover','backgroundPosition': 'center center'}}>
                        <Link to={`${path}/${project._id}`}>
                            <div className="hackImg">
                                <img src='http://7xl3tq.com1.z0.glb.clouddn.com/1px.gif?imageMogr2/thumbnail/22x15!'/>
                            </div>
                        </Link>
                        <div className="card-block">
                            <h4 className="card-title content-title"></h4>
                            <p className="card-text content-desc"></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChannelDownloadProject.propTypes = {
    project: PropTypes.object.isRequired,
    path: PropTypes.string
};