'use strict';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class CardList extends Component {
    render() {
        return (
            <div className="row home-list" style={ this.props.style }>
                <div>
                    <span className="title">{ this.props.title }</span>
                    {
                        this.props.more &&
                        <a className="more"
                           href="javascript:;"
                           onClick={ () => { browserHistory.push(this.props.more) } }>更多</a>
                    }
                </div>
                <hr/>
                <div>{ this.props.children }</div>
            </div>
        )
    }
}

CardList.propTypes = {
    title: PropTypes.string,
    more: PropTypes.string
};