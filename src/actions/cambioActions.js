import { CAMBIAR } from './types'

export const cambiar = (data) => dispatch => {
    /* 
    Incluir la llamada acá
    Luego de tener éxito, llamar dispatch
    */
   console.log('Action');
   fetch('https://api.exchangeratesapi.io/latest?base=USD')
   .then(res => res.json())
   .then(response => {

        const dolar = parseFloat(data.usd);
        console.log(response);
        
        const valor = dolar * response.rates.EUR;
        return valor
   })
   .then(valor => dispatch({
    type: CAMBIAR,
    payload: valor
    }))
};
