import { CAMBIAR } from '../actions/types'

const initialState = {
    cambio: 0.00
}

export default function(state = initialState, action) {
    console.log('Reducer');
    switch(action.type) {
        case CAMBIAR:
                return {
                    ...state,
                    cambio: action.payload
                }
        default:
            return state
    }
}