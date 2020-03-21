import React, {Component} from 'react'
import { Row, Co, Layout } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom'
import storageUtils from '../../utils/storageUtils'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import { connect } from 'react-redux';

const { Footer, Sider, Content } = Layout


class Admin extends Component {


  render() {
    const user = this.props.user
    if(!user || !user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight: '100%',minHeight:'100vh'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Redirect from='/' exact to='/home'/>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#cccccc'}}>Use Chrome for better experience</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default connect(
	state => ({
		user: state.user
	}),
  null
)(Admin)