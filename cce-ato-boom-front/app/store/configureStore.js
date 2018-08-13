'use strict';

import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

/**
 * 记录所有被发起的 action 以及产生的新的 state。
 */
const logger = store => next => action => {

    // console.log('dispatching', action);
    let result = next(action);
    // console.log('next state', store.getState());
    return result
};

export default function configureStore(initData) {
     return applyMiddleware(logger, thunkMiddleware)(createStore)(rootReducer, initData,
         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    //return createStore(
    //    rootReducer,
    //    initData,
    //    compose(
    //        applyMiddleware(thunkMiddleware)
    //        // ,DevTools.instrument()
    //    )
    //);
}