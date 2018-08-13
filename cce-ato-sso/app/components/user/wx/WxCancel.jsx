import React, { Component,PropTypes } from 'react';

class WxCancel extends Component {

    closeWxRelation = () => {
        let myModal = $(this.refs.myModal);
        myModal.modal('show');
    }

    confirmClose = () => {
        this.props.cancelWx();
        let myModal = $(this.refs.myModal);
        myModal.modal('hide');
    }



    render() {
        return (
            <div>
                <button type="button" onClick={this.closeWxRelation}>解除绑定</button>
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="myModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">解除微信关联</h5>

                            </div>
                            <div className="modal-body">
                                解除后将无法使用该微信号快速登录。
                             </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">取消</button>
                                <button type="button" onClick={this.confirmClose} className="btn btn-primary" style={{ color: 'white', marginLeft: '10px' }}>确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};

export default WxCancel;

WxCancel.PropTypes = {
    cancelWx: PropTypes.func
}