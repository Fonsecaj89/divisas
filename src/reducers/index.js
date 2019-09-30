import { combineReducers } from 'redux';

import divisasReducer from './divisasReducer.js';
import loginReducer from './loginReducer.js';

export default combineReducers({
    cambio: divisasReducer,
    login: loginReducer,
});
