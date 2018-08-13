'use strict';

import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';
import classnames from 'classnames';
import Spinner from './../components/common/Spinner.jsx';
import PageTitle from './../components/layout/PageTitle.jsx';
import ProjectListWrapperLink from './../components/project/ProjectListWrapperLink.jsx'
import ScrollPagination from './../components/common/ScrollPagination.jsx';
import SearchInput from './../components/common/SearchInput.jsx';

export default class ProjectsContainer extends Component {

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
            this.setState({ tags: result });
        });
    }

    hasNext() {
        return !this.props.loadingState && !this.props.projects.isAll;
    }

    handleChange(keyword, callback) {
        this.setState({ keyword: keyword }, () => {
            callback && callback.call(this);
        });
    }

    handleSearch() {
        this.props.onGetProjects(1);
    }

    handleOnToggleCollectTag(e) {
        let tag = $(e.target).text();
        let ost = this.state.selectedTags;
        let nst;
        if (ost.indexOf(tag) != -1) {
            nst =  _.pull([...ost], tag);
        } else {
            nst =  [...ost, tag];
        }
        this.setState({ selectedTags: nst }, this.handleSearch);
    }

    render() {
        const { projects, location, title, onGetProjects, loadingState } = this.props;

        let tags = this.state.tags;
        let selectedTags = this.state.selectedTags;

        let tagBtns = _.map(_.filter(tags, t => t), tag => {
            let selected = selectedTags.indexOf(tag) != -1;
            let className = classnames({ tag: true, selected: selected });

            return <button key={'tag-'+tag}
                           onClick={ this.handleOnToggleCollectTag.bind(this) }
                           className={ className }>{tag}</button>;
        });

        return (
            <ScrollPagination onNextPage={ onGetProjects }
                              hasNext={ this.hasNext.bind(this) }>

                <PageTitle title={ title }/>
                <div className="search-panel">
                    <SearchInput keyword={ this.state.keyword }
                                 onSearch={ this.handleSearch.bind(this) }
                                 onChange={ this.handleChange.bind(this) }/>

                    <div className="tags">
                        { tagBtns }
                    </div>
                </div>

                { this.props.children }
                {
                    projects.list &&
                    <ProjectListWrapperLink projects={projects.list} path={ location.pathname + location.search } />
                }
                { loadingState ? <Spinner/> : null}
            </ScrollPagination>
        );

    }
}

ProjectsContainer.propTypes = {
    projects: PropTypes.object,
    location: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onGetProjects: PropTypes.func.isRequired,
    loadingState: PropTypes.bool.isRequired
};

