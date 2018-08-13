'use strict';

import React from 'react';
import Modal from './../Modal.jsx';

export default class StyleEditor extends React.Component {

    handleChange = e => {
        let value = e.target.value;
        value = value && value.trim();
        this.props.onChange(value);
    };

    handleClear = () => {
        if (this.props.current.html &&
            window.confirm('确定清空所有内容?')) {
            this.props.onChange('');
        }
    };

    handleCompress = e => {
        let value = this.props.current.html.replace(/>\s+</g,'><');
        this.props.onChange(value);
    }

    render () {
        let { types, current, onSave, onChooseType } = this.props;
        return (
            <div className="style-editor col-md-5">
                <div className="row editor">
                    <div className="col-md-12">
                        <textarea value={ current.html || '' } onChange={ this.handleChange } />
                    </div>
                </div>
                <div className="row saver">
                    <div className="col-md-12">
                        <div>
                            <a href="javascript:;" data-toggle="modal" data-target="#previewModal">
                                <i className="fa fa-check-circle-o fa-4x"/>
                            </a> 
                            <Modal current={ current }
                                   types={ types }
                                   onSave={ onSave }
                                   onChooseType={ onChooseType }/>
                        </div>
                        <div className="btn-toolbar">
                            <button className="btn-compress" onClick={this.handleCompress}>压缩</button>
                        </div>
                        <div className="btn-toolbar" role="toolbar">
                            <div className="btn-group" role="group">
                                <a href="javascript:;" onClick={ this.handleClear }>
                                    <i className="fa fa-trash fa-2x"/>
                                </a>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}