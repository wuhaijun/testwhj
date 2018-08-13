'use strict';
import React, { Component, ProTypes } from 'react';
import _ from 'lodash';
import Modal from './../components/common/Modal.jsx';
import ProjectHeader from './../components/project/ProjectHeader.jsx';
import ProjectTags from './../components/project/ProjectTags.jsx';
import ProjectContent from './../components/project/ProjectContent.jsx';
import ProjectLikeProjects from './../components/project/ProjectLikeProjects.jsx';
import ProjectReadLike from './../components/project/ProjectReadLike.jsx';
import ProjectCollectAndLike from './../components/project/ProjectCollectAndLike.jsx';
import ContainerWrapper from './ContainerWrapper.jsx';

import * as ProjectActions from '../actions/project';

import { get } from '../../common/UrlStack';
import { event, CATEGORYS, ACTIONS } from '../../common/TrackUtils';
import { injectConfig, removeConfig } from '../../common/WxJsSdkInject.js';

class ProjectContainer extends Component {

    constructor(props) {
        super(props);
        this.initState(props);
    }

    componentDidMount() {
        const { actions, params } = this.props;
        actions.fetchProject(params.id);
    }

    componentWillUnmount() {
        removeConfig();
    }


    componentWillReceiveProps(newProps) {
        if (newProps.params.id != this.props.params.id) {
            this.props.actions.fetchProject(newProps.params.id);

            var mc = $(this.refs.modal.refs.content);
            mc.stop().animate({
                scrollTop: 0
            }, 1000);
        }

        this.initState(newProps);
    }

    initState(props) {
        const { project } = props;
        if (!project) {
            return;
        }
        this.state = {
            liking: false,
            isLike: project.isLike,
            likes: project.likes || 0,
            views: project.views || 0
        };
    }

    handleOnLike() {
        let state = this.state;
        if (state.liking) return;
        state.liking = true;

        let comp = this;
        let id = this.props.params.id;
        $.get('/api/project/like/' + id, () => {
            state.isLike = !state.isLike;
            if (state.isLike)
                state.likes += 1;
            else
                state.likes -= 1;

            state.liking = false;
            comp.setState(state);
        });

        event(CATEGORYS.PROJECT, ACTIONS.LIKE, id);
    }

    handleSaveCollectionTags(tags) {
        const { actions, params } = this.props;
        actions.saveCollectionTags(params.id, tags);
        event(CATEGORYS.PROJECT, ACTIONS.PROJECT_COLLECT_SAVE_TAGS, params.id);
    }

    handleOnToggleCollect() {
        const { actions, params } = this.props;
        actions.toggleCollect(params.id);
        event(CATEGORYS.PROJECT, ACTIONS.PROJECT_COLLECT, params.id);
    }

    findChannelName(menus, cid, titles, parent) {
        _.each(menus, c => {
            if (cid == c._id) {
                titles.subTitle = c.name;
                if (parent) titles.title = parent.name;

            } else if (c.subList) {
                this.findChannelName(c.subList, cid, titles, c);
            }
        });
    }

    getTitles(cid, menus) {
        let titles = {};
        this.findChannelName(menus, cid, titles, null);
        return titles;
    }

    render() {
        const { project, loading, account, parentUrl, menus, params } = this.props;
        let titles = {};
        if (params.channelId) {
            titles = this.getTitles(params.channelId, menus.channels);
        } else if (params.feedId) {
            titles = this.getTitles(params.feedId, menus.topics);
        }
        if (this.props.project._id) injectConfig(this.props.project);
        return (
            <Modal ref="modal" closable={true} loading={loading && loading['project']}
                dialogClass="project-modal-dialog" goBackUrl={get()}>

                <div className="modal-body boom-content">
                    <ProjectHeader project={project}
                        topics={menus.topics}
                        views={this.state.views}
                        likes={this.state.likes} />

                    <ProjectTags tags={project.tags}
                        onLike={this.handleOnLike.bind(this)}
                        isLike={this.state.isLike}
                        project={project}
                        account={account}
                        onSaveCollectionTags={this.handleSaveCollectionTags.bind(this)}
                        onToggleCollect={this.handleOnToggleCollect.bind(this)} />

                    <ProjectContent project={project}
                        parentUrl={parentUrl} />

                    <ProjectCollectAndLike
                        trackLabel="project footer"
                        onLike={this.handleOnLike.bind(this)}
                        isLike={this.state.isLike}
                        project={project}
                        account={account}
                        onSaveCollectionTags={this.handleSaveCollectionTags.bind(this)}
                        onToggleCollect={this.handleOnToggleCollect.bind(this)} />

                    <ProjectLikeProjects likeProjects={project.likeProjects}
                        parentUrl={parentUrl} />
                </div>
            </Modal>
        );
    }
}

const addNextAndPrev = (state, projects, project, _id = "_id") => {

    let index = projects.findIndex(p => p[_id] == project._id);
    if (index != -1) {
        let size = projects.length;
        let prevId = index == 0 ? null : projects[index - 1][_id];
        let nextId = index == size - 1 ? null : projects[index + 1][_id];

        project.prev = prevId;
        project.next = nextId;
    }

    return {
        project: project,
        account: state.account,
        loading: state.loading,
        menus: state.menus
    }
};

const stateWrapper = ContainerWrapper(ProjectContainer)(ProjectActions);

export const HomeSliderProjectContainer = stateWrapper(state => {
    let projects = state.home.sliders || [];
    let project = state.project;
    return addNextAndPrev(state, projects, project, 'pid');
});

export const HomeRecommendProjectContainer = stateWrapper(state => {
    let projects = state.home.recommendProjects || [];
    let project = state.project;
    return addNextAndPrev(state, projects, project);
});

export const HomeHotProjectContainer = stateWrapper(state => {
    let projects = state.home.hotProjects || [];
    let project = state.project;
    return addNextAndPrev(state, projects, project);
});

export default stateWrapper(state => {
    let projects = state.projects.list || [];
    let project = state.project;
    return addNextAndPrev(state, projects, project);
});

