import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Grid, Segment  } from 'semantic-ui-react';

import { cambiar } from '../actions/cambioActions'

class DivisasForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            USD: '0.00',
            EUR: 0.00,
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value}) 
    }

    toUSD(number) {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        });
        return formatter.format(number).toString() ;
    };

    toEUR(number) {
        const formatter = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        });
      
        return formatter.format(number);
    };

  
    onSubmit = (event) => {
        event.preventDefault()  
        const valor = {
            usd: parseFloat(this.state.USD)
        }
        this.toEUR(this.props.cambiar(valor))
        this.setState({ USD: this.toUSD(this.state.USD)}) 
    };

    render() {
        return (
            <Segment size='huge' >
                <Form size='big' onSubmit={this.onSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Form.Input fluid 
                            label='Dólares' 
                            type="decimal" 
                            name="USD" 
                            value={this.state.USD} 
                            onChange={ this.onChange } 
                            placeholder='0.00' />
                        </Form.Field>
                        
                        <Form.Field>
                            <Form.Input fluid 
                            label='Euro' 
                            type="decimal" 
                            name="EUR" 
                            value={ this.toEUR(this.props.cambio) } 
                            placeholder='0.00' readOnly/>
                        </Form.Field>
                    </Form.Group>
                    <Grid>
                        <Grid.Column textAlign="center">
                            <Button secondary>Enviar</Button>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Segment>
            
            
        )
    }
}

DivisasForm.propTypes = {
    cambiar: PropTypes.func.isRequired,
    cambio: PropTypes.number
}

const mapStateToProps = state => ({
    cambio: state.cambio.cambio
})
export default connect(mapStateToProps, { cambiar })(DivisasForm)
