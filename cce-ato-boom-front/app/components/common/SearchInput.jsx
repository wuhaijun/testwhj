'use strict';

import React, {Component, PropTypes} from 'react';

export default class SearchInput extends Component {

    handleChange(e) {
        let keyword = e.target.value && e.target.value.trim();
        this.props.onChange(keyword);
    }

    handleKeyUp(e) {
        if (e.keyCode == 13) {
            this.props.onSearch();
        }
    }

    handleClear() {
        this.props.onChange('', this.props.onSearch);
    }

    render() {
        return (
            <div className="search-input">
                {
                    this.props.keyword &&
                    <i className="fa fa-times" onClick={ this.handleClear.bind(this) }/>
                }
                {
                    !this.props.keyword &&
                    <i className="fa fa-search"/>
                }

                <input type="text" placeholder="搜索关键字" className="form-control boom-search-input" value={this.props.keyword} onChange={ this.handleChange.bind(this) } onKeyUp={ this.handleKeyUp.bind(this) } />
            </div>
        );
    }
};

SearchInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    keyword: PropTypes.string
};