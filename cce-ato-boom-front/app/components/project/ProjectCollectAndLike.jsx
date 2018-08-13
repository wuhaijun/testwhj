'use strict';

import React, { Component, PropTypes } from 'react'
import _ from 'lodash';
import classnames from 'classnames';
import { get } from '../../../common/UrlStack';
import ChannelSimpleProject from './../channel/ChannelSimpleProject.jsx';
import {event, ACTIONS, CATEGORYS} from '../../../common/TrackUtils';

const tagSplit = ' ';
export default class ProjectCollectAndLike extends Component {

    constructor(props) {
        super(props);

        const { project } = props;
        let selectedTags = (project.collection && project.collection.tags) || [];

        this.state = {
            showCollectTag: false,
            selectedTags: selectedTags,
            newTags: []
        };
    }

    componentWillReceiveProps(newProps) {
        const { project } = newProps;
        let selectedTags = (project.collection && project.collection.tags) || [];
        this.state = { selectedTags: selectedTags };
    }

    componentDidMount() {
        $('body').bind('click.collect',e => {
            let t = $(e.target);
            if(!t.parents('.boom-content-collect').length){
                this.setState({ showCollectTag: false });
            }
        });
    }

    componentWillUnmount() {
        $('body').unbind('click.collect');
    }

    handleChange(e) {
        let v = e.target.value;
        if (!v || !v.trim()) this.setState({ selectedTags: [] });

        let ats = v.split(tagSplit);
        let pts = this.props.project.tags || [];
        let mts = this.props.account.tags || [];

        let dts = _.filter(ats, t=> pts.indexOf(t) == -1 && mts.indexOf(t) == -1);

        this.setState({ selectedTags: ats });
        this.setState({ newTags: _.uniq(dts) });
    }

    handleOnToggleCollect() {
        event(CATEGORYS.BUTTONS, ACTIONS.PROJECT_COLLECT, this.props.trackLabel);
        this.props.onToggleCollect();
    }
    //我的标签和提示标签
    handleOnToggleCollectTag(e){
        let tag = $(e.target).text();
        let selectedTags = this.state.selectedTags;

        if (selectedTags.indexOf(tag) != -1) {
            this.setState({ selectedTags: _.pull([...selectedTags], tag) });
        } else {
            this.setState({ selectedTags: [...selectedTags, tag] });
        }
    }
    //新增标签
    handleOnClickNewTag(e) {
        let tag = $(e.target).text();
        let selectedTags = this.state.selectedTags;
        let newTags = this.state.newTags;

        this.setState({ selectedTags: _.pull([...selectedTags], tag) });
        this.setState({ newTags: _.pull([...newTags], tag) });
    }
    //保存标签
    handleSaveCollectionTags() {
        let selectedTags = this.state.selectedTags;
        if (selectedTags && selectedTags.length != 0)
            this.props.onSaveCollectionTags(_.filter(selectedTags, t=>t));

        this.setState({ showCollectTag: false });
        this.setState({ newTags: [] });
        event(CATEGORYS.BUTTONS, ACTIONS.PROJECT_COLLECT_SAVE_TAGS, this.props.trackLabel);
    }

    render() {
        const { onLike, isLike, project, account, trackLabel } = this.props;

        let collection = project.collection;
        let collectBtn;
        if (collection && collection.isCollected){
            collectBtn = <a onClick={ this.handleOnToggleCollect.bind(this) }><i className="fa fa-star fa-2x"/><span>已收藏</span></a>;
        } else {
            collectBtn = <a onClick={ this.handleOnToggleCollect.bind(this) } ><i className="fa fa-star-o fa-2x" /><span>收藏</span></a>;
        }

        let selectedTags = this.state.selectedTags;
        return (
            <div className="boom-content-like-collect">
                <LikeComp isLike={ isLike } trackLabel={trackLabel} onLike={ onLike }/>

                <div className="boom-content-collect"
                     onMouseOver={ () => { this.setState({ showCollectTag: true }); } }>
                    { collectBtn }
                    {
                        <div className="collect-tags" style={{
                            display: (collection &&
                            collection.isCollected &&
                            this.state.showCollectTag)?'block':'none'
                        }}>
                            <div className="tags">
                                <div className="tag-input">
                                    <div>标签(多个标签用空格分隔):</div>
                                    <input type="text"
                                           onChange={ this.handleChange.bind(this) }
                                           value={ selectedTags.join(tagSplit) }/>
                                </div>

                                <div className="tag-val">

                                    <TagsComp lebal="新增标签: "
                                          tags={ this.state.newTags }
                                          selectedTags={ this.state.newTags }
                                          onToggleCollectTag={ this.handleOnClickNewTag.bind(this) }/>

                                    <TagsComp lebal="我的标签: "
                                          tags={ account.tags }
                                          selectedTags={ selectedTags }
                                          onToggleCollectTag={ this.handleOnToggleCollectTag.bind(this) }/>

                                    <TagsComp lebal="提示标签: "
                                          tags={ project.tags }
                                          selectedTags={ selectedTags }
                                          onToggleCollectTag={ this.handleOnToggleCollectTag.bind(this) }/>

                                </div>

                                <button type="button" onClick={ this.handleSaveCollectionTags.bind(this) } className="btn btn-success btn-sm">确定</button>
                            </div>
                            <div className="caret-up"></div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

class LikeComp extends Component {

    render() {
        const { onLike, isLike, trackLabel } = this.props;
        let trackOnLike = e => {
            event(CATEGORYS.BUTTONS, ACTIONS.PROJECT_LIKE, trackLabel);
            onLike(e);
        };

        let likeButton;
        if(isLike) {
            likeButton = <a onClick={ trackOnLike } ><i className="fa fa-heart fa-2x"/><span>已点赞</span></a>;
        }else {
            likeButton = <a onClick={ trackOnLike } ><i className="fa fa-heart-o fa-2x"/><span>点赞</span></a>;
        }
        return (
            <div className="boom-content-like">
                { likeButton }
            </div>
        );
    }
}

class TagsComp extends Component {
    render() {
        const { lebal, tags, selectedTags, onToggleCollectTag } = this.props;

        let tagsComp;
        if (!tags || tags.length == 0) {
            tagsComp = <span>暂无!</span>;
        } else {
            tagsComp = _.map(_.filter(tags, t => t), tag => {
                let selected = selectedTags.indexOf(tag) != -1;
                let className = classnames({ tag: !selected, selected: selected });

                return <button key={'tag-'+tag} onClick={ onToggleCollectTag } className={className}>{tag}</button>;
            })
        }

        return (
            <div>
                <label>{ lebal }</label>
                { tagsComp }
            </div>
        );
    }
}

ProjectCollectAndLike.propTypes = {
    project: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    onToggleCollect: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onSaveCollectionTags: PropTypes.func.isRequired,
    isLike: PropTypes.bool
};