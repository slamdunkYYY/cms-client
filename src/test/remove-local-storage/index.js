import React, { Component } from 'react';
import store from 'store'
import { message } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class RemoveLocalStorage extends Component {

  componentDidMount() {
      message.success('Local storage is removed')
      const user_key = "user_key"
      const LocalStorage = store.get(user_key)
      console.log("LocalStorage",LocalStorage)
      store.remove(user_key)
  }
  render() {
    return (
      <div>RemoveLocalStorage</div>
    )
  }
}