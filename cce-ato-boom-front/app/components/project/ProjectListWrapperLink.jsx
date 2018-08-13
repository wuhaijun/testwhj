'use strict';

import React, {Component, PropTypes} from 'react';
import { Cards } from 'react-components-cce';

import * as projectTypes from '../../constants/ProjectTypes';

import ChannelInstagramPhoto from '../../components/channel/ChannelInstagramPhoto.jsx';
import ChannelDownloadProject from '../../components/channel/ChannelDownloadProject.jsx';
import ChannelSimpleProject from '../../components/channel/ChannelSimpleProject.jsx';
import { ProjectItemLinkWrapper } from '../../components/channel/ProjectItemLinkWrapper.jsx';
import { ProjectListWrapper } from './ProjectListWrapper.jsx';

class ProjectListWrapperLink extends Component {

    constructor(props) {
        super(props);
        this.buildProjectComponent = this.buildProjectComponent.bind(this);
    }

    buildProjectComponent(project) {
        let type = this.props.type;
        let projectComponent;
        switch (type) {
            case projectTypes.DOWNLOAD:
                projectComponent = <ChannelDownloadProject key={project._id} project={ project } {...this.props} />;
                break;

            default:
                projectComponent = <ChannelSimpleProject key={project._id} project={ project } {...this.props} />;
        }
        return projectComponent;
    }

    render() {
        let row = this.props.buildProjectRowList(this.buildProjectComponent);
        return (
            <div className="content-list">
                <div className="row">
                    <Cards marginLeftRight={ 0.8 } rowCols="auto">
                        { row }
                    </Cards>
                </div>
            </div>
        )
    }
}

ProjectListWrapperLink.propTypes = {
    projects: PropTypes.array,
    path: PropTypes.string.isRequired
};

export default ProjectListWrapper(ProjectListWrapperLink);
