'use strict';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter, browserHistory} from 'react-router';
import $ from 'jquery';
import _ from 'lodash';
import AuthorizationUtils from 'koa-sso-auth-cli/AuthorizationUtils';
import classnames from 'classnames';

import * as ProjectActions from '../actions/project';

import Spinner from './../components/common/Spinner.jsx';
import PageTitle from './../components/layout/PageTitle.jsx';
import ProjectListWrapperLink from './../components/project/ProjectListWrapperLink.jsx';
import ScrollPagination from './../components/common/ScrollPagination.jsx';
import SearchInput from './../components/common/SearchInput.jsx';
import ProjectsContainer from './ProjectsContainer.jsx';

class CollectionContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            tags: [],
            selectedTags: []
        };
    }

    componentDidMount() {
        $.get('/api/project/collections/tags', result => {
            this.setState({tags: result});
        });

        this.listCollections(1)
    }

    listCollections(page) {
        this.props.actions.listCollections(page, this.state.selectedTags, this.state.keyword);
    }

    hasNext() {
        return !this.getLoadingState() && !this.props.projects.isAll;
    }

    getLoadingState() {
        return this.props.loading && this.props.loading['collections'];
    }

    handleChange(keyword, callback) {
        this.setState({keyword: keyword}, () => {
            callback && callback.call(this);
        });
    }

    handleSearch() {
        this.listCollections(1);
    }

    handleOnToggleCollectTag(e) {
        let tag = $(e.target).text();
        // let ost = this.state.selectedTags;
        // let nst;
        // if (ost.indexOf(tag) != -1) {
        //     nst = _.pull([...ost], tag);
        // } else {
        //     nst = [...ost, tag];
        // }
        if (this.state.selectedTags === tag) {
            this.setState({selectedTags: []}, this.handleSearch);
        } else {
            this.setState({selectedTags: tag}, this.handleSearch);
        }
    }


    render() {
        const {projects, location} = this.props;
        let tags = this.state.tags;
        let selectedTags = this.state.selectedTags;

        let tagBtns = _.map(_.filter(tags, t => t), tag => {
            let selected = selectedTags.indexOf(tag) != -1;
            let className = classnames({tag: true, selected: selected});

            return <button key={'tag-' + tag}
                           onClick={this.handleOnToggleCollectTag.bind(this)}
                           className={className}>{tag}</button>;
        });

        return (
            <ScrollPagination onNextPage={this.listCollections.bind(this)}
                              hasNext={this.hasNext.bind(this)}>

                <PageTitle title='我的收藏'/>
                <div className="search-panel">
                    {AuthorizationUtils.checkClient('collect.search.fulltext') &&
                    <SearchInput keyword={this.state.keyword}
                                 onSearch={this.handleSearch.bind(this)}
                                 onChange={this.handleChange.bind(this)}/>
                    }

                    <div className="tags">
                        {tagBtns}
                    </div>
                </div>

                {this.props.children}
                {
                    !this.getLoadingState() &&
                    projects.list &&
                    <ProjectListWrapperLink projects={projects.list} path={location.pathname + location.search}/>
                }
                {this.getLoadingState() ? <Spinner/> : null}
            </ScrollPagination>
        );

    }
}

const mapStateToProps = state => {
    return {
        projects: state.projects,
        loading: state.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Object.assign({}, ProjectActions), dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CollectionContainer));

