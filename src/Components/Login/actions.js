import { LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT } from '../../Redux/types';
import { addToCache } from '../../Utils/cache';

const fakeUsers = {
    username: 'javier',
    password: '1234',
};

export const login = data => dispatch => {
    if (data.usuario === fakeUsers.username && data.password === fakeUsers.password) {

        addToCache('userAuthorized', { user: fakeUsers.username, authorized: true });
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { user: fakeUsers.username, authorized: true },
        });
    } else {
        dispatch({
            type: LOGIN_ERROR,
            payload: { error: 'Credenciales inválidas' },
        });
    }
};

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT,
    });
};
