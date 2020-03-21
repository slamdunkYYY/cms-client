import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {PAGE_SIZE} from "../../utils/constants"
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils"
import {formateDate} from '../../utils/dateUtils'
import storageUtils from "../../utils/storageUtils";


export default class Role extends Component {

  state = {
    roles: [],
    role: {},
    isShowAdd: false,
    isShowAuth: false,
  }

  constructor (props) {
    super(props)
    this.initColumn()
    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title: 'Role name',
        dataIndex: 'name'
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: 'Auth time',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: 'Auth name',
        dataIndex: 'auth_name'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status===0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }


  onRow = (role) => {
    return {
      onClick: event => {
        console.log('row onClick()', role)
        this.setState({
          role
        })
      },
    }
  }

  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({
          isShowAdd: false
        })
        const {roleName} = values
        this.form.resetFields()
        const result = await reqAddRole(roleName)
        if (result.status===0) {
          message.success('Add role success')
          const role = result.data
          this.setState(state => ({
            roles: [...state.roles, role]
          }))

        } else {
          message.success('Add role failed')
        }

      }
    })


  }
  updateRole = async () => {

   this.setState({
      isShowAuth: false
    })

    const role = this.state.role
    // get updated menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = storageUtils.getUser().username

    // update ajax
    const result = await reqUpdateRole(role)
    if (result.status===0) {
      // this.getRoles()
      // relogin if the change is the current role
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('Set up current user role success')
      } else {
        message.success('Set up role success')
        this.setState({
          roles: [...this.state.roles]
        })
      }

    }
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {

    const {roles, role, isShowAdd, isShowAuth} = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>Add new role</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Change role</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({
                role
              })
            }

          }}
          onRow={this.onRow}
        />

        <Modal
          title="Add new role"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false})
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="Set role"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false})
          }}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    )
  }
}