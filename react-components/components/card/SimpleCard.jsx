'use strict';

import React, { Component, PropTypes } from 'react';
import './card.less';

export default class SimpleCard extends Component {

    render() {
        let { cover, author, desc, readNum, likeNum, articleNum, btnName  } = this.props;
        return (
            <div className="react-component-card simple">
                <div>
                    <img src={ cover } />
                    <a href="javascript:;" onClick={ this.props.onClick }>
                       <span>{ btnName }</span>
                    </a>
                </div>
                <div>
                    <h4>{ author || '' }</h4>
                    <p>{ desc }</p>
                    <div>
                        <span className="fa fa-eye">&nbsp;<i>{ readNum || '-' }</i></span>
                        <span className="fa fa-heart">&nbsp;<i>{ likeNum || '-' }</i></span>
                        <span className="fa fa-file-text-o">&nbsp;<i>{ articleNum || '-' }</i></span>
                    </div>
                </div>
            </div>
        );
    }
}

SimpleCard.propTypes = {
    cover:PropTypes.string.isRequired,
    onClick:PropTypes.func.isRequired,
    author:PropTypes.string,
    desc:PropTypes.string,
    readNum:PropTypes.string,
    likeNum:PropTypes.string,
    articleNum:PropTypes.string,
    btnName:PropTypes.string
};