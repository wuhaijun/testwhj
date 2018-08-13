'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import $ from 'jquery';

export default class TopicButton extends Component {

    constructor(props) {
        super(props);
        this.state = {mouseOver: false}
    }

    onMouseOver() {
        this.setState({mouseOver: true});
    }

    onMouseOut() {
        this.setState({mouseOver: false});
    }

    render() {
        const { onClick, topic } = this.props;

        return (
            <button type="button"
                    data-dismiss="modal"
                    onMouseOver={ this.onMouseOver.bind(this) }
                    onMouseOut={ this.onMouseOut.bind(this) }
                    onClick={ onClick } className="list-group-item" key={'topic'+topic._id}>
                {
                    this.state.mouseOver ?
                        <i className="fa fa-folder-open" /> :
                        <i className="fa fa-folder-o" />
                }
                {topic.name}
            </button>
        );
    }
}

TopicButton.propTypes = {
    onClick: PropTypes.func.isRequired
};