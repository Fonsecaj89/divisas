/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Message } from 'semantic-ui-react';

import { login } from '../actions/loginActions';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: '',
            password: '',
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = event => {
        event.preventDefault();
        const loginData = {
            usuario: this.state.usuario,
            password: this.state.password,
        };
        this.props.login(loginData);
    };

    errorMessage = () => {
        if (this.props.error) {
            return (
                <Message negative>
                    <Message.Header>{this.props.error}</Message.Header>
                </Message>
            );
        }
    };

    render() {
        return (
            <Form size="large" onSubmit={this.onSubmit}>
                {this.errorMessage()}
                <Form.Field>
                    <label>Usuario</label>
                    <input placeholder="Usuario" name="usuario" onChange={this.onChange} />
                </Form.Field>
                <Form.Field>
                    <label>Contraseña</label>
                    <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        onChange={this.onChange}
                    />
                </Form.Field>

                <Button>Submit</Button>
            </Form>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    error: PropTypes.string,
};

const mapStateToProps = state => ({
    error: state.login.error.error,
});
export default connect(
    mapStateToProps,
    { login }
)(LoginForm);
