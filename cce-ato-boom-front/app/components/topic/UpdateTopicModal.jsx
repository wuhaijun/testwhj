'use strict';

import React, { Component, PropTypes } from 'react';
import ErrorPromptCard from './ErrorPromptCard.jsx';

export default class UpdateTopicModal extends Component {

    componentDidMount() {
        let $this = $('.'+ this.props.data_target);
        $this.on('show.bs.modal', (e) => {
            this.props.onShow();
        });
    }

    constructor(props) {
        super(props);
        this.state = { value: props.value, message: ''};
    }

    handleUpdate() {
        let newValue = this.state.value;
        let oldValue = this.props.value;
        if (newValue && newValue.trim()) {
            $('.'+ this.props.data_target).modal('hide');
            this.props.onUpdate(newValue);
            this.props.onHide();
            this.setState({value: oldValue});
        } else {
            this.setState({message: '不能为空!'});
        }
    }

    handleChange(e) {
        let value = e.target.value;
        this.setState({value: value});
        if (value && value.trim())
            this.setState({message: ''});
    }

    handleClose() {
        this.props.onHide();
        $('.'+ this.props.data_target).modal('hide');
    }

    render() {
        return (
            <div className={"topic-modal update-topic-modal modal fade " + this.props.data_target} >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={ this.handleClose.bind(this) } aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <span>更新</span>
                        </div>
                        <div className="modal-body">
                            <input value={ this.state.value }  onChange={ this.handleChange.bind(this) }/>
                            <button type="button" className="btn btn-success" onClick={ this.handleUpdate.bind(this) }>保存</button>
                        </div>
                        <ErrorPromptCard message={ this.state.message } />
                    </div>
                </div>
            </div>
        );
    }
}

UpdateTopicModal.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    data_target: PropTypes.string.isRequired,
    value: PropTypes.string
};