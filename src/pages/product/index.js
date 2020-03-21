import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './production.less'

export default class Product extends Component {
	render() {
		return (
			<Switch>
				<Route path="/product" exact component={ProductHome}/>
				<Route path="/product/addupdate" component={ProductAddUpdate}/>
				<Route path="/product/detail" component={ProductDetail}/>
			</Switch>
		)
	}
}