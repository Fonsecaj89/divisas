import { UPDATE_EURO, CAMBIAR, LIMPIAR } from '../../Redux/types';

const initialState = {
    cambio: 0.0,
    euro: 0.0,
    timeToRefresh: 0,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_EURO:
            return {
                ...state,
                euro: action.payload,
            };
        case CAMBIAR:
            return {
                ...state,
                cambio: action.payload,
            };
        case LIMPIAR:
            return {
                ...state,
                cambio: initialState.cambio,
            };
        default:
            return state;
    }
}
