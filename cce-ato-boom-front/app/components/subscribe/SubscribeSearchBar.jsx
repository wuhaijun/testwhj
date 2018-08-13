'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {frequently2once} from '../../../common/FunctionWheelUtils';

export default class SubscribeSearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = { type: '', keyword: '' };
        this.queryFreq = frequently2once(this.query);
    }

    componentDidMount(){
        let keyword = this.props.location.query.keyword;
        let type = this.props.location.query.type;
        this.setState({ keyword: keyword, type: type });
    }

    query(type, keyword) {
        const { onQuery } = this.props;
        onQuery(type, keyword);
    }

    clearKeyword(e) {
        this.setState({keyword: ''});
        this.query(this.state.type, '');
    }

    handleSearchInputChange(e) {
        let keyword = e.target.value;
        this.setState({keyword: keyword});
        this.queryFreq(this.state.type, keyword);
    }

    handleTypeSelectChange(e) {
        let type = e.target.value;
        this.setState({ type: type });

        this.query(type, this.state.keyword);
    }

    render() {
        const { feedSourceTypes } = this.props;
        let typeOptions = feedSourceTypes.map(type => <option key={type._id} value={type._id}>{type.name}</option> );
        let _typeOptions = [<option key='ALL' value="ALL">类型</option>, ...typeOptions];

        return (
            <div className="row subscribe-search-bar">
                <div className="col-sm-12">
                    <div className="card-block">
                        <div className="row">
                            <div className="col-sm-3 col-select">
                                <select className="form-control boom-search-select" value={ this.state.type } onChange={this.handleTypeSelectChange.bind(this)}>
                                    {_typeOptions}
                                </select>
                            </div>
                            <div className="col-sm-9 col-input">
                                {
                                    this.state.keyword && <i className="fa fa-times" onClick={this.clearKeyword.bind(this)} />
                                }
                                {
                                    !this.state.keyword && <i className="fa fa-search" />
                                }
                                <input value={this.state.keyword} className="form-control boom-search-input" type="text" onChange={this.handleSearchInputChange.bind(this)} placeholder="搜索您感兴趣的订阅源并订阅"/>
                            </div>
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        );
    }
}

SubscribeSearchBar.propTypes = {
    feedSourceTypes: PropTypes.array.isRequired,
    onQuery: PropTypes.func.isRequired
};