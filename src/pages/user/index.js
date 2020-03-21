import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {formateDate} from "../../utils/dateUtils"
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'

export default class User extends Component {

  constructor (props) {
    super(props)
    this.initColumns()
  } 

  state = {
    users: [],
    roles: [],
    isShow: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email',
        dataIndex: 'email'
      },

      {
        title: 'Phone',
        dataIndex: 'phone'
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: 'Role',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: 'Action',
        render: (user) => (
          <span>
            <Button type="link" onClick={() => this.showUpdate(user)}>Update</Button>
            <Button type="link" onClick={() => this.deleteUser(user)}>Delete</Button>
          </span>
        )
      },
    ]
  }

  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  showAdd = () => {
    this.user = null
    this.setState({isShow: true})
  }

  showUpdate = (user) => {
    this.user = user
    this.setState({
      isShow: true
    })
  }

  deleteUser = (user) => {
    Modal.confirm({
      title: `Delete ${user.username}?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('User is delete!')
          this.getUsers()
        }
      }
    })
  }

  addOrUpdateUser = async () => {

    this.setState({isShow: false})
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    if (this.user) {
      user._id = this.user._id
    }
    const result = await reqAddOrUpdateUser(user)
    if(result.status===0) {
      message.success(`${this.user ? 'Update' : 'Add'} user`)
      this.getUsers()
    }
  }

  getUsers = async () => {
    const result = await reqUsers()
    console.log(result)
    if (result.status===0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }

  componentDidMount () {
    this.getUsers()
  }


  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

    const title = <Button type='primary' onClick={this.showAdd}>Add new user</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 2}}
        />

        <Modal
          title={user._id ? 'Update' : 'Add'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>

      </Card>
    )
  }
}