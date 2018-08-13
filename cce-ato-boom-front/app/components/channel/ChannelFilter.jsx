'use strict';
import React, {Component, PropTypes} from 'react';
import {frequently2once} from '../../../common/FunctionWheelUtils';
import CloseableInputText from '../common/CloseableInputText.jsx';
import _ from 'lodash';

export default class ChannelFilter extends Component {

    constructor() {
        super();
        this.state = {
            filters: [],
            parameters: {}
        };

        this.freqSearch = frequently2once(this.search).bind(this);
        this.updateKeyword = this.updateKeyword.bind(this);
    }

    componentDidMount() {
        this.queryChannelFilter(this.props.channelId);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.channelId != newProps.channelId) {
            this.queryChannelFilter(newProps.channelId);
        }
    }

    queryChannelFilter(channelId) {
        if (channelId) {
            $.get('/api/channel/filters/' + channelId, (json) => {
                this.setState({ filters: json.result });
            });
        } else {
            this.setState({ filters: [] })
        }
    }

    handleChangeFilter = (filterId) => {
        return e => {
            let v = e.target.value;
            let parameters = _.assign(this.state.parameters, {[filterId]: (v && v.length>0) ? v : null});
            this.setState({parameters});
            this.freqSearch({parameters});
        };
    };

    updateKeyword(v) {
        let keyword = (v && v.length > 0) ? v : null;
        this.setState({keyword});
        this.freqSearch({keyword});
    }

    search(params) {
        if(!params.keyword) {
            params.keyword = this.state.keyword;
        }
        if(!params.parameters) {
            params.parameters = this.state.parameters;
        }

        let query = {
            keyword: params.keyword
        };
        _.each(params.parameters, (v,k) => {
            query['p:' + k] = v;
        });
        this.props.search(query);
    }

    render() {
        let filterSum = this.state.filters.length;
        let selectCol = (filterSum % 4) == 3 ? 2 : 3;
        let selectCountOfRow = 4;
        let searchCol = 12 - (filterSum % selectCountOfRow) * selectCol;
        return (
            <div>
                <div className="row channel-filter">
                    {
                        this.state.filters.map(filter => {
                            return (
                                <div key={ filter._id } className={ "col-md-" + selectCol} >
                                    <div className="form-group">
                                        <select onChange={ this.handleChangeFilter(filter._id) } className="form-control boom-search-select" style={{width:'100%'}}>
                                            <option value="">{ filter.name }</option>
                                            {
                                                filter.children.map(child => {
                                                    return (<option key={'t'+child._id} value={child._id}>{ child.name }</option>);
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        searchCol != 12 &&
                        <div className={ 'col-md-' + searchCol }>
                            <div className="form-group">
                                <CloseableInputText onChange={this.updateKeyword}/>
                            </div>
                        </div>
                    }
                </div>
                {
                    searchCol == 12 &&
                    <div className="row channel-filter">
                        <div className={ 'col-md-' + searchCol }>
                            <div className="form-group">
                                <CloseableInputText onChange={this.updateKeyword}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

ChannelFilter.propTypes = {
    channelId: PropTypes.string,
    search: PropTypes.func.isRequired
};