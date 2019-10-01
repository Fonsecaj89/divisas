import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import store from './store';

import 'semantic-ui-less/semantic.less';

import ErrorBoundary from './Utils/ErrorHandler';
import Login from './Pages/Login';
import Divisas from './Pages/Divisas';

function App() {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <Router>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/divisas" component={Divisas} />
                </Router>
            </ErrorBoundary>
        </Provider>
    );
}

export default App;
