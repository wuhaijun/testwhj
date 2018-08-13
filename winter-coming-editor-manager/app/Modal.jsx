'use strict';

import React from 'react';

export default class Modal extends React.Component {

    handleChooseType = (type) => {
        return () => {
            if (this.isCurrent(type)) return;
            this.props.onChooseType(type);
        };
    };

    isCurrent = type => this.props.current.types.indexOf(type) != -1;

    buildModalTypeSelector = (types) => {
        let components = [];
        types.forEach(parentType => {
            components.push(<h6 key={parentType.name}>{parentType.name}</h6>);
            parentType.children.forEach(type => {
                let isCurrent = this.isCurrent(type);
                components.push(
                    <button key={type} className={"btn btn-primary " + (isCurrent ? 'current' : '')} type="button" onClick={this.handleChooseType(type)}>
                        {type}
                    </button>
                )
            });
        });
        return components;
    }

    render() {
        let { types, current } = this.props;
        let comps = this.buildModalTypeSelector(types);
        return (
            <div className="modal fade" id="previewModal" tabIndex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3>预览-选择分类</h3>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div dangerouslySetInnerHTML={{ __html: current.html }} ></div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-12">
                                        {comps}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.props.onSave}>保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};