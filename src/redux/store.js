import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { offline } from 'redux-offline';
import offlineConfig from 'redux-offline/lib/defaults';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import todos from './todo';

const store = createStore(
  combineReducers({todos}),
  {},
  compose(
    applyMiddleware(thunk, logger),
    offline(offlineConfig)
  )
);

export default store;