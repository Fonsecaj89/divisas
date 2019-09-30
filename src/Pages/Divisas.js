import React, { Component } from 'react';
import {
  Container,
  Grid,
  Image,
  Segment,
  Header,
  List,
  Button
} from 'semantic-ui-react';

import DivisasForm from '../Components/DivisasForm';

class Divisas extends Component {
  render() {
    const img = require('../Assets/img/logo.jpeg');
    return (
      <Container>
        <Grid centered>


        <Grid.Row>
          <Grid.Column>
              <Image src={img} size='medium' centered circular/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={6}>
        <Grid.Column/>
          <Grid.Column>
              <Button>USD</Button>
          </Grid.Column>
          <Grid.Column>
            <Button>EUR</Button>
          </Grid.Column>
          <Grid.Column>
            <Button>GBP</Button>
          </Grid.Column>
          <Grid.Column>
            <Button>JPY</Button>
          </Grid.Column>
          <Grid.Column/>
        </Grid.Row>
        
          <Grid.Row centered>
            <Grid.Column>
              <DivisasForm/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Segment inverted vertical style={{ padding: '5em 0em' }}>
              <Container>
                <Grid divided inverted stackable>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Header inverted as='h4' content='About' />
                      <List link inverted>
                        <List.Item as='a'>Sitemap</List.Item>
                        <List.Item as='a'>Contact Us</List.Item>
                        <List.Item as='a'>Religious Ceremonies</List.Item>
                        <List.Item as='a'>Gazebo Plans</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Header inverted as='h4' content='Services' />
                      <List link inverted>
                        <List.Item as='a'>Banana Pre-Order</List.Item>
                        <List.Item as='a'>DNA FAQ</List.Item>
                        <List.Item as='a'>How To Access</List.Item>
                        <List.Item as='a'>Favorite X-Men</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column width={7}>
                      <Header as='h4' inverted>
                        Footer Header
                      </Header>
                      <p>
                        Extra space for a call to action inside the footer that could help re-engage users.
                      </p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Segment>
          </Grid.Row>

          </Grid>
       </Container>
    );
  }
}

export default Divisas;
