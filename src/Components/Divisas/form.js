/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button, Grid, Segment } from 'semantic-ui-react';

import store from '../../store';
import cambiar from './actions';

class DivisasForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            USD: '',
        };

        this.toUSD = this.toUSD.bind(this);
        this.toEUR = this.toEUR.bind(this);
        this.limpiar = this.limpiar.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = event => {
        if (event.target.value.match('(^$)|([0-9])') !== null) {
            this.setState({ [event.target.name]: event.target.value });
        }
    };

    onSubmit = event => {
        event.preventDefault();
        const { USD } = this.state;

        const valor = {
            usd: parseFloat(USD),
        };
        this.toEUR(this.props.cambiar(valor));
        const usd = this.toUSD(USD);
        this.setState({ USD: usd });
    };

    toUSD(number) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(number).toString();
    }

    toEUR(number) {
        if (number === 0) {
            return '0.00 €';
        }

        const formatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        });

        return formatter.format(number);
    }

    limpiar() {
        this.setState({ USD: '' });
        store.dispatch({ type: 'LIMPIAR' });
    }

    render() {
        const { USD } = this.state;
        const { cambio } = this.props;
        return (
            <Segment size="huge">
                <Form size="big">
                    <Form.Group widths="equal">
                        <Form.Field>
                            <Form.Input
                                fluid
                                label="Dólares"
                                type="decimal"
                                name="USD"
                                value={USD}
                                onChange={this.onChange}
                                placeholder="0.00"
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Input
                                fluid
                                label="Euro"
                                type="decimal"
                                name="EUR"
                                value={this.toEUR(cambio)}
                                placeholder="0.00"
                                readOnly
                            />
                        </Form.Field>
                    </Form.Group>
                    <Grid>
                        <Grid.Column textAlign="center">
                            <Button onClick={this.onSubmit} secondary>Calcular</Button>
                            <Button onClick={this.limpiar}>Limpiar</Button>
                        </Grid.Column>
                    </Grid>
                </Form>
            </Segment>
        );
    }
}

DivisasForm.defaultProps = {
    cambiar: () => {},
    cambio: '0.00 €',
};

DivisasForm.propTypes = {
    cambiar: PropTypes.func,
    cambio: PropTypes.number,
};

const mapStateToProps = state => ({
    cambio: state.cambio.cambio,
});

export default connect(
    mapStateToProps,
    { cambiar }
)(DivisasForm);
