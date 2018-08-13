'use strict';

import React, { Component, PropTypes } from 'react';
import './card.less';

export default class Card extends Component {

    render() {
        let { cover, title, author, desc, readNum, likeNum, createdDate  } = this.props;
        return (
          <div className="react-component-card">
              <img src={ cover } />
              <div>
                  <h4>
                      { title }
                      <div><span>{ author || '' }</span><span>{ createdDate || '' }</span></div>
                  </h4>
                  <p>{ desc }</p>
                  <div>
                      <i className="fa fa-eye">&nbsp;{ readNum || '-' }</i>
                      <i className="fa fa-heart">&nbsp;{ likeNum || '-' }</i>
                  </div>
              </div>
          </div>
        );
    }
}

Card.propTypes = {
    cover:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired,
    author:PropTypes.string,
    desc:PropTypes.string,
    readNum:PropTypes.string,
    likeNum:PropTypes.string,
    createdDate:PropTypes.string,
    onClick:PropTypes.func
};