import { CAMBIAR } from './types';

const cambiar = data => dispatch => {
    /* 
    Incluir la llamada acá
    Luego de tener éxito, llamar dispatch
    */
    fetch('https://api.exchangeratesapi.io/latest?base=USD')
        .then(res => res.json())
        .then(response => {
            const dolar = parseFloat(data.usd);

            const valor = dolar * response.rates.EUR;
            return valor;
        })
        .then(valor =>
            dispatch({
                type: CAMBIAR,
                payload: valor,
            })
        );
};

export default cambiar;
