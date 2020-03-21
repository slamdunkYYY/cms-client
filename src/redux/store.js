import { createStore, applyMiddleware } from 'redux';
import reducers from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

const store = createStore(reducers,  composeWithDevTools(
    applyMiddleware(thunk)
  ));

// const store = createStore(reducers, applyMiddleware(thunk))

export default store;