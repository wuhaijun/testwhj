'use strict';

import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGlobal } from './actions/common';
import _ from 'lodash';
const config = require('../common/config');
import { isMobile } from '../common/Utils';
import Modal from './components/guide/Modal.js';
import EmailValidAlert from './components/layout/EmailValidAlert';

class App extends Component {

    componentDidMount() {
        this.props.fetchGlobal();

        if (isMobile) {
            let $app = $('#app');
            $('body').bind('click.offscreen', function (e) {
                if ($app.hasClass('offscreen')) {
                    let $this = $(e.target);
                    if (!$this.is('#boom-sidebar') && !$this.is('i.expand')) {
                        $app.removeClass('offscreen').removeClass('move-left');
                    }
                }
            });
        }
    }

    componentWillUnmount() {
        $('body').unbind('click.offscreen');
    }

    componentWillReceiveProps(props) {
        if (props.account && props.account.username) {
            $(function () {
                if ($('body > .pageload').length) {
                    if ($('body').hasClass('page-loaded')) {
                        return;
                    }
                    $('body').addClass('page-loaded').removeClass('page-loading');
                    $('body > .pageload').fadeOut('slow');
                }
            });
        }
    }



    render() {
        const href = config.get('host') + this.props.location.pathname;
        let events = this.props.account.events;
        let modalCom = null;
        if (events) {
            modalCom = <Modal show={!isMobile && (events.indexOf('guided') == -1)} />;
        }

        return (
            <div>
                {modalCom}
                <Sidebar menus={this.props.menus} step={this.props.step} />
                <div className="main-panel">
                    <Header account={this.props.account} href={href} />
                    {!this.props.account.validDate ? <EmailValidAlert email={this.props.account.username} /> : null}}
                    <div className="main-content">
                        {this.props.children}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        account: state.account,
        step: state.guide.step,
        menus: state.menus
    }
};

module.exports = connect(
    mapStateToProps,
    { fetchGlobal }
)(App);