'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

export const ProjectItemLinkWrapper = (ComposedComponent) => class extends Component {

    render() {
        const { project, path } = this.props;
        return (
            <Link to={`${path}/${project._id}`}>
                <ComposedComponent {...this.props} />
            </Link>
        );
    }
};
