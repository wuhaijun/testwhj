'use strict';

import React, { Component, PropTypes } from 'react'

const avatars = [ '01.png', '02.png', '03.png', '04.png', '05.png', '06.png'];

export default class AvatarModal extends Component {

    handleSubmitAvatar = avatar => {
        return () => {
            $('#avatarModal').modal('hide');
            this.props.onSubmitAvatar(avatar);
        };
    };

    render() {
        let avatarComps = avatars.map(avatar => {
            return (
                <a href="javascript:;" key={ avatar } onClick={ this.handleSubmitAvatar(avatar) }>
                    <img  src={ 'http://boom-static.static.cceato.com/boom/imgs/avatars/' + avatar } />
                </a>
            );
        });

        return (
            <div className="modal fade" id="avatarModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="myModalLabel">更改头像</h4>
                        </div>
                        <div className="modal-body">
                            { avatarComps }
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

AvatarModal.propTypes = {
    onSubmitAvatar: PropTypes.func.isRequired
};