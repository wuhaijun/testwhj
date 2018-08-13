'use strict';

import React, { Component, PropTypes } from 'react';
import Navigation from './Navigation.jsx';
import { Link } from 'react-router'

export default class Sidebar extends Component {

    render() {
        return (
            <div id='boom-sidebar' className="sidebar-panel offscreen-left bg-black">
                <div className="brand" style={{ height: '150px', textAlign: 'center' }}>
                    <div className="toggle-offscreen">
                        <a href="javascript:;" className="visible-xs hamburger-icon" data-toggle="offscreen" data-move="ltr">
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>
                    </div>
                    <Link id="brand-logo" className="brand-logo" to="/home">
                        <img src="http://boom-static.static.cceato.com/boom/imgs/sidebar-logo-white.png" />
                    </Link>
                    <a href="/" className="small-menu-visible brand-logo" style={{ padding: 0 }}>
                        <img src="http://boom-static.static.cceato.com/boom/imgs/favicon.ico" />
                    </a>
                    <i className="beta">beta 2.0</i>
                </div>
                <ul className="quick-launch-apps hide">
                    <li>
                        <a>
                            <span className="app-icon bg-success text-white">
                                W
                            </span>
                            <span className="app-title">Wechat</span>
                        </a>
                    </li>
                </ul>

                <Navigation menus={this.props.menus} step={this.props.step} />
            </div>
        )
    }
}

Sidebar.propTypes = {
    menus: PropTypes.object.isRequired,
    step: PropTypes.number
};