import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './redux/store.js'
import Login from './pages/login'
import Admin from './pages/admin'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename="/cms">
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/" component={Admin}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}