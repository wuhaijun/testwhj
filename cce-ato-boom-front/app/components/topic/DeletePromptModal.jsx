'use strict';

import React, { Component, PropTypes } from 'react';

export default class DeletePromptModal extends Component {

    componentDidMount() {
        let $this = $('.'+ this.props.data_target);
        $this.on('show.bs.modal', (e) => {
            this.props.onShow();
        });
    }

    handleDelete() {
        $('.'+ this.props.data_target).modal('hide');
        this.props.onDelete();
        this.props.onHide();
    }

    handleCancel() {
        this.props.onHide();
        $('.'+ this.props.data_target).modal('hide');
    }

    render() {
        return (
            <div className={"topic-modal delete-topic-modal modal fade " + this.props.data_target} >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <span>是否确认删除?</span>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={ this.handleDelete.bind(this) }>残忍删除</button>
                            <button type="button" className="btn btn-default" onClick={ this.handleCancel.bind(this) }>还是算了</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DeletePromptModal.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    data_target: PropTypes.string.isRequired
};