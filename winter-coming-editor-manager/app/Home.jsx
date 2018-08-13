'use strict';

import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

export default class extends React.Component {

    render () {
        return (
            <div className="home">
                <ul className="category-list">
                    <li><Link to="/style">样式管理</Link></li>
                    <li><Link to="/template">模板管理</Link></li>
                    <li><Link to="/article">文章管理</Link></li>
                </ul>
            </div>
        );
    }
}