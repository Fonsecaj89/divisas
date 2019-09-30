import { CAMBIAR } from '../actions/types';

const initialState = {
    cambio: 0.0,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CAMBIAR:
            return {
                ...state,
                cambio: action.payload,
            };
        default:
            return state;
    }
}
