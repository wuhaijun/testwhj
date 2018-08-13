'use strict';

import * as projectTypes from '../../constants/ProjectTypes';
import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router';
import _ from 'lodash';
import FileUrlUtil from '../../../common/FileUrlUtil';
import { event, CATEGORYS, ACTIONS } from '../../../common/TrackUtils';
import Share from '../common/Share.jsx';

export default class ProjectContent extends Component {

    componentDidMount() {
        const { project } = this.props;
        let $t = $(findDOMNode(this)).find('div.modal-content');
        let indexBtn = $t.find('.show-index-btn');
        indexBtn.animate({ top: ($t.height() / 2 + 'px') }, 'fast');

        let c = $(this.refs.contentText);
        let scrollable = c.closest('.scrollable');
        c.find('img').lazyload({
            container: scrollable
        });

        let contentWidth = c.outerWidth();
        c.find('iframe').each(function () {
            try {
                let $t = $(this);
                let originSrc = $t.attr('data-src');
                if (originSrc && originSrc.indexOf('qq.com')) {
                    if (project.type == projectTypes.WECHAT) {
                        let vid = originSrc.split('?')[1].split('&')[0].split('=')[1];
                        $t.attr('src', `https://v.qq.com/iframe/player.html?vid=${vid}&tiny=0&auto=0`);
                    }
                }
                if ($t.attr('src').indexOf('qq.com')) {
                    if (!$t.attr('width') || $t.width() > contentWidth) {
                        let w = ((contentWidth > 600) ? 600 : contentWidth) - 20;
                        $t.attr('width', w).attr('height', parseInt(w * 31 / 50));
                    }
                }
            } catch (e) { console.error(e); }
        });
    }

    buildPrevAndNext(project) {
        let result = {};
        let parentUrl = this.props.parentUrl;
        if (project.prev) {
            result.prev = <Link to={`${parentUrl}/${project.prev}`} className="show-prev show-index-btn"><img src="http://boom-static.static.cceato.com/boom/imgs/button/left.png" /></Link>;
        }
        if (project.next) {
            result.next = <Link to={`${parentUrl}/${project.next}`} className="show-next show-index-btn"><img src="http://boom-static.static.cceato.com/boom/imgs/button/right.png" /></Link>;
        }
        return result;
    }

    textHandle(data) {
        let type = data.type;
        let $t = $('<div></div>').html(data.text);

        let $content = $t.children('div').eq(0);
        $content.children('h2').eq(0).remove();
        $content.children('div').eq(0).remove();

        //过滤script
        $t.find('script').remove();

        //过滤class
        $t.find('*').removeAttr('class').removeAttr('id');

        //图片懒加载
        $t.find('img').each(function () {
            let $i = $(this);
            let imgUrl = $i.attr('src');
            if (type == projectTypes.WECHAT) {
                imgUrl = 'http://imgcache.cceato.com/cache/' + encodeURIComponent(imgUrl);
            }
            $i.removeAttr('src');
            $i.attr('data-original', imgUrl);
        });

        return $t[0].innerHTML;
    }

    supplyText(data) {
        switch (data.type) {
            case projectTypes.FACEBOOK:
            case projectTypes.TWITTER:
            case projectTypes.INSTAGRAM:
                return (
                    <div>
                        {
                            data.coverImg && data.coverImg.url &&
                            <img src={FileUrlUtil.md5ImageUrl(data.coverImg.url, data.type)} />
                        }
                        <p>{data.desc}</p>
                    </div>
                );
            case projectTypes.STUDIO:
                return (
                    <div>
                        <p style={{ 'textAlign': 'center' }}>
                            <img src={`http://boom.static.cceato.com/${data.coverImg.fileName}`} />
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: this.textHandle(data) }}></div>
                    </div>
                );
            default:
                return (
                    data.text ?
                        (<div dangerouslySetInnerHTML={{ __html: this.textHandle(data) }}></div>)
                        :
                        (<div><p>{data.desc}</p></div>)
                );
        }
    }

    supplyDownload(data) {
        if (!data.downloadFile) {
            return null;
        }
        return (
            <div>
                <br />
                <br />
                <button type="button"
                    title={data.downloadName}
                    className="btn btn-success btn-lg"
                    onClick={() => {
                        FileUrlUtil.downloadProjectFile(data._id);
                        event(CATEGORYS.BUTTONS, ACTIONS.DOWNLOAD, 'project container');
                    }}
                >
                    <i className="icon-cloud-download" />
                    <span>下载附件</span>
                </button>
            </div>
        );
    }

    render() {
        const { project } = this.props;
        let prevAndNext = this.buildPrevAndNext(project);
        return (
            <div>
                <div className="shareOptions">
                    <Share project={project}/>
                </div>
                <div ref="contentText" className="boom-content-text">
                    {this.supplyText(project)}
                    {this.supplyDownload(project)}
                </div>
                <div className="shareOptions">
                    <Share project={project}/>
                </div>
                {prevAndNext && prevAndNext.prev}
                {prevAndNext && prevAndNext.next}
            </div>
        );
    }
}

ProjectContent.propTypes = {
    project: PropTypes.object.isRequired,
    parentUrl: PropTypes.string
};