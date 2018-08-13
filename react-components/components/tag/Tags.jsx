'use strict';
import React, { Component, PropTypes } from 'react';
import './tag.less';
import Tag from './Tag.jsx';

import * as types from './constant';

export default class Tags extends Component {

    constructor(props) {
        super(props);
        this.state = { selected: [] };
    }

    handleOnClickTag = child => {
        let { name, onClick } = child.props;
        return () => {
            this.toggleSelected(name);
            onClick && onClick(name);
        }
    };

    toggleSelected = name => {
        let selected = this.state.selected;
        let index = selected.indexOf(name);
        if (index == -1) {
            this.setState({ selected: [name, ...selected] });
        } else {
            let temp = [...selected];
            temp.splice(index, 1);
            this.setState({ selected: temp });
        }
    };

    render() {
        let children = this.props.children;
        children = Object.prototype.toString.call(children) === "[object Array]" ? children : [ children ];
        children = children.filter((child, pos) => children.indexOf(child) == pos);
        children = children.map(child => React.cloneElement(child, {
            key: child.props.name,
            onClick: this.handleOnClickTag(child)
        }));
        return (
            <div className="react-component-tags">
                { children }
            </div>
        );
    }
};

Tags.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    type: PropTypes.oneOf([
        types.TAGS_TYPE_LINE
    ])
};

Tags.defaultProps = {
    type: types.TAGS_TYPE_LINE
};
