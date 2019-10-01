/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Message } from 'semantic-ui-react';

import store from '../../store';
import { login } from './actions';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: '',
            password: '',
            count: 0,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.errorMessage = this.errorMessage.bind(this);
        this.cleanError = this.cleanError.bind(this);
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = event => {
        event.preventDefault();
        const { usuario, password } = this.state;

        const loginData = {
            usuario,
            password,
        };
        this.props.login(loginData);
    };

    cleanError = () => {
        const { count } = this.state;

        if (count === 0) {
            this.setState({ count: 1 });
            this.setState({ usuario: '' });
            this.setState({ password: '' });
            setTimeout(() => {
                // eslint-disable-next-line no-plusplus
                store.dispatch({ type: 'CLEAN_LOGIN_ERROR' });
                this.setState({ count: 0 });
            }, 5000);
        }
    };

    errorMessage = () => {
        const { error } = this.props;

        if (error.hasOwnProperty('error')) {
            this.cleanError();
            return (
                <Message negative>
                    <Message.Header>{error.error}</Message.Header>
                </Message>
            );
        }
        return null;
    };

    render() {
        const { usuario, password } = this.state;
        return (
            <Form size="large" onSubmit={this.onSubmit}>
                {this.errorMessage()}
                <Form.Field>
                    <label>Usuario</label>
                    <input
                        placeholder="Usuario"
                        name="usuario"
                        value={usuario}
                        onChange={this.onChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Contraseña</label>
                    <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={this.onChange}
                    />
                </Form.Field>

                <Button>Submit</Button>
            </Form>
        );
    }
}

LoginForm.defaultProps = {
    login,
    error: {},
};

LoginForm.propTypes = {
    login: PropTypes.func,
    error: PropTypes.shape({
        error: PropTypes.string,
    }),
};

const mapStateToProps = state => ({
    error: state.login.error,
});

export default connect(
    mapStateToProps,
    { login }
)(LoginForm);
