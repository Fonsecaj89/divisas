import { CAMBIAR, LIMPIAR } from '../../Redux/types';

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
        case LIMPIAR:
            return {
                ...state,
                cambio: initialState.cambio,
            };
        default:
            return state;
    }
}
