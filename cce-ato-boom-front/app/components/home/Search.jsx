'use strict';
import React, { Component, PropTypes } from 'react';
import { SearchInput, Tag, Tags } from 'react-components-cce';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { keyword: '' } ;
    }

    handleOnChange = keyword =>  {
        this.setState({ keyword: keyword });
    };

    handleSearch = url => {
        return () => {
            let keyword = this.state.keyword;
            if (!keyword || !keyword.trim() || !url) return;

            location.href = url + keyword;
        };
    };

    handleOnClick = type => {
        return function() {
            location.href = '/subscribe/follow?type='+type;
        };
    };

    render() {
        let { feedSourceTypes } = this.props;
        const TagsComp = (
            <Tags>
                {  feedSourceTypes.map(type => <Tag onClick={ this.handleOnClick(type._id) } key= { type._id } style={ { float:'left' } }  name={ '# ' + type.name }/>) }
            </Tags>
        );
        return (
            <div className="row home-search">
                <div>
                    <div>
                        <SearchInput onSearch={ this.handleSearch('/search/') } onChange= { this.handleOnChange.bind(this) } placeholder="搜索您感兴趣的订阅源或文章"   />
                    </div>
                    <div>
                        <a href="javascript:;" onClick={ this.handleSearch('/subscribe/follow?keyword=') }>搜索帐号</a>
                        <a href="javascript:;" onClick={ this.handleSearch('/search/') }>搜索文章</a>
                    </div>
                </div>
                <div>
                    { TagsComp }
                    <div className="clear-fix"></div>
                </div>
                <hr />
            </div>
        )
    }
}

Search.propTypes = {
    feedSourceTypes: PropTypes.array
};