import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './public/css/main.less';

import ProgressBarDemo from './demo/ProgressBarDemo.jsx';
import RowInputDemo from './demo/RowInputDemo.jsx';
import FormGroupDemo from './demo/FormGroupDemo.jsx';
import TagDemo from './demo/TagDemo.jsx';
import SearchInputDemo from './demo/SearchInputDemo.jsx';
import CardDemo from './demo/CardDemo.jsx';
import SliderBannerDemo from './demo/SliderBannerDemo.jsx';

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path="/" component={ ProgressBarDemo }/>
        <Route path="progressbar" component={ ProgressBarDemo } />
        <Route path="rowinput" component={ RowInputDemo } />
        <Route path="formgroup" component={ FormGroupDemo } />
        <Route path="tag" component={ TagDemo } />
        <Route path="searchinput" component={ SearchInputDemo } />
        <Route path="card" component={ CardDemo } />
        <Route path="sliderbanner" component={ SliderBannerDemo } />

    </Router>, document.getElementById('main'));