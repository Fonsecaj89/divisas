/* eslint-disable global-require */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';

import LoginForm from '../Components/Login/form';

import history from '../Utils/history';

class Login extends Component {
    componentWillReceiveProps(newProps) {
        if (newProps.loginAuth.authorized) {
            this.props.history.push('/divisas');
        }
    }

    render() {
        const img = require('../Assets/img/login.jpg');
        const logo = require('../Assets/img/logo.jpeg');
        const divStyle = {
            height: '100vh',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
        };

        return (
            <Grid textAlign="center" style={divStyle} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Segment style={{ backgroundColor: 'hsla(0,0%,75%, 0.7)' }}>
                        <Header as="h2" textAlign="center">
                            <Image src={logo} circular /> Log-in to your account
                        </Header>
                        <LoginForm />
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

Login.defaultProps = {
    history,
    loginAuth: {
        authorized: false,
    },
};

Login.propTypes = {
    loginAuth: PropTypes.shape({
        authorized: PropTypes.bool,
    }),
    history: PropTypes.func,
};

const mapStateToProps = state => ({
    loginAuth: state.login.login,
});

export default connect(
    mapStateToProps,
    null
)(Login);
