/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable global-require */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Grid, Image, Segment, Header, List, Button } from 'semantic-ui-react';

import DivisasForm from '../Components/Divisas/form';

import history from '../Utils/history';

class Divisas extends Component {
    constructor(props) {
        super(props);

        this.checkLogin = this.checkLogin.bind(this);

        this.checkLogin();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.login.authorized === false) {
            this.props.history.push('/');
        }
    }

    checkLogin() {
        if (this.props.login.authorized === false) {
            this.props.history.push('/');
        }
    }

    render() {
        const img = require('../Assets/img/logo.jpeg');
        return (
            <Container>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column>
                            <Image src={img} size="medium" centered circular />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={7}>
                        <Grid.Column />
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
                        <Grid.Column>
                            <Button onClick={this.props.logout} negative>
                                Logout
                            </Button>
                        </Grid.Column>
                        <Grid.Column />
                    </Grid.Row>

                    <Grid.Row centered>
                        <Grid.Column>
                            <DivisasForm />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Segment inverted vertical style={{ padding: '5em 0em' }}>
                            <Container>
                                <Grid divided inverted stackable>
                                    <Grid.Row>
                                        <Grid.Column width={3}>
                                            <Header inverted as="h4" content="About" />
                                            <List link inverted>
                                                <List.Item as="a">Sitemap</List.Item>
                                                <List.Item as="a">Contact Us</List.Item>
                                            </List>
                                        </Grid.Column>
                                        <Grid.Column width={3}>
                                            <Header inverted as="h4" content="Services" />
                                            <List link inverted>
                                                <List.Item as="a">DNA FAQ</List.Item>
                                                <List.Item as="a">How To Access</List.Item>
                                                <List.Item as="a">Favorite X-Men</List.Item>
                                            </List>
                                        </Grid.Column>
                                        <Grid.Column width={7}>
                                            <Header as="h4" inverted>
                                                Footer Header
                                            </Header>
                                            <p>
                                                Extra space for a call to action inside the footer
                                                that could help re-engage users.
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

Divisas.defaultProps = {
    history,
    login: {
        authorized: false,
    },
};

Divisas.propTypes = {
    login: PropTypes.shape({
        authorized: PropTypes.bool,
    }),
    logout: PropTypes.func.isRequired,
    history: PropTypes.func,
};

const mapStateToProps = state => ({
    login: state.login.login,
});

const mapDispatchToProps = dispatch => {
    return {
        // dispatching plain actions
        logout: () => dispatch({ type: 'LOGOUT' }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Divisas);
