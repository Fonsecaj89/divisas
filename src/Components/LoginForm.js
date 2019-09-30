import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react';
class LoginForm extends Component {
    render() {
        return (
            <Form>
                <Form.Field>
                    <label>First Name</label>
                    <input placeholder='Usuario' />
                </Form.Field>
                <Form.Field>
                    <label>Last Name</label>
                    <input placeholder='Password' name="password" type="password" />
                </Form.Field>
                
                <Button type='submit'>Submit</Button>
            </Form>
        )
    }
}
export default LoginForm