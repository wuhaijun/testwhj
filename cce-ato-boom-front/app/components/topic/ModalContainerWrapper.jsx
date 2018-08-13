'use strict';

import React, { Component, PropTypes } from 'react';
import DeletePromptModal from './DeletePromptModal.jsx';
import UpdateTopicModal from './UpdateTopicModal.jsx';

import _ from 'lodash';

export const ModalContainerWrapper = (ComposedComponent) => class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updateModalShow: false,
            deleteModalShow: false,
            mouseEnter: false
        };
    }

    handleMouseEnter(e) {
        this.setState({mouseEnter: true});
    }

    handleMouseLeave(e) {
        this.setState({mouseEnter: false});
    }
    
    handleDeleteModalShow() {
        this.setState({deleteModalShow: true});
    }
    handleDeleteModalHide() {
        this.setState({deleteModalShow: false});
    }

    handleUpdateModalShow() {
        this.setState({updateModalShow: true});
    }
    handleUpdateModalHide() {
        this.setState({updateModalShow: false});
    }

    render() {
        let comp = this;
        let wrapperData = {
           handleDeleteModalShow: comp.handleDeleteModalShow.bind(comp),
           handleMouseEnter: comp.handleMouseEnter.bind(comp),
           handleMouseLeave: comp.handleMouseLeave.bind(comp),
           handleDeleteModalHide: comp.handleDeleteModalHide.bind(comp),
           handleUpdateModalHide: comp.handleUpdateModalHide.bind(comp),
           handleUpdateModalShow: comp.handleUpdateModalShow.bind(comp),
           state: comp.state
        };
        return <ComposedComponent {...this.props} wrapperData= { wrapperData } />;
    }
};
