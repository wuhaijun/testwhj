'use strict';

import React, { Component } from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import ReactDOM from 'react-dom';

import App from './App.jsx';
import Home from './Home.jsx';
import StyleContainer from './style/StyleContainer.jsx';
import TemplateContainer from './template/TemplateContainer.jsx';
import ArticleContainer from './article/ArticleContainer.jsx';



ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <IndexRoute component={ Home }/>
            <Route path="style" component={ StyleContainer } />
            <Route path="template" component={ TemplateContainer } />
            <Route path="article" component={ ArticleContainer } />
        </Route>
    </Router>, document.body);
