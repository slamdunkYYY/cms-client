import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTitle } from '../../redux/action'
import { Menu, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom'
import './index.less';
import MenuConfig from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'


const { SubMenu } = Menu;

class LeftNav extends Component {

	constructor(props) {
		super(props);
		const menuTreeNode = this.renderMenu(MenuConfig)
		this.state = {
			menuTreeNode: menuTreeNode
		}
	}

	hasAuth = (item) => {
		const { key, isPublic } = item
		const menus = this.props.user.role.menus
		const username = this.props.user.username

		if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
			return true
		} else if (item.children) {
			return !!item.children.find(child => menus.indexOf(child.key) !== -1)
		}

		return false
	}

	renderMenu = (data) => {
		const path = this.props.location.pathname
		return data.map((item) => {
			if (this.hasAuth(item)) {
				if (item.children) {
					const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
					if (cItem) {
						this.openKey = item.key
					}
					return (
						<SubMenu key={item.key} title={
							<span>
								<Icon type={item.icon} />
								<span>{item.title}</span>
							</span>
						}
						>
							{this.renderMenu(item.children)}
						</SubMenu>
					)
				}
				else {
					if (path.indexOf(item.key)===0) {
						this.props.setTitle(item.title)
					}
					return <Menu.Item title={item.title} key={item.key}>
						<Link to={item.key} onClick={() => this.props.setTitle(item.title)}>
							<Icon type={item.icon} />
							<span>{item.title}</span>
						</Link>
					</Menu.Item>
				}
			}
		})
	}

	render() {
		let path = this.props.location.pathname
		if (path.indexOf('/product') === 0) {
			path = '/product'
		}
		const openKey = this.openKey
		return (
			<div className="left-nav">
				<div className="left-nav-header">
					<img src={logo} alt="logo-ant" />
					<h1>Imooc MS</h1>
				</div>
				<Menu mode="inline" theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
					{this.state.menuTreeNode}
				</Menu>
			</div>
		)
	}
}

export default withRouter(connect(
	state => ({
		user: state.user
	}),
	{ setTitle }
)(LeftNav))