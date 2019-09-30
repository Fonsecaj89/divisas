import React, { Component } from 'react';
import {
  Container,
  Grid,
  Image
} from 'semantic-ui-react';

import LoginForm from '../Components/LoginForm'

class Login extends Component {
  render() {
    return (
      <Container>
        <Grid centered>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Image src='/images/wireframe/image.png' size='small' />
            </Grid.Column>
            <Grid.Column>
              <LoginForm/>
            </Grid.Column>
          </Grid.Row>
          </Grid>
       </Container>
    );
  }
}

export default Login;
