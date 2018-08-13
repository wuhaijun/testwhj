'use strict';
import React, { Component, PropTypes } from 'react';
import './search.less';

export default class SearchInput extends Component {

    constructor(props) {
        super(props);
        this.state = { keyword: '', isFocus: false };
    }

    handleChange = e => {
        let keyword = e.target.value && e.target.value.trim();
        this.setState({ keyword: keyword });
        this.props.onChange && this.props.onChange(keyword);
    };

    handleClear = () => {
        this.setState({ keyword: '' })
    };

    handleKeyUp = e => {
        if (e.keyCode == 13) {
            this.props.onSearch(this.state.keyword);
        }
    };

    render() {
        return (
            <div className="react-component-search">
                {
                    (this.state.keyword || this.state.isFocus) &&
                    <i className="fa fa-times" onClick={ this.handleClear } />
                }
                {
                    (!this.state.keyword && !this.state.isFocus) &&
                    <i className="fa fa-search" />
                }

                <input type="text"
                       placeholder={ this.props.placeholder || '' }
                       value={ this.state.keyword }
                       onFocus={ () => { this.setState({ isFocus: true }); } }
                       onBlur={ () => { this.setState({ isFocus: false }); }  }
                       onChange={ this.handleChange }
                       onKeyUp={ this.handleKeyUp } />
            </div>
        );
    }
};

SearchInput.propTypes = {
    onSearch:PropTypes.func.isRequired,
    onChange:PropTypes.func,
    placeholder:PropTypes.string
};