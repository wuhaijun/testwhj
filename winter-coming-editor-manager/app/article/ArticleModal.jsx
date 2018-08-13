'use strict';

import React from 'react';

export default class ArticleModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="modal fade" id="previewModal" tabIndex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3>文章预览</h3>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div dangerouslySetInnerHTML={{ __html: this.props.content }} ></div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};