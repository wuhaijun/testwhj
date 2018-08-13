'use strict';

import React, {Component, PropTypes} from 'react';

import * as projectTypes from '../../constants/ProjectTypes';

import ChannelInstagramPhoto from '../../components/channel/ChannelInstagramPhoto.jsx';
import ChannelDownloadProject from '../../components/channel/ChannelDownloadProject.jsx';
import ChannelSimpleProject from '../../components/channel/ChannelSimpleProject.jsx';
import { ProjectItemModalWrapper } from '../../components/channel/ProjectItemModalWrapper.jsx';
import { ProjectListWrapper } from './ProjectListWrapper.jsx';

const ChannelInstagramPhotoModal = ProjectItemModalWrapper(ChannelInstagramPhoto);
const ChannelSimpleProjectModal = ProjectItemModalWrapper(ChannelSimpleProject);

class ProjectListWrapperModal extends Component {

    constructor(props) {
        super(props);
        this.buildProjectComponent = this.buildProjectComponent.bind(this);
    }

    buildProjectComponent(project) {
        let type = project.type;
        let projectComponent;
        switch (type) {
            case projectTypes.INSTAGRAM:
            case projectTypes.FACEBOOK:
            case projectTypes.TWITTER:
                projectComponent = <ChannelInstagramPhotoModal key={ project._id}  project={ project } {...this.props} />;
                break;

            case projectTypes.DOWNLOAD:
                projectComponent = <ChannelDownloadProject key={project._id} project={ project } {...this.props} />;
                break;

            default:
                projectComponent = <ChannelSimpleProjectModal key={project._id} project={ project } {...this.props} />;
        }
        return projectComponent;
    }

    render() {
        let row = this.props.buildProjectRowList(this.buildProjectComponent);
        return (
            <div className="content-list">
                <div className="row">
                    { row }
                </div>
            </div>
        )
    }
}

ProjectListWrapperModal.propTypes = {
    projects: PropTypes.array,
    target: PropTypes.string.isRequired
};

export default ProjectListWrapper(ProjectListWrapperModal);
