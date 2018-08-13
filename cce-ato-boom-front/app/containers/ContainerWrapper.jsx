'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, browserHistory } from 'react-router';

export default ComposedComponent => (...actions) => mapStateToProps => {
    const Wrapped = class extends Component {
        render() {
            return (
                <ComposedComponent { ...this.props } />
            );
        }
    };

    let __actions__ = {};
    if (actions && actions.length != 0) {
        __actions__ = actions.reduce((a1, a2) => {
            return Object.assign({}, a1, a2)
        }, {});
    }

    const mapDispatchToProps = dispath => {
        return {
            actions: bindActionCreators(__actions__, dispath)
        }
    };

    mapStateToProps = mapStateToProps || function(state) {};
    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(withRouter(Wrapped));
};
