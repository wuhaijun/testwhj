'use strict';

import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import { Link } from 'react-router';
import _ from 'lodash';
import FileUrlUtil from '../../../common/FileUrlUtil';
import moment from 'moment';
import { format } from '../../../common/Utils';
import LazyImage from './LazyImage.jsx';

export default class WaterFallSimpleProject extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    play(e) {
        e.preventDefault();
        if(e.currentTarget.tagName.toUpperCase() == 'BUTTON') {
            this.setState({played: !this.state.played});
        }
    }

    go(e) {
        if(e.target.tagName.toUpperCase() != 'BUTTON') {
            this.refs.slink.handleClick(e);
        }
    }

    render() {
        const {project, path, width} = this.props;

        let coverImg = project.coverImg;
        let coverWidth = width - 24, coverHeight = 0;

        if(coverImg && coverImg.width && coverImg.height) {
            coverHeight = parseInt((coverImg.height / coverImg.width) * coverWidth);
        }else {
            coverHeight = parseInt(0.6818181818 * coverWidth);
        }
        let wh = `/3/w/${coverWidth}/h/${coverHeight}`;
        let coverUrl = `http://boom.static.cceato.com/${project.coverImg.fileName}?imageView${wh}|imageView${wh}/format/jpg|imageView${wh}|imageView${wh}`;
        let isGif = project.coverImg.fileName.endsWith('gif');

        let coverUrlObj = FileUrlUtil.coverUrlObj(project);
        coverUrlObj.url = coverUrl;

        let coreDiv = (
            <div className="card bg-white card-simple project-card thumbnail"
                 onClick={this.go.bind(this)}
                 style={{'cursor': 'pointer'}}>
                <button className="btn btn-icon-icon btn-sm"
                        onClick={this.play.bind(this)}
                        style={{position: 'absolute', top: coverHeight - 35, left: 15, display: isGif? 'block' : 'none'}}>
                    <i className={this.state.played?'icon-control-pause':'icon-control-play'}></i>
                </button>
                {
                    this.state.played &&
                    <img src = {`http://boom.static.cceato.com/${project.coverImg.fileName}`}
                         className="card-img-top img-responsive"
                         style={{
                             position: 'absolute',
                             width: `${coverWidth}px`,
                             height: `${coverHeight}px`,
                         }}/>
                }
                <LazyImage url={ coverUrlObj } width={coverWidth} height={coverHeight}/>
                <div className="card-block">
                    <Link ref="slink" to={`${path}/${project._id}`}></Link>
                    <p title={project.caption} className="card-text content-desc">{project.title}</p>
                </div>
                <div style={{color: '#bcbcbc',fontFamily:'FontAwesome',fontSize:'12px',padding:'0 1.25rem'}} >
                    { format((project.datePublished || project.dateCreated || ''))   }
                </div>
            </div>);

        return (
            <div key={'project'+project._id} className="project-col col-sm-4">
                {/*<Link to={`${path}/${project._id}`}>*/}
                    {coreDiv}
                {/*</Link>*/}
            </div>
        )
    }
}

WaterFallSimpleProject.propTypes = {
    width: PropTypes.number.isRequired,
    project: PropTypes.object.isRequired,
    path: PropTypes.string
};