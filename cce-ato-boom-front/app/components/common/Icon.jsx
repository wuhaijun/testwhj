'use strict';
import React, { Component, PropTypes } from 'react';
import * as projectTypes from '../../constants/ProjectTypes';

export default class Icon extends Component {

    render() {
        const { type, size, icon, style } = this.props;
        if (icon) {
            return <i className={ icon } style={ style } />
        } else {
            switch (type) {
                case projectTypes.WECHAT:
                    return ( <i className={ "fa fa-weixin " + size || '' } style={ style } /> );

                case projectTypes.FACEBOOK:
                    return ( <i className={ "fa icon-social-facebook " + size || '' } style={ style } /> );

                case projectTypes.INSTAGRAM:
                    return ( <i className={ "fa fa-instagram " + size || '' } style={ style } /> );

                case projectTypes.TWITTER:
                    return ( <i className={ "fa icon-social-twitter " + size || '' } style={ style } /> );

                case projectTypes.FEED:
                    return ( <i className={ "fa icon-feed " + size || '' } style={ style } /> );

                case projectTypes.WEBSITE:
                    return ( <i className={ "fa fa-internet-explorer " + size || '' } style={ style } /> );

                case projectTypes.DOWNLOAD:
                    return ( <i className={ "fa icon-cloud-download " + size || '' } style={ style } /> );

                default:
                    return ( <i className={ "fa icon-folder-alt " + size || '' } style={ style } /> );
            }
        }
    }
}

Icon.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object
};