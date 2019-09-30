import { LOGIN } from './types'

export const login = (data) => dispatch => {
    /* 
    Incluir la llamada acá
    Luego de tener éxito, llamar dispatch
    */
   console.log('Action');
   /*
   fetch('https://api.exchangeratesapi.io/latest?base=USD')
   .then(res => res.json())
   .then(response => {

        const dolar = parseFloat(data.usd);
        console.log(response);
        
        const valor = dolar * response.rates.EUR;
        return valor
   })
   .then(valor => dispatch({
    type: LOGIN,
    payload: valor
    }))
    */
   dispatch({
    type: LOGIN,
    payload: true
    })
};
