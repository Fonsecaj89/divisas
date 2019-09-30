import { LOGIN } from '../actions/types'

const initialState = {
    login: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                login: action.payload
            }
        default:
            return state
    }
}