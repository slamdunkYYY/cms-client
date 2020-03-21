import { SET_TITLE, RECEIVE_USER, ERROR_MSG, RESET_USER } from './action-type'
import {
	reqLogin
} from '../api'
import storageUtils from '../utils/storageUtils'

export const setTitle = (title) => ({
	type: SET_TITLE,
	data: title
})

const errorMsg = (msg) => ({
	type: ERROR_MSG,
	data: msg
})

const receiveUser = (user) => ({
	type: RECEIVE_USER,
	data: user
})

export const resetUser = () => ({
	type: RESET_USER,
})

export const login = ({username,password}) => {
	return async (dispatch) => {
		const result = await reqLogin(username, password)
		if (result.status === 0) {
			const user = result.data
			console.log("login successful")
			console.log(user)
			dispatch(receiveUser(user))
			//	memoryUtils.user = user
			storageUtils.saveUser(user)
		}
		else {
			console.log("ERROR")
			dispatch(errorMsg(result.msg))
		}
	}

	// const { username, password } = user
	// if (!username && !password) {
	// 	return errorMsg('enter username and password')
	// }
	// if (!username) {
	// 	return errorMsg('enter username')
	// }
	// if (!password) {
	// 	return errorMsg('enter password')
	// }
	// return async (dispatch) => {
	// 	const response = await reqLogin(user)
	// 	const result = response.data
	// 	if (result.code === 0) {
	// 		dispatch(receiveUser(result.data))
	// 	}
	// 	else {
	// 		dispatch(errorMsg(result.msg))
	// 	}
	// }
}
