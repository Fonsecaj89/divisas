import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react';

import { login } from '../actions/loginActions';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            usuario: "",
            password: ""
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    };
    
    componentDidUpdate(newprops) {
        console.log(this.props);
        
        
    }
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value}) 
    };

    onSubmit = (event) => {
        event.preventDefault()  
        const login = {
            usuario: this.state.usuario,
            password: this.state.password
        }
        this.props.login(login)
    };

    render() {
        return (
            <Form size='large' onSubmit={this.onSubmit}>
                <Form.Field>
                    <label>Usuario</label>
                    <input placeholder='Usuario' name="usuario" onChange={ this.onChange } />
                </Form.Field>
                <Form.Field>
                    <label>Contraseña</label>
                    <input placeholder='Password' name="password" type="password" onChange={ this.onChange } />
                </Form.Field>
                
                <Button>Submit</Button>
            </Form>
        )
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    aprobado: PropTypes.number
}

const mapStateToProps = state => ({
    login: state.login.aprobacion
})
export default connect(mapStateToProps, { login })(LoginForm)
