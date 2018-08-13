'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

export const ProjectItemModalWrapper = (ComposedComponent) => class extends Component {

    render() {
        const { project, target } = this.props;
        return (
            <div className="view-project-modal"
                 data-toggle="modal"
                 data-target={ target }
                 data-project={ project._id }>
                <ComposedComponent {...this.props} />
            </div>
        );
    }
};
