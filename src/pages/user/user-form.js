import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {
 
  constructor(props){
    super(props);
    this.props.setForm(this.props.form)
  }

  render() {

    const {roles, user} = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },  
      wrapperCol: { span: 15 }, 
    }

    return (
      <Form {...formItemLayout}>
        <Item label='Username'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
            })(
              <Input placeholder='Username'/>
            )
          }
        </Item>

        {
          user._id ? null : (
            <Item label='Password'>
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                })(
                  <Input type='password' placeholder='Password'/>
                )
              }
            </Item>
          )
        }

        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
            })(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='Email'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
            })(
              <Input placeholder='Email'/>
            )
          }
        </Item>

        <Item label='Role'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)