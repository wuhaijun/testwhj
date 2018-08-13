'use strict';

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import ProjectContent from '../project/ProjectContent.jsx';

export default class PreviewProjectModal extends Component {

    constructor(props) {
        super(props);
        this.state = { project: null };
    }

    componentDidMount() {
        let $dialog = $('.preview-project-dialog'),
            $sidebar = $('#boom-sidebar'),
            $header = $('#boom-header');

        $dialog.css('margin-left', $sidebar.width() + 'px');
        $dialog.css('margin-top', $header.height() + 'px');

        $('#viewProjectModal').on('show.bs.modal', event => {
            let target = $(event.relatedTarget);
            let projectId = target.data('project');

            this.props.onPreviewProject(projectId);
        })
    }

    render() {
        const { previewProject } = this.props;
        return (
            <div className="modal fade" id="viewProjectModal" tabIndex="-1" role="dialog" aria-labelledby="viewProjectModal" aria-hidden="true">
                <div className="modal-dialog preview-project-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <i className="fa fa-times fa-2x" data-dismiss="modal"/>
                        </div>
                        <div className="modal-body">
                            {
                                previewProject &&
                                <ProjectContent project={ previewProject }/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PreviewProjectModal.propTypes = {
    onPreviewProject: PropTypes.func.isRequired,
    previewProject: PropTypes.object.isRequired
};