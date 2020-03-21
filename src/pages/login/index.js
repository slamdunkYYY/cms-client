import React, { Component } from 'react'
import { connect } from 'react-redux';
import { login } from '../../redux/action'
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './login.less'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const FormItem = Form.Item

class Login extends Component {
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			const { username, password } = values
			if (!err) {
				this.props.login({ username, password })
			}
			else {
				console.log("validation faild")
			}
		});
	};

	validatePwd = (rule, value, callback) => {
		if (!value) {
			callback('password is required')
		} else if (value.length < 4) {
			callback('password should be longer than 4 digital')
		} else if (value.length > 12) {
			callback('password should be less than 12 digital')
		} else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
			callback('password should use character, number or underline')
		} else {
			callback() //pass validation
		}
	}

	render() {
		const user = this.props.user
		if (user && user._id) {
			return <Redirect to='/' />
		}
		const { getFieldDecorator } = this.props.form;
		const { msg } = this.props.user
		return (
			<div className="login">
				<header className="login-header">
					<img src={logo} alt="logo" />
					<h1>Content Manager System</h1>
				</header>
				<section className="login-content">
					<Form onSubmit={this.handleSubmit} className="login-form">
						<FormItem>
							{getFieldDecorator('username', {
								rules: [
									{
										required: true,
										message: 'please enter one user name'
									},
									{
										min: 5, max: 10,
										message: 'user name length should be between 5 and 10'
									},
									{
										pattern: /^[a-zA-Z0-9_]+$/,
										message: 'username should use character, number or underline'
									}
								]
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Username"
								/>,
							)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								rules: [
									{
										validator: this.validatePwd
									}
								],
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="Password"
								/>,
							)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit" className="login-form-button">
								Log in
		          			</Button>
						</FormItem>
					</Form>
					{
						msg?<div style={{color: "red"}}>{msg}</div>:null
					}
				</section>
			</div>
		);
	}
}

export default connect(
	state => ({
		user: state.user
	}),
	{ login }
)(Form.create()(Login))