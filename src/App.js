import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-less/semantic.less';

import Login from './Pages/Login';
import Divisas from './Pages/Divisas';

function App() {
  return (
    <Router>
      <Container>
        <Route exact path="/" component={Login} />
        <Route exact path="/divisas" component={Divisas} />
      </Container>
    </Router>
  );
}

export default App;
