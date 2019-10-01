import { combineReducers } from 'redux';

import divisasReducer from '../Components/Divisas/reducer';
import loginReducer from '../Components/Login/reducer';

export default combineReducers({
    cambio: divisasReducer,
    login: loginReducer,
});
