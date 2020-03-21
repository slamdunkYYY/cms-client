import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'

const initTitle = ""
function title(state = initTitle, action) {
    switch (action.type) {
        case 'SET_TITLE':
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()

function user(state = initUser, action) {
    switch (action.type) {
        case 'RECEIVE_USER':
            return action.data
        case 'ERROR_MSG':
            return {...state,msg:action.data}
        case 'RESET_USER':
            const resetUser = {}
            return resetUser
        default:
            return state
    }
}

export default combineReducers({
    user,
    title
})