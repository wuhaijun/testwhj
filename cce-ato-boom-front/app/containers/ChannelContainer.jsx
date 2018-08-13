'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, browserHistory } from 'react-router';
import { Cards, Card, Tips, Tip } from 'react-components-cce';
import _ from 'lodash';

import * as ProjectActions from '../actions/project';
import { limitTime } from '../../common/FunctionWheelUtils';
import { format } from '../../common/Utils';
import FileUrlUtil from '../../common/FileUrlUtil';
import TrackUtils from '../../common/TrackUtils';

import PageTitle from './../components/layout/PageTitle.jsx';
import Spinner from './../components/common/Spinner.jsx';
import ChannelFilter from './../components/channel/ChannelFilter.jsx';
import ProjectListWrapperLink from './../components/project/ProjectListWrapperLink.jsx';
import ProjectWaterFall from './../components/project/ProjectWaterFall.jsx';
import ChannelSimpleProject from './../components/channel/ChannelSimpleProject.jsx';

class ChannelContainer extends Component {

    constructor(props) {
        super(props);
        this.page = 1;
        this.isFirstPage = this.isFirstPage.bind(this);
        this.state = {};
    }

    static getOpts(props, page) {
        let params = props.params;
        return {
            page: page || 1,
            keyword: params.keyword || (props.listQuery && props.listQuery.keyword),
            feed: params.feedId,
            channel: params.channelId
        };
    }

    fetch(props, page) {
        this.page = page;
        this.props.actions.listProject(ChannelContainer.getOpts(props, page));
        this.track(props, page);
    }

    track(props, page) {
        let action = TrackUtils.ACTIONS.LIST_PAGE;
        let { category, label } = this.trackLabel(this.props);
        TrackUtils.event(category, action, label, page);
    }

    trackLabel(props) {
        const { params } = props;
        let category, label;
        if (params.channelId) {
            category = TrackUtils.CATEGORYS.CHANNEL;
            label = params.channelId;
        } else if (params.feedId) {
            category = TrackUtils.CATEGORYS.FEED;
            label = params.feedId;
        } else {
            category = TrackUtils.CATEGORYS.SEARCH;
            label = params.keyword;
        }
        return { category, label };
    }

    componentDidMount() {
        let channelDiv = $(this.refs.channelDiv);
        let $w = $(window);
        this.$w = $w;
        $w.scroll(limitTime(() => {
            if (this.getLoadingState() || this.props.projects.isAll) {
                return;
            }
            if ((channelDiv.offset().top + channelDiv.height()) < ($w.scrollTop() + $w.height())) {
                this.fetch(this.props, this.page + 1);
            }
        }));
        this.fetch(this.props, 1);
        this.highlight();
    }

    componentWillUnmount() {
        this.$w.unbind('scroll');
    }

    componentDidUpdate() {
        this.highlight();
    }

    componentWillReceiveProps(newProps) {
        let params = this.props.params, newParams = newProps.params;
        if (
            params.channelId != newParams.channelId
            ||
            params.feedId != newParams.feedId
            ||
            (params.keyword && params.keyword != newParams.keyword)
        ) {
            this.fetch({ params: newProps.params }, 1);
        }
    }

    highlight() {
        let props = this.props;
        let keyword = props.params.keyword || this.state.keyword;
        if (keyword) {
            $(this.refs.channelDiv).find('div.react-component-card').find('h4, p').highlight(keyword);
        }
    }

    getLoadingState() {
        return this.props.loading && this.props.loading['channel'];
    }

    isFirstPage() {
        let page = this.page;
        return !page || page == 1;
    }

    loadMore() {
        if (this.getLoadingState() || this.props.projects.isAll) {
            return;
        }
        this.fetch(this.props, this.page + 1);
    }

    //@TODO 获取menus名称过于繁琐，有待进一步优化
    findChannelName(menus, cid, titles, parent) {
        _.each(menus, c => {
            if (cid == c._id) {
                titles.push(c.name);
                if (parent) titles.unshift(parent.name);

            } else if (c.subList) {
                this.findChannelName(c.subList, cid, titles, c);
            }
        });
    }

    getTitles(cid, menus) {
        let titles = [];
        this.findChannelName(menus, cid, titles, null);
        return titles;
    }

    search(query) {
        this.setState({ keyword: query.keyword });
        this.props.actions.listProject(
            _.assign(ChannelContainer.getOpts(this.props, 1), query)
        );
        let { category, label } = this.trackLabel(this.props);
        TrackUtils.event(category, TrackUtils.ACTIONS.SEARCH, label);
    }

    render() {
        const { params, menus, projects, location } = this.props;
        let titles = [];
        let channelDucky = {};
        if (params.channelId) {
            titles = this.getTitles(params.channelId, menus.channels);
            channelDucky = menus.channelMap[params.channelId];
        } else if (params.feedId) {
            let feedId = params.feedId;
            titles = this.getTitles(feedId.startsWith('t_') ? feedId.substring(2) : feedId, menus.topics);
            titles.unshift('我的订阅');
        } else {
            let keyword = params.keyword;
            console.log(this.state.keyword);
            if (this.state.keyword !== undefined) keyword = this.state.keyword;
            if (keyword) {
                titles.push('搜索结果');
                titles.push(`关键词 / ${keyword}`);
            }
        }

        //@TODO 这里需要一个翻页按钮 没有下文了进行提示 加载过程不显示按钮 只依靠滚动翻页会有问题
        return (
            <div ref='channelDiv'>
                <PageTitle title={titles} />
                {
                    <ChannelFilter search={this.search.bind(this)} channelId={params.channelId} />
                }
                {
                    !(this.getLoadingState() && this.isFirstPage()) && (
                        (channelDucky && channelDucky.type === 'studio') ?
                            <ProjectWaterFall projects={projects.list} location={location} />
                            :
                            <ProjectListWrapperLink params={params}
                                type={channelDucky && channelDucky.type}
                                projects={projects.list}
                                path={location.pathname + location.search} />
                    )
                }
                {this.props.children}
                {this.getLoadingState() ? <Spinner /> : null}
                {
                    !projects.isAll && !this.getLoadingState() &&
                    <a className="btn btn-default btn-lg btn-block" onClick={this.loadMore.bind(this)}>
                        <i className="icon-control-play" />&nbsp;<span>加载更多</span>
                    </a>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        menus: state.menus,
        projects: state.projects
    }
};

const mapDispatchToProps = dispath => {
    return {
        actions: bindActionCreators(Object.assign({}, ProjectActions), dispath)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ChannelContainer));