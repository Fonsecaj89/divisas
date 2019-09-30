import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';

import LoginForm from '../Components/LoginForm';

class Login extends Component {
    componentWillReceiveProps(newProps) {
        console.log('newProps', newProps);
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

LoginForm.propTypes = {
    loginAuth: PropTypes.object,
};

const mapStateToProps = state => ({
    loginAuth: state.login.login,
});
export default connect(
    mapStateToProps,
    null
)(Login);
