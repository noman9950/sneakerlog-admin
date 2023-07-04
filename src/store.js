import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from 'react-router-redux';
import reducers from './reducers';
import thunk from "redux-thunk";

export default function configureStore(history) {
  const middleware = applyMiddleware(thunk, routerMiddleware(history));

  return createStore(reducers, middleware);
}
