import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { formateDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import { Modal, Button } from 'antd'
import './index.less'
import { reqLocation, reqWeather } from '../../api'
import storageUtils from '../../utils/storageUtils'
import {resetUser} from '../../redux/action'

class Header extends Component {
  state = {
    title: "",
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      let sysTime = formateDate(new Date().getTime())
      this.setState({ sysTime })
    }, 1000)
  }

  getWeather = async () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    }
    const locationData = await reqLocation(options)
    const lat = locationData.coords.latitude
    const lon = locationData.coords.longitude
    const weatherData = await reqWeather(lat, lon)
    const weather = weatherData.weather[0].main
    this.setState({
      weather
    })
  }

  logout = () => {
    Modal.confirm({
      content: 'Logout?',
      onOk: () => {
        console.log('OK', this)
        storageUtils.removeUser()
        this.props.resetUser()
      }
    })
  }
  componentDidMount() {
    this.getTime()
    this.getWeather()
  }
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { sysTime, weather } = this.state
    let username = ""
    if (this.props.user.username) {
      username = this.props.user.username
    }
    else if (storageUtils.getUser()) {
      username = storageUtils.getUser().username
    }
    const title = this.props.title
    return (
      <div className="header">
        <div className="header-top">
          <span>Welcome, {username}</span>
          <Button type="link" onClick={this.logout}>Logout</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{sysTime}</span>&nbsp;
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(connect(
  state => ({
    title: state.title,
    user: state.user
  }),
  {resetUser}
)(Header))