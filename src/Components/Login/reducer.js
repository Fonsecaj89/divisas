import { LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT, CLEAN_LOGIN_ERROR } from '../../Redux/types';

const initialState = {
    login: { authorized: false },
    error: {},
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                login: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                login: action.payload,
            };
        case LOGIN_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                login: initialState.login,
            };
        case CLEAN_LOGIN_ERROR:
            return {
                ...state,
                error: initialState.error,
            };
        default:
            return state;
    }
}
