'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import Menu from './Menu.jsx';
import Icon from '../common/Icon.jsx';
import ToolTip from '../guide/ToolTip.js';

export default class Navigation extends Component {
    menus(sources, type) {
        let result = {}
        const exceptName = "未分组";
        const exceptType = "feed";
        let s1 = sources.filter(source => {
            return source.name === exceptName && type === exceptType;
        });
        let s2 = sources.filter(source => {
            return source.name !== exceptName || type !== exceptType;
        });
        return s1.concat(s2).map(source => {
            // let feedIds = source.subList.map(sub => sub._id);
            return (
                <Menu name={source.name}
                    hasSub={source.subList.length > 0}
                    to={type == 'feed' ? `/${type}/${'t_' + source._id}` : `/${type}/${source._id}`}
                    icon={source.icon}
                    type={source.type}
                    key={source._id}>

                    <ul className="sub-menu">
                        {
                            source.subList.map(sub => {
                                return <Menu name={sub.name}
                                    to={`/${type}/${sub._id}`}
                                    type={sub.type}
                                    icon={sub.icon}
                                    key={sub._id} />;
                            })
                        }
                    </ul>
                </Menu>
            );
        });
    }

    render() {
        let channels = this.menus(this.props.menus.channels, 'channel');
        let topics = this.menus(this.props.menus.topics, 'feed');
        let guideStyle = {};
        let tooltip = null;
        if (this.props.step === 3) {
            guideStyle = { border: '2px dashed #6164C1' };
            tooltip = <ToolTip />;
        }

        return (
            <nav role="navigation">
                <ul className="nav">
                    <Menu name="浏览发现" to="/home" icon="fa icon-compass" />
                    {channels}
                    <Menu name="新增订阅" to="/subscribe/follow" icon="fa icon-plus" />
                    <Menu guideStyle={guideStyle} ref="myPop" name="我的订阅" hasSub={topics.length > 0} to={"/feed/subscribe"} icon="fa icon-tag">
                        <ul className="sub-menu">
                            {topics}
                            <Menu name="编辑分类" to="/subscribe/edit" icon="fa icon-settings" />
                        </ul>
                    </Menu>
                    {tooltip}
                    <Menu name="我的收藏" to="/collections" icon="fa icon-star" />
                </ul>
            </nav>

        )
    }
}

Navigation.propTypes = {
    menus: PropTypes.object.isRequired,
    step: PropTypes.number
};