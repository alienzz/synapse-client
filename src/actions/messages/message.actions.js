import * as TYPES from './messages.types'
import * as interfaceTypes from '../interface/interface.types'
import { store } from '../../index'
import socket from '../../config/socket'
const id_token = localStorage.getItem('id_token')

socket.on(TYPES.ROOM_MESSAGE, ({ room, message }) => {
    const { room_name } = store.getState().room
    if (room === room_name) {
        if (!document.hasFocus()) {
            store.dispatch({ type: TYPES.UPDATE_UNFOCUSED_UNREAD })
        }
        if (message.user === id_token) {
            const { history } = store.getState().room
            let updatedKeys = history.map(m => {
                if (m.id === message.id) {
                    return message
                }
                return m
            })
            store.dispatch({ type: TYPES.UPDATE_USER_MESSAGE_DELIVERED, payload: updatedKeys })
        } else {
            store.dispatch({ type: TYPES.ROOM_MESSAGE, payload: message })
        }
    }
    else {
        const { room_list } = store.getState().auth
        let update =  room_list[room]
        update.unread = update.unread += 1
        store.dispatch({ type: TYPES.INACTIVE_ROOM_MESSAGE, payload: {room, update} })
    }
})

export const reportMessage = message => {
    store.dispatch({ type: TYPES.REPORT_MESSAGE, payload: message })
    store.dispatch({ type: interfaceTypes.OPEN_REPORT_DIALOG })
}

export const submitReport = message => dispatch => {
    console.log(message)
    // store.dispatch({ type: interfaceTypes.CLOSE_REPORT_DIALOG })
}

export const updateUserInput = value => dispatch => {
    dispatch({ type: TYPES.UPDATE_USER_INPUT, payload: value })
}

export const tagUser = value => dispatch => {
    dispatch({ type: TYPES.TAG_USER, payload: value})
}

export const blurInput = () => dispatch => {
    dispatch({ type: TYPES.BLUR_USER_INPUT })
}

export const sendMessage = (room, message) => dispatch => {
    const { room_name } = store.getState().room
    if (room === room_name) {
        store.dispatch({ type: TYPES.ROOM_MESSAGE, payload: message })
    }
    else {
        const { room_list } = store.getState().auth
        let update =  room_list[room]
        update.unread = update.unread += 1
        store.dispatch({ type: TYPES.INACTIVE_ROOM_MESSAGE, payload: {room, update} })
    }
    socket.emit(TYPES.SEND_MESSAGE, {room, message})
    // dispatch({ type: TYPES.SEND_MESSAGE, payload: message })
}