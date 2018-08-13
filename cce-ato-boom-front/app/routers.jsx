'use strict';

import React, { Component } from 'react';
import { Route } from 'react-router';
import App from './App.jsx';

import ProjectContainer from './containers/ProjectContainer.jsx';
import { HomeSliderProjectContainer, HomeHotProjectContainer, HomeRecommendProjectContainer } from './containers/ProjectContainer.jsx';
import ChannelContainer from './containers/ChannelContainer.jsx';
import SubscribeContainer from './containers/SubscribeContainer.jsx';
import SubscribeDetailContainer from './containers/SubscribeDetailContainer.jsx';
import TopicContainer from './containers/TopicContainer.jsx';
import CollectionContainer from './containers/CollectionContainer.jsx';
import HomeContainer from './containers/HomeContainer.jsx';

import { pop, push } from '../common/UrlStack';
import { trackPage } from '../common/TrackUtils';
import { isString, isNumber } from '../common/Utils';

const genUrl = (router, level) => {
    let path = '';
    if (isString(level)) {
        path = level;
    } else if (isNumber(level)) {
        // router.routes return the route tree,
        // current route is the routes[i], i is the distance that current route to root route.
        // so the root route is routes[0] and so on.
        let routes = router.routes;
        for (let i = 1; i <= level; i++) {
            path += routes[i].path;
            if (i < level) path += '/';
        }
    }

    let urls = path.split(':');
    let url = urls[0];
    if (urls.length > 1) {
        for (let i = 1; i < urls.length; i++) {
            let paramPath = urls[i];
            let paramName = paramPath.replace('/', '');
            url += router.params[paramName];
            if (i != urls.length - 1) url += '/';
        }
    }
    return url;
};

const pushUrl = (level = 1) => {
    return router => {
        trackPage();
        push(genUrl(router, level));
    };
};

const getProjectContainer = (level = 1, component = ProjectContainer) => {
    return (router, cb) => {
        let parentUrl = genUrl(router, level);
        component.defaultProps = { parentUrl };
        cb(null, component);
    };
};

module.exports = (
    <Route component={App}>
        <Route path="/home" component={ HomeContainer } onEnter={ pushUrl() } onLeave={ pop } >
            <Route path='slider/:id' onEnter={ trackPage } getComponent={ getProjectContainer('/home/slider', HomeSliderProjectContainer) } />
            <Route path='hot/project/:id' onEnter={ trackPage } getComponent={ getProjectContainer('/home/hot/project', HomeHotProjectContainer) } />
            <Route path='recommend/project/:id' onEnter={ trackPage } getComponent={ getProjectContainer('/home/recommend/project', HomeRecommendProjectContainer) } />
        </Route>
        <Route path='/search/:keyword' component={ChannelContainer} onEnter={ pushUrl() } onLeave={ pop }>
            <Route path=':id' onEnter={ trackPage } getComponent={ getProjectContainer() }/>
        </Route>
        <Route path='/channel/:channelId' component={ChannelContainer} onEnter={ pushUrl() } onLeave={ pop }>
            <Route path=':id' onEnter={ trackPage } getComponent={ getProjectContainer() }/>
        </Route>

        <Route path='/collections' component={CollectionContainer} onEnter={ pushUrl() } onLeave={ pop }>
            <Route path=':id' onEnter={ trackPage } getComponent={ getProjectContainer() }/>
        </Route>

        <Route path='/feed/:feedId' component={ChannelContainer} onEnter={ pushUrl() } onLeave={ pop }>
            <Route path=':id' onEnter={ trackPage } getComponent={ getProjectContainer() }/>
        </Route>
        <Route path='/subscribe/follow' component={SubscribeContainer} onEnter={ pushUrl() } onLeave={ pop } />
        <Route path='/subscribe/follow/:feedId' component={SubscribeDetailContainer} onEnter={ pushUrl() } onLeave={ pop }>
            <Route path=':id' onEnter={ trackPage } getComponent={ getProjectContainer() }/>
        </Route>
        <Route path='/subscribe/edit' component={TopicContainer} onEnter={ pushUrl() } onLeave={ pop }/>
    </Route>
);