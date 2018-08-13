'use strict';
import React, { Component, PropTypes } from 'react';
import DeletePromptModal from './DeletePromptModal.jsx';
import UpdateTopicModal from './UpdateTopicModal.jsx';

export default class OperatorModal extends Component {
    
    onDelete() {
        confirm({
            title: '',
            ok: function () {

            }
        });
    }

    render() {
        const { wrapperData, data, onDelete, onUpdate } = this.props;
        return (
            <div>
                {
                    (wrapperData.state.mouseEnter || wrapperData.state.deleteModalShow ) &&
                    <DeletePromptModal data_target={ 'delete-'+ data._id }
                                       onDelete={ onDelete }
                                       onShow={ wrapperData.handleDeleteModalShow }
                                       onHide={ wrapperData.handleDeleteModalHide } />
                }
                {
                    (wrapperData.state.mouseEnter || wrapperData.state.updateModalShow ) &&
                    <UpdateTopicModal value={ data.name }
                                      data_target={ 'update-'+ data._id }
                                      onUpdate={ onUpdate }
                                      onShow={ wrapperData.handleUpdateModalShow }
                                      onHide={ wrapperData.handleUpdateModalHide }/>
                }
            </div>
        )
    }
}

OperatorModal.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    wrapperData: PropTypes.object.isRequired
};