'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export const ProjectListWrapper = (ComposedComponent) => class extends Component {

    constructor(props) {
        super(props);
        this.buildProjectRowList = this.buildProjectRowList.bind(this);
    }

    buildProjectRowList(buildProjectComponent) {
        if (!buildProjectComponent || typeof buildProjectComponent != 'function') {
            throw new Error('buildProjectRowList param must be a function.');
        }

        const { projects } = this.props;
        let row = [];
        for (let i = 0; i < projects.length; i++) {
            let project = projects[i];
            let comp = buildProjectComponent(project);
            row.push(comp);
        }
        return row;
    }

    render() {
        return <ComposedComponent {...this.props} buildProjectRowList= { this.buildProjectRowList } />;
    }
};
